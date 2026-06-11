#!/usr/bin/env python3
"""
Hugo 云端院史馆 · 构建与部署脚本
支持: Python 3.6+, Hugo Extended 0.100+, or Node.js fallback
"""

import json, os, sys, shutil, subprocess, time
from pathlib import Path

BASE_DIR = Path(__file__).parent.absolute()
PUBLIC_DIR = BASE_DIR / 'public'
DATA_FILE = BASE_DIR / 'data' / 'museum.json'

def cmd(c, shell=False):
    try:
        r = subprocess.run(c, shell=shell, cwd=str(BASE_DIR), capture_output=True, text=True)
        return r.returncode == 0, r.stdout, r.stderr
    except Exception as e:
        return False, '', str(e)

def check_hugo():
    ok, out, _ = cmd(['hugo', 'version'])
    if ok:
        print(f'[OK] Hugo found: {out.strip()}')
        return True
    ok, out, _ = cmd(['hugo'], shell=True)
    if 'Usage' in out or 'hugo' in out.lower():
        return True
    return False

def build_with_hugo():
    print('[BUILD] Running: hugo --minify --cleanDestinationDir ...')
    ok, out, err = cmd(['hugo', '--minify', '--cleanDestinationDir'])
    if not ok:
        print(f'[ERROR] Hugo build failed:\n{err}\n{out}')
        return False
    print(f'[DONE] Site built to: {PUBLIC_DIR}')
    return True

