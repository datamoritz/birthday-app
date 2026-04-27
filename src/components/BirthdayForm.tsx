"use client";

import { FormEvent, useMemo, useState } from "react";

const drinkOptions = [
  "Beer",
  "Wine",
  "Champagne",
  "Aperol Spritz",
  "Coca Cola",
  "Flavored bubbly water",
  "Vodka Seltzer",
  "Juice",
];

type Status = "idle" | "submitting" | "success" | "error";

const submissionsUrl = process.env.NEXT_PUBLIC_SUBMISSIONS_API_URL ?? "/api/submissions";

export default function BirthdayForm() {
  const [songs, setSongs] = useState(["", "", ""]);
  const [showExtraSongs, setShowExtraSongs] = useState(false);
  const [movie, setMovie] = useState("");
  const [tvShow, setTvShow] = useState("");
  const [drinks, setDrinks] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const canSubmit = useMemo(
    () => movie.trim() && tvShow.trim() && drinks.length > 0,
    [drinks.length, movie, tvShow],
  );

  function updateSong(index: number, value: string) {
    setSongs((prev) => prev.map((s, i) => (i === index ? value : s)));
  }

  function toggleDrink(drink: string) {
    setDrinks((prev) =>
      prev.includes(drink) ? prev.filter((d) => d !== drink) : [...prev, drink],
    );
  }

  async function submitForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");

    const res = await fetch(submissionsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ songs, movie, tvShow, drinks, note }),
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setStatus("error");
      setMessage(data?.error ?? "Something did not make it to the dance floor. Try again?");
      return;
    }

    setStatus("success");
  }

  const partyDate = new Date("2026-04-29T00:00:00");
  const daysLeft = Math.max(0, Math.ceil((partyDate.getTime() - Date.now()) / 86_400_000));

  return (
    <main>
      <section className="hero" aria-labelledby="party-title">
        <div className="confetti" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="paraglider" aria-hidden="true">
          <span className="paraglider__wing" />
          <span className="paraglider__lines" />
          <span className="paraglider__pilot" />
        </div>
        <span className="hero__badge">April 29, 2026 · Denver</span>
        <div className="hero__content">
          <h1 id="party-title">
            <span className="title-word title-word--moritz">Moritz&apos;</span>
            <br />
            <span className="title-word title-word--birthday">Birthday</span>
            <br />
            <span className="title-word title-word--bash">Bash</span>
          </h1>
          <p className="hero__sub">
            Send your top songs, screen favorites, and drink picks before the party magic starts
            (anonymous)
          </p>
          <address className="hero__address">
            <span>180 W 10th Ave</span>
            <span>Denver, CO 80204</span>
          </address>
        </div>
      </section>

      {status === "success" ? (
        <section className="success-screen">
          <div className="success-card">
            <div className="success-check" aria-hidden="true">
              <svg viewBox="0 0 52 52" fill="none">
                <circle className="success-check__circle" cx="26" cy="26" r="24" />
                <path className="success-check__tick" d="M14 26 l8 9 l16-17" />
              </svg>
            </div>
            <h2 className="success-title">Sent!</h2>
            <p className="success-sub">
              Your favorites are on their way to Moritz. Get ready for some games and fun.
            </p>
            {daysLeft > 0 ? (
              <div className="success-countdown">
                <span className="success-countdown__num">{daysLeft}</span>
                <span className="success-countdown__label">{daysLeft === 1 ? "day" : "days"} to go</span>
              </div>
            ) : (
              <div className="success-countdown">
                <span className="success-countdown__label">It&apos;s party time!</span>
              </div>
            )}
          </div>
        </section>
      ) : (
      <section className="form-section">
        <form className="party-form" onSubmit={submitForm}>
          <div className="form-block">
            <span className="form-block__label">Favorite Songs (up to 3)</span>
            {songs.map((song, i) => (
              <input
                className={i > 0 && !showExtraSongs ? "song-input--hidden" : undefined}
                key={i}
                maxLength={120}
                onChange={(e) => {
                  updateSong(i, e.target.value);
                  if (i === 0) setShowExtraSongs(true);
                }}
                onFocus={() => {
                  if (i === 0) setShowExtraSongs(true);
                }}
                placeholder="Artist - song"
                value={song}
              />
            ))}
          </div>

          <div className="form-block">
            <span className="form-block__label">Favorite movie</span>
            <input
              maxLength={120}
              onChange={(e) => setMovie(e.target.value)}
              placeholder="You will recognize any quote"
              required
              value={movie}
            />
          </div>

          <div className="form-block">
            <span className="form-block__label">Favorite TV show</span>
            <input
              maxLength={120}
              onChange={(e) => setTvShow(e.target.value)}
              placeholder="No matter how old"
              required
              value={tvShow}
            />
          </div>

          <div className="form-block">
            <span className="form-block__label">Favorite drinks</span>
            <div className="drink-grid">
              {drinkOptions.map((drink) => {
                const on = drinks.includes(drink);
                return (
                  <button
                    aria-pressed={on}
                    className="drink-btn"
                    key={drink}
                    onClick={() => toggleDrink(drink)}
                    type="button"
                  >
                    <span className="drink-btn__mark">{on ? "✓" : "+"}</span>
                    {drink === "Aperol Spritz" ? "Aperol Spritz (Duh!!)" : drink}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-block">
            <span className="form-block__label">Optional note</span>
            <textarea
              maxLength={240}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Requests, allergies, friendly comments"
              rows={3}
              value={note}
            />
          </div>

          <button
            className="submit-btn"
            disabled={!canSubmit || status === "submitting"}
            type="submit"
          >
            {status === "submitting" ? "Sending..." : "Send my picks"}
          </button>

          {message ? <p className={`status status--${status}`}>{message}</p> : null}
        </form>
      </section>
      )}
    </main>
  );
}
