/**
 * 云端院史馆 · 后台内容管理系统
 * 基于 AdminLTE 3.x + localStorage
 * 支持12板块全部内容的可视化编辑
 */

// ====== 底层数据模型 ======
var SECTIONS = [
  { id:'history',     name:'历史沿革', icon:'fas fa-history',       color:'#2980b9', page:'01-history.html',     types:['hero','block','timeline','gallery'] },
  { id:'people',      name:'人物风采', icon:'fas fa-users',         color:'#e67e22', page:'02-people.html',      types:['hero','block','leader','profile','dataCard','gallery'] },
  { id:'disciplines', name:'学科建设', icon:'fas fa-microscope',    color:'#27ae60', page:'03-disciplines.html', types:['hero','block','profile','gallery'] },
  { id:'campus',      name:'院区建设', icon:'fas fa-building',      color:'#8e44ad', page:'04-campus.html',      types:['hero','block','gallery'] },
  { id:'education',   name:'教学人才', icon:'fas fa-graduation-cap',color:'#e91e63', page:'05-education.html',   types:['hero','block','profile','dataCard','gallery'] },
  { id:'culture',     name:'文化建设', icon:'fas fa-heart',         color:'#f57c00', page:'06-culture.html',     types:['hero','block','dataCard','gallery'] },
  { id:'tech',        name:'科技交流', icon:'fas fa-robot',         color:'#1565c0', page:'07-tech.html',        types:['hero','block','gallery'] },
  { id:'duty',        name:'责任担当', icon:'fas fa-shield-alt',    color:'#c62828', page:'08-duty.html',        types:['hero','block','gallery'] },
  { id:'honors',      name:'荣誉殿堂', icon:'fas fa-trophy',        color:'#f9a825', page:'09-honors.html',      types:['hero','block','dataCard','gallery'] },
  { id:'vision',      name:'展望未来', icon:'fas fa-eye',           color:'#00695c', page:'10-vision.html',      types:['hero','block','gallery'] },
  { id:'structure',   name:'组织架构', icon:'fas fa-sitemap',       color:'#4527a0', page:'11-structure.html',   types:['hero','block','gallery'] },
  { id:'leadership',  name:'领导团队', icon:'fas fa-user-tie',      color:'#bf360c', page:'12-leadership.html',  types:['hero','block','leadership','gallery'] },
  { id:'staff',       name:'职工名录', icon:'fas fa-id-card',      color:'#00796b', page:'13-staff.html',       types:['hero','block','staffRoster','gallery'] }
];

// ====== 初始化全部数据 ======
function initAllData() {
  if (!localStorage.getItem('hm_admin_sections')) {
    var data = {};
    SECTIONS.forEach(function(s) { data[s.id] = { title:s.name, status:'published', updatedAt:new Date().toISOString().split('T')[0], notes:'' }; });
    localStorage.setItem('hm_admin_sections', JSON.stringify(data));
  }
  if (!localStorage.getItem('hm_announcements')) {
    var anns = [
      { id:1, title:'大理大学第一附属医院2025年度工作报告', date:'2025-05-20', category:'notice', dept:'院办', content:'年度工作报告全文…', published:true },
      { id:2, title:'关于开展2025年"5·12"国际护士节系列活动的通知', date:'2025-05-10', category:'event', dept:'护理部', content:'活动详情…', published:true },
      { id:3, title:'关于2025年职称评审工作的通知', date:'2025-05-08', category:'hr', dept:'人事科', content:'评审条件与流程…', published:true },
      { id:4, title:'关于召开2025年科研工作推进会的通知', date:'2025-04-28', category:'academic', dept:'科研科', content:'会议议程…', published:true },
      { id:5, title:'2025年劳动节放假及值班安排', date:'2025-04-25', category:'notice', dept:'院办', content:'值班表…', published:true },
      { id:6, title:'关于启动2026年度国家自然科学基金申报工作的通知', date:'2025-04-15', category:'academic', dept:'科研科', content:'申报指南…', published:true }
    ];
    localStorage.setItem('hm_announcements', JSON.stringify(anns));
  }
  if (!localStorage.getItem('hm_settings')) {
    localStorage.setItem('hm_settings', JSON.stringify({
      siteTitle:'云端院史馆', siteSubtitle:'大理大学第一附属医院',
      officialUrl:'https://www.dfy.dali.edu.cn', contactEmail:'', contactPhone:'', foundedYear:1991
    }));
  }
  if (!localStorage.getItem('hm_content')) {
    localStorage.setItem('hm_content', JSON.stringify(seedContent()));
  }
}