def build_with_python():
    """Python fallback: generate static HTML from data/museum.json"""
    print('[BUILD] Using Python HTML generator...')
    from html import escape

    def fix_path(p):
        """Fix relative paths like ../assets/ to /assets/ for flat output structure"""
        if not p: return p
        p = p.replace('../assets/', '/assets/')
        p = p.replace('assets/', '/assets/')
        # Don't double up
        p = p.replace('//assets/', '/assets/')
        return p

    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    settings = data.get('settings', {})
    content = data.get('content', {})
    PUBLIC_DIR.mkdir(exist_ok=True)
    (PUBLIC_DIR / 'css').mkdir(exist_ok=True)
    (PUBLIC_DIR / 'js').mkdir(exist_ok=True)
    (PUBLIC_DIR / 'assets').mkdir(exist_ok=True)

    # Copy static assets
    for d in ['css', 'js', 'assets']:
        src = BASE_DIR / 'static' / d
        dst = PUBLIC_DIR / d
        if src.exists():
            for f in src.glob('**/*'):
                if f.is_file():
                    df = dst / f.relative_to(src)
                    df.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(f, df)

    # Copy admin panel
    admin_src = BASE_DIR / 'admin'
    admin_dst = PUBLIC_DIR / 'admin'
    if admin_src.exists():
        if admin_dst.exists():
            shutil.rmtree(admin_dst)
        shutil.copytree(admin_src, admin_dst)
        print('[BUILD] Admin panel copied')

    page_count = 0

    # Helper to render blocks HTML
    def render_blocks(blocks, sec_id=''):
        if not blocks: return ''
        html = ''
        for b in blocks:
            img_html = ''
            if b.get('imgUrl'):
                img_html = f'<a href="{escape(fix_path(b["imgUrl"]))}" data-lightbox="{sec_id}"><img src="{escape(fix_path(b["imgUrl"]))}" alt="{escape(b.get("imgLabel",""))}" class="block-img" loading="lazy"></a>'
            html += f'''<div class="content-block">
    <div class="block-header">
      <div class="block-num">{escape(b.get("num",""))}</div>
      <h2 class="block-title">{escape(b.get("title",""))}</h2>
      <p class="block-sub">{escape(b.get("subtitle",""))}</p>
    </div>
    <div class="block-body"><div class="content-text">
      <span class="img-icon">{escape(b.get("imgIcon",""))}</span>
      <div class="text-html">{b.get("text","")}</div>
      {img_html}
    </div></div>
  </div>'''
        return html

    def render_timeline(items):
        if not items: return ''
        html = '<div class="timeline">'
        for t in items:
            html += f'''<div class="timeline-item">
    <div class="timeline-dot">{escape(t.get("dot",""))}</div>
    <div class="timeline-content">
      <div class="timeline-year">{escape(t.get("year",""))}</div>
      <h3 class="timeline-title">{escape(t.get("title",""))}</h3>
      <p class="timeline-desc">{escape(t.get("desc",""))}</p>
    </div>
  </div>'''
        return html + '</div>'

    def render_leaders(leaders):
        if not leaders: return ''
        html = '<div class="leader-grid">'
        for l in leaders:
            photo = f'<img src="{escape(fix_path(l["photo"]))}" alt="{escape(l["name"])}">' if l.get('photo') else f'<div class="leader-avatar">{escape(l["name"][:1])}</div>'
            html += f'''<div class="leader-card">
    <div class="leader-photo">{photo}</div>
    <div class="leader-info">
      <h3 class="leader-name">{escape(l.get("name",""))}</h3>
      <p class="leader-position">{escape(l.get("position",""))}</p>
      {f'<p class="leader-years">{escape(l["years"])}</p>' if l.get("years") else ''}
      {f'<span class="leader-era">{escape(l["era"])}</span>' if l.get("era") else ''}
      {f'<p class="leader-desc">{escape(l["desc"])}</p>' if l.get("desc") else ''}
      {f'<p class="leader-duty">{escape(l["duty"])}</p>' if l.get("duty") else ''}
      {f'<p class="leader-resume">{escape(l["resume"])}</p>' if l.get("resume") else ''}
    </div>
  </div>'''
        return html + '</div>'

    def render_profiles(profiles):
        if not profiles: return ''
        html = '<div class="profile-grid">'
        for p in profiles:
            html += f'''<div class="profile-card">
    {f'<div class="profile-photo"><img src="{escape(p["photo"])}" alt="{escape(p["name"])}"></div>' if p.get("photo") else ''}
    <div class="profile-info">
      <h3 class="profile-name">{escape(p.get("name",""))}</h3>
      <p class="profile-title">{escape(p.get("title",""))}</p>
      <p class="profile-dept">{escape(p.get("dept",""))}</p>
      {f'<p class="profile-desc">{escape(p["desc"])}</p>' if p.get("desc") else ''}
    </div>
  </div>'''
        return html + '</div>'

    def render_datacards(cards):
        if not cards: return ''
        html = '<div class="data-cards-row">'
        for c in cards:
            html += f'''<div class="data-card">
    <div class="data-card-value">{escape(str(c.get("value","")))}</div>
    <div class="data-card-label">{escape(c.get("label",""))}</div>
    {f'<div class="data-card-note">{escape(c["note"])}</div>' if c.get("note") else ''}
  </div>'''
        return html + '</div>'

    def render_gallery(items, sec_id=''):
        if not items: return ''
        html = '<div class="gallery-grid">'
        for g in items:
            if g.get('url'):
                html += f'''<div class="gallery-item">
    <a href="{escape(fix_path(g["url"]))}" data-lightbox="{sec_id}"><img src="{escape(fix_path(g["url"]))}" alt="{escape(g.get("label",""))}" loading="lazy"></a>
    <div class="gallery-label">{g.get("label","")}</div>
  </div>'''
            else:
                html += f'''<div class="gallery-item">
    <div class="gallery-placeholder">{escape(g.get("icon",""))}</div>
    <div class="gallery-label">{g.get("label","")}</div>
  </div>'''
        return html + '</div>'

    sections = [
        ('history', '01-history'), ('people', '02-people'), ('disciplines', '03-disciplines'),
        ('campus', '04-campus'), ('education', '05-education'), ('culture', '06-culture'),
        ('tech', '07-tech'), ('duty', '08-duty'), ('honors', '09-honors'),
        ('vision', '10-vision'), ('structure', '11-structure'), ('leadership', '12-leadership'),
        ('staff', '13-staff')
    ]

    # Build each section page
    for sec_id, filename in sections:
        sec = content.get(sec_id, {})
        if not sec: continue
        hero = sec.get('hero', {})
        body = f'''    {render_datacards(sec.get('dataCards'))}
    {render_blocks(sec.get('blocks'), sec_id)}
    {render_timeline(sec.get('timeline'))}
    {render_leaders(sec.get('leaders'))}
    {render_profiles(sec.get('profiles'))}
    {render_gallery(sec.get('gallery'), sec_id)}'''

        page_html = f'''<!DOCTYPE html>
<html lang="zh-CN" data-theme="dark">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>{escape(hero.get("title",""))} · 云端院史馆</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700&family=Noto+Serif+TC:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/style.css"><link rel="stylesheet" href="/css/sections.css"><link rel="stylesheet" href="/css/visuals.css">
</head>
<body>
<nav class="navbar container"><a href="/" class="nav-logo">🏛 云端院史馆</a>
<button class="btn-theme" onclick="toggleTheme()">☀️</button></nav>
<section class="page-hero">
  <img class="page-hero-bg" src="{escape(fix_path(hero.get("bgImage","")))}" alt="{escape(hero.get("title",""))}" onerror="this.style.display='none'">
  <div class="page-hero-overlay"></div>
  <div class="page-hero-content">
    <div class="page-hero-num">{escape(hero.get("num",""))}</div>
    <h1 class="page-hero-title">{escape(hero.get("title",""))}</h1>
    <p class="page-hero-subtitle">{escape(hero.get("subtitle",""))}</p>
    <p class="page-hero-desc">{escape(hero.get("desc",""))}</p>
  </div>
</section>
<div class="container section-content">{body}
</div>
<footer class="footer"><div class="container"><p>&copy; {time.localtime().tm_year} 云端院史馆 · 大理大学第一附属医院</p></div></footer>
<script>var a=document.documentElement;function t(){{var e=localStorage.getItem('museum-theme')||'dark';a.setAttribute('data-theme',e);var n=document.querySelector('.btn-theme');if(n)n.textContent=e==='dark'?'☀️':'🌙';}}window.toggleTheme=function(){{localStorage.setItem('museum-theme',a.getAttribute('data-theme')==='dark'?'light':'dark');t();}};t();</script>
</body></html>'''
        page_file = PUBLIC_DIR / f'{filename}.html'
        page_file.write_text(page_html, encoding='utf-8')
        page_count += 1

    # Build index
    idx = content.get('index', {})
    idx_gallery = idx.get('gallery', [])
    stats = idx.get('statsBar', [])
    stats_html = ''.join(f'<div class="stat-item"><span class="stat-value">{escape(str(s["value"]))}<small>{escape(s.get("unit",""))}</small></span><span class="stat-label">{escape(s.get("label",""))}</span></div>' for s in stats)

    ann_html = ''
    anns = data.get('announcements', [])
    if anns:
        ann_html = '<section class="announcements-section container"><h2>📋 医院公告</h2><div class="announcements-list">'
        for a in anns[:6]:
            ann_html += f'<div class="announcement-item"><span class="ann-date">{escape(a.get("date",""))}</span> <a href="#">{escape(a.get("title",""))}</a></div>'
        ann_html += '</div></section>'

    gallery_html = render_gallery(idx_gallery, 'index')

    cards = [
        ('01', '📜', '/01-history.html', '历史沿革', '医院发展的时光足迹'),
        ('02', '👥', '/02-people.html', '人物风采', '历任院领导·学科带头人'),
        ('03', '🔬', '/03-disciplines.html', '学科建设', '省级重点专科·医教研协同'),
        ('04', '🏥', '/04-campus.html', '院区建设', '一院两区·双核驱动'),
        ('05', '🎓', '/05-education.html', '教学人才', '国家临床教学示范中心'),
        ('06', '🎨', '/06-culture.html', '文化建设', '医院精神·人文底蕴'),
        ('07', '🤖', '/07-tech.html', '科技交流', '科研创新·国际合作'),
        ('08', '🛡️', '/08-duty.html', '责任担当', '抗疫驰援·脱贫攻坚'),
        ('09', '🏆', '/09-honors.html', '荣誉殿堂', '辉煌成就·荣耀时刻'),
        ('10', '🔭', '/10-vision.html', '展望未来', '滇西区域医疗中心'),
        ('11', '🏛️', '/11-structure.html', '组织架构', '科学管理·高效运行'),
        ('12', '👔', '/12-leadership.html', '领导团队', '党委领导·院长负责'),
        ('13', '📋', '/13-staff.html', '职工名录', '全院职工名录'),
    ]
    cards_html = ''.join(f'<a href="{c[2]}" class="section-card"><div class="card-num">{c[0]}</div><div class="card-icon">{c[1]}</div><h3>{c[3]}</h3><p>{c[4]}</p></a>' for c in cards)

    founded = settings.get('foundedYear', 1991)
    age = time.localtime().tm_year - founded

    index_html = f'''<!DOCTYPE html>
<html lang="zh-CN" data-theme="dark">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>云端院史馆 · 大理大学第一附属医院</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700&family=Noto+Serif+TC:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/style.css"><link rel="stylesheet" href="/css/sections.css"><link rel="stylesheet" href="/css/visuals.css">
</head>
<body>
<nav class="navbar container"><a href="/" class="nav-logo">🏛 云端院史馆</a><button class="btn-theme" onclick="toggleTheme()">☀️</button></nav>
<section class="hero"><img class="hero-bg" src="/assets/images/2_20.png" alt="医院"><div class="hero-overlay"></div>
<div class="hero-content"><div class="hero-tag"><span>🏛</span><span>云南省卫健委直管 · 非省会三甲综合高校附属医院 · 建院{age}年</span></div>
<h1 class="hero-title">大理大学第一附属医院</h1>
<div class="hero-flip"><div class="hero-flip-track"><span class="hero-flip-item">云南省第四人民医院</span><span class="hero-flip-item">三级甲等综合医院</span><span class="hero-flip-item">国家临床教学示范中心</span><span class="hero-flip-item">滇西区域医疗高地</span></div></div>
<p class="hero-desc">1991年始建，坐落于大理市，一院两区运营。编制床位1500张，开放2013张，职工1946人，临床科室41个。</p>
<div class="hero-ctas"><a href="/01-history.html" class="btn-primary">探索院史</a><button class="btn-outline" onclick="document.getElementById('grid-section').scrollIntoView({{behavior:'smooth'}})">查看全部板块</button></div>
</div></section>
<section class="stats-bar"><div class="container">{stats_html}</div></section>
{ann_html}
<section class="section-grid container" id="grid-section"><h2 class="section-title">云端院史馆 · 探索板块</h2><div class="cards-grid">{cards_html}</div></section>
{gallery_html}
<footer class="footer"><div class="container"><p>&copy; {time.localtime().tm_year} 云端院史馆 · 大理大学第一附属医院</p></div></footer>
<script>var a=document.documentElement;function t(){{var e=localStorage.getItem('museum-theme')||'dark';a.setAttribute('data-theme',e);var n=document.querySelector('.btn-theme');if(n)n.textContent=e==='dark'?'☀️':'🌙';}}window.toggleTheme=function(){{localStorage.setItem('museum-theme',a.getAttribute('data-theme')==='dark'?'light':'dark');t();}};t();</script>
</body></html>'''
    (PUBLIC_DIR / 'index.html').write_text(index_html, encoding='utf-8')
    page_count += 1

    print(f'[DONE] Generated {page_count} pages to: {PUBLIC_DIR}')

def main():
    print('=' * 60)
    print('  云端院史馆 · 构建脚本')
    print('=' * 60)

    if check_hugo():
        if build_with_hugo():
            print('[OK] Hugo build successful!')
            return
        print('[WARN] Hugo build failed, trying Python fallback...')

    print('[INFO] Hugo not found, using Python HTML generator...')
    build_with_python()

    print(f'\n[READY] Site is in: {PUBLIC_DIR}')
    print('  Run: python serve.py')
    print('  Or deploy the public/ directory to any static hosting.')

if __name__ == '__main__':
    main()
