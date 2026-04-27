import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

type Submission = {
  songs: string[];
  movie: string;
  tvShow: string;
  drinks: string[];
  note?: string;
};

type StoredSubmission = Submission & {
  createdAt: string;
};

const drinkOptions = new Set([
  "Beer",
  "Wine",
  "Champagne",
  "Aperol Spritz",
  "Coca Cola",
  "Flavored bubbly water",
  "Vodka Seltzer",
  "Juice",
]);

function isValidSubmission(value: unknown): value is Submission {
  if (!value || typeof value !== "object") return false;
  const data = value as Partial<Submission>;
  return (
    Array.isArray(data.songs) &&
    data.songs.length <= 3 &&
    data.songs.every((song) => typeof song === "string") &&
    typeof data.movie === "string" &&
    data.movie.trim().length > 0 &&
    typeof data.tvShow === "string" &&
    data.tvShow.trim().length > 0 &&
    Array.isArray(data.drinks) &&
    data.drinks.length > 0 &&
    data.drinks.every((drink) => typeof drink === "string" && drinkOptions.has(drink)) &&
    (data.note === undefined || typeof data.note === "string")
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!isValidSubmission(body)) {
    return NextResponse.json(
      { error: "Please complete the required party picks." },
      { status: 400 },
    );
  }

  const filePath = path.join(process.cwd(), "data", "submissions.json");
  const submission = {
    ...body,
    songs: body.songs.map((song) => song.trim()).filter(Boolean),
    movie: body.movie.trim(),
    tvShow: body.tvShow.trim(),
    note: body.note?.trim() || "",
    createdAt: new Date().toISOString(),
  };

  await fs.mkdir(path.dirname(filePath), { recursive: true });

  const existing: StoredSubmission[] = await fs
    .readFile(filePath, "utf8")
    .then((content) => JSON.parse(content) as StoredSubmission[])
    .catch(() => []);

  existing.push(submission);
  await fs.writeFile(filePath, `${JSON.stringify(existing, null, 2)}\n`);

  return NextResponse.json({ ok: true });
}
