#!/usr/bin/env python3
"""
dsh-skin-luoxiaohei · 素材生成脚本
assets/* → base64 data URI → 注入 client 模板 → lib/client.js
用法：python scripts/gen-assets.py
"""
import base64
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS_DIR = os.path.join(ROOT, "assets")
TEMPLATE = os.path.join(ROOT, "scripts", "client.template.js")
OUT = os.path.join(ROOT, "lib", "client.js")

MIME = {
    "jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png",
    "gif": "image/gif", "webp": "image/webp", "svg": "image/svg+xml",
}


def mime_of(name: str) -> str:
    ext = name.rsplit(".", 1)[-1].lower()
    return MIME.get(ext, "application/octet-stream")


def build() -> None:
    assets: dict[str, str] = {}
    for f in sorted(os.listdir(ASSETS_DIR)):
        path = os.path.join(ASSETS_DIR, f)
        if not os.path.isfile(path):
            continue
        with open(path, "rb") as fh:
            b64 = base64.b64encode(fh.read()).decode()
        assets[f] = f"data:{mime_of(f)};base64,{b64}"
        print(f"  assets/{f} -> {len(b64) // 1024} KB base64")

    with open(TEMPLATE, encoding="utf-8") as fh:
        source = fh.read()

    # JS 素材对象
    assets_js = "{\n" + "".join(
        f"  {json.dumps(k)}: {json.dumps(v)},\n" for k, v in assets.items()
    ) + "}"
    source = source.replace("__ASSETS__", assets_js)

    # CSS url 占位符 __ASSET_<name>__
    def repl(match: re.Match) -> str:
        key = match.group(1)
        return assets.get(key, match.group(0))

    source = re.sub(r"__ASSET_([a-zA-Z0-9._-]+)__", repl, source)

    with open(OUT, "w", encoding="utf-8") as fh:
        fh.write(source)
    print(f"  -> lib/client.js ({len(source) // 1024} KB)")


if __name__ == "__main__":
    build()
