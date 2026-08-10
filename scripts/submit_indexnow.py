#!/usr/bin/env python3
"""Envía a IndexNow todas las URL públicas declaradas en sitemap.xml."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen
from xml.etree import ElementTree


SITE_HOST = "andyclor.com.ar"
SITE_ORIGIN = f"https://{SITE_HOST}"
INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow"
INDEXNOW_KEY = "9e25630c36644c258549d8f7415001ab"
KEY_FILENAME = f"{INDEXNOW_KEY}.txt"
PROJECT_ROOT = Path(__file__).resolve().parents[1]


def sitemap_urls(path: Path) -> list[str]:
    root = ElementTree.parse(path).getroot()
    urls: list[str] = []

    for element in root.iter():
        if element.tag.rsplit("}", 1)[-1] != "loc" or not element.text:
            continue

        url = element.text.strip()
        parsed = urlparse(url)
        if parsed.scheme != "https" or parsed.netloc != SITE_HOST:
            raise ValueError(f"URL fuera de {SITE_ORIGIN}: {url}")
        if url not in urls:
            urls.append(url)

    if not urls:
        raise ValueError("sitemap.xml no contiene URL para enviar")
    if len(urls) > 10_000:
        raise ValueError("IndexNow admite como máximo 10.000 URL por envío")

    return urls


def validate_key_file(path: Path) -> None:
    if not path.is_file():
        raise FileNotFoundError(f"Falta el archivo de verificación: {path.name}")
    if path.read_text(encoding="utf-8").strip() != INDEXNOW_KEY:
        raise ValueError(f"El contenido de {path.name} no coincide con su clave")


def submit(urls: list[str]) -> int:
    payload = {
        "host": SITE_HOST,
        "key": INDEXNOW_KEY,
        "keyLocation": f"{SITE_ORIGIN}/{KEY_FILENAME}",
        "urlList": urls,
    }
    request = Request(
        INDEXNOW_ENDPOINT,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": "ANDYCLOR-IndexNow/1.0",
        },
        method="POST",
    )

    with urlopen(request, timeout=30) as response:
        return response.status


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Valida la configuración sin comunicarse con IndexNow.",
    )
    args = parser.parse_args()

    try:
        validate_key_file(PROJECT_ROOT / KEY_FILENAME)
        urls = sitemap_urls(PROJECT_ROOT / "sitemap.xml")

        if args.dry_run:
            print(f"Validación correcta: {len(urls)} URL listas para IndexNow.")
            return 0

        status = submit(urls)
        if status not in (200, 202):
            print(f"IndexNow respondió con HTTP {status}.", file=sys.stderr)
            return 1

        detail = "recibidas" if status == 200 else "recibidas; validación de clave pendiente"
        print(f"IndexNow: {len(urls)} URL {detail} (HTTP {status}).")
        return 0
    except HTTPError as error:
        body = error.read().decode("utf-8", errors="replace").strip()
        detail = f": {body[:300]}" if body else ""
        print(f"IndexNow rechazó el envío (HTTP {error.code}){detail}", file=sys.stderr)
    except (FileNotFoundError, ValueError, ElementTree.ParseError, URLError, TimeoutError) as error:
        print(f"No se pudo completar IndexNow: {error}", file=sys.stderr)

    return 1


if __name__ == "__main__":
    raise SystemExit(main())
