# Contributing

Thanks for considering it. Bug reports, translations and small focused pull requests are all
welcome.

## Getting set up

You need the [.NET 10 SDK](https://dotnet.microsoft.com/download) and Node.js 22+.

Run the two processes in separate terminals:

```bash
dotnet run --project backend
```

```bash
npm install --prefix frontend && npm run dev --prefix frontend
```

The backend downloads the ONNX model (~170MB) into `backend/Models/` on first start, then listens
on <http://localhost:5210>. The dev server prints its own URL; English is at `/en` and Italian at
`/it` — the clean `/` URL only exists in production, where the backend rewrites it.

## Checks before opening a pull request

```bash
dotnet test unback.slnx
```

```bash
npm run lint --prefix frontend && npm run typecheck --prefix frontend && npm run build --prefix frontend
```

To try the production shape locally, build the frontend, copy `frontend/out/` into
`backend/wwwroot/` and run the backend on its own: it then serves both the page and the API on one
origin, exactly like the container does.

If you touched the `Dockerfile`, build the real thing instead — CI does the same on every pull
request:

```bash
docker build -t unback:dev . && docker run --rm -p 8080:8080 -v unback-dev-models:/app/Models unback:dev
```

## Adding a language

1. Copy `frontend/lib/i18n/en.ts` to `frontend/lib/i18n/<code>.ts` and translate the values.
2. Add the code to `locales` and `localeInfo` in `frontend/lib/i18n/locales.ts`.
3. Register it in the `dictionaries` map in `frontend/lib/i18n/index.ts`.

Static params, canonical URLs, hreflang tags, the sitemap and the language switcher all derive
from that registry, and the backend discovers the new page on its own. TypeScript will tell you
about any string you missed.

## House style

- Small, single-purpose commits with a conventional-commit subject (`feat:`, `fix:`, `docs:`, …).
- Match the surrounding code. Comments explain constraints, not mechanics.
- New behaviour on the API surface comes with a test in `backend.Tests/`.
- Please do not bump `SixLabors.ImageSharp` past 3.1.x — later versions changed licence terms.
