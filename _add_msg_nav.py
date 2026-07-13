import os

# 要插入的留言墙菜单项（板块页面用 ../pages/ 路径）
menu_item_pages = '        <li><a href="messages.html">院史<br>寄语</a></li>\n'
# 首页用 pages/ 路径
menu_item_index = '        <li><a href="pages/messages.html">院史<br>寄语</a></li>\n'

pages_dir = r'G:\web\DFY\pages'
index_path = r'G:\web\DFY\index.html'

def add_to_nav(filepath, menu_item):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 检查是否已经有留言墙
    if 'messages.html' in content:
        return 'skip'
    
    # 找到 13-staff.html 那一行，在它后面插入
    marker = '13-staff.html'
    idx = content.find(marker)
    if idx == -1:
        return 'not found'
    
    # 找到这一行的结束 </li>
    line_end = content.find('</li>', idx)
    if line_end == -1:
        return 'no li end'
    
    insert_pos = line_end + len('</li>')
    content = content[:insert_pos] + '\n' + menu_item + content[insert_pos:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return 'done'

# 首页
result = add_to_nav(index_path, menu_item_index)
print(f'index.html: {result}')

# 所有板块页面
count = 0
for fname in os.listdir(pages_dir):
    if not fname.endswith('.html'):
        continue
    fpath = os.path.join(pages_dir, fname)
    r = add_to_nav(fpath, menu_item_pages)
    print(f'{fname}: {r}')
    if r == 'done':
        count += 1

print(f'\nTotal updated: {count + (1 if result == "done" else 0)} pages')
