<div align="center">

<img src=".github/assets/demo.gif" alt="Unback removing the background from a photo of a trainer" width="360">

# Unback

Open-source background removal you can self-host.

[![CI](https://github.com/davidebriscese/unback/actions/workflows/ci.yml/badge.svg)](https://github.com/davidebriscese/unback/actions/workflows/ci.yml)
[![Release](https://github.com/davidebriscese/unback/actions/workflows/release.yml/badge.svg)](https://github.com/davidebriscese/unback/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Container](https://img.shields.io/badge/ghcr.io-unback-1f6feb?logo=docker&logoColor=white)](https://github.com/davidebriscese/unback/pkgs/container/unback)
[![Stars](https://img.shields.io/github/stars/davidebriscese/unback?style=social)](https://github.com/davidebriscese/unback/stargazers)

</div>

Upload a photo, get a transparent PNG. No account, no credits, no watermark, and no image is ever
written to disk. There is a web page for people and a plain HTTP API for programs, and both come in
one container you can run yourself.

- **No sign-up, no quota to buy.** Fair-use rate limits, which you can lift on your own instance.
- **Nothing is stored.** Images are decoded, processed and discarded inside a single request; no
  image is written to disk, logged or used for training.
- **One container.** The web page and the API are the same process on the same origin.
- **Runs on CPU.** No GPU required; roughly a second or two per image on a modern computer.

---

## Quickstart

```bash
docker run -p 8080:8080 -v unback-models:/app/Models ghcr.io/davidebriscese/unback
```

Open <http://localhost:8080>. On first start it downloads the neural network (~170MB) into the
volume, so later restarts are instant.

Or with Compose:

```bash
curl -O https://raw.githubusercontent.com/davidebriscese/unback/main/docker-compose.yml && docker compose up -d
```

## The web app

Drop an image, click to pick one, or paste with `Ctrl+V`. You get a before/after slider, an optional
solid background colour (composited in your browser, so it costs no extra request), and a download
button. English lives at `/`; German, Spanish, French, Italian, Japanese, Portuguese, Russian and
Chinese live at `/de`, `/es`, `/fr`, `/it`, `/ja`, `/pt`, `/ru` and `/zh`. Adding a language is one
dictionary file; see [CONTRIBUTING.md](CONTRIBUTING.md).

## The API

One endpoint: send an image, get a transparent PNG.

```bash
curl -F "file=@photo.jpg" http://localhost:8080/api/v1/remove -o unback.png
```

```python
import requests

with open("photo.jpg", "rb") as photo:
    response = requests.post("http://localhost:8080/api/v1/remove", files={"file": photo})
response.raise_for_status()
open("unback.png", "wb").write(response.content)
```

```javascript
const body = new FormData();
body.append("file", file);

const response = await fetch("http://localhost:8080/api/v1/remove", { method: "POST", body });
if (!response.ok) throw new Error((await response.json()).code);
const png = await response.blob();
```

### `POST /api/v1/remove`

`multipart/form-data` with one part named `file`. Returns `image/png` at the original dimensions,
with the background made transparent. Up to 15MB and 25 megapixels; JPEG, PNG, WebP, BMP, GIF and
TIFF are accepted.

Failures answer JSON: `{"code": "…", "error": "…"}`. Branch on `code`, show `error` to nobody but
yourself: it is always English.

| Status | `code` | Meaning |
| --- | --- | --- |
| 400 | `missing_file` | No `file` part, or it was empty |
| 400 | `invalid_image` | The bytes are not a decodable image |
| 400 | `invalid_request` | Malformed request body |
| 413 | `file_too_large` | Larger than the configured upload limit |
| 413 | `payload_too_large` | Beyond the hard limit; rejected by the server before the endpoint |
| 415 | `unsupported_media_type` | The part is not an `image/*` type |
| 422 | `too_many_pixels` | Above the configured pixel cap |
| 429 | `rate_limited` | Per-minute limit; see `Retry-After` |
| 429 | `daily_limit_reached` | Daily fair-use cap; see `Retry-After` |
| 503 | `server_busy` | Inference queue full; see `Retry-After` |
| 504 | `timeout` | Processing exceeded the request budget |
| 500 | `internal_error` | Something broke; please open an issue |

Unknown routes under `/api` answer `404 not_found`. A request far beyond the size limit may have its
connection reset mid-upload before any JSON body is readable, so always check the status before
parsing.

**Fair use.** A public instance allows 10 requests per minute and 100 per day, per IP address. No key
is needed, and none is offered: if you need more, run your own instance.

Other endpoints: `GET /healthz` reports the loaded model and version, and `GET /openapi/v1.json`
is the machine-readable spec.

## Self-hosting

Every setting is an environment variable. The `Unback__` prefix mirrors the JSON structure in
[`backend/appsettings.json`](backend/appsettings.json).

| Variable | Default | What it does |
| --- | --- | --- |
| `Unback__RateLimit__PermitLimit` | `10` | Requests per window, per IP |
| `Unback__RateLimit__WindowSeconds` | `60` | Length of that window |
| `Unback__RateLimit__DailyLimit` | `100` | Requests per 24h, per IP. `0` disables the daily cap |
| `Unback__MaxUploadBytes` | `15728640` | Upload size limit |
| `Unback__MaxImagePixels` | `25000000` | Pixel cap, to stop decompression bombs |
| `Unback__MaxConcurrentInferences` | `2` | Images processed at once; raise it with core count |
| `Unback__InferenceQueueTimeoutSeconds` | `10` | How long a request waits for a slot before a 503 |
| `Unback__RequestTimeoutSeconds` | `60` | Wall-clock budget per request; raise it on slow hardware |
| `Unback__AllowedOrigins__0` | *(unset)* | Lock CORS to specific origins. Unset means any origin |
| `Unback__Analytics__MeasurementId` | *(unset)* | GA4 measurement ID, `G-XXXXXXXXXX`. Unset means no analytics at all |
| `Unback__Model__Name` | `isnet-general-use` | Model file name, without `.onnx` |
| `Unback__Model__Url` | *(see appsettings)* | Where to fetch it on first start |
| `Unback__Model__Sha256` | *(see appsettings)* | Expected checksum. Empty string disables the check |
| `Unback__Model__InputSize` | `1024` | Square input resolution the model expects |
| `Unback__Model__Mean__0..2` | `0.5, 0.5, 0.5` | Per-channel normalization mean the model was trained with |
| `Unback__Model__Std__0..2` | `1.0, 1.0, 1.0` | Per-channel normalization standard deviation |
| `Unback__Model__AlphaFloor` | `0.15` | Saliency below this reads as background |
| `Unback__Model__AlphaCeiling` | `0.55` | Saliency above this reads as solid subject. `0`/`1` disables the pass |
| `ASPNETCORE_URLS` | `http://+:8080` | Listen address. Changing the port? Set `HEALTHCHECK_URL` to match |
| `HEALTHCHECK_URL` | `http://localhost:8080/healthz` | What the container's own health probe requests |
| `ASPNETCORE_FORWARDEDHEADERS_ENABLED` | *(unset)* | See below |

**Behind a reverse proxy**, set `ASPNETCORE_FORWARDEDHEADERS_ENABLED=true` so rate limits key on the
real client IP instead of the proxy's. Only do this when the container is reachable *exclusively*
through a proxy that overwrites `X-Forwarded-For` itself, otherwise anyone can forge the header and
walk around the limits.

**Bind mounts** for `/app/Models` need to be writable by the container user: `chown 1654 <dir>`.
Named volumes inherit the right ownership from the image and need nothing.

Rate-limit counters live in memory: they reset when the container restarts, and the daily window
starts at a client's first request rather than at midnight. That is fair-use behaviour, not billing.

**Your own domain and SEO.** The public domain is baked into the page at build time, so the prebuilt
`:latest` image emits `unback.app` in its canonical URL, sitemap, robots and OG tags. That is
harmless for personal use, but if you want search engines to index *your* domain, build the image
yourself with your host:

```bash
docker build --build-arg NEXT_PUBLIC_SITE_URL=https://your.domain -t unback .
```

**Analytics.** Off unless you turn it on, and the image carries nobody's measurement ID - not even
the official instance's, which supplies its own at runtime like any other deployment. Point it at
your own GA4 property with one environment variable:

```bash
docker run -e Unback__Analytics__MeasurementId=G-XXXXXXXXXX -p 8080:8080 unback
```

The app then serves `/analytics.js` with Google's tag; leave the variable unset and that file is
empty, so no third-party request is ever made. Page views plus a handful of anonymous events (an
image selected, a background removed, a result downloaded, and how long inference took) are
reported - never a file name, never image content. Bear in mind that Google Analytics sets cookies:
if you serve visitors in the EU, consent is your responsibility as the operator.

## Models and their licences

The model is downloaded at runtime, not baked into the image, so swapping it is a config change.

| Model | Licence | Notes |
| --- | --- | --- |
| [`isnet-general-use`](https://github.com/danielgatis/rembg/releases/download/v0.0.0/isnet-general-use.onnx) | Apache-2.0 | Default. Best all-round quality |
| [`u2net`](https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net.onnx) | Apache-2.0 | Older, lighter, rougher edges |
| [`u2netp`](https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2netp.onnx) | Apache-2.0 | Smallest and fastest |
| [`silueta`](https://github.com/danielgatis/rembg/releases/download/v0.0.0/silueta.onnx) | Apache-2.0 | u2net-sized quality in a smaller file |
| `BRIA RMBG-1.4` | **CC BY-NC 4.0** | ⚠️ Non-commercial only. Do not use it on a public or commercial instance |

To switch, point `Unback__Model__Url` and `Unback__Model__Name` at another file and set
`Unback__Model__InputSize`, `Unback__Model__Mean` and `Unback__Model__Std` to the values that model was
trained with; [rembg's session definitions](https://github.com/danielgatis/rembg) are the reference.
Clear `Unback__Model__Sha256` (or set the new file's checksum) or startup will reject the download.

## How it works

```
browser ──► Kestrel ──┬──► static export (wwwroot)   the page, one HTML file per locale
                      └──► /api/v1/remove
                              │
                              ├─ header-only decode: reject bombs before allocating
                              ├─ resize to the model input, normalise, run ONNX Runtime
                              ├─ min-max the saliency map, then stretch it between the alpha levels
                              └─ upscale it into the alpha channel, encode PNG
```

The levels step is the one place Unback departs from rembg. The model is only ever *confident* about
the subject, never certain, so its raw map leaves the middle of a low-contrast subject (a grey
jumper on a grey wall) sitting around 85% opaque, which reads as a see-through cut-out. Clamping
everything above `AlphaCeiling` to solid fixes that; keeping a ramp below it is what leaves hair and
fur soft instead of cut out with scissors.

The frontend is a Next.js static export; the backend is an ASP.NET Core minimal API that serves
those files and runs the model through ONNX Runtime on CPU. Comparing, recolouring and downloading
all happen client-side, so the server only ever does the one expensive thing.

## Development

You need the .NET 10 SDK and Node.js 22+. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full loop;
the short version is two terminals:

```bash
dotnet run --project backend
```

```bash
npm install --prefix frontend && npm run dev --prefix frontend
```

Adding a language is one dictionary file and one registry entry. TypeScript reports anything you
miss, and the backend picks up the new page on its own.

## Licences

Unback is MIT licensed. Its dependencies:

- **ONNX Runtime**: MIT.
- **SixLabors.ImageSharp 3.1.x**: Six Labors Split License 1.0, which grants Apache-2.0 terms when
  the consuming software is open source. Unback qualifies, and the dependency is pinned to 3.1.x
  deliberately: later versions changed those terms.
- **Model weights**: see the table above. The default is Apache-2.0.

Demo photos in `frontend/public/samples/`, and the animation at the top of this file, are from
Unsplash under the [Unsplash License](https://unsplash.com/license), by
[Jurica Koletić](https://unsplash.com/@juricakoletic),
[USAMA AKRAM](https://unsplash.com/@usama_1248) and
[Richard Brutyo](https://unsplash.com/@richardbrutyo).

## Contributing

Issues, translations and focused pull requests are welcome; start with
[CONTRIBUTING.md](CONTRIBUTING.md). For security reports, see [SECURITY.md](SECURITY.md).
