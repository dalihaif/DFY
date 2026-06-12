#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
云端院史馆 · 本地开发服务器
============================
启动后管理后台与前台共享同一 origin (localhost:PORT)，
localStorage 数据互通，编辑即时生效。

用法：
    python serve.py            # 默认 8000 端口
    python serve.py 3000       # 指定端口
    python serve.py --open     # 自动打开浏览器
"""

import http.server
import socketserver
import os
import sys
import mimetypes
import webbrowser
import signal

# ============================================================
# 配置
# ============================================================
ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = 8000
AUTO_OPEN = False

if len(sys.argv) > 1:
    for arg in sys.argv[1:]:
        if arg == '--open':
            AUTO_OPEN = True
        elif arg.isdigit():
            PORT = int(arg)

# ---- 补充 MIME 类型 ----
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('application/javascript', '.mjs')
mimetypes.add_type('text/css', '.css')
mimetypes.add_type('image/svg+xml', '.svg')
mimetypes.add_type('image/webp', '.webp')
mimetypes.add_type('font/woff2', '.woff2')
mimetypes.add_type('font/woff', '.woff')
mimetypes.add_type('application/json', '.json')
mimetypes.add_type('application/json', '.map')

# ============================================================
# Handler
# ============================================================
class Handler(http.server.SimpleHTTPRequestHandler):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    # ---- 响应头 ----
    def end_headers(self):
        ext = os.path.splitext(self.path)[1].lower()
        # HTML / JS 不缓存，确保编辑即时可见
        if ext in ('.html', '.js', '.css', '.json', '.map'):
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        else:
            self.send_header('Cache-Control', 'public, max-age=3600')
        super().end_headers()

    # ---- 美化日志 ----
    def log_message(self, format, *args):
        status = getattr(self, 'log_status', None) or (args[0] if args else '-')
        color = {
            '200': '\033[32m', '304': '\033[36m',
            '301': '\033[33m', '302': '\033[33m',
            '404': '\033[31m', '500': '\033[31m',
        }.get(str(status), '\033[0m')
        reset = '\033[0m'
        print(f"  {color}{status}{reset}  {args[0]}")

    def log_request(self, code='-', size='-'):
        self.log_status = str(code)
        super().log_request(code, size)

    # ---- 404 页面 ----
    def send_error(self, code, message=None):
        if code == 404:
            self.send_response(404)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(f"""<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8"><title>404</title>
<style>body{{font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#1a1a2e;color:#e0e0e0;flex-direction:column;gap:12px}}
h1{{font-size:4rem;margin:0;color:#e8c170}}a{{color:#e8c170}}</style></head>
<body><h1>404</h1><p>页面不存在：<code>{self.path}</code></p>
<p><a href="/">返回首页</a> &nbsp;·&nbsp; <a href="/admin/">管理后台</a></p></body></html>""".encode())
        else:
            super().send_error(code, message)

    # ---- 禁止目录列表 ----
    def list_directory(self, path):
        self.send_error(404)
        return None

# ============================================================
# 启动
# ============================================================
def try_start(port):
    """尝试在指定端口启动，失败则返回 None"""
    try:
        httpd = socketserver.ThreadingTCPServer(('', port), Handler)
        return httpd
    except OSError:
        return None

BANNER = """
  ╔═══════════════════════════════════════════════════╗
  ║     🏛️  云端院史馆 · 大理大学第一附属医院         ║
  ╠═══════════════════════════════════════════════════╣
  ║  前台首页 : http://localhost:{port}/               ║
  ║  管理后台 : http://localhost:{port}/admin/         ║
  ║  职工名录 : http://localhost:{port}/pages/13-staff.html  ║
  ║                                                   ║
  ║  按 Ctrl+C 停止                                    ║
  ╚═══════════════════════════════════════════════════╝
"""

os.chdir(ROOT)

# 逐个尝试端口（从指定 port 到 port+9）
for offset in range(10):
    p = PORT + offset
    httpd = try_start(p)
    if httpd:
        PORT = p
        break
else:
    print(f"错误：端口 {PORT}–{PORT+9} 均被占用，请手动指定端口")
    sys.exit(1)

print(BANNER.format(port=PORT))

if AUTO_OPEN:
    webbrowser.open(f'http://localhost:{PORT}/')

# 优雅退出
signal.signal(signal.SIGINT, lambda s, f: (print('\n服务器已停止'), sys.exit(0)))

try:
    httpd.serve_forever()
except KeyboardInterrupt:
    print('\n服务器已停止')
