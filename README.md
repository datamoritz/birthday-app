# Moritz Birthday Bash

Mobile-first birthday party intake app for April 29, 2026.

Guests can anonymously submit:

- Favorite songs, up to 3
- Favorite movie
- Favorite TV show
- Favorite drinks
- Optional note

## Frontend

```bash
npm install
npm run dev
```

The local app runs on `http://localhost:3020`.

For Vercel, set:

```text
NEXT_PUBLIC_SUBMISSIONS_API_URL=https://birthday-api.moritzknodler.com/submissions
```

If that variable is not set, the app posts to the built-in local Next.js route at `/api/submissions`.

## Backend

The production backend is a small Python HTTP service in `backend/birthday_backend.py`.

It stores submissions in:

```text
backend/data/submissions.json
```

Useful environment variables:

```text
BIRTHDAY_HOST=127.0.0.1
BIRTHDAY_PORT=8029
BIRTHDAY_DATA_FILE=/opt/moritz-birthday-bash/backend/data/submissions.json
BIRTHDAY_ALLOWED_ORIGINS=*
```

Health check:

```bash
curl https://birthday-api.moritzknodler.com/health
```
