import os

# 各页面的描述
page_descs = {
    'index.html': '大理大学第一附属医院（云南省第四人民医院）云端院史馆，在线展示医院三十五年发展历程、人物风采、学科建设、院区风貌、荣誉成就等历史文化内容。',
    '01-history.html': '追溯大理大学第一附属医院历史沿革，从1991年建院到2026年的关键发展节点，见证三十五年砥砺奋进之路。',
    '02-people.html': '大理大学第一附属医院人物风采，历任院长、党委书记、学科带头人、医学名家等医院发展核心力量介绍。',
    '03-disciplines.html': '大理大学第一附属医院学科建设成果，9个省级重点专科、41个临床科室的学科发展与医疗实力展示。',
    '04-campus.html': '大理大学第一附属医院院区建设，院本部与凤仪院区一院两区协同发展，162亩现代化医疗综合体全景展示。',
    '05-education.html': '大理大学第一附属医院教学与人才培养，临床医学院一体化管理，医学人才培养体系与师资力量介绍。',
    '06-culture.html': '大理大学第一附属医院文化建设，医院精神、核心价值观、院训院徽、特色文化活动等医院文化展示。',
    '07-tech.html': '大理大学第一附属医院科技与学术交流，科研成果、学术合作、新技术引进等科技发展成就。',
    '08-duty.html': '大理大学第一附属医院社会责任与担当，抗疫驰援、对口帮扶、健康扶贫、公益医疗等社会责任履行。',
    '09-honors.html': '大理大学第一附属医院荣誉殿堂，国家级、省级、市级荣誉奖项，建院以来重要荣誉成就展示。',
    '10-vision.html': '大理大学第一附属医院展望未来，十四五发展规划、智慧医院建设、高质量发展战略愿景。',
    '11-structure.html': '大理大学第一附属医院组织架构，党政管理机构、临床科室、医技科室等组织体系介绍。',
    '12-leadership.html': '大理大学第一附属医院现任领导团队，院领导班子成员介绍与分工。',
    '13-staff.html': '大理大学第一附属医院职工名录，全院1946名职工基本信息，41个临床科室人员构成。',
    'timeline.html': '大理大学第一附属医院院史时间轴，横向可视化展示建院三十五年来的关键里程碑与重大事件。',
    'search.html': '大理大学第一附属医院云端院史馆全站搜索，一键检索全部13个板块的历史、人物、科室、荣誉等内容。',
    'messages.html': '大理大学第一附属医院院史寄语墙，职工在线留言互动，共同书写医院历史与祝福。'
}

keywords = '大理大学第一附属医院,云南省第四人民医院,云端院史馆,医院历史,院史,大理医院,三甲医院,滇西医疗'

pages_dir = r'G:\web\DFY\pages'
index_path = r'G:\web\DFY\index.html'

def add_meta(filepath, desc, is_home=False):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 检查是否已有description
    if 'name="description"' in content:
        return 'skip'
    
    # 在 </title> 后面插入 meta
    title_end = content.find('</title>')
    if title_end == -1:
        return 'no title'
    
    insert_pos = title_end + len('</title>')
    
    meta_tags = '\n  <meta name="description" content="' + desc + '">'
    meta_tags += '\n  <meta name="keywords" content="' + keywords + '">'
    
    if is_home:
        meta_tags += '\n  <meta property="og:title" content="云端院史馆 · 大理大学第一附属医院">'
        meta_tags += '\n  <meta property="og:description" content="' + desc + '">'
        meta_tags += '\n  <meta property="og:type" content="website">'
        meta_tags += '\n  <meta name="author" content="大理大学第一附属医院">'
    
    content = content[:insert_pos] + meta_tags + content[insert_pos:]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return 'done'

# 首页
result = add_meta(index_path, page_descs['index.html'], is_home=True)
print(f'index.html: {result}')

# 所有板块页面
count = 0
for fname, desc in page_descs.items():
    if fname == 'index.html':
        continue
    fpath = os.path.join(pages_dir, fname)
    if os.path.exists(fpath):
        r = add_meta(fpath, desc)
        print(f'{fname}: {r}')
        if r == 'done':
            count += 1

print(f'\nTotal updated: {count + 1} pages')
