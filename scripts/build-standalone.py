#!/usr/bin/env python3
"""
Bundles index.html + src/styles/*.css + src/js/*.js into a single zero-dependency
portable file: dist/NPS-Promoter-Recognition.html
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / "index.html"
OUT = ROOT / "dist" / "NPS-Promoter-Recognition.html"

def main():
    html = INDEX.read_text(encoding="utf-8")

    css_chunks = []
    def replace_css(match):
        rel = match.group(1).lstrip("./")
        css_chunks.append((ROOT / rel).read_text(encoding="utf-8").rstrip())
        return ""

    html = re.sub(r'\s*<link\s+rel="stylesheet"\s+href="([^"]+)"\s*/?>', replace_css, html)
    inlined_style = "\n  <style>\n" + "\n\n".join(
        "\n".join("    " + ln if ln else "" for ln in chunk.splitlines())
        for chunk in css_chunks
    ) + "\n  </style>"
    html = html.replace("</head>", inlined_style + "\n</head>", 1)

    js_chunks = []
    def replace_js(match):
        rel = match.group(1).lstrip("./")
        js_chunks.append((ROOT / rel).read_text(encoding="utf-8").rstrip())
        return ""

    html = re.sub(r'\s*<script\s+src="([^"]+)"\s*></script>', replace_js, html)
    inlined_script = "\n  <script>\n" + "\n\n".join(
        "\n".join("    " + ln if ln else "" for ln in chunk.splitlines())
        for chunk in js_chunks
    ) + "\n  </script>"
    html = html.replace("</body>", inlined_script + "\n</body>", 1)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(html, encoding="utf-8")
    print(f"Built standalone file: {OUT} ({OUT.stat().st_size:,} bytes)")

if __name__ == "__main__":
    main()
