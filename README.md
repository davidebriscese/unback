# no-bg

Self-hosted background removal, remove.bg style. Upload an image, get back a transparent PNG. Inference runs on the server with ONNX Runtime, images never leave it.

## Stack

- `frontend/` — Next.js 16, Tailwind 4, shadcn/ui. Single page: drag & drop or paste, before/after slider, PNG download.
- `backend/` — ASP.NET Core minimal API (.NET 10), ONNX Runtime (CPU), ImageSharp 3.1.
- Model: ISNet general-use, auto-downloaded to `backend/Models/` on first start. ~1-3s per image on CPU.

## Run

```bash
dotnet run --project backend --launch-profile http
```

```bash
npm run dev --prefix frontend
```

Backend on :5210, frontend on :3000. The frontend reads `NEXT_PUBLIC_API_URL` from `frontend/.env.local` (defaults to http://localhost:5210).

## API

- `POST /api/remove-background` — multipart, `file` field (max 15MB, max 25MP). Returns `image/png` with alpha.
- `GET /healthz` — status and loaded model.

```bash
curl -F "file=@photo.jpg" http://localhost:5210/api/remove-background -o out.png
```

## Config

Everything lives in `backend/appsettings.json` under `NoBg`: model (name, url, input size, normalization), upload limits, concurrency cap + queue timeout (503 when saturated), per-IP rate limit (429 + Retry-After), CORS origins (empty = any localhost port, dev only).

To switch model, edit `NoBg:Model` — the backend downloads it on first start and adapts pre/post-processing. Alternatives: `u2netp` (very fast, rough edges), `RMBG-1.4` (great quality but non-commercial license). URLs and normalization values for both are in the rembg and briaai/RMBG-1.4 repos.

## Notes

- Behind a reverse proxy, configure forwarded headers (`X-Forwarded-For`) with trusted proxies, or the per-IP rate limit sees every request as coming from the proxy.
- ImageSharp is pinned to 3.1.x: 4.x requires a commercial license at build time.
- GPU: switch to `Microsoft.ML.OnnxRuntime.DirectML` and enable the DML provider for a big speedup.
