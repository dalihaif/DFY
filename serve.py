#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
云端院史馆 · 本地开发服务器
解决 file:// 下 localStorage 跨目录隔离问题
统一 origin → 管理后台 + 前台共享同一份数据
"""

import http.server
import socketserver
import os

PORT = 8000
DIR = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIR, **kwargs)

    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {args[0]}")

os.chdir(DIR)
print(f"""
╔════════════════════════════════════════════════╗
║         🏛️  云端院史馆 · 本地服务              ║
╠════════════════════════════════════════════════╣
║  管理后台: http://localhost:{PORT}/admin/       ║
║  前台首页: http://localhost:{PORT}/             ║
║  职工名录: http://localhost:{PORT}/pages/13-staff.html  ║
║  数据诊断: http://localhost:{PORT}/diagnostic.html      ║
║                                                ║
║  按 Ctrl+C 停止服务器                           ║
╚════════════════════════════════════════════════╝
""")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n服务器已停止")