// ====== 种子内容数据（从现有HTML提取） ======
function seedContent() {
  return {
    history: {
      hero: { bgImage:'../assets/images/2_20.png', num:'板块一 · SECTION 01', title:'历史沿革', subtitle:'医院发展的时光足迹', desc:'追溯医院源头，呈现从无到有、逐步成长的关键节点。' },
      blocks: [
        { id:'b1', num:'01 · 源起 · 历史定格', title:'源起与奠基', subtitle:'1991年始建 — 云南省人民政府批准成立',
          text:'<h4>建院缘起</h4><p>1991年，云南省人民政府正式批准成立大理医学院附属医院，这是大理高等医学教育与临床医疗事业发展的里程碑。</p><p>彼时，云南大理地处偏远，优质医疗资源严重匮乏，医院的批准成立，标志着大理人民就医水平将迎来质的飞跃。</p>',
          imgIcon:'📷', imgLabel:'1991年批准文件 / 医院蓝图规划', imgSize:'16:9' },
        { id:'b2', num:'02 · 启航 · 奠基盛典', title:'奠基开工与正式开诊', subtitle:'1992年动工 → 1997年开诊',
          text:'<h4>1992 · 奠基动工</h4><p>1992年，医院正式开工建设，标志从蓝图走向现实的第一步。</p><h4>1997 · 正式开诊</h4><p>经云南省卫生厅批准，医院于1997年正式开诊运营。</p>',
          imgIcon:'📷', imgLabel:'1992年奠基典礼 / 1997年开诊剪彩', imgSize:'4:3' }
      ],
      timeline: [
        { year:'1991', title:'医院获批成立', desc:'大理医学院附属医院获云南省人民政府批准成立，奠定医院发展基础。', dot:'建' },
        { year:'1997', title:'正式开诊运营', desc:'经省卫生厅批准，医院顺利开诊运营，实现医疗服务零的突破。', dot:'诊' },
        { year:'2003', title:'院系一体化管理', desc:'与大理大学临床医学院一体化管理，推进医教协同发展。', dot:'教' },
        { year:'2008', title:'挂牌云南省第四人民医院', desc:'增挂云南省第四人民医院，服务能级向全省辐射提升。', dot:'省' },
        { year:'2009', title:'新住院大楼落成', desc:'新住院大楼竣工投用，综合服务能力显著提升。', dot:'楼' },
        { year:'2015', title:'获评三级甲等综合医院', desc:'通过国家三级甲等综合医院评审，正式跻身高水平医院行列。', dot:'甲' },
        { year:'2020–2025', title:'高质量发展新阶段', desc:'157名医护驰援抗疫；9个十四五省级重点专科立项建设；达芬奇机器人引进。', dot:'新' }
      ],
      gallery: [
        { icon:'📷', label:'1991年 批准文件' }, { icon:'📷', label:'1992年 奠基典礼' },
        { icon:'📷', label:'1997年 开诊剪彩' }, { icon:'📷', label:'2015年 三甲评审' }
      ]
    },
    people: {
      hero: { bgImage:'../assets/images/2_20.png', num:'板块二 · SECTION 02', title:'人物风采', subtitle:'医院发展的核心力量', desc:'历任院长、党委书记、学科带头人、医学名家……每一位为医院发展倾注心血的人都值得被铭记。' },
      blocks: [
        { id:'pb1', num:'01 · 薪火 · 传承接力', title:'薪火相传', subtitle:'一棒接一棒，精神永相传',
          text:'<h4>薪火相传</h4><p>从首任院长到现任领导，一代代大附院人接过接力棒，赓续百年薪火，书写新时代高质量发展新篇章。</p>',
          imgIcon:'🤝', imgLabel:'领导交接合影 /  milestone 时刻', imgSize:'16:9' },
        { id:'pb2', num:'02 · 党建 · 领航把舵', title:'党建领航', subtitle:'党建引领，筑牢发展根基',
          text:'<h4>党建领航</h4><p>坚持和加强党对医院工作的全面领导，以高质量党建引领高质量发展，筑牢公立医院发展的「根」和「魂」。</p>',
          imgIcon:'🚩', imgLabel:'党建活动 / 主题教育', imgSize:'4:3' },
        { id:'pb3', num:'03 · 群英 · 学科领军', title:'群英荟萃', subtitle:'学科带头人，医院的脊梁',
          text:'<h4>群英荟萃</h4><p>一批批省突专家、省学术带头人、兴滇英才扎根滇西，以精湛医术和高尚医德服务边疆各族群众。</p>',
          imgIcon:'👨‍⚕️', imgLabel:'学科带头人在手术 / 带教', imgSize:'16:9' },
        { id:'pb4', num:'04 · 组织 · 凝心聚力', title:'组织有力', subtitle:'基层组织，坚强堡垒',
          text:'<h4>组织有力</h4><p>全院X个党支部、Y名党员，战斗在医疗、教学、科研、管理各条战线的最前沿，让党旗在高原大地高高飘扬。</p>',
          imgIcon:'🏗️', imgLabel:'支部活动 / 志愿者服务', imgSize:'4:3' },
        { id:'pb5', num:'05 · 人才 · 厚德精医', title:'厚德精医', subtitle:'医学人才，立德树人',
          text:'<h4>厚德精医</h4><p>秉承「厚德精医、博学笃行」院训，培养了一批批医术精湛、医德高尚的医学人才，为滇西医疗卫生事业输送源源不断的新鲜血液。</p>',
          imgIcon:'🎓', imgLabel:'教学查房 / 名师授课', imgSize:'16:9' },
        { id:'pb6', num:'06 · 荣誉 · 榜样力量', title:'榜样力量', subtitle:'优秀员工，闪耀星光',
          text:'<h4>榜样力量</h4><p>每年评选表彰一批优秀员工，用身边事教育身边人，让崇尚先进、学习先进、争当先进在医院蔚然成风。</p>',
          imgIcon:'🏆', imgLabel:'表彰大会 / 优秀员工合影', imgSize:'4:3' }
      ],
      leaders: [
        { id:'l1', category:'院长', name:'[待补充]', years:'1992 – 2000', era:'建院奠基', eraColor:'', desc:'主持建院筹备工作，从零起步搭建医院基本架构。', photo:'' },
        { id:'l2', category:'院长', name:'[待补充]', years:'2000 – 2008', era:'规模拓展', eraColor:'', desc:'推动医院规模化发展，扩充临床科室。', photo:'' },
        { id:'l3', category:'院长', name:'[待补充]', years:'2008 – 2015', era:'三甲创建', eraColor:'', desc:'带领全院奋力冲刺三级甲等评审。', photo:'' },
        { id:'l4', category:'院长', name:'[待补充]', years:'2015 – 2022', era:'跨越发展', eraColor:'', desc:'推进凤仪院区建设，实现一院两区格局。', photo:'' },
        { id:'l5', category:'院长', name:'[待补充]', years:'2022 – 至今', era:'现任 · 高质量发展', eraColor:'', desc:'深化医教研协同，推动智慧医院建设。', photo:'' },
        { id:'l6', category:'书记', name:'[待补充]', years:'1992 – 2000', era:'建院初期', eraColor:'', desc:'在建院最艰难时期，以党建凝聚人心。', photo:'' },
        { id:'l7', category:'书记', name:'[待补充]', years:'2000 – 2008', era:'党建规范', eraColor:'', desc:'推进党建工作规范化制度化建设。', photo:'' },
        { id:'l8', category:'书记', name:'[待补充]', years:'2008 – 2015', era:'思政引领', eraColor:'', desc:'强化思想政治引领，推动党建与业务融合。', photo:'' },
        { id:'l9', category:'书记', name:'[待补充]', years:'2015 – 2022', era:'全面从严', eraColor:'', desc:'落实全面从严治党，打造清廉医院。', photo:'' },
        { id:'l10', category:'书记', name:'[待补充]', years:'2022 – 至今', era:'现任 · 党建引领', eraColor:'', desc:'以高质量党建引领高质量发展。', photo:'' }
      ],
      profiles: [
        { id:'p1', name:'[待补充]', title:'省突专家 · 二级教授 · 博导', dept:'心血管内科', desc:'深耕冠心病介入治疗30年，主持国自然3项。' },
        { id:'p2', name:'[待补充]', title:'省贴专家 · 兴滇英才 · 教授', dept:'神经外科', desc:'滇西神经外科领军人物。' },
        { id:'p3', name:'[待补充]', title:'省学术带头人 · 主任医师', dept:'骨科', desc:'脊柱微创与关节置换领域专家。' },
        { id:'p4', name:'[待补充]', title:'省卫健委高层次人才 · 教授', dept:'妇产科', desc:'高危妊娠管理及妇科肿瘤微创手术专家。' },
        { id:'p5', name:'[待补充]', title:'兴滇英才 · 省级教学名师', dept:'消化内科', desc:'内镜诊疗技术精湛。' },
        { id:'p6', name:'[待补充]', title:'省卫健委高层次人才 · 硕导', dept:'儿科', desc:'滇西儿童重症救治中心主任。' },
        { id:'p7', name:'[待补充]', title:'省学术带头人 · 主任医师', dept:'肿瘤科', desc:'肿瘤综合治疗专家。' },
        { id:'p8', name:'[待补充]', title:'省卫健委高层次人才 · 硕导', dept:'医学影像科', desc:'主持省级科研项目5项。' }
      ],
      profiles2: [
        { id:'p11', name:'[待补充]', title:'医学博士 · 副主任医师', dept:'呼吸与危重症医学科', desc:'新冠疫情期间驰援武汉。' },
        { id:'p12', name:'[待补充]', title:'医学博士 · 主任医师', dept:'泌尿外科', desc:'达芬奇机器人手术主刀医师。' },
        { id:'p13', name:'[待补充]', title:'硕士 · 副主任医师', dept:'急诊医学科', desc:'急危重症救治专家。' },
        { id:'p14', name:'[待补充]', title:'博士 · 副主任护师', dept:'护理部', desc:'护理学科带头人。' },
        { id:'p15', name:'[待补充]', title:'硕士 · 副主任医师', dept:'麻醉科', desc:'年麻醉量逾万例。' },
        { id:'p16', name:'[待补充]', title:'硕士 · 主管药师', dept:'药学部', desc:'临床药学专家。' },
        { id:'p17', name:'[待补充]', title:'硕士 · 副主任技师', dept:'检验科', desc:'PCR实验室负责人。' },
        { id:'p18', name:'[待补充]', title:'硕士 · 主治医师', dept:'康复医学科', desc:'神经康复与骨伤康复专家。' }
      ],
      dataCards: [
        { icon:'👥', value:'1946', label:'全院职工', note:'含编内编外' },
        { icon:'🩺', value:'1638', label:'卫技人员', note:'占比 84.2%' },
        { icon:'🎓', value:'29', label:'博士', note:'含在读' },
        { icon:'📚', value:'360', label:'硕士', note:'含在读' },
        { icon:'🏅', value:'294', label:'高级职称', note:'正高+副高' }
      ],
      gallery: [
        { icon:'👥', label:'历任院领导集体合影' }, { icon:'👤', label:'首任院长工作照' },
        { icon:'👨‍⚕️', label:'学科带头人群像' }, { icon:'🎗', label:'年度优秀员工表彰' },
        { icon:'🚩', label:'党建主题活动' }, { icon:'👩‍⚕️', label:'护理团队风采' },
        { icon:'🎓', label:'教学名师授课' }, { icon:'🤝', label:'新老传承交接' }
      ]
    },
    disciplines: {
      hero: { bgImage:'../assets/images/2_20.png', num:'板块三 · SECTION 03', title:'学科建设', subtitle:'构筑滇西医学高地', desc:'以重点专科为核心，以人才培养为基础，全面构建医教研协同发展的学科体系。' },
      blocks: [
        { id:'b1', num:'01 · 重点 · 省级重点专科', title:'十四五省级重点专科', subtitle:'9个专科入围十四五省级临床重点专科建设项目',
          text:'<h4>在建项目</h4><p>神经外科、康复科、神经内科、检验科、重症医学科——5个专科进入十四五在建重点项目。</p><h4>首次/复评立项</h4><p>呼吸科、老年病科首次立项；普外科、麻醉科复评立项——共4个专科获得省级认定。</p>',
          imgIcon:'🏛', imgLabel:'重点专科/实验室场景图', imgSize:'4:3' }
      ],
      profiles: [
        { id:'d1', name:'[待补充]', title:'神经外科主任 · 省突专家', dept:'神经外科', desc:'滇西神经外科领军人物。' },
        { id:'d2', name:'[待补充]', title:'重症医学科主任 · 省学术带头人', dept:'重症医学科', desc:'急危重症救治专家。' },
        { id:'d3', name:'[待补充]', title:'呼吸科主任 · 省卫健委高层次人才', dept:'呼吸科', desc:'呼吸疾病全病程管理专家。' },
        { id:'d4', name:'[待补充]', title:'骨科主任 · 省学术带头人', dept:'骨科', desc:'脊柱微创与关节置换领域专家。' }
      ],
      gallery: [
        { icon:'🔬', label:'重点专科授牌仪式' }, { icon:'🏥', label:'临床科室实景' },
        { icon:'🎓', label:'学术会议交流' }, { icon:'🏛', label:'实验室平台' }
      ]
    },
    campus: {
      hero: { bgImage:'../assets/images/2_20.png', num:'板块四 · SECTION 04', title:'院区建设', subtitle:'一院两区 · 双核驱动', desc:'主院区与凤仪院区协同发展，构筑滇西区域医疗中心。' },
      blocks: [
        { id:'b1', num:'01 · 主院区', title:'主院区', subtitle:'大理市核心区位',
          text:'<h4>地理位置</h4><p>位于大理市核心区域，交通便利，服务人口覆盖大理及周边地区。</p><h4>院区规模</h4><p>编制床位XXX张，开放床位XXX张，年门急诊量超XXX万人次。</p>',
          imgIcon:'🏥', imgLabel:'主院区航拍图', imgSize:'16:9' },
        { id:'b2', num:'02 · 凤仪院区', title:'凤仪院区', subtitle:'跨越发展新引擎',
          text:'<h4>规划定位</h4><p>凤仪院区是医院高质量发展的重要战略布局，承担医疗、教学、科研综合功能。</p>',
          imgIcon:'🏗', imgLabel:'凤仪院区效果图', imgSize:'16:9' }
      ],
      gallery: [
        { icon:'🏥', label:'主院区全景' }, { icon:'🏗', label:'凤仪院区规划' },
        { icon:'🛏', label:'病房环境' }, { icon:'🔬', label:'先进设备' }
      ]
    },
    education: {
      hero: { bgImage:'../assets/images/2_20.png', num:'板块五 · SECTION 05', title:'教学与人才', subtitle:'医教协同 · 人才兴院', desc:'国家临床教学示范中心，住培基地，为滇西培养输送医学人才。' },
      blocks: [
        { id:'b1', num:'01 · 教学 · 临床教学', title:'医学教育体系', subtitle:'国家临床教学示范中心 · 住培基地',
          text:'<h4>教学体系</h4><p>承担大理大学临床医学院教学任务，涵盖本科、硕士、博士多层次培养。</p>',
          imgIcon:'🎓', imgLabel:'教学场景照片', imgSize:'16:9' }
      ],
      profiles: [
        { id:'e1', name:'[待补充]', title:'省级教学名师', dept:'临床教学部', desc:'连续5年被评为学生最喜爱教师。' },
        { id:'e2', name:'[待补充]', title:'优秀带教老师', dept:'内科', desc:'培养住院医师规范化培训学员120人。' },
        { id:'e3', name:'[待补充]', title:'教学改革先锋', dept:'外科', desc:'主持省级教改项目3项。' },
        { id:'e4', name:'[待补充]', title:'全科医学导师', dept:'全科医学科', desc:'全科医师培养基地核心师资。' }
      ],
      dataCards: [
        { icon:'🎓', value:'21', label:'教研室/实验室', note:'' },
        { icon:'📚', value:'5', label:'教学基地', note:'含住培/全科' },
        { icon:'👨‍🏫', value:'800+', label:'年培养学员', note:'各级各类' }
      ],
      gallery: [
        { icon:'🎓', label:'教学活动' }, { icon:'📚', label:'技能培训' },
        { icon:'🏆', label:'教学竞赛' }, { icon:'👨‍🏫', label:'名师风采' }
      ]
    },
    culture: {
      hero: { bgImage:'../assets/images/2_20.png', num:'板块六 · SECTION 06', title:'文化建设', subtitle:'厚德精医 · 博学笃行', desc:'以文化人，以文润心，构建有温度的人文医院。' },
      blocks: [
        { id:'b1', num:'01 · 院训 · 精神文化', title:'医院精神与文化', subtitle:'厚德精医 · 博学笃行',
          text:'<h4>院训</h4><p>"厚德精医，博学笃行"——八个字凝聚了大附院人的价值追求。</p>',
          imgIcon:'📜', imgLabel:'院训展示', imgSize:'16:9' }
      ],
      dataCards: [
        { icon:'📜', value:'35', label:'文化积淀（年）', note:'1991至今' }
      ],
      gallery: [
        { icon:'🎭', label:'文化活动' }, { icon:'🎨', label:'职工书画' },
        { icon:'🎵', label:'文艺汇演' }, { icon:'🤝', label:'志愿服务' }
      ]
    },
    tech: {
      hero: { bgImage:'../assets/images/2_20.png', num:'板块七 · SECTION 07', title:'科技与交流', subtitle:'创新驱动 · 开放合作', desc:'科研创新与国际交流双轮驱动，不断提升医院学术影响力。' },
      blocks: [
        { id:'b1', num:'01 · 科研 · 科研创新', title:'科研平台与成果', subtitle:'院士工作站 · 重点实验室',
          text:'<h4>科研平台</h4><p>建有院士工作站1个、省级重点实验室3个、省级医学研究分中心8个。</p>',
          imgIcon:'🔬', imgLabel:'科研平台照片', imgSize:'16:9' }
      ],
      gallery: [
        { icon:'🔬', label:'科研实验' }, { icon:'🌐', label:'国际交流' },
        { icon:'📄', label:'学术论文' }, { icon:'🏆', label:'科技成果' }
      ]
    },
    duty: {
      hero: { bgImage:'../assets/images/2_20.png', num:'板块八 · SECTION 08', title:'责任与担当', subtitle:'医者仁心 · 大爱无疆', desc:'在急难险重面前，大附院人始终冲锋在前，以行动诠释医者担当。' },
      blocks: [
        { id:'b1', num:'01 · 抗疫 · 驰援一线', title:'抗疫驰援', subtitle:'157名医护驰援抗疫一线',
          text:'<h4>逆行出征</h4><p>新冠疫情暴发后，医院先后派出157名医护人员驰援武汉、上海、瑞丽等地。</p>',
          imgIcon:'🦸', imgLabel:'抗疫出征照片', imgSize:'16:9' }
      ],
      gallery: [
        { icon:'🦸', label:'抗疫出征' }, { icon:'🤝', label:'对口帮扶' },
        { icon:'🏔', label:'脱贫攻坚' }, { icon:'🚑', label:'应急救援' }
      ]
    },
    honors: {
      hero: { bgImage:'../assets/images/2_20.png', num:'板块九 · SECTION 09', title:'荣誉殿堂', subtitle:'辉煌成就 · 荣耀时刻', desc:'三十余载奋斗，硕果累累，每一份荣誉都凝聚着大附院人的汗水与智慧。' },
      blocks: [
        { id:'b1', num:'01 · 荣誉 · 辉煌成就', title:'主要荣誉成就', subtitle:'大附院35年辉煌成就',
          text:'<h4>国家级荣誉</h4><p>全国文明单位、全国百姓放心示范医院、全国医院文化建设先进单位…</p>',
          imgIcon:'🏆', imgLabel:'荣誉奖牌/证书', imgSize:'16:9' }
      ],
      dataCards: [
        { icon:'🏅', value:'50+', label:'省部级荣誉', note:'' },
        { icon:'🥇', value:'100+', label:'厅局级荣誉', note:'' }
      ],
      gallery: [
        { icon:'🏆', label:'荣誉奖牌' }, { icon:'🎖', label:'表彰证书' },
        { icon:'📜', label:'资质认定' }, { icon:'⭐', label:'五星好评' }
      ]
    },
    vision: {
      hero: { bgImage:'../assets/images/2_20.png', num:'板块十 · SECTION 10', title:'展望未来', subtitle:'踔厉奋发 · 勇毅前行', desc:'立足新起点，锚定新目标，奋力建设滇西区域医疗中心。' },
      blocks: [
        { id:'b1', num:'01 · 战略 · 发展目标', title:'战略目标', subtitle:'建设滇西区域医疗中心',
          text:'<h4>核心目标</h4><p>建成集医疗、教学、科研、预防、康复于一体的滇西区域医疗中心。</p>',
          imgIcon:'🎯', imgLabel:'发展愿景图', imgSize:'16:9' }
      ],
      gallery: [
        { icon:'🎯', label:'战略规划' }, { icon:'🚀', label:'未来蓝图' },
        { icon:'🌟', label:'远景目标' }, { icon:'📈', label:'发展路径' }
      ]
    },
    structure: {
      hero: { bgImage:'../assets/images/2_20.png', num:'板块十一 · SECTION 11', title:'组织架构', subtitle:'科学管理 · 高效运行', desc:'完善的组织管理体系，保障医院高效运转。' },
      blocks: [
        { id:'b1', num:'01 · 架构 · 组织体系', title:'医院组织架构', subtitle:'党委领导下的院长负责制',
          text:'<h4>管理体系</h4><p>院党委—院行政—党政管理部门—临床医技科室—教研室/实验室，五级管理体系。</p>',
          imgIcon:'🏛', imgLabel:'组织架构图', imgSize:'4:3' }
      ],
      gallery: [
        { icon:'🏛', label:'组织架构会议' }, { icon:'📋', label:'管理会议' },
        { icon:'🤝', label:'科室协作' }, { icon:'📷', label:'团队合影' }
      ]
    },
    leadership: {
      hero: { bgImage:'../assets/images/2_20.png', num:'板块十二 · SECTION 12', title:'领导团队', subtitle:'领航定向，掌舵前行', desc:'党委领导下的院长负责制，党政工团齐心协力。' },
      blocks: [
        { id:'b1', num:'01 · 领航 · 现任领导班子', title:'院党政领导班子', subtitle:'团结务实、开拓创新的领导核心',
          text:'<h4>大理大学第一附属医院（云南省第四人民医院）现任领导班子</h4><p>在云南省委教育工委、省卫健委和大理大学党委的领导下，医院党政领导班子坚持"党委领导下的院长负责制"。</p>',
          imgIcon:'', imgLabel:'', imgSize:'' }
      ],
      leaders: [
        { id:'ld1', name:'[待补充]', role:'党委书记', duty:'主持医院党委全面工作', resume:'曾任[待补充]，分管党政办公室、组织人事等工作。' },
        { id:'ld2', name:'[待补充]', role:'党委副书记、院长', duty:'主持医院行政全面工作', resume:'医学博士，主任医师，教授，博士生导师。分管医务、科研等工作。' },
        { id:'ld3', name:'[待补充]', role:'党委副书记', duty:'分管党建、学生工作', resume:'协助党委书记负责党的建设、学生管理、共青团、工会等工作。' },
        { id:'ld4', name:'[待补充]', role:'副院长', duty:'分管医疗业务', resume:'分管医务部、护理部、临床科室质量管理等工作。' },
        { id:'ld5', name:'[待补充]', role:'副院长', duty:'分管科研教学', resume:'分管科研科、教学管理科、研究生培养等工作。' },
        { id:'ld6', name:'[待补充]', role:'纪委书记', duty:'分管纪检监察', resume:'主持医院纪委全面工作，分管纪检监察审计。' }
      ],
      gallery: [
        { icon:'👔', label:'领导班子合影' }, { icon:'🤝', label:'党政联席会议' },
        { icon:'📷', label:'科室主任会议' }, { icon:'🎗', label:'工会活动' }
      ]
    }
  };
}

