import chardet

filepath = r'G:\web\DFY\admin\index.html'

# 读取原始字节
with open(filepath, 'rb') as f:
    raw = f.read()

# 检测编码
result = chardet.detect(raw)
print(f'检测编码: {result}')

# 尝试用检测到的编码解码
encoding = result.get('encoding', 'gbk')
try:
    content = raw.decode(encoding)
    print(f'解码成功，使用编码: {encoding}')
    print(f'文件大小: {len(content)} 字符')
    
    # 检查是否还有乱码特征
    if '浜戠' in content or '闄㈠彶' in content:
        print('警告: 仍有乱码特征，尝试GBK...')
        content = raw.decode('gbk')
        print('GBK解码成功')
    
    # 重新保存为UTF-8
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print('已重新保存为UTF-8编码')
    
except Exception as e:
    print(f'解码失败: {e}')
