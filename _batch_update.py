import os

pages_dir = r'G:\web\DFY\pages'
files = [
    '01-history.html', '02-people.html', '03-disciplines.html',
    '05-education.html', '06-culture.html', '07-tech.html',
    '08-duty.html', '09-honors.html', '10-vision.html',
    '11-structure.html', '12-leadership.html', '13-staff.html'
]

css_link = '  <link rel="stylesheet" href="../css/features.css">'
js_script = '  <script src="../js/features.js"></script>'

count = 0
for fname in files:
    fpath = os.path.join(pages_dir, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'features.css' in content:
        print(f'{fname}: already has features.css, skip')
        continue
    
    old_css = '  <link rel="stylesheet" href="../css/visuals.css">'
    new_css = old_css + '\n' + css_link
    content = content.replace(old_css, new_css, 1)
    
    old_js = '  <script src="../js/main.js"></script>'
    new_js = old_js + '\n' + js_script
    content = content.replace(old_js, new_js, 1)
    
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    count += 1
    print(f'{fname}: done')

print(f'\nTotal updated: {count} files')