// ====== 通用工具 ======
function escHtml(s) { if (!s) return ''; return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function pad2(n) { return n<10?'0'+n:''+n; }
function getContent() { return JSON.parse(localStorage.getItem('hm_content')||'{}'); }
function saveContent(data) {
  try { localStorage.setItem('hm_content', JSON.stringify(data)); return true; }
  catch(e) { toastMsg('保存失败：存储空间不足，请清理浏览器缓存', 'danger'); return false; }
}
function safeSetItem(key, val) {
  try { localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val)); return true; }
  catch(e) { toastMsg('存储失败：' + key, 'danger'); return false; }
}
// Toast 快捷方法
function toastMsg(body, type) {
  type = type || 'success';
  $(document).Toasts('create', {
    class: 'bg-' + type, title: type === 'danger' ? '错误' : (type === 'warning' ? '提示' : '成功'),
    body: body, autohide: true, delay: 2000
  });
}

// ====== 页面路由 ======
var currentPage = 'dashboard';
var currentSection = null;

function navigateTo(pageId) {
  currentPage = pageId;
  currentSection = SECTIONS.find(function(s){return s.id===pageId;}) || null;
  $('.nav-sidebar .nav-link').removeClass('active');
  $('.nav-sidebar .nav-link[data-page="'+pageId+'"]').addClass('active');

  var html='';
  switch(pageId) {
    case 'dashboard': html=renderDashboard(); break;
    case 'announcements': html=renderAnnouncements(); break;
    case 'settings': html=renderSettings(); break;
    default: html=currentSection ? renderSectionEditor(currentSection) : renderDashboard();
  }

  var titleMap={dashboard:'控制台',announcements:'公告管理',settings:'网站设置'};
  var pageTitle=titleMap[pageId]||(currentSection?currentSection.name:'控制台');
  $('#page-title').text(pageTitle);

  var bc='<li class="breadcrumb-item"><a href="#" data-nav="dashboard">控制台</a></li>';
  if(pageId!=='dashboard') bc+='<li class="breadcrumb-item active">'+pageTitle+'</li>';
  else bc='<li class="breadcrumb-item active">控制台</li>';
  $('#breadcrumb').html(bc);
  $('#main-content').html(html);
  $('#breadcrumb a[data-nav]').click(function(e){ e.preventDefault(); navigateTo($(this).data('nav')); });
}

// ====== 控制台 ======
function renderDashboard() {
  var sd=JSON.parse(localStorage.getItem('hm_admin_sections')||'{}');
  var published=0,drafts=0;
  SECTIONS.forEach(function(s){
    if(sd[s.id]&&sd[s.id].status==='published') published++; else drafts++;
  });
  var anns=JSON.parse(localStorage.getItem('hm_announcements')||'[]');
  var activeAnns=anns.filter(function(a){return a.published;}).length;
  var content=JSON.parse(localStorage.getItem('hm_content')||'{}');
  var contentItems=0;
  for(var k in content){
    var c=content[k];
    ['leaders','profiles','profiles2','timeline','blocks','gallery','dataCards'].forEach(function(t){
      if(Array.isArray(c[t])) contentItems+=c[t].length;
    });
  }

  var html='<div class="container-fluid">';
  html+='<div class="row">';
  html+=statCard('col-lg-3 col-6','bg-info','fas fa-layer-group',published,'已发布板块');
  html+=statCard('col-lg-3 col-6','bg-warning','fas fa-edit',drafts,'待编辑板块');
  html+=statCard('col-lg-3 col-6','bg-success','fas fa-bullhorn',activeAnns,'有效公告');
  html+=statCard('col-lg-3 col-6','bg-primary','fas fa-database',contentItems,'内容条目');
  html+='</div>';

  html+='<div class="row"><div class="col-12"><div class="card card-primary card-outline"><div class="card-header"><h3 class="card-title">板块内容管理</h3></div>';
  html+='<div class="card-body p-0"><div class="table-responsive"><table class="table table-hover mb-0">';
  html+='<thead><tr><th>序号</th><th>板块名称</th><th>状态</th><th>内容条目</th><th>最后更新</th><th>操作</th></tr></thead><tbody>';

  SECTIONS.forEach(function(s,i){
    var d=sd[s.id]||{status:'draft',updatedAt:'-',notes:''};
    var statusClass=d.status==='published'?'status-published':(d.status==='review'?'status-review':'status-draft');
    var statusText=d.status==='published'?'已发布':(d.status==='review'?'审核中':'草稿');
    var c=content[s.id]||{};
    var itemCount=0;
    ['leaders','profiles','profiles2','timeline','blocks','gallery','dataCards'].forEach(function(t){
      if(Array.isArray(c[t])) itemCount+=c[t].length;
    });
    html+='<tr>';
    html+='<td>'+pad2(i+1)+'</td>';
    html+='<td><i class="'+s.icon+'" style="color:'+s.color+';margin-right:8px"></i><strong>'+s.name+'</strong></td>';
    html+='<td><span class="status-badge '+statusClass+'">'+statusText+'</span></td>';
    html+='<td>'+itemCount+' 条</td>';
    html+='<td>'+(d.updatedAt||'-')+'</td>';
    html+='<td><button class="btn btn-sm btn-outline-primary btn-edit-content" data-nav="'+s.id+'"><i class="fas fa-pen mr-1"></i>编辑内容</button> ';
    html+='<a href="../pages/'+s.page+'" target="_blank" class="btn btn-sm btn-outline-secondary"><i class="fas fa-eye mr-1"></i>预览</a></td>';
    html+='</tr>';
  });
  html+='</tbody></table></div></div></div></div></div>';

  html+='<div class="row"><div class="col-12"><div class="card card-accent card-outline"><div class="card-header"><h3 class="card-title">快捷操作</h3></div><div class="card-body">';
  html+='<div class="quick-actions">';
  html+='<a href="#" class="quick-action-btn" data-nav="announcements"><i class="fas fa-plus-circle text-success"></i>发布公告</a>';
  html+='<a href="#" class="quick-action-btn" data-nav="people"><i class="fas fa-user-plus text-warning"></i>更新人物信息</a>';
  html+='<a href="#" class="quick-action-btn" data-nav="honors"><i class="fas fa-medal text-info"></i>添加荣誉</a>';
  html+='<a href="#" class="quick-action-btn" data-nav="history"><i class="fas fa-history text-primary"></i>编辑时间线</a>';
  html+='<a href="../index.html" target="_blank" class="quick-action-btn"><i class="fas fa-desktop text-primary"></i>打开前台网站</a>';
  html+='</div></div></div></div></div>';
  html+='</div>';
  return html;
}
function statCard(col,bg,icon,count,label){
  return '<div class="'+col+'"><div class="small-box '+bg+'"><div class="inner"><h3>'+count+'</h3><p>'+label+'</p></div><div class="icon"><i class="'+icon+'"></i></div></div></div>';
}

