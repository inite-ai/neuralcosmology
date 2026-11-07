#!/usr/bin/env python3
"""IndexNow: сообщить Bing и Яндексу только о новых и изменённых адресах.

Раньше каждый деплой (бывало 15 в день) отправлял все ~570 адресов sitemap, хотя
менялись единицы. IndexNow просит слать только то, что изменилось: постоянная
повторная отправка неизменных страниц снижает доверие к сигналам сайта.

Состояние (адрес → lastmod) лежит на сервере деплоя в STATE. Адрес уходит, если его
раньше не было или у него сменился lastmod. Первый запуск только запоминает
текущий sitemap: всё уже было отправлено прежними деплоями.

  python3 scripts/indexnow.py <domain> <key> [state-file]
"""
from __future__ import annotations

import json
import os
import re
import sys
import urllib.error
import urllib.request

ENDPOINTS = ["https://api.indexnow.org/indexnow", "https://yandex.com/indexnow"]
BATCH = 10000
# Cloudflare отвечает 403 на стандартный «Python-urllib».
UA = {"User-Agent": "neuralcosmology-indexnow/1.0 (+https://neuralcosmology.com)"}


def sitemap(domain: str) -> dict[str, str]:
    with urllib.request.urlopen(urllib.request.Request(f"https://{domain}/sitemap.xml", headers=UA), timeout=60) as r:
        xml = r.read().decode()
    out = {}
    for block in re.findall(r"<url>(.*?)</url>", xml, re.S):
        loc = re.search(r"<loc>([^<]+)</loc>", block)
        if loc:
            mod = re.search(r"<lastmod>([^<]+)</lastmod>", block)
            out[loc.group(1).strip()] = mod.group(1).strip() if mod else ""
    return out


def submit(domain: str, key: str, urls: list[str]) -> bool:
    ok = True
    for i in range(0, len(urls), BATCH):
        body = json.dumps({"host": domain, "key": key, "keyLocation": f"https://{domain}/{key}.txt", "urlList": urls[i : i + BATCH]}).encode()
        for ep in ENDPOINTS:
            req = urllib.request.Request(ep, data=body, headers={"Content-Type": "application/json; charset=utf-8", **UA})
            try:
                with urllib.request.urlopen(req, timeout=60) as r:
                    code = r.status
            except urllib.error.HTTPError as e:
                code = e.code
            except Exception as e:  # сеть: в следующий раз отправим снова
                print(f"{ep}: {e}")
                ok = False
                continue
            print(f"{ep}: {code}")
            if code not in (200, 202):
                ok = False
    return ok


def main() -> None:
    domain, key = sys.argv[1], sys.argv[2]
    state_path = sys.argv[3] if len(sys.argv) > 3 else os.path.expanduser(f"~/.indexnow/{domain}.json")
    current = sitemap(domain)
    if not current:
        sys.exit("sitemap is empty")
    try:
        with open(state_path) as f:
            seen = json.load(f)
    except FileNotFoundError:
        seen = None
    if seen is None:
        print(f"first run: remembering {len(current)} urls, nothing submitted")
        changed = []
    else:
        changed = [u for u, m in current.items() if u not in seen or seen[u] != m]
        print(f"{len(changed)} new or changed of {len(current)}")
        for u in changed[:20]:
            print("  " + u)
    # Состояние обновляется только после принятой отправки — иначе повторим в следующий раз.
    if changed and not submit(domain, key, changed):
        sys.exit(0)
    os.makedirs(os.path.dirname(state_path), exist_ok=True)
    tmp = state_path + ".tmp"
    with open(tmp, "w") as f:
        json.dump(current, f)
    os.replace(tmp, state_path)


if __name__ == "__main__":
    main()
