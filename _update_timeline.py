import json
import re

# 读取 data.js
with open(r'G:\web\DFY\js\data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 找到 history 板块的 timeline 数组（第一个timeline）
# 用正则匹配 timeline: [ ... ] 的内容

# 扩充后的时间轴数据 - 15个关键节点
new_timeline = '''      "timeline": [
        {
          "year": "1991",
          "title": "医院获批成立",
          "desc": "云南省人民政府正式批准成立大理医学院附属医院，开启建院征程。",
          "tag": "奠基"
        },
        {
          "year": "1992",
          "title": "奠基动工建设",
          "desc": "医院正式开工建设，从蓝图走向现实，拉开发展序幕。",
          "tag": "建设"
        },
        {
          "year": "1997",
          "title": "正式开诊运营",
          "desc": "经云南省卫生厅批准，医院顺利开诊运营，首批开设内、外、妇、儿等核心科室。",
          "tag": "开诊"
        },
        {
          "year": "2001",
          "title": "临床医学院成立",
          "desc": "大理学院临床医学院挂牌，医教协同发展格局初步形成。",
          "tag": "教学"
        },
        {
          "year": "2003",
          "title": "院系一体化管理",
          "desc": "与大理学院临床医学院实行一体化管理，推进医教研协同发展。",
          "tag": "整合"
        },
        {
          "year": "2006",
          "title": "整体移交大理学院",
          "desc": "医院整体移交大理学院管理，正式成为高校直属附属医院。",
          "tag": "体制"
        },
        {
          "year": "2008",
          "title": "挂牌云南省第四人民医院",
          "desc": "增挂云南省第四人民医院牌子，代管省第二传染病医院，服务能级向全省辐射。",
          "tag": "升级"
        },
        {
          "year": "2009",
          "title": "新住院大楼落成",
          "desc": "新住院大楼竣工投用，住院条件大幅改善，综合服务能力显著提升。",
          "tag": "基建"
        },
        {
          "year": "2012",
          "title": "更名为大理学院第一附属医院",
          "desc": "随学校更名，正式更名为大理学院第一附属医院。",
          "tag": "更名"
        },
        {
          "year": "2015",
          "title": "获评三级甲等综合医院",
          "desc": "通过国家三级甲等综合医院评审，跻身国家级高水平医院行列。",
          "tag": "三甲"
        },
        {
          "year": "2017",
          "title": "大理大学更名同步",
          "desc": "随大理学院升格为大理大学，更名为大理大学第一附属医院。",
          "tag": "更名"
        },
        {
          "year": "2020",
          "title": "驰援抗疫彰显担当",
          "desc": "派出157名医护人员驰援湖北抗疫，荣获多项国家级、省级表彰。",
          "tag": "抗疫"
        },
        {
          "year": "2022",
          "title": "9个省级重点专科立项",
          "desc": "9个专科入选云南省十四五临床重点专科建设项目，学科建设迈上新台阶。",
          "tag": "学科"
        },
        {
          "year": "2023",
          "title": "凤仪院区投入运营",
          "desc": "凤仪院区正式启用，一院两区协同发展格局形成，服务半径大幅扩展。",
          "tag": "扩张"
        },
        {
          "year": "2026",
          "title": "建院三十五周年",
          "desc": "建院35周年，云端院史馆上线，铭记历史，开启高质量发展新征程。",
          "tag": "纪念"
        }
      ]'''

# 替换第一个timeline（history板块的）
# 找到timeline数组开始和结束的位置
start_marker = '"timeline": ['
start_idx = content.find(start_marker)
if start_idx > 0:
    # 找到对应的结束 ]
    bracket_count = 0
    end_idx = start_idx
    for i in range(start_idx, len(content)):
        if content[i] == '[':
            bracket_count += 1
        elif content[i] == ']':
            bracket_count -= 1
            if bracket_count == 0:
                end_idx = i + 1
                break
    
    # 替换
    old_part = content[start_idx:end_idx]
    content = content[:start_idx] + new_timeline.strip() + content[end_idx:]
    print(f'Replaced history timeline: {len(old_part)} -> {len(new_timeline)} chars')
else:
    print('ERROR: timeline not found')

# 写回
with open(r'G:\web\DFY\js\data.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done!')