// ====== 板块内容编辑器（核心） ======
function renderSectionEditor(sec) {
  var sd=JSON.parse(localStorage.getItem('hm_admin_sections')||'{}');
  var data=sd[sec.id]||{title:sec.name,status:'draft',updatedAt:'',notes:''};
  var content=getContent()[sec.id]||{};

  var html='<div class="container-fluid">';

  // 顶部：板块基础信息
  html+='<div class="row"><div class="col-md-8"><div class="card card-primary card-outline"><div class="card-header"><h3 class="card-title"><i class="'+sec.icon+'" style="color:'+sec.color+'"></i> '+sec.name+' — 内容管理</h3>';
  html+='<div class="card-tools"><button class="btn btn-sm btn-accent btn-save-content" data-section="'+sec.id+'"><i class="fas fa-save mr-1"></i>保存全部</button></div>';
  html+='</div><div class="card-body" id="section-editor-body">';

  // ---- Hero 编辑区 ----
  if (sec.types.indexOf('hero')>=0) {
    var hero=content.hero||{};
    html+='<div class="content-section"><h5 class="content-section-title"><i class="fas fa-image text-info mr-2"></i>页面头部 Hero</h5>';
    html+='<div class="form-row"><div class="col-md-6"><label>背景图片URL</label><input class="form-control form-control-sm hero-bg" data-key="bgImage" value="'+escHtml(hero.bgImage||'')+'"></div>';
    html+='<div class="col-md-6"><label>板块编号</label><input class="form-control form-control-sm hero-num" data-key="num" value="'+escHtml(hero.num||'')+'"></div></div>';
    html+='<div class="form-row mt-2"><div class="col-md-6"><label>标题</label><input class="form-control form-control-sm hero-title" data-key="title" value="'+escHtml(hero.title||'')+'"></div>';
    html+='<div class="col-md-6"><label>副标题</label><input class="form-control form-control-sm hero-subtitle" data-key="subtitle" value="'+escHtml(hero.subtitle||'')+'"></div></div>';
    html+='<div class="form-row mt-2"><div class="col-12"><label>描述</label><textarea class="form-control form-control-sm hero-desc" data-key="desc" rows="2">'+escHtml(hero.desc||'')+'</textarea></div></div>';
    html+='</div>';
  }

  // ---- Blocks 编辑区 ----
  if (sec.types.indexOf('block')>=0 && Array.isArray(content.blocks)) {
    html+='<div class="content-section" id="blocks-section"><h5 class="content-section-title"><i class="fas fa-align-left text-primary mr-2"></i>内容区块';
    html+=' <button class="btn btn-xs btn-outline-success ml-2 btn-add-block" data-section="'+sec.id+'"><i class="fas fa-plus"></i> 新增区块</button></h5>';
    content.blocks.forEach(function(b,i){
      html+=renderBlockEditor(sec.id,b,i);
    });
    html+='</div>';
  }

  // ---- Timeline 编辑区 ----
  if (sec.types.indexOf('timeline')>=0 && Array.isArray(content.timeline)) {
    html+='<div class="content-section" id="timeline-section"><h5 class="content-section-title"><i class="fas fa-stream text-success mr-2"></i>时间线事件';
    html+=' <button class="btn btn-xs btn-outline-success ml-2 btn-add-timeline" data-section="'+sec.id+'"><i class="fas fa-plus"></i> 新增事件</button></h5>';
    content.timeline.forEach(function(t,i){
      html+='<div class="timeline-item-editor">';
      html+='<div class="form-row"><div class="col-md-2"><label>年份</label><input class="form-control form-control-sm tl-year" value="'+escHtml(t.year||'')+'"></div>';
      html+='<div class="col-md-1"><label>标记</label><input class="form-control form-control-sm tl-dot" value="'+escHtml(t.dot||'')+'" maxlength="2"></div>';
      html+='<div class="col-md-4"><label>标题</label><input class="form-control form-control-sm tl-title" value="'+escHtml(t.title||'')+'"></div>';
      html+='<div class="col-md-5"><label>描述</label><div class="input-group input-group-sm"><input class="form-control tl-desc" value="'+escHtml(t.desc||'')+'"><div class="input-group-append"><button class="btn btn-outline-danger btn-del-timeline" data-idx="'+i+'"><i class="fas fa-trash"></i></button></div></div></div>';
      html+='</div></div>';
    });
    html+='</div>';
  }

  // ---- 历任院领导 编辑区 ----
  if (sec.types.indexOf('leader')>=0) {
    if (!Array.isArray(content.leaders)) content.leaders=[];
    // 按类别分组显示
    var deans=content.leaders.filter(function(l){return l.category==='院长';});
    var secretarys=content.leaders.filter(function(l){return l.category==='书记';});
    html+='<div class="content-section card card-outline card-info"><div class="card-header"><h5 class="card-title mb-0"><i class="fas fa-users text-primary mr-2"></i>历任院领导</h5>';
    html+='<div class="card-tools"><div class="btn-group btn-group-sm">';
    html+='<button class="btn btn-outline-primary btn-add-leader" data-section="'+sec.id+'"><i class="fas fa-plus"></i> 添加院长</button>';
    html+='<button class="btn btn-outline-danger btn-add-party" data-section="'+sec.id+'"><i class="fas fa-plus"></i> 添加书记</button>';
    html+='</div></div></div>';
    html+='<div class="card-body" id="leaders-editor-body">';

    // 院长列表
    if(deans.length>0 || secretarys.length>0) {
      if(deans.length>0) {
        html+='<h6 class="mt-2 mb-2 text-primary"><i class="fas fa-user-tie mr-1"></i>历任院长</h6>';
        deans.forEach(function(l,i){
          html+='<div class="leader-item-editor mb-3 p-2 border rounded">';
          html+='<input type="hidden" class="ld-id" value="'+escHtml(l.id||'')+'">';
          html+='<div class="form-row"><div class="col-md-3"><label>姓名</label><input class="form-control form-control-sm ld-name" value="'+escHtml(l.name||'')+'"></div>';
          html+='<div class="col-md-3"><label>任期</label><input class="form-control form-control-sm ld-years" value="'+escHtml(l.years||'')+'"></div>';
          html+='<div class="col-md-2"><label>标签</label><input class="form-control form-control-sm ld-era" value="'+escHtml(l.era||'')+'"></div>';
          html+='<div class="col-md-4"><label>简介</label><div class="input-group input-group-sm"><input class="form-control ld-desc" value="'+escHtml(l.desc||'')+'"><div class="input-group-append"><button class="btn btn-outline-danger btn-del-leader" data-id="'+escHtml(l.id||'')+'"><i class="fas fa-trash"></i></button></div></div></div>';
          html+='</div>';
          html+='<div class="form-row mt-1"><div class="col-md-4"><label>照片URL</label><input class="form-control form-control-sm ld-photo" value="'+escHtml(l.photo||'')+'" placeholder="留空使用占位符"></div>';
          html+='<div class="col-md-3"><label>类型</label><select class="form-control form-control-sm ld-category"><option value="院长" selected>院长</option><option value="书记">书记</option></select></div></div>';
          html+='</div>';
        });
      }
      // 书记列表
      if(secretarys.length>0) {
        html+='<h6 class="mt-3 mb-2 text-danger"><i class="fas fa-flag mr-1"></i>历任书记</h6>';
        secretarys.forEach(function(l,i){
          html+='<div class="leader-item-editor mb-3 p-2 border rounded border-danger">';
          html+='<input type="hidden" class="ld-id" value="'+escHtml(l.id||'')+'">';
          html+='<div class="form-row"><div class="col-md-3"><label>姓名</label><input class="form-control form-control-sm ld-name" value="'+escHtml(l.name||'')+'"></div>';
          html+='<div class="col-md-3"><label>任期</label><input class="form-control form-control-sm ld-years" value="'+escHtml(l.years||'')+'"></div>';
          html+='<div class="col-md-2"><label>标签</label><input class="form-control form-control-sm ld-era" value="'+escHtml(l.era||'')+'"></div>';
          html+='<div class="col-md-4"><label>简介</label><div class="input-group input-group-sm"><input class="form-control ld-desc" value="'+escHtml(l.desc||'')+'"><div class="input-group-append"><button class="btn btn-outline-danger btn-del-leader" data-id="'+escHtml(l.id||'')+'"><i class="fas fa-trash"></i></button></div></div></div>';
          html+='</div>';
          html+='<div class="form-row mt-1"><div class="col-md-4"><label>照片URL</label><input class="form-control form-control-sm ld-photo" value="'+escHtml(l.photo||'')+'" placeholder="留空使用占位符"></div>';
          html+='<div class="col-md-3"><label>类型</label><select class="form-control form-control-sm ld-category"><option value="院长">院长</option><option value="书记" selected>书记</option></select></div></div>';
          html+='</div>';
        });
      }
    } else {
      html+='<p class="text-muted text-center py-2 mb-0">暂无院领导数据，点击上方按钮添加</p>';
    }
    html+='</div></div>';
  }

  // ---- Profiles 编辑区（学科带头人/医学人才） ----
  if (sec.types.indexOf('profile')>=0) {
    // profiles (p1)
    if (Array.isArray(content.profiles) && content.profiles.length>0) {
      html+='<div class="content-section"><h5 class="content-section-title"><i class="fas fa-user-md text-orange mr-2"></i>人物简介（第一组）';
      html+=' <button class="btn btn-xs btn-outline-success ml-2 btn-add-profile" data-section="'+sec.id+'" data-group="profiles"><i class="fas fa-plus"></i> 新增</button></h5>';
      content.profiles.forEach(function(p,i){
        html+=renderProfileRow('profiles',p,i);
      });
      html+='</div>';
    }
    // profiles2 (p2)
    if (Array.isArray(content.profiles2) && content.profiles2.length>0) {
      html+='<div class="content-section"><h5 class="content-section-title"><i class="fas fa-user-nurse text-cyan mr-2"></i>人物简介（第二组）';
      html+=' <button class="btn btn-xs btn-outline-success ml-2 btn-add-profile" data-section="'+sec.id+'" data-group="profiles2"><i class="fas fa-plus"></i> 新增</button></h5>';
      content.profiles2.forEach(function(p,i){
        html+=renderProfileRow('profiles2',p,i);
      });
      html+='</div>';
    }
  }

  // ---- StaffRoster 编辑区（13-职工名录） ----
  if (sec.types.indexOf('staffRoster')>=0) {
    if (!Array.isArray(content.staff)) content.staff=[];
    html+='<div class="content-section card card-outline card-info"><div class="card-header"><h5 class="card-title mb-0"><i class="fas fa-id-card text-primary mr-2"></i>职工名录</h5>';
    html+='<div class="card-tools"><button class="btn btn-xs btn-outline-success btn-batch-import-staff" data-section="'+sec.id+'"><i class="fas fa-file-import"></i> 批量导入</button> ';
    html+='<button class="btn btn-xs btn-outline-primary btn-add-staff" data-section="'+sec.id+'"><i class="fas fa-plus"></i> 添加职工</button></div></div>';
    html+='<div class="card-body" id="staff-editor-body">';
    if(content.staff.length>0) {
      content.staff.forEach(function(s,i){
        html+='<div class="staff-item-editor mb-3 p-2 border rounded">';
        html+='<input type="hidden" class="st-id" value="'+escHtml(s.id||'')+'">';
        html+='<div class="form-row">';
        html+='<div class="col-md-2"><label>姓名</label><input class="form-control form-control-sm st-name" value="'+escHtml(s.name||'')+'"></div>';
        html+='<div class="col-md-1"><label>性别</label><select class="form-control form-control-sm st-gender"><option value="男" '+(s.gender==='男'?'selected':'')+'>男</option><option value="女" '+(s.gender==='女'?'selected':'')+'>女</option></select></div>';
        html+='<div class="col-md-2"><label>职称</label><input class="form-control form-control-sm st-title" value="'+escHtml(s.title||'')+'"></div>';
        html+='<div class="col-md-2"><label>科室</label><input class="form-control form-control-sm st-dept" value="'+escHtml(s.department||'')+'"></div>';
        html+='<div class="col-md-2"><label>入职时间</label><input class="form-control form-control-sm st-hire" value="'+escHtml(s.hireDate||'')+'" placeholder="如：1995-07"></div>';
        html+='<div class="col-md-2"><label>状态</label><select class="form-control form-control-sm st-status"><option value="在职" '+(s.status==='在职'?'selected':'')+'>在职</option><option value="退休" '+(s.status==='退休'?'selected':'')+'>退休</option><option value="离职" '+(s.status==='离职'?'selected':'')+'>离职</option></select></div>';
        html+='<div class="col-md-1 d-flex align-items-end"><button class="btn btn-outline-danger btn-block btn-del-staff" data-id="'+escHtml(s.id||'')+'"><i class="fas fa-trash"></i></button></div>';
        html+='</div>';
        html+='<div class="form-row mt-1">';
        html+='<div class="col-md-3"><label>离职时间</label><input class="form-control form-control-sm st-leave" value="'+escHtml(s.leaveDate||'')+'" placeholder="在职/退休留空"></div>';
        html+='<div class="col-md-7"><label>备注</label><input class="form-control form-control-sm st-remark" value="'+escHtml(s.remark||'')+'" placeholder="可填写获奖情况、特长等"></div>';
        html+='<div class="col-md-2"><label>照片URL</label><input class="form-control form-control-sm st-photo" value="'+escHtml(s.photo||'')+'" placeholder="留空使用占位符"></div>';
        html+='</div>';
        html+='</div>';
      });
    } else {
      html+='<p class="text-muted text-center py-2 mb-0">暂无职工数据，点击上方按钮添加</p>';
    }
    html+='</div></div>';
  }

  // ---- Leadership 编辑区（12-领导团队） ----
  if (sec.types.indexOf('leadership')>=0 && Array.isArray(content.leaders)) {
    html+='<div class="content-section"><h5 class="content-section-title"><i class="fas fa-crown text-danger mr-2"></i>领导班子成员';
    html+=' <button class="btn btn-xs btn-outline-success ml-2 btn-add-leadership" data-section="'+sec.id+'"><i class="fas fa-plus"></i> 新增</button></h5>';
    content.leaders.forEach(function(l,i){
      html+='<div class="leadership-item-editor">';
      html+='<div class="form-row"><div class="col-md-3"><label>姓名</label><input class="form-control form-control-sm lsh-name" value="'+escHtml(l.name||'')+'"></div>';
      html+='<div class="col-md-3"><label>职务</label><input class="form-control form-control-sm lsh-role" value="'+escHtml(l.role||'')+'"></div>';
      html+='<div class="col-md-6"><label>职责</label><input class="form-control form-control-sm lsh-duty" value="'+escHtml(l.duty||'')+'"></div></div>';
      html+='<div class="form-row mt-1"><div class="col-md-10"><label>简历</label><div class="input-group input-group-sm"><textarea class="form-control lsh-resume" rows="2">'+escHtml(l.resume||'')+'</textarea><div class="input-group-append"><button class="btn btn-outline-danger btn-del-leadership" data-idx="'+i+'"><i class="fas fa-trash"></i></button></div></div></div>';
      html+='<div class="col-md-2"><label>照片URL</label><input class="form-control form-control-sm lsh-photo" value="'+escHtml(l.photo||'')+'" placeholder="留空用占位"></div></div>';
      html+='</div>';
    });
    html+='</div>';
  }

  // ---- Data Cards 编辑区 ----
  if (sec.types.indexOf('dataCard')>=0 && Array.isArray(content.dataCards)) {
    html+='<div class="content-section"><h5 class="content-section-title"><i class="fas fa-chart-bar text-success mr-2"></i>数据卡片';
    html+=' <button class="btn btn-xs btn-outline-success ml-2 btn-add-datacard" data-section="'+sec.id+'"><i class="fas fa-plus"></i> 新增</button></h5>';
    content.dataCards.forEach(function(d,i){
      html+='<div class="form-row datacard-row"><div class="col-md-1"><label>图标</label><input class="form-control form-control-sm dc-icon" value="'+escHtml(d.icon||'')+'" maxlength="4" placeholder="📊"></div>';
      html+='<div class="col-md-2"><label>数值</label><input class="form-control form-control-sm dc-value" value="'+escHtml(d.value||'')+'"></div>';
      html+='<div class="col-md-3"><label>标签</label><input class="form-control form-control-sm dc-label" value="'+escHtml(d.label||'')+'"></div>';
      html+='<div class="col-md-3"><label>注释</label><input class="form-control form-control-sm dc-note" value="'+escHtml(d.note||'')+'"></div>';
      html+='<div class="col-md-2"><label>&nbsp;</label><button class="btn btn-sm btn-outline-danger btn-block btn-del-datacard" data-idx="'+i+'"><i class="fas fa-trash"></i></button></div></div>';
    });
    html+='</div>';
  }

  // ---- Gallery 编辑区 ----
  if (sec.types.indexOf('gallery')>=0 && Array.isArray(content.gallery)) {
    html+='<div class="content-section"><h5 class="content-section-title"><i class="fas fa-images text-purple mr-2"></i>底部画廊';
    html+=' <button class="btn btn-xs btn-outline-success ml-2 btn-add-gallery" data-section="'+sec.id+'"><i class="fas fa-plus"></i> 新增</button></h5>';
    content.gallery.forEach(function(g,i){
      html+='<div class="form-row gallery-row"><div class="col-md-2"><label>图标Emoji</label><input class="form-control form-control-sm ga-icon" value="'+escHtml(g.icon||'')+'" maxlength="4"></div>';
      html+='<div class="col-md-4"><label>标签</label><input class="form-control form-control-sm ga-label" value="'+escHtml(g.label||'')+'"></div>';
      html+='<div class="col-md-4"><label>图片URL</label><input class="form-control form-control-sm ga-imgUrl" value="'+escHtml(g.imgUrl||'')+'" placeholder="可选：图片链接"></div>';
      html+='<div class="col-md-2"><label>&nbsp;</label><button class="btn btn-sm btn-outline-danger btn-block btn-del-gallery" data-idx="'+i+'"><i class="fas fa-trash"></i></button></div></div>';
    });
    html+='</div>';
  }

  html+='</div></div></div>'; // card+col

  // 侧边信息
  html+='<div class="col-md-4"><div class="card card-accent card-outline"><div class="card-header"><h3 class="card-title">页面信息</h3></div>';
  html+='<div class="card-body"><p><strong>前台页面：</strong><br><code>pages/'+sec.page+'</code></p>';
  html+='<p><strong>状态：</strong><br><span id="info-status" class="status-badge '+(data.status==='published'?'status-published':'status-draft')+'">'+(data.status==='published'?'已发布':'草稿')+'</span></p>';
  html+='<p><strong>内容类型：</strong><br><span class="text-muted">'+sec.types.join(' · ')+'</span></p>';
  html+='<p><strong>提示：</strong><br><small class="text-muted">修改内容后点击<b>保存全部</b>按钮，刷新前台页面即可看到更新。</small></p>';
  html+='<a href="../pages/'+sec.page+'" target="_blank" class="btn btn-outline-info btn-sm btn-block"><i class="fas fa-eye mr-1"></i>预览前台页面</a>';
  html+='</div></div></div></div></div>';
  return html;
}

