# Security policy

## Reporting a vulnerability

Please report security issues privately through
[GitHub Security Advisories](https://github.com/davidebriscese/no-bg/security/advisories/new)
rather than opening a public issue. Include what you found, how to reproduce it, and the impact
you think it has.

Expect an acknowledgement within a few days. Once a fix is released the advisory is published with
credit, unless you prefer otherwise.

## Supported versions

Fixes land on `main` and in the next `ghcr.io/davidebriscese/no-bg` image. Only the latest image is
supported — there are no maintenance branches.

## Scope notes

Uploaded images are held in memory for the duration of a request and never written to disk. If you
find a way to make the service persist, leak, or serve another user's image, that is in scope and
worth reporting.

Public instances are intentionally unauthenticated. Exhausting the documented fair-use rate limits
is not a vulnerability; bypassing them is.
