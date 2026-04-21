#!/usr/bin/env python3
"""
Fetch lecture transcripts from YouTube into content/lectures/transcripts/.

Requires: pip install --user youtube-transcript-api

Usage:
    python3 scripts/fetch-transcripts.py              # all missing
    python3 scripts/fetch-transcripts.py --en-only    # only English
    python3 scripts/fetch-transcripts.py --refetch    # overwrite existing

English transcripts are pulled from YouTube directly (human-made preferred,
auto-generated as fallback). Ru/pt/es are pulled as YouTube auto-translations
from the English source.

YouTube sometimes IP-blocks requests — if you see IpBlocked errors, wait an
hour and re-run.
"""

import os
import sys
import time
import random

try:
    from youtube_transcript_api import YouTubeTranscriptApi
    from youtube_transcript_api._errors import IpBlocked
except ImportError:
    print("Install: pip install --user --break-system-packages youtube-transcript-api")
    sys.exit(1)

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(REPO_ROOT, "content/lectures/transcripts")
LOCALES = ["en", "ru", "pt", "es"]

LECTURES = {
    "levin-bioelectric-morphogenesis-2024": "qWrU2f1wMmY",
    "tononi-iit-4-2025": "Rdn5lN1dz8w",
    "vanchurin-jaimungal-2026": "73IdQGgfxas",
    "vanchurin-world-as-neural-network-2020": "tAKaqojK0d8",
}


def filepath(slug: str, locale: str) -> str:
    suffix = "" if locale == "en" else f".{locale}"
    return os.path.join(OUT_DIR, f"{slug}{suffix}.md")


def format_transcript(segments) -> str:
    paras, buf, last_end = [], [], 0.0
    for s in segments:
        text = getattr(s, "text", "").strip()
        start = getattr(s, "start", 0.0)
        dur = getattr(s, "duration", 0.0)
        if not text:
            continue
        if buf and (start - last_end) > 2.0:
            paras.append(" ".join(buf))
            buf = []
        buf.append(text.replace("\n", " "))
        last_end = start + dur
    if buf:
        paras.append(" ".join(buf))
    blocks, chunk = [], []
    for p in paras:
        chunk.append(p)
        if len(" ".join(chunk)) > 600:
            blocks.append(" ".join(chunk))
            chunk = []
    if chunk:
        blocks.append(" ".join(chunk))
    return "\n\n".join(blocks)


def save(slug: str, vid: str, locale: str, body: str, origin: str) -> None:
    path = filepath(slug, locale)
    header = (
        f"# Transcript — {slug}"
        + (f" ({locale})" if locale != "en" else "")
        + "\n\n"
        f"Source: https://www.youtube.com/watch?v={vid}\n"
        f"Language: {locale}\n"
        f"Origin: {origin}\n\n"
        "---\n\n"
    )
    with open(path, "w") as f:
        f.write(header + body + "\n")
    print(f"  wrote {path} ({len(body)} chars)")


def fetch_one(
    api: YouTubeTranscriptApi, slug: str, vid: str, locale: str, refetch: bool
) -> bool:
    if not refetch and os.path.exists(filepath(slug, locale)):
        print(f"  {slug}.{locale}: skip (exists)")
        return True
    try:
        listing = api.list(vid)
        src = next((t for t in listing if t.language_code == "en" and not t.is_generated), None)
        if not src:
            src = next((t for t in listing if t.language_code == "en"), None)
        if not src:
            print(f"  {slug}.{locale}: no English source")
            return False
        if locale == "en":
            segs = list(src.fetch())
            origin = "Human-made" if not src.is_generated else "Auto-generated"
            origin += " (YouTube)"
        else:
            segs = list(src.translate(locale).fetch())
            origin = "Auto-translated from English by YouTube (machine translation)"
        save(slug, vid, locale, format_transcript(segs), origin)
        return True
    except IpBlocked:
        print(f"  {slug}.{locale}: IpBlocked — wait ~1h and retry")
        return False
    except Exception as e:
        print(f"  {slug}.{locale}: FAIL {type(e).__name__}: {str(e)[:100]}")
        return False


def main() -> None:
    en_only = "--en-only" in sys.argv
    refetch = "--refetch" in sys.argv
    os.makedirs(OUT_DIR, exist_ok=True)
    api = YouTubeTranscriptApi()
    targets = ["en"] if en_only else LOCALES
    pending = [(slug, vid, loc) for slug, vid in LECTURES.items() for loc in targets]
    print(f"pending: {len(pending)}")
    for i, (slug, vid, loc) in enumerate(pending):
        if i > 0:
            delay = 30 + random.randint(0, 20)
            print(f"sleeping {delay}s...")
            time.sleep(delay)
        fetch_one(api, slug, vid, loc, refetch)


if __name__ == "__main__":
    main()