// Block编辑器子组件
function renderBlockEditor(secId,b,i){
  var h='<div class="block-item-editor">';
  h+='<div class="form-row"><div class="col-md-4"><label>编号</label><input class="form-control form-control-sm bl-num" value="'+escHtml(b.num||'')+'"></div>';
  h+='<div class="col-md-4"><label>标题</label><input class="form-control form-control-sm bl-title" value="'+escHtml(b.title||'')+'"></div>';
  h+='<div class="col-md-4"><label>副标题</label><div class="input-group input-group-sm"><input class="form-control bl-subtitle" value="'+escHtml(b.subtitle||'')+'"><div class="input-group-append"><button class="btn btn-outline-danger btn-del-block" data-idx="'+i+'"><i class="fas fa-trash"></i></button></div></div></div></div>';
  h+='<div class="form-row mt-1"><div class="col-12"><label>正文 (HTML)</label><textarea class="form-control form-control-sm bl-text" rows="3">'+escHtml(b.text||'')+'</textarea></div></div>';
  h+='<div class="form-row mt-1"><div class="col-md-2"><label>图片Emoji</label><input class="form-control form-control-sm bl-imgIcon" value="'+escHtml(b.imgIcon||'')+'"></div>';
  h+='<div class="col-md-5"><label>图片描述</label><input class="form-control form-control-sm bl-imgLabel" value="'+escHtml(b.imgLabel||'')+'"></div>';
  h+='<div class="col-md-2"><label>尺寸</label><input class="form-control form-control-sm bl-imgSize" value="'+escHtml(b.imgSize||'')+'"></div>';
  h+='<div class="col-md-3"><label>图片URL</label><input class="form-control form-control-sm bl-imgUrl" value="'+escHtml(b.imgUrl||'')+'" placeholder="直接填入图片URL"></div></div>';
  h+='</div>';
  return h;
}

// Profile行组件
function renderProfileRow(group,p,i){
  var h='<div class="profile-row-editor">';
  h+='<div class="form-row"><div class="col-md-3"><label>姓名</label><input class="form-control form-control-sm pr-name" data-group="'+group+'" value="'+escHtml(p.name||'')+'"></div>';
  h+='<div class="col-md-3"><label>职称/称号</label><input class="form-control form-control-sm pr-title" value="'+escHtml(p.title||'')+'"></div>';
  h+='<div class="col-md-2"><label>科室</label><input class="form-control form-control-sm pr-dept" value="'+escHtml(p.dept||'')+'"></div>';
  h+='<div class="col-md-4"><label>简介</label><div class="input-group input-group-sm"><input class="form-control pr-desc" value="'+escHtml(p.desc||'')+'"><div class="input-group-append"><button class="btn btn-outline-danger btn-del-profile" data-group="'+group+'" data-idx="'+i+'"><i class="fas fa-trash"></i></button></div></div></div></div>';
  h+='<div class="form-row mt-1"><div class="col-md-3"><label>照片URL</label><input class="form-control form-control-sm pr-photo" value="'+escHtml(p.photo||'')+'" placeholder="留空用占位"></div></div>';
  h+='</div>';
  return h;
}

