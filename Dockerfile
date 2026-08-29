# syntax=docker/dockerfile:1

# The web app is exported to static files and served by the API itself, so the whole product
# is one container on one origin.
FROM node:26-alpine AS frontend
WORKDIR /src
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
ARG NEXT_PUBLIC_SITE_URL=https://unback.app
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend
ARG TARGETARCH
ARG VERSION=0.0.0-dev
WORKDIR /src
COPY backend/backend.csproj ./
# Architecture-specific restore: only this platform's ONNX Runtime natives end up in the image.
RUN dotnet restore -a $TARGETARCH
COPY backend/ ./
RUN dotnet publish -a $TARGETARCH -c Release --no-restore -o /app \
    -p:UseAppHost=false -p:Version=$VERSION

# Debian, not Alpine: ONNX Runtime ships no musl natives.
FROM mcr.microsoft.com/dotnet/aspnet:10.0
LABEL org.opencontainers.image.source="https://github.com/davidebriscese/unback" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.title="Unback" \
      org.opencontainers.image.description="Free, self-hostable background remover"

WORKDIR /app
COPY --from=backend /app ./
COPY --from=frontend /src/out ./wwwroot

# The model is downloaded on first start into a volume, so upgrading the image does not refetch it.
RUN mkdir -p /app/Models && chown $APP_UID /app/Models
VOLUME /app/Models

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
USER $APP_UID

# The runtime image carries no curl or wget, so the app probes itself. The start period covers
# the first-boot model download.
HEALTHCHECK --interval=30s --timeout=10s --start-period=300s --retries=3 \
    CMD ["dotnet", "/app/backend.dll", "healthcheck"]

ENTRYPOINT ["dotnet", "/app/backend.dll"]
