#!/usr/bin/env python3
"""
云端院史馆 · 本地开发服务器
用法: python serve.py [port]
"""

import http.server, os, sys, socket, webbrowser
from pathlib import Path

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
PUBLIC_DIR = Path(__file__).parent / 'public'

if not PUBLIC_DIR.exists():
    print(f'[ERROR] public/ directory not found. Run build.py first.')
    sys.exit(1)

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PUBLIC_DIR), **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

def get_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return '127.0.0.1'

if __name__ == '__main__':
    ip = get_ip()
    print('=' * 60)
    print('  云端院史馆 · 本地开发服务器')
    print('=' * 60)
    print(f'  本地地址: http://localhost:{PORT}')
    print(f'  局域网:   http://{ip}:{PORT}')
    print(f'  按 Ctrl+C 停止服务器')
    print('=' * 60)
    with http.server.HTTPServer(('', PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print('\n[STOP] Server stopped.')