// ====== 保存全部内容 ======
function saveSectionContent(secId) {
  var content=getContent();
  if(!content[secId]) content[secId]={};
  var sec=SECTIONS.find(function(s){return s.id===secId;});
  if(!sec) return;

  // Hero
  if(sec.types.indexOf('hero')>=0) {
    content[secId].hero={
      bgImage: $('#section-editor-body .hero-bg').val()||'',
      num: $('#section-editor-body .hero-num').val()||'',
      title: $('#section-editor-body .hero-title').val()||'',
      subtitle: $('#section-editor-body .hero-subtitle').val()||'',
      desc: $('#section-editor-body .hero-desc').val()||''
    };
  }

  // Blocks
  if(sec.types.indexOf('block')>=0) {
    content[secId].blocks=[];
    $('#section-editor-body .block-item-editor').each(function(){
      content[secId].blocks.push({
        num: $(this).find('.bl-num').val()||'',
        title: $(this).find('.bl-title').val()||'',
        subtitle: $(this).find('.bl-subtitle').val()||'',
        text: $(this).find('.bl-text').val()||'',
        imgIcon: $(this).find('.bl-imgIcon').val()||'',
        imgLabel: $(this).find('.bl-imgLabel').val()||'',
        imgSize: $(this).find('.bl-imgSize').val()||'',
        imgUrl: $(this).find('.bl-imgUrl').val()||''
      });
    });
  }

  // Timeline
  if(sec.types.indexOf('timeline')>=0) {
    content[secId].timeline=[];
    $('#section-editor-body .timeline-item-editor').each(function(){
      content[secId].timeline.push({
        year: $(this).find('.tl-year').val()||'',
        title: $(this).find('.tl-title').val()||'',
        desc: $(this).find('.tl-desc').val()||'',
        dot: $(this).find('.tl-dot').val()||''
      });
    });
  }

  // Leaders — 历任院领导（院长+书记）
  if(sec.types.indexOf('leader')>=0) {
    var savedLeaders=[];
    $('#leaders-editor-body .leader-item-editor').each(function(){
      var $el=$(this);
      var cat=$el.find('.ld-category').val()||'院长';
      savedLeaders.push({
        id: $el.find('.ld-id').val()||('l'+Date.now()+Math.random()),
        category: cat,
        name: $el.find('.ld-name').val()||'',
        years: $el.find('.ld-years').val()||'',
        era: $el.find('.ld-era').val()||'',
        eraColor: '',
        desc: $el.find('.ld-desc').val()||'',
        photo: $el.find('.ld-photo').val()||''
      });
    });
    content[secId].leaders=savedLeaders;
  }

  // Profiles
  ['profiles','profiles2'].forEach(function(group){
    if(sec.types.indexOf('profile')>=0 && Array.isArray(content[secId][group])) {
      content[secId][group]=[];
      $('#section-editor-body .profile-row-editor').each(function(){
        var grp=$(this).find('.pr-name').data('group');
        if(grp!==group) return;
        content[secId][group].push({
          id: 'p'+Date.now()+Math.random(),
          name: $(this).find('.pr-name').val()||'',
          title: $(this).find('.pr-title').val()||'',
          dept: $(this).find('.pr-dept').val()||'',
          desc: $(this).find('.pr-desc').val()||'',
          photo: $(this).find('.pr-photo').val()||''
        });
      });
      if(content[secId][group].length===0) delete content[secId][group];
    }
  });

  // StaffRoster — 职工名录
  if(sec.types.indexOf('staffRoster')>=0) {
    content[secId].staff=[];
    $('#staff-editor-body .staff-item-editor').each(function(){
      content[secId].staff.push({
        id: $(this).find('.st-id').val()||('s'+Date.now()+Math.random()),
        name: $(this).find('.st-name').val()||'',
        gender: $(this).find('.st-gender').val()||'男',
        title: $(this).find('.st-title').val()||'',
        department: $(this).find('.st-dept').val()||'',
        hireDate: $(this).find('.st-hire').val()||'',
        leaveDate: $(this).find('.st-leave').val()||'',
        status: $(this).find('.st-status').val()||'在职',
        remark: $(this).find('.st-remark').val()||'',
        photo: $(this).find('.st-photo').val()||''
      });
    });
  }

  // Leadership (12-领导团队)
  if(sec.types.indexOf('leadership')>=0) {
    content[secId].leaders=[];
    $('#section-editor-body .leadership-item-editor').each(function(){
      content[secId].leaders.push({
        id: 'ld'+Date.now()+Math.random(),
        name: $(this).find('.lsh-name').val()||'',
        role: $(this).find('.lsh-role').val()||'',
        duty: $(this).find('.lsh-duty').val()||'',
        resume: $(this).find('.lsh-resume').val()||'',
        photo: $(this).find('.lsh-photo').val()||''
      });
    });
  }

  // Data Cards
  if(sec.types.indexOf('dataCard')>=0) {
    content[secId].dataCards=[];
    $('#section-editor-body .datacard-row').each(function(){
      content[secId].dataCards.push({
        icon: $(this).find('.dc-icon').val()||'',
        value: $(this).find('.dc-value').val()||'',
        label: $(this).find('.dc-label').val()||'',
        note: $(this).find('.dc-note').val()||''
      });
    });
  }

  // Gallery
  if(sec.types.indexOf('gallery')>=0) {
    content[secId].gallery=[];
    $('#section-editor-body .gallery-row').each(function(){
      content[secId].gallery.push({
        icon: $(this).find('.ga-icon').val()||'',
        label: $(this).find('.ga-label').val()||'',
        imgUrl: $(this).find('.ga-imgUrl').val()||''
      });
    });
  }

  saveContent(content);
  // Update updatedAt
  var sd=JSON.parse(localStorage.getItem('hm_admin_sections')||'{}');
  if(!sd[secId]) sd[secId]={title:sec.name,status:'published',updatedAt:'',notes:''};
  sd[secId].updatedAt=new Date().toISOString().split('T')[0];
  localStorage.setItem('hm_admin_sections',JSON.stringify(sd));

  $(document).Toasts('create',{class:'bg-success',title:'保存成功',body:sec.name+' 全部内容已保存',autohide:true,delay:2000});
}

// ====== 公告管理 ======
function renderAnnouncements() {
  var anns=JSON.parse(localStorage.getItem('hm_announcements')||'[]');
  var catMap={notice:'通知公告',event:'活动事件',hr:'人事信息',academic:'科研学术'};
  var catColor={notice:'info',event:'warning',hr:'success',academic:'primary'};
  var html='<div class="container-fluid"><div class="row"><div class="col-12"><div class="card card-primary card-outline"><div class="card-header">';
  html+='<h3 class="card-title">公告管理</h3><div class="card-tools"><button class="btn btn-sm btn-accent" id="btn-add-ann"><i class="fas fa-plus mr-1"></i>新增公告</button></div></div>';
  html+='<div class="card-body p-0"><div class="table-responsive"><table class="table table-hover mb-0"><thead><tr>';
  html+='<th>ID</th><th>标题</th><th>分类</th><th>日期</th><th>部门</th><th>状态</th><th>操作</th></tr></thead><tbody>';
  anns.forEach(function(a){
    html+='<tr><td>'+a.id+'</td><td>'+escHtml(a.title)+'</td>';
    html+='<td><span class="badge badge-'+(catColor[a.category]||'secondary')+'">'+(catMap[a.category]||a.category)+'</span></td>';
    html+='<td>'+a.date+'</td><td>'+escHtml(a.dept)+'</td>';
    html+='<td><span class="status-badge '+(a.published?'status-published':'status-draft')+'">'+(a.published?'已发布':'草稿')+'</span></td>';
    html+='<td><button class="btn btn-sm btn-outline-info btn-edit-ann" data-id="'+a.id+'"><i class="fas fa-pen"></i></button> ';
    html+='<button class="btn btn-sm btn-outline-warning toggle-ann" data-id="'+a.id+'"><i class="fas fa-'+(a.published?'eye-slash':'eye')+'"></i></button> ';
    html+='<button class="btn btn-sm btn-outline-danger del-ann" data-id="'+a.id+'"><i class="fas fa-trash"></i></button></td></tr>';
  });
  html+='</tbody></table></div></div></div></div>';

  // 新增/编辑公告弹窗
  html+='<div class="row"><div class="col-12"><div class="card card-accent card-outline" id="add-ann-form" style="display:none"><div class="card-header"><h3 class="card-title" id="ann-form-title">新增公告</h3></div>';
  html+='<div class="card-body"><div class="row">';
  html+='<div class="col-md-6"><label>标题</label><input class="form-control" id="ann-title"></div>';
  html+='<div class="col-md-3"><label>日期</label><input type="date" class="form-control" id="ann-date"></div>';
  html+='<div class="col-md-3"><label>分类</label><select class="form-control" id="ann-cat"><option value="notice">通知公告</option><option value="event">活动事件</option><option value="hr">人事信息</option><option value="academic">科研学术</option></select></div>';
  html+='<div class="col-md-3"><label>部门</label><input class="form-control" id="ann-dept"></div>';
  html+='<div class="col-12 mt-2"><label>正文</label><textarea class="form-control" id="ann-content" rows="3"></textarea></div>';
  html+='</div><input type="hidden" id="ann-edit-id"><button class="btn btn-accent mt-2" id="btn-save-ann"><i class="fas fa-check mr-1"></i>提交</button> ';
  html+='<button class="btn btn-outline-secondary mt-2" id="btn-cancel-ann">取消</button></div></div></div></div>';
  html+='</div></div>';
  return html;
}

// ====== 网站设置 ======
function renderSettings() {
  var settings=JSON.parse(localStorage.getItem('hm_settings')||'{}');
  var html='<div class="container-fluid"><div class="row"><div class="col-md-8"><div class="card card-primary card-outline"><div class="card-header"><h3 class="card-title">网站设置</h3></div><div class="card-body">';
  html+='<div class="form-group"><label>网站标题</label><input class="form-control" id="set-title" value="'+escHtml(settings.siteTitle||'')+'"></div>';
  html+='<div class="form-group"><label>副标题</label><input class="form-control" id="set-subtitle" value="'+escHtml(settings.siteSubtitle||'')+'"></div>';
  html+='<div class="form-group"><label>官网链接</label><input class="form-control" id="set-url" value="'+escHtml(settings.officialUrl||'')+'"></div>';
  html+='<div class="form-group"><label>联系邮箱</label><input type="email" class="form-control" id="set-email" value="'+escHtml(settings.contactEmail||'')+'"></div>';
  html+='<div class="form-group"><label>联系电话</label><input class="form-control" id="set-phone" value="'+escHtml(settings.contactPhone||'')+'"></div>';
  html+='<div class="form-group"><label>建院年份</label><input type="number" class="form-control" id="set-founded-year" value="'+(settings.foundedYear||1991)+'" min="1900" max="2100"><small class="text-muted">前台据此自动计算院龄</small></div>';
  html+='<button class="btn btn-primary" id="btn-save-settings"><i class="fas fa-save mr-1"></i>保存设置</button>';
  html+='</div></div></div><div class="col-md-4"><div class="card"><div class="card-header"><h3 class="card-title">说明</h3></div>';
  html+='<div class="card-body"><p class="text-muted mb-0">修改后前台刷新生效。</p></div></div></div></div>';

  // 修改密码卡片
  html+='<div class="row mt-4"><div class="col-md-8"><div class="card card-warning card-outline"><div class="card-header"><h3 class="card-title"><i class="fas fa-key mr-2"></i>修改管理密码</h3></div><div class="card-body">';
  html+='<div class="row"><div class="col-md-4"><div class="form-group"><label>当前密码</label><input type="password" class="form-control" id="chpw-old" placeholder="输入当前密码"></div></div>';
  html+='<div class="col-md-4"><div class="form-group"><label>新密码</label><input type="password" class="form-control" id="chpw-new" placeholder="至少4位"></div></div>';
  html+='<div class="col-md-4"><div class="form-group"><label>确认新密码</label><input type="password" class="form-control" id="chpw-confirm" placeholder="再次输入"></div></div></div>';
  html+='<button class="btn btn-warning" id="btn-change-pwd"><i class="fas fa-check mr-1"></i>修改密码</button> ';
  html+='<span id="chpw-msg" class="ml-2" style="font-weight:600"></span>';
  html+='</div></div></div></div></div>';
  return html;
}

