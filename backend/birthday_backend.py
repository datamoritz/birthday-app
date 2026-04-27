#!/usr/bin/env python3
from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any


DRINK_OPTIONS = {
    "Beer",
    "Wine",
    "Champagne",
    "Aperol Spritz",
    "Coca Cola",
    "Flavored bubbly water",
    "Vodka Seltzer",
    "Juice",
}

DATA_FILE = Path(os.environ.get("BIRTHDAY_DATA_FILE", "data/submissions.json"))
ALLOWED_ORIGINS = {
    origin.strip()
    for origin in os.environ.get("BIRTHDAY_ALLOWED_ORIGINS", "*").split(",")
    if origin.strip()
}


def clean_submission(payload: Any) -> dict[str, Any] | None:
    if not isinstance(payload, dict):
        return None

    songs = payload.get("songs")
    movie = payload.get("movie")
    tv_show = payload.get("tvShow")
    drinks = payload.get("drinks")
    note = payload.get("note", "")

    if not isinstance(songs, list) or len(songs) > 3:
        return None
    if not all(isinstance(song, str) for song in songs):
        return None
    if not isinstance(movie, str) or not movie.strip():
        return None
    if not isinstance(tv_show, str) or not tv_show.strip():
        return None
    if not isinstance(drinks, list) or not drinks:
        return None
    if not all(isinstance(drink, str) and drink in DRINK_OPTIONS for drink in drinks):
        return None
    if not isinstance(note, str):
        return None

    return {
        "songs": [song.strip() for song in songs if song.strip()],
        "movie": movie.strip(),
        "tvShow": tv_show.strip(),
        "drinks": drinks,
        "note": note.strip(),
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }


def read_submissions() -> list[dict[str, Any]]:
    try:
        return json.loads(DATA_FILE.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return []


def append_submission(submission: dict[str, Any]) -> None:
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    submissions = read_submissions()
    submissions.append(submission)
    DATA_FILE.write_text(json.dumps(submissions, indent=2) + "\n", encoding="utf-8")


class Handler(BaseHTTPRequestHandler):
    server_version = "BirthdayBackend/1.0"

    def end_headers(self) -> None:
        origin = self.headers.get("Origin", "")
        if "*" in ALLOWED_ORIGINS:
            self.send_header("Access-Control-Allow-Origin", "*")
        elif origin in ALLOWED_ORIGINS:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        super().end_headers()

    def send_json(self, status: int, payload: dict[str, Any]) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.end_headers()

    def do_GET(self) -> None:
        if self.path == "/health":
            self.send_json(200, {"ok": True})
            return
        self.send_json(404, {"error": "Not found"})

    def do_POST(self) -> None:
        if self.path != "/submissions":
            self.send_json(404, {"error": "Not found"})
            return

        content_length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(content_length)

        try:
            payload = json.loads(raw_body.decode("utf-8"))
        except json.JSONDecodeError:
            self.send_json(400, {"error": "Invalid JSON"})
            return

        submission = clean_submission(payload)
        if submission is None:
            self.send_json(400, {"error": "Please complete the required party picks."})
            return

        append_submission(submission)
        self.send_json(200, {"ok": True})

    def log_message(self, format: str, *args: Any) -> None:
        print(f"{self.address_string()} - {format % args}", flush=True)


def main() -> None:
    host = os.environ.get("BIRTHDAY_HOST", "127.0.0.1")
    port = int(os.environ.get("BIRTHDAY_PORT", "8029"))
    server = ThreadingHTTPServer((host, port), Handler)
    print(f"Birthday backend listening on http://{host}:{port}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