// ====== 事件绑定 ======
$(document).ready(function() {
  initAllData();

  // 服务器数据加载完毕后重新渲染当前页（确保控制台显示最新服务器数据）
  window.addEventListener('serverDataLoaded', function() {
    navigateTo(currentPage);
  });

  // 侧边栏导航（直接绑定：AdminLTE Treeview 会 stopPropagation 阻止冒泡，故不能用 document 委托）
  $('.nav-sidebar .nav-link[data-page]').on('click',function(e){ e.preventDefault(); navigateTo($(this).data('page')); });
  $(document).on('click','[data-nav]',function(e){
    if($(this).closest('.nav-sidebar').length>0) return;
    e.preventDefault(); navigateTo($(this).data('nav'));
  });

  // 保存板块内容
  $(document).on('click','.btn-save-content',function(){
    saveSectionContent($(this).data('section'));
  });

  // 新增/删除 Block
  $(document).on('click','.btn-add-block',function(){
    var secId=$(this).data('section');
    var content=getContent();
    if(!content[secId]) content[secId]={};
    if(!content[secId].blocks) content[secId].blocks=[];
    content[secId].blocks.push({num:'新编号',title:'新标题',subtitle:'新副标题',text:'',imgIcon:'📷',imgLabel:'图片描述',imgSize:'16:9',imgUrl:''});
    saveContent(content);
    navigateTo(secId);
  });
  $(document).on('click','.btn-del-block',function(){
    var idx=parseInt($(this).data('idx'));
    var content=getContent();
    if(!content[currentPage]) content[currentPage]={};
    if(!content[currentPage].blocks) content[currentPage].blocks=[];
    if(idx>=0 && idx<content[currentPage].blocks.length){
      content[currentPage].blocks.splice(idx,1);
      if(saveContent(content)) toastMsg('已删除', 'success');
    }
    navigateTo(currentPage);
  });

  // 新增/删除 Timeline
  $(document).on('click','.btn-add-timeline',function(){
    var secId=$(this).data('section');
    var content=getContent();
    if(!content[secId]) content[secId]={};
    if(!content[secId].timeline) content[secId].timeline=[];
    content[secId].timeline.push({year:'新',title:'新事件',desc:'描述',dot:'新'});
    saveContent(content);
    navigateTo(secId);
  });
  $(document).on('click','.btn-del-timeline',function(){
    var idx=parseInt($(this).data('idx'));
    var content=getContent();
    if(!content[currentPage]) content[currentPage]={};
    if(!content[currentPage].timeline) content[currentPage].timeline=[];
    if(idx>=0 && idx<content[currentPage].timeline.length){
      content[currentPage].timeline.splice(idx,1);
      if(saveContent(content)) toastMsg('已删除', 'success');
    }
    navigateTo(currentPage);
  });

  // 新增/删除 Leader (院长)
  $(document).on('click','.btn-add-leader',function(){
    var secId=$(this).data('section');
    var content=getContent();
    if(!content[secId]) content[secId]={};
    if(!content[secId].leaders) content[secId].leaders=[];
    content[secId].leaders.push({id:'l'+Date.now(),category:'院长',name:'新姓名',years:'2000–2005',era:'标签',eraColor:'',desc:'简介',photo:''});
    saveContent(content);
    navigateTo(secId);
  });
  $(document).on('click','.btn-del-leader',function(){
    var id=$(this).data('id');
    if(!id) return;
    var content=getContent();
    if(!content[currentPage]) content[currentPage]={};
    var arr=content[currentPage].leaders||[];
    var realIdx=-1;
    for(var i=0;i<arr.length;i++){ if(arr[i].id===id){ realIdx=i; break; } }
    if(realIdx>=0){
      var cat=arr[realIdx].category||'';
      arr.splice(realIdx,1);
      if(saveContent(content)) toastMsg('已删除'+ (cat==='书记'?'书记':'院长'), 'success');
    }
    navigateTo(currentPage);
  });

  // 新增/删除 Party (书记)
  $(document).on('click','.btn-add-party',function(){
    var secId=$(this).data('section');
    var content=getContent();
    if(!content[secId]) content[secId]={};
    if(!content[secId].leaders) content[secId].leaders=[];
    content[secId].leaders.push({id:'l'+Date.now(),category:'书记',name:'新姓名',years:'2000–2005',era:'标签',eraColor:'',desc:'简介',photo:''});
    saveContent(content);
    navigateTo(secId);
  });

  // 新增/删除 Profile
  $(document).on('click','.btn-add-profile',function(){
    var secId=$(this).data('section');
    var group=$(this).data('group')||'profiles';
    var content=getContent();
    if(!content[secId]) content[secId]={};
    if(!content[secId][group]) content[secId][group]=[];
    content[secId][group].push({id:'p'+Date.now(),name:'新姓名',title:'职称',dept:'科室',desc:'简介',photo:''});
    saveContent(content);
    navigateTo(secId);
  });
  $(document).on('click','.btn-del-profile',function(){
    var idx=parseInt($(this).data('idx'));
    var group=$(this).data('group')||'profiles';
    var content=getContent();
    if(!content[currentPage]) content[currentPage]={};
    if(!content[currentPage][group]) content[currentPage][group]=[];
    if(idx>=0 && idx<content[currentPage][group].length){
      content[currentPage][group].splice(idx,1);
      if(saveContent(content)) toastMsg('已删除', 'success');
    }
    navigateTo(currentPage);
  });

  // 新增/删除 Staff（职工名录）
  $(document).on('click','.btn-add-staff',function(){
    var secId=$(this).data('section');
    var content=getContent();
    if(!content[secId]) content[secId]={};
    if(!content[secId].staff) content[secId].staff=[];
    content[secId].staff.push({
      id:'s'+Date.now(),
      name:'新职工',
      gender:'男',
      title:'职称',
      department:'科室',
      hireDate:'',
      leaveDate:'',
      status:'在职',
      remark:'',
      photo:''
    });
    saveContent(content);
    navigateTo(secId);
  });
  $(document).on('click','.btn-del-staff',function(){
    var id=$(this).data('id');
    if(!id) return;
    var content=getContent();
    if(!content[currentPage]) content[currentPage]={};
    var arr=content[currentPage].staff||[];
    var realIdx=-1;
    for(var i=0;i<arr.length;i++){ if(arr[i].id===id){ realIdx=i; break; } }
    if(realIdx>=0){
      var nm=arr[realIdx].name||'';
      arr.splice(realIdx,1);
      if(saveContent(content)) toastMsg('已删除：'+nm, 'success');
    }
    navigateTo(currentPage);
  });

  // 新增/删除 Leadership
  $(document).on('click','.btn-add-leadership',function(){
    var secId=$(this).data('section');
    var content=getContent();
    if(!content[secId]) content[secId]={};
    if(!content[secId].leaders) content[secId].leaders=[];
    content[secId].leaders.push({id:'ld'+Date.now(),name:'新姓名',role:'职务',duty:'职责',resume:'简历',photo:''});
    saveContent(content);
    navigateTo(secId);
  });
  $(document).on('click','.btn-del-leadership',function(){
    var idx=parseInt($(this).data('idx'));
    var content=getContent();
    if(!content[currentPage]) content[currentPage]={};
    if(!content[currentPage].leaders) content[currentPage].leaders=[];
    if(idx>=0 && idx<content[currentPage].leaders.length){
      content[currentPage].leaders.splice(idx,1);
      if(saveContent(content)) toastMsg('已删除', 'success');
    }
    navigateTo(currentPage);
  });

  // 新增/删除 Gallery
  $(document).on('click','.btn-add-gallery',function(){
    var secId=$(this).data('section');
    var content=getContent();
    if(!content[secId]) content[secId]={};
    if(!content[secId].gallery) content[secId].gallery=[];
    content[secId].gallery.push({icon:'📷',label:'新图片',imgUrl:''});
    saveContent(content);
    navigateTo(secId);
  });
  $(document).on('click','.btn-del-gallery',function(){
    var idx=parseInt($(this).data('idx'));
    var content=getContent();
    if(!content[currentPage]) content[currentPage]={};
    if(!content[currentPage].gallery) content[currentPage].gallery=[];
    if(idx>=0 && idx<content[currentPage].gallery.length){
      content[currentPage].gallery.splice(idx,1);
      if(saveContent(content)) toastMsg('已删除', 'success');
    }
    navigateTo(currentPage);
  });

  // 新增/删除 DataCard
  $(document).on('click','.btn-add-datacard',function(){
    var secId=$(this).data('section');
    var content=getContent();
    if(!content[secId]) content[secId]={};
    if(!content[secId].dataCards) content[secId].dataCards=[];
    content[secId].dataCards.push({value:'0',label:'标签',note:''});
    saveContent(content);
    navigateTo(secId);
  });
  $(document).on('click','.btn-del-datacard',function(){
    var idx=parseInt($(this).data('idx'));
    var content=getContent();
    if(!content[currentPage]) content[currentPage]={};
    if(!content[currentPage].dataCards) content[currentPage].dataCards=[];
    if(idx>=0 && idx<content[currentPage].dataCards.length){
      content[currentPage].dataCards.splice(idx,1);
      if(saveContent(content)) toastMsg('已删除', 'success');
    }
    navigateTo(currentPage);
  });

  // 全部保存
  $(document).on('click','#btn-save-all',function(e){
    e.preventDefault();
    var sd=JSON.parse(localStorage.getItem('hm_admin_sections')||'{}');
    SECTIONS.forEach(function(s){
      if(!sd[s.id]) sd[s.id]={title:s.name,status:'published',updatedAt:new Date().toISOString().split('T')[0],notes:''};
    });
    localStorage.setItem('hm_admin_sections',JSON.stringify(sd));
    toastMsg('12板块已全部设为已发布', 'success');
  });

  // 公告管理
  $(document).on('click','#btn-add-ann',function(){ $('#ann-form-title').text('新增公告'); $('#add-ann-form').slideDown(); });
  $(document).on('click','#btn-cancel-ann',function(){ $('#add-ann-form').slideUp(); });
  $(document).on('click','.btn-edit-ann',function(){
    var anns=JSON.parse(localStorage.getItem('hm_announcements')||'[]');
    var a=anns.find(function(x){return x.id===$(this).data('id');}.bind(this))||anns.find(function(x){return x.id===parseInt($(this).data('id'));}.bind(this));
    if(!a) return;
    $('#ann-form-title').text('编辑公告 #'+a.id); $('#ann-edit-id').val(a.id);
    $('#ann-title').val(a.title); $('#ann-date').val(a.date); $('#ann-cat').val(a.category);
    $('#ann-dept').val(a.dept); $('#ann-content').val(a.content||'');
    $('#add-ann-form').slideDown();
  });
  $(document).on('click','#btn-save-ann',function(){
    var anns=JSON.parse(localStorage.getItem('hm_announcements')||'[]');
    var editId=$('#ann-edit-id').val();
    if(editId){
      anns=anns.map(function(a){ if(a.id===parseInt(editId)){ a.title=$('#ann-title').val(); a.date=$('#ann-date').val(); a.category=$('#ann-cat').val(); a.dept=$('#ann-dept').val(); a.content=$('#ann-content').val(); } return a; });
    } else {
      var maxId=0; anns.forEach(function(a){if(a.id>maxId)maxId=a.id;});
      anns.push({id:maxId+1,title:$('#ann-title').val(),date:$('#ann-date').val(),category:$('#ann-cat').val(),dept:$('#ann-dept').val(),content:$('#ann-content').val(),published:true});
    }
    localStorage.setItem('hm_announcements',JSON.stringify(anns));
    navigateTo('announcements');
    toastMsg(editId?'公告已更新':'公告已新增', 'success');
  });
  $(document).on('click','.toggle-ann',function(){
    var id=$(this).data('id');
    var anns=JSON.parse(localStorage.getItem('hm_announcements')||'[]');
    anns=anns.map(function(a){if(a.id===id)a.published=!a.published;return a;});
    localStorage.setItem('hm_announcements',JSON.stringify(anns));
    navigateTo('announcements');
  });
  $(document).on('click','.del-ann',function(){
    if(!confirm('确认删除此公告？')) return;
    var id=$(this).data('id');
    var anns=JSON.parse(localStorage.getItem('hm_announcements')||'[]');
    anns=anns.filter(function(a){return a.id!==id;});
    localStorage.setItem('hm_announcements',JSON.stringify(anns));
    navigateTo('announcements');
    toastMsg('公告已删除', 'success');
  });

  // 保存设置
  $(document).on('click','#btn-save-settings',function(){
    var settings={siteTitle:$('#set-title').val(),siteSubtitle:$('#set-subtitle').val(),officialUrl:$('#set-url').val(),contactEmail:$('#set-email').val(),contactPhone:$('#set-phone').val(),foundedYear:parseInt($('#set-founded-year').val())||1991};
    localStorage.setItem('hm_settings',JSON.stringify(settings));
    $(document).Toasts('create',{class:'bg-success',title:'已保存',body:'网站设置已更新',autohide:true,delay:2000});
  });

  // 修改密码
  $(document).on('click','#btn-change-pwd',function(){
    var msgEl=$('#chpw-msg');
    msgEl.removeClass('text-danger text-success').text('');
    var oldPwd=$('#chpw-old').val();
    var newPwd=$('#chpw-new').val();
    var confirmPwd=$('#chpw-confirm').val();
    if(!oldPwd){ msgEl.addClass('text-danger').text('请输入当前密码'); return; }
    if(newPwd.length<4){ msgEl.addClass('text-danger').text('新密码至少4位'); return; }
    if(newPwd!==confirmPwd){ msgEl.addClass('text-danger').text('两次新密码不一致'); return; }
    var stored=localStorage.getItem('hm_auth_pwdhash');
    if(!stored){ msgEl.addClass('text-danger').text('系统错误：无密码数据'); return; }
    var calcHash=function(p){ return btoa(unescape(encodeURIComponent('dfy@2026!'+p))); };
    if(calcHash(oldPwd)!==stored){ msgEl.addClass('text-danger').text('当前密码错误'); return; }
    localStorage.setItem('hm_auth_pwdhash',calcHash(newPwd));
    msgEl.addClass('text-success').text('密码修改成功！请牢记新密码。');
    setTimeout(function(){ $('#chpw-old,#chpw-new,#chpw-confirm').val(''); msgEl.text(''); },1500);
  });

if(!$('.toasts-top-right').length) $('body').append('<div class="toasts-top-right fixed" style="position:fixed;top:70px;right:20px;z-index:9999"></div>');

  // ====== 批量导入职工名录模态框 ======
  if($('#staff-batch-import-modal').length===0){
    var modalHtml='<div class="modal fade" id="staff-batch-import-modal" tabindex="-1" role="dialog">';
    modalHtml+='<div class="modal-dialog modal-lg" role="document"><div class="modal-content">';
    modalHtml+='<div class="modal-header bg-info"><h5 class="modal-title"><i class="fas fa-file-import mr-2"></i>批量导入职工名录</h5>';
    modalHtml+='<button type="button" class="close" data-dismiss="modal" aria-label="关闭"><span aria-hidden="true">&times;</span></button></div>';
    modalHtml+='<div class="modal-body">';
    modalHtml+='<div class="alert alert-info"><i class="fas fa-info-circle mr-2"></i>支持JSON格式或CSV格式批量导入职工数据。';
    modalHtml+='<br>JSON格式：粘贴包含职工对象的数组；CSV格式：第一行是表头（姓名,性别,职称,科室,入职时间,状态,离职时间,备注）。</div>';
    modalHtml+='<div class="form-group"><label>选择导入格式</label><select class="form-control" id="batch-import-format">';
    modalHtml+='<option value="json">JSON格式</option><option value="csv">CSV格式（逗号分隔）</option></select></div>';
    modalHtml+='<div class="form-group"><label>粘贴数据或上传文件</label>';
    modalHtml+='<div class="input-group mb-2"><div class="custom-file"><input type="file" class="custom-file-input" id="batch-import-file" accept=".json,.csv">';
    modalHtml+='<label class="custom-file-label" for="batch-import-file">选择文件...</label></div></div>';
    modalHtml+='<textarea class="form-control" id="batch-import-data" rows="10" placeholder="在此粘贴JSON数组或CSV数据...\n\nJSON示例：\n[\n  {\"name\":\"张三\",\"gender\":\"男\",\"title\":\"主任医师\",\"department\":\"内科\",\"hireDate\":\"1995-07\",\"status\":\"在职\",\"leaveDate\":\"\",\"remark\":\"优秀员工\"}\n]"></textarea></div>';
    modalHtml+='<div class="form-group"><label>导入选项</label><div class="form-check">';
    modalHtml+='<input class="form-check-input" type="radio" name="import-mode" id="import-mode-append" value="append" checked>';
    modalHtml+='<label class="form-check-label" for="import-mode-append">追加到现有数据</label></div>';
    modalHtml+='<div class="form-check"><input class="form-check-input" type="radio" name="import-mode" id="import-mode-replace" value="replace">';
    modalHtml+='<label class="form-check-label" for="import-mode-replace">清空后导入（替换全部）</label></div></div>';
    modalHtml+='<div id="batch-import-preview" style="display:none;"><hr><h6>数据预览（前5条）</h6><div class="table-responsive"><table class="table table-sm table-bordered" id="batch-import-preview-table">';
    modalHtml+='<thead><tr><th>姓名</th><th>性别</th><th>职称</th><th>科室</th><th>入职时间</th><th>状态</th></tr></thead><tbody></tbody></table></div>';
    modalHtml+='<div class="text-muted small" id="batch-import-count"></div></div></div>';
    modalHtml+='<div class="modal-footer"><button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>';
    modalHtml+='<button type="button" class="btn btn-info" id="btn-preview-import"><i class="fas fa-eye mr-1"></i>预览数据</button>';
    modalHtml+='<button type="button" class="btn btn-primary" id="btn-confirm-import"><i class="fas fa-upload mr-1"></i>确认导入</button></div>';
    modalHtml+='</div></div></div>';
    $('body').append(modalHtml);
  }

  // ====== 批量导入事件处理 ======
  // 打开批量导入模态框
  $(document).on('click','.btn-batch-import-staff',function(){
    $('#batch-import-data').val('');
    $('#batch-import-file').val('');
    $('#batch-import-preview').hide();
    $('#staff-batch-import-modal').modal('show');
  });

  // 文件上传处理
  $(document).on('change','#batch-import-file',function(){
    var file=this.files[0];
    if(!file) return;
    $('.custom-file-label[for="batch-import-file"]').text(file.name);
    var reader=new FileReader();
    reader.onload=function(e){
      $('#batch-import-data').val(e.target.result);
      toastMsg('文件已加载，请点击"预览数据"检查', 'info');
    };
    reader.readAsText(file, 'UTF-8');
  });

  // 预览导入数据
  $(document).on('click','#btn-preview-import',function(){
    var format=$('#batch-import-format').val();
    var rawData=$('#batch-import-data').val().trim();
    if(!rawData){ toastMsg('请先粘贴数据或上传文件', 'warning'); return; }
    try {
      var data=[];
      if(format==='json'){
        data=JSON.parse(rawData);
        if(!Array.isArray(data)) throw new Error('JSON数据必须是数组格式');
      } else {
        // CSV解析
        var lines=rawData.split('\n').filter(function(l){return l.trim();});
        if(lines.length<2) throw new Error('CSV文件至少需要包含表头和一行数据');
        var headers=lines[0].split(',').map(function(h){return h.trim();});
        for(var i=1;i<lines.length;i++){
          var vals=lines[i].split(',').map(function(v){return v.trim();});
          var obj={};
          headers.forEach(function(h,idx){ obj[h]=vals[idx]||''; });
          data.push(obj);
        }
      }
      // 验证并标准化数据
      var validData=[];
      data.forEach(function(item,idx){
        var staff={
          id:'s'+Date.now()+'_'+idx,
          name:item.name||item.姓名||'未命名',
          gender:item.gender||item.性别||'男',
          title:item.title||item.职称||'',
          department:item.department||item.科室||'',
          hireDate:item.hireDate||item.入职时间||'',
          leaveDate:item.leaveDate||item.离职时间||'',
          status:item.status||item.状态||'在职',
          remark:item.remark||item.备注||'',
          photo:item.photo||item.照片||''
        };
        validData.push(staff);
      });
      // 显示预览
      var previewHtml='';
      validData.slice(0,5).forEach(function(s){
        previewHtml+='<tr><td>'+escHtml(s.name)+'</td><td>'+escHtml(s.gender)+'</td><td>'+escHtml(s.title)+'</td>';
        previewHtml+='<td>'+escHtml(s.department)+'</td><td>'+escHtml(s.hireDate)+'</td><td>'+escHtml(s.status)+'</td></tr>';
      });
      $('#batch-import-preview-table tbody').html(previewHtml);
      $('#batch-import-count').text('共 '+validData.length+' 条记录'+(validData.length>5?'（仅显示前5条）':''));
      $('#batch-import-preview').show();
      // 保存预览数据到全局变量
      window._batchImportPreviewData=validData;
      toastMsg('数据验证成功，共 '+validData.length+' 条记录', 'success');
    } catch(e) {
      toastMsg('数据格式错误：'+e.message, 'danger');
      $('#batch-import-preview').hide();
    }
  });

  // 确认导入
  $(document).on('click','#btn-confirm-import',function(){
    var data=window._batchImportPreviewData;
    if(!data || !data.length){ toastMsg('请先预览数据', 'warning'); return; }
    var mode=$('input[name="import-mode"]:checked').val()||'append';
    var secId=currentPage;
    if(secId!=='staff'){ toastMsg('当前页面不是职工名录', 'warning'); return; }
    var content=getContent();
    if(!content[secId]) content[secId]={};
    if(mode==='replace'){
      content[secId].staff=data;
    } else {
      if(!content[secId].staff) content[secId].staff=[];
      content[secId].staff=content[secId].staff.concat(data);
    }
    if(saveContent(content)){
      toastMsg('成功导入 '+data.length+' 条职工记录', 'success');
      $('#staff-batch-import-modal').modal('hide');
      navigateTo(secId);
    }
  });

  navigateTo('dashboard');
});
