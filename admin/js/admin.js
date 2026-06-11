/**
 * 云端院史馆 · 后台内容管理系统
 * 基于 AdminLTE 3.x + localStorage
 * 支持13板块全部内容的可视化编辑
 */

// ====== 底层数据模型 ======
var SECTIONS = [
  { id:'index',       name:'网站首页', icon:'fas fa-home',          color:'#1a73e8', page:'index.html',         types:['index-hero','sectionCards','stats-bar','gallery','footer'] },

  { id:'history',     name:'历史沿革', icon:'fas fa-history',       color:'#2980b9', page:'01-history.html',     types:['hero','block','timeline','gallery'] },
  { id:'people',      name:'人物风采', icon:'fas fa-users',         color:'#e67e22', page:'02-people.html',      types:['hero','leader','profile','dataCard','gallery','party','roleModel'] },
  { id:'disciplines', name:'学科建设', icon:'fas fa-microscope',    color:'#27ae60', page:'03-disciplines.html', types:['hero','block','profile','gallery'] },
  { id:'campus',      name:'院区建设', icon:'fas fa-building',      color:'#8e44ad', page:'04-campus.html',      types:['hero','block','dataCard','gallery'] },
  { id:'education',   name:'教学人才', icon:'fas fa-graduation-cap',color:'#e91e63', page:'05-education.html',   types:['hero','block','profile','dataCard','gallery'] },
  { id:'culture',     name:'文化建设', icon:'fas fa-heart',         color:'#f57c00', page:'06-culture.html',     types:['hero','block','dataCard','gallery'] },
  { id:'tech',        name:'科技交流', icon:'fas fa-robot',         color:'#1565c0', page:'07-tech.html',        types:['hero','block','dataCard','gallery'] },
  { id:'duty',        name:'责任担当', icon:'fas fa-shield-alt',    color:'#c62828', page:'08-duty.html',        types:['hero','block','dataCard','gallery'] },
  { id:'honors',      name:'荣誉殿堂', icon:'fas fa-trophy',        color:'#f9a825', page:'09-honors.html',      types:['hero','block','dataCard','gallery'] },
  { id:'vision',      name:'展望未来', icon:'fas fa-eye',           color:'#00695c', page:'10-vision.html',      types:['hero','block','timeline','dataCard','gallery'] },
  { id:'structure',   name:'组织架构', icon:'fas fa-sitemap',       color:'#4527a0', page:'11-structure.html',   types:['hero','block','gallery'] },
  { id:'leadership',  name:'领导团队', icon:'fas fa-user-tie',      color:'#bf360c', page:'12-leadership.html',  types:['hero','block','leadership','gallery'] },
  { id:'staff',       name:'职工名录', icon:'fas fa-address-book',    color:'#0288d1', page:'13-staff.html',       types:['hero','block','profile','dataCard','gallery'] }
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
      leaders: [
        { id:'l1', position:'院长', category:'院长', name:'[待补充]', years:'1992 – 2000', era:'建院奠基', eraColor:'', desc:'主持建院筹备工作，从零起步搭建医院基本架构。', photo:'' },
        { id:'l2', position:'院长', category:'院长', name:'[待补充]', years:'2000 – 2008', era:'规模拓展', eraColor:'', desc:'推动医院规模化发展，扩充临床科室。', photo:'' },
        { id:'l3', position:'院长', category:'院长', name:'[待补充]', years:'2008 – 2015', era:'三甲创建', eraColor:'', desc:'带领全院奋力冲刺三级甲等评审。', photo:'' },
        { id:'l4', position:'院长', category:'院长', name:'[待补充]', years:'2015 – 2022', era:'跨越发展', eraColor:'', desc:'推进凤仪院区建设，实现一院两区格局。', photo:'' },
        { id:'l5', position:'院长', category:'院长', name:'[待补充]', years:'2022 – 至今', era:'现任 · 高质量发展', eraColor:'', desc:'深化医教研协同，推动智慧医院建设。', photo:'' },
        { id:'l6', position:'党委书记', category:'书记', name:'[待补充]', years:'1992 – 2000', era:'建院初期', eraColor:'', desc:'在建院最艰难时期，以党建凝聚人心。', photo:'' },
        { id:'l7', position:'党委书记', category:'书记', name:'[待补充]', years:'2000 – 2008', era:'党建规范', eraColor:'', desc:'推进党建工作规范化制度化建设。', photo:'' },
        { id:'l8', position:'党委书记', category:'书记', name:'[待补充]', years:'2008 – 2015', era:'思政引领', eraColor:'', desc:'强化思想政治引领，推动党建与业务融合。', photo:'' },
        { id:'l9', position:'党委书记', category:'书记', name:'[待补充]', years:'2015 – 2022', era:'全面从严', eraColor:'', desc:'落实全面从严治党，打造清廉医院。', photo:'' },
        { id:'l10', position:'党委书记', category:'书记', name:'[待补充]', years:'2022 – 至今', era:'现任 · 党建引领', eraColor:'', desc:'以高质量党建引领高质量发展。', photo:'' }
      ],
      profiles: [
        { id:'p1', name:'[待补充]', title:'省突专家 · 二级教授 · 博导', dept:'心血管内科', desc:'深耕冠心病介入治疗30年，主持国自然3项。' },
        { id:'p2', name:'[待补充]', title:'省贴专家 · 兴滇英才 · 教授', dept:'神经外科', photo:'', desc:'滇西神经外科领军人物。' },
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
      statsCards: [
        { value:'3', label:'省突/省贴专家' },
        { value:'4', label:'兴滇英才' },
        { value:'6', label:'省学术带头人' },
        { value:'16', label:'省卫健委高层次人才' },
        { value:'59', label:'院级学术带头人' },
        { value:'294', label:'高级职称人员' }
      ],
      dataCards: [
        { value:'1946', label:'全院职工', note:'含编内编外' },
        { value:'1638', label:'卫技人员', note:'占比 84.2%' },
        { value:'29', label:'博士', note:'含在读' },
        { value:'360', label:'硕士', note:'含在读' },
        { value:'294', label:'高级职称', note:'正高+副高' }
      ],
      party: {
        branches: '9', subBranches: '55', members: '803',
        staffMembers: '615', gradMembers: '188',
        textTitle: '组织有力 · 党员先锋',
        text: '医院党委始终坚持以高质量党建引领高质量发展。9个党总支、55个党支部（含1个直属支部）覆盖医疗、教学、科研、管理各条战线，803名党员（教工615名、研究生188名）在各自岗位上发挥先锋模范作用。',
        textTitle2: '党旗在一线高高飘扬',
        text2: '在抗疫驰援、脱贫攻坚、对口帮扶、应急救援等急难险重任务中，党员始终冲锋在前、勇挑重担。党组织战斗堡垒作用和党员先锋模范作用，已成为医院攻坚克难、砥砺前行的最强保障。',
        imgIcon: '🚩', imgLabel: '党员先锋岗 / 主题党日活动<br><small>党建风采 · 16:9</small>', imgSize: '16:9 横幅'
      },
      roleModels: [
        { id:'r1', name:'[待补充]', title:'年度优秀护士 · 30年护龄', dept:'护理部', desc:'三十年如一日坚守临床一线，以爱心耐心赢得患者广泛赞誉。', photo:'' },
        { id:'r2', name:'[待补充]', title:'科研标兵 · 博士', dept:'中心实验室', desc:'主持国自然面上项目1项，发表SCI一区论文4篇。', photo:'' },
        { id:'r3', name:'[待补充]', title:'优秀教师 · 省级教学比赛一等奖', dept:'临床教学部', desc:'连续5年被评为学生最喜爱教师，培养住院医师规范化培训学员120人。', photo:'' },
        { id:'r4', name:'[待补充]', title:'优秀管理工作者', dept:'医务部', desc:'优化门诊流程，患者平均候诊时间缩短40%，满意度提升至98%。', photo:'' }
      ],
      gallery: [
        { icon:'👥', label:'历任院领导集体合影' }, { icon:'👤', label:'首任院长工作照' },
        { icon:'👨‍⚕️', label:'专家群像馆' }, { icon:'🎗', label:'年度优秀员工表彰' },
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
        { id:'d1', name:'[待补充]', title:'神经外科主任 · 省突专家', dept:'神经外科', photo:'', desc:'滇西神经外科领军人物。' },
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
          text:'<h4>地理位置</h4><p>位于大理市核心区域，交通便利，服务人口覆盖大理及周边地区。</p><h4>院区规模</h4><p>编制床位1500张，开放床位XXX张，年门急诊量超80万人次。</p>',
          imgIcon:'🏥', imgLabel:'主院区航拍图', imgSize:'16:9' },
        { id:'b2', num:'02 · 凤仪院区', title:'凤仪院区', subtitle:'跨越发展新引擎',
          text:'<h4>规划定位</h4><p>凤仪院区是医院高质量发展的重要战略布局，承担医疗、教学、科研综合功能。</p>',
          imgIcon:'🏗', imgLabel:'凤仪院区效果图', imgSize:'16:9' }
      ],
      dataCards: [
        { value:'162', label:'总占地面积（亩）', note:'院本部+凤仪院区' },
        { value:'18万', label:'业务用房面积', note:'m²' },
        { value:'1500', label:'编制床位（张）', note:'实际开放2013张' },
        { value:'2', label:'运营院区', note:'院本部+凤仪院区' },
        { value:'41', label:'临床科室', note:'覆盖主要专科领域' }
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
        { value:'21', label:'教研室/实验室', note:'' },
        { value:'5', label:'教学基地', note:'含住培/全科' },
        { value:'800+', label:'年培养学员', note:'各级各类' }
      ],
      gallery: [
        { icon:'🎓', label:'教学活动' }, { icon:'📚', label:'技能培训' },
        { icon:'🏆', label:'教学竞赛' }, { icon:'👨‍🏫', label:'名师风采' }
      ]
    },
    culture: {
      hero: { bgImage:'../assets/images/2_20.png', num:'板块六 · SECTION 06', title:'文化建设', subtitle:'诚信 · 进取 · 和谐 · 奉献', desc:'以文化人，以文润心，构建有温度的人文医院。' },
      blocks: [
        { id:'b1', num:'01 · 灵魂 · 医院精神', title:'医院精神与文化', subtitle:'诚信 · 进取 · 和谐 · 奉献',
          text:'<h4>医院精神</h4><p>"诚信、进取、和谐、奉献"——四字精神凝聚了大附院人的价值追求。</p>',
          imgIcon:'📜', imgLabel:'精神文化展示', imgSize:'16:9' }
      ],
      dataCards: [
        { value:'35', label:'文化积淀（年）', note:'1991至今' }
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
      dataCards: [
        { value:'193', label:'SCI论文（篇）', note:'累计发表国际期刊' },
        { value:'102', label:'专利授权（项）', note:'自主知识产权成果' },
        { value:'8', label:'省研究分中心', note:'省级科研平台集群' },
        { value:'16', label:'国际留学生来源国', note:'' }
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
      dataCards: [
        { value:'157', label:'抗疫驰援医护（名）', note:'驰援武汉/上海/瑞丽' },
        { value:'87', label:'帮扶脱贫（户）', note:'云龙县健康扶贫' },
        { value:'10+', label:'对口支援医院', note:'滇西基层医疗单位' },
        { value:'1', label:'代管机构', note:'省第二传染病医院' }
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
        { value:'50+', label:'省部级荣誉', note:'' },
        { value:'100+', label:'厅局级荣誉', note:'' }
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
      dataCards: [
        { value:'区域', label:'医疗中心建设目标', note:'滇西高水平医疗中心' },
        { value:'9', label:'十四五省级重点专科', note:'在建+新立项' },
        { value:'AI', label:'智能诊断', note:'智慧医院全面深化' },
        { value:'16国', label:'国际合作', note:'南亚东南亚拓展' }
      ],
      timeline: [
        { year:'1991', title:'奠基起步', desc:'大理医学院附属医院获批成立，开启奋斗征程。', dot:'起' },
        { year:'2015', title:'三甲跨越', desc:'获评三级甲等综合医院，跻身高水平医院行列。', dot:'甲' },
        { year:'2020', title:'抗疫担当', desc:'157名医护驰援一线，展现大附院人责任担当。', dot:'战' },
        { year:'未来', title:'愿景展望', desc:'建成滇西区域医疗中心，辐射南亚东南亚。', dot:'梦' }
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
        { icon:'🏛', label:'职代会全景' }, { icon:'🚩', label:'党委会议' },
        { icon:'👥', label:'党支部活动' }, { icon:'🎉', label:'工会文体活动' }
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
        { icon:'👤', label:'党委书记风采' }, { icon:'👤', label:'院长风采' },
        { icon:'👥', label:'领导班子合影' }, { icon:'🏛', label:'院务会议' }
      ]
    },
    index: {
      hero: {
        bgImage:'assets/images/2_20.png',
        title:'大理大学第一附属医院',
        tag:'云南省卫健委直管 · 非省会三甲综合高校附属医院',
        flipItems: ['云南省第四人民医院','三级甲等综合医院','国家临床教学示范中心','滇西区域医疗高地'],
        desc:'1991年始建，坐落于大理市，一院两区运营。编制床位1500张，开放2013张，职工1946人，临床科室41个，集医疗、教学、科研、预防于一体。',
        cta1Text:'探索院史', cta1Link:'pages/01-history.html',
        cta2Text:'查看全部板块'
      },
      sectionCards: [
        { num:'板块一', icon:'📜', title:'历史沿革', sub:'医院发展的时光足迹', desc:'从1991年获批成立到2015年三甲评审，7个关键节点完整记录医院从无到有、从弱到强的发展历程。', link:'pages/01-history.html' },
        { num:'板块二', icon:'👨‍⚕️', title:'人物风采', sub:'医院发展的核心力量', desc:'致敬先驱领导者，礼赞学科带头人，展示1946名职工与803名党员的奋斗风貌与精神风采。', link:'pages/02-people.html' },
        { num:'板块三', icon:'🏥', title:'学科建设', sub:'医院实力的核心体现', desc:'9个省级重点专科、41个临床科室、8个省医学研究分中心，展现滇西领先的综合学科实力矩阵。', link:'pages/03-disciplines.html' },
        { num:'板块四', icon:'🏗', title:'院区建设', sub:'医院空间的拓展与升级', desc:'从初创简陋建筑到现代化医疗综合体，162亩双院区协同运营，业务用房18万平方米的壮阔蜕变。', link:'pages/04-campus.html' },
        { num:'板块五', icon:'🎓', title:'教学与人才', sub:'医院发展的智力支撑', desc:'5个本科专业、977名在读研究生（含22名留学生）、来自全球16个国家的国际化办学生态。', link:'pages/05-education.html' },
        { num:'板块六', icon:'💎', title:'文化建设', sub:'医院发展的精神灵魂', desc:'"诚信进取，和谐奉献"四字精神凝聚全院文化认同；"仁爱厚德，精诚严谨"八字院训指引医者初心。', link:'pages/06-culture.html' },
        { num:'板块七', icon:'🤖', title:'科技与交流', sub:'创新引擎与国际视野', desc:'达芬奇手术机器人、智慧医院、193篇SCI论文、16国留学生，科技赋能与国际合作双轮驱动。', link:'pages/07-tech.html' },
        { num:'板块八', icon:'🚑', title:'责任与担当', sub:'践行使命的生动实践', desc:'157名医护驰援武汉、上海、瑞丽等地；帮扶云龙县87户脱贫；长期对口支援10余家基层医院。', link:'pages/08-duty.html' },
        { num:'板块九', icon:'🏆', title:'荣誉殿堂', sub:'三十四载荣耀征程', desc:'三甲认证、省科技进步奖、102项专利、9个省级重点专科——每一份荣誉都是奋斗的见证。', link:'pages/09-honors.html' },
        { num:'板块十', icon:'🔭', title:'展望未来', sub:'砥砺奋进新征程', desc:'区域医疗中心、精准医疗、AI诊断、国际拓展——四大战略引领高质量发展新篇章。', link:'pages/10-vision.html' },
        { num:'板块十一', icon:'🏛', title:'组织架构', sub:'科学布局 · 高效运转', desc:'党委领导下的院长负责制，41个临床科室、9党总支/55党支部，三级甲等现代医院治理体系。', link:'pages/11-structure.html' },
        { num:'板块十二', icon:'👥', title:'领导团队', sub:'领航定向 · 掌舵前行', desc:'现任院党政领导班子成员介绍，各临床科室负责人风采展示，凝聚全院1946名职工的力量。', link:'pages/12-leadership.html' },
        { num:'板块十三', icon:'📋', title:'职工名录', sub:'每一位职工，都是基石', desc:'铭记全院1946名职工的基本信息与贡献，41个临床科室全覆盖，每一位大附院人都值得被铭记。', link:'pages/13-staff.html' }
      ],
      statsBar: [
        { value:'162', unit:'亩', label:'总占地面积' },
        { value:'1946', unit:'人', label:'全院职工' },
        { value:'1500', unit:'张', label:'编制床位' },
        { value:'11.15', unit:'亿', label:'资产总额' },
        { value:'41', unit:'个', label:'临床科室' }
      ],
      footer: {
        slogan:'诚信 · 进取 · 和谐 · 奉献<br>云南省第四人民医院 · 云端院史馆',
        addr:'<strong>院本部：</strong>云南省大理市嘉士伯大道32号<br><strong>凤仪院区：</strong>大理经开区凤仪镇工业大道西侧、白塔河以东',
        phones:'党政办：0872-2201062 | 门诊部：0872-2201150 | 投诉办：0872-2201309 | 体检中心：0872-2201119 | 医务部：0872-2201168',
        copyright:'© 2025 大理大学第一附属医院（云南省第四人民医院）版权所有 | 云端院史馆 v4.0 | 本网站非官方站点，信息仅供参考'
      },
      gallery: [
        { icon:'📷', label:'1992年奠基典礼<br><small>历史影像</small>', url:'' },
        { icon:'📷', label:'1997年正式开诊<br><small>珍贵历史</small>', url:'' },
        { icon:'📷', label:'2015年三甲评审<br><small>里程碑时刻</small>', url:'' },
        { icon:'📷', label:'2020年抗疫驰援<br><small>逆行英雄</small>', url:'' }
      ]
    },
    staff: {
      hero: { bgImage:'../assets/images/2_20.png', num:'板块十三 · SECTION 13', title:'职工名录', subtitle:'每一位职工，都是医院发展的基石', desc:'1946名在册职工，41个临床科室，来自五湖四海，汇聚于此。铭记每一位大附院人的名字与贡献。' },
      blocks: [
        { id:'b1', num:'01 · 根基 · 职工名录', title:'全院职工名录', subtitle:'铭记每一位为大附院发展贡献力量的人',
          text:'<h4>大理大学第一附属医院职工名录</h4><p>自1991年建院至今，一代代大附院人秉承"诚信、进取、和谐、奉献"的医院精神，在各自的岗位上默默耕耘。</p><p>本名录记录全院职工的姓名、科室、职称、职位等基本信息，旨在铭记每一位职工为医院发展所做出的贡献。</p>',
          imgIcon:'', imgLabel:'', imgSize:'' }
      ],
      profiles: [
        { id:'s1', employeeId:'001', name:'张伟民', title:'主任医师 · 教授', dept:'心血管内科', position:'科室主任', desc:'深耕冠心病介入诊疗30年，主持国自然项目3项，培养硕士研究生18名。' }
      ],
      dataCards: [
        { value:'1946', label:'全院职工', note:'含编内编外' },
        { value:'1638', label:'卫技人员', note:'占比 84.2%' },
        { value:'29', label:'博士', note:'含在读' },
        { value:'360', label:'硕士', note:'含在读' },
        { value:'294', label:'高级职称', note:'正高+副高' },
        { value:'41', label:'临床科室', note:'覆盖主要专科' }
      ],
      gallery: [
        { icon:'👥', label:'全院职工合影' }, { icon:'🏥', label:'临床科室查房' },
        { icon:'🎓', label:'教学带教日常' }, { icon:'🎗', label:'护士节表彰' },
        { icon:'🤝', label:'多学科会诊MDT' }, { icon:'🔬', label:'科研团队实验室' },
        { icon:'🏆', label:'年度表彰先进职工' }, { icon:'📸', label:'医院文化活动' }
      ]
    }
  };
}

// ====== 通用工具 ======
function escHtml(s) { if (!s) return ''; return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function pad2(n) { return n<10?'0'+n:''+n; }
function getContent() {
  var raw = localStorage.getItem('hm_content');
  if (!raw) { console.log('[Admin getContent] hm_content 不存在'); return {}; }
  var obj = JSON.parse(raw);
  var sc = obj && obj.staff && Array.isArray(obj.staff.profiles) ? obj.staff.profiles.length : 0;
  console.log('[Admin getContent] 读取 hm_content，sections=' + Object.keys(obj).length + '，staff.profiles=' + sc + '条');
  return obj;
}
function saveContent(data) {
  try {
    var json = JSON.stringify(data);
    localStorage.setItem('hm_content', json);
    localStorage.setItem('hm_last_edit', Date.now().toString());
    var sc = data && data.staff && Array.isArray(data.staff.profiles) ? data.staff.profiles.length : 0;
    console.log('[Admin saveContent] 已保存 hm_content，大小=' + (json.length/1024).toFixed(1) + 'KB，staff.profiles=' + sc + '条');
    return true;
  }
  catch(e) { if (typeof showToast === 'function') showToast('保存失败：存储空间不足，请清理浏览器缓存', 'danger'); console.error('[Admin saveContent] 失败:', e); return false; }
}
function safeSetItem(key, val) {
  try { localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val)); return true; }
  catch(e) { if (typeof showToast === 'function') showToast('存储失败：' + key, 'danger'); return false; }
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
    case 'data-manager': html=renderDataManager(); break;
    case 'settings': html=renderSettings(); break;
    default: html=currentSection ? renderSectionEditor(currentSection) : renderDashboard();
  }

  var titleMap={dashboard:'控制台',announcements:'公告管理',settings:'网站设置','data-manager':'数据管理'};
  var pageTitle=titleMap[pageId]||(currentSection?currentSection.name:'控制台');
  $('#page-title').text(pageTitle);

  var bc='<li class="breadcrumb-item"><a href="#" data-nav="dashboard">控制台</a></li>';
  if(pageId!=='dashboard') bc+='<li class="breadcrumb-item active">'+pageTitle+'</li>';
  else bc='<li class="breadcrumb-item active">控制台</li>';
  $('#breadcrumb').html(bc);
  $('#main-content').html(html);
  $('#breadcrumb a[data-nav]').click(function(e){ e.preventDefault(); navigateTo($(this).data('nav')); });

  // 更新侧边栏状态徽章
  updateSidebarBadges();

  // 职工名录：初始化分页列表
  if (pageId === 'staff') {
    setTimeout(function() { initStaffAdmin(); }, 50);
  }
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
    ['leaders','profiles','profiles2','roleModels','statsCards','timeline','blocks','gallery','dataCards'].forEach(function(t){
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
    ['leaders','profiles','profiles2','roleModels','statsCards','timeline','blocks','gallery','dataCards'].forEach(function(t){
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

// ====== 首页专属编辑器 ======
function renderIndexEditor(content) {
  var hero = content.hero || {};
  var cards = content.sectionCards || [];
  var footer = content.footer || {};
  var h = '';

  // Hero 编辑区
  h += '<div class="content-section"><h5 class="content-section-title"><i class="fas fa-image text-info mr-2"></i>首页 Hero（轮播+描述）</h5>';
  h += '<div class="form-row"><div class="col-md-6"><label>背景图</label><input class="form-control form-control-sm hero-bg" value="' + escHtml(hero.bgImage || '') + '"></div>';
  h += '<div class="col-md-6"><label>医院名称</label><input class="form-control form-control-sm hero-index-title" value="' + escHtml(hero.title || '') + '"></div></div>';
  h += '<div class="form-row mt-2"><div class="col-md-6"><label>标签</label><input class="form-control form-control-sm hero-index-tag" value="' + escHtml(hero.tag || '') + '"></div>';
  h += '<div class="col-md-6"><label>描述</label><textarea class="form-control" rows="4" style="width:100%">' + (hero.desc || '') + '</textarea></div></div>';
  h += '<div class="form-row mt-2"><div class="col-md-3"><label>按钮1文字</label><input class="form-control form-control-sm hero-index-cta1-text" value="' + escHtml(hero.cta1Text || '') + '"></div>';
  h += '<div class="col-md-3"><label>按钮1链接</label><input class="form-control form-control-sm hero-index-cta1-link" value="' + escHtml(hero.cta1Link || '') + '"></div>';
  h += '<div class="col-md-3"><label>按钮2文字</label><input class="form-control form-control-sm hero-index-cta2-text" value="' + escHtml(hero.cta2Text || '') + '"></div></div>';

  // Flip 轮播词
  var flips = hero.flipItems || [];
  h += '<label class="mt-2 mb-1"><strong>轮播关键词</strong> <button class="btn btn-xs btn-outline-success ml-2 btn-add-flip"><i class="fas fa-plus"></i> 新增</button></label>';
  h += '<div id="flip-items-container">';
  flips.forEach(function(f, i) {
    h += '<div class="input-group input-group-sm mb-1 flip-item">';
    h += '<input class="form-control flip-item-val" value="' + escHtml(f) + '" placeholder="例如: 三级甲等综合医院">';
    h += '<div class="input-group-append"><button class="btn btn-outline-danger btn-del-flip" data-idx="' + i + '"><i class="fas fa-trash"></i></button></div>';
    h += '</div>';
  });
  h += '</div>';
  h += '</div>'; // content-section

  // Section Cards 编辑区（13个板块卡片）
  h += '<div class="content-section"><h5 class="content-section-title"><i class="fas fa-th-large text-primary mr-2"></i>板块导航卡片（13张）</h5>';
  h += '<div class="table-responsive"><table class="table table-sm table-bordered table-striped"><thead><tr>';
  h += '<th width="60">编号</th><th width="40">图标</th><th width="80">标题</th><th width="90">副标题</th><th>描述</th><th width="120">链接</th></tr></thead><tbody>';
  cards.forEach(function(c, i) {
    h += '<tr class="index-card-row">';
    h += '<td><input class="form-control form-control-sm ic-num" value="' + escHtml(c.num || '') + '" style="width:70px"></td>';
    h += '<td><input class="form-control form-control-sm ic-icon" value="' + escHtml(c.icon || '') + '" style="width:50px"></td>';
    h += '<td><input class="form-control form-control-sm ic-title" value="' + escHtml(c.title || '') + '"></td>';
    h += '<td><input class="form-control form-control-sm ic-sub" value="' + escHtml(c.sub || '') + '"></td>';
    h += '<td><input class="form-control form-control-sm ic-desc" value="' + escHtml(c.desc || '') + '"></td>';
    h += '<td><input class="form-control form-control-sm ic-link" value="' + escHtml(c.link || '') + '"></td>';
    h += '</tr>';
  });
  h += '</tbody></table></div></div>'; // content-section

  // Stats-bar 编辑区
  var statsBar = content.statsBar || [];
  h += '<div class="content-section"><h5 class="content-section-title"><i class="fas fa-chart-bar text-success mr-2"></i>首页统计条</h5>';
  h += '<div class="table-responsive"><table class="table table-sm table-bordered"><thead><tr><th>数值</th><th>单位</th><th>标签</th></tr></thead><tbody>';
  statsBar.forEach(function(s, i) {
    h += '<tr class="idx-stat-row"><td><input class="form-control form-control-sm is-val" value="' + escHtml(s.value || '') + '" style="width:100px"></td>';
    h += '<td><input class="form-control form-control-sm is-unit" value="' + escHtml(s.unit || '') + '" style="width:80px"></td>';
    h += '<td><input class="form-control form-control-sm is-label" value="' + escHtml(s.label || '') + '"></td></tr>';
  });
  h += '</tbody></table></div></div>'; // content-section

  // Footer 编辑区
  h += '<div class="content-section"><h5 class="content-section-title"><i class="fas fa-window-maximize text-secondary mr-2"></i>页脚 Footer</h5>';
  h += '<div class="form-row"><div class="col-md-6"><label>Slogan (支持&lt;br&gt;)</label><textarea class="form-control form-control-sm idx-footer-slogan" rows="2">' + escHtml(footer.slogan || '') + '</textarea></div>';
  h += '<div class="col-md-6"><label>地址 (支持HTML)</label><textarea class="form-control form-control-sm idx-footer-addr" rows="2">' + escHtml(footer.addr || '') + '</textarea></div></div>';
  h += '<div class="form-row mt-2"><div class="col-md-6"><label>联系电话 (" | " 分隔)</label><input class="form-control form-control-sm idx-footer-phones" value="' + escHtml(footer.phones || '') + '"></div>';
  h += '<div class="col-md-6"><label>版权信息</label><input class="form-control form-control-sm idx-footer-copyright" value="' + escHtml(footer.copyright || '') + '"></div></div>';
  h += '</div>';

  // Gallery 编辑区
  var gallery = content.gallery || [];
  h += '<div class="content-section"><h5 class="content-section-title"><i class="fas fa-images text-purple mr-2"></i>首页画廊';
  h += ' <button class="btn btn-xs btn-outline-success ml-2 btn-add-idx-gallery"><i class="fas fa-plus"></i> 新增</button></h5>';
  h += '<div id="idx-gallery-container">';
  gallery.forEach(function(g, i) {
    h += '<div class="idx-gallery-item border rounded p-2 mb-2">';
    h += '<div class="form-row"><div class="col-md-1"><label>图标</label><input class="form-control form-control-sm ig-icon" value="' + escHtml(g.icon || '') + '" style="font-size:18px"></div>';
    h += '<div class="col-md-4"><label>标签 (支持&lt;br&gt;)</label><input class="form-control form-control-sm ig-label" value="' + escHtml(g.label || '') + '"></div>';
    h += '<div class="col-md-5"><label>图片URL</label><input class="form-control form-control-sm ig-url" value="' + escHtml(g.url || '') + '" placeholder="https://... 或 ../assets/images/xxx.jpg"></div>';
    h += '<div class="col-md-2"><label>&nbsp;</label><button class="btn btn-outline-danger btn-sm btn-del-idx-gallery"><i class="fas fa-trash"></i> 删除</button></div></div>';
    h += '</div>';
  });
  h += '</div></div>';

  return h;
}

// ====== 板块内容编辑器（核心） ======
function renderSectionEditor(sec) {
  var sd=JSON.parse(localStorage.getItem('hm_admin_sections')||'{}');
  var data=sd[sec.id]||{title:sec.name,status:'draft',updatedAt:'',notes:''};
  var allContent=getContent();
  var content=allContent[sec.id]||{};

  // ---- 自动补全缺失字段（兼容旧数据）----
  var seed=seedContent()[sec.id]||{};
  var needSave=false;
  ['gallery','dataCards','statsCards','blocks','profiles','profiles2','roleModels','leaders','leadership','timeline'].forEach(function(field){
    if(sec.types.indexOf(field.replace('Card',''))<0 &&
       sec.types.indexOf('dataCard')<0 && field==='dataCards') return; // 跳过不在types中的field
    if(field==='statsCards' && sec.types.indexOf('dataCard')<0) return;
    // gallery 和 dataCards 需根据 types 判断
    if(field==='gallery' && sec.types.indexOf('gallery')<0) return;
    if(field==='dataCards' && sec.types.indexOf('dataCard')<0) return;
    if(field==='roleModels' && sec.types.indexOf('roleModel')<0) return;
    if(!Array.isArray(content[field]) && Array.isArray(seed[field])) {
      content[field]=seed[field];
      needSave=true;
    }
  });
  // party 对象补全
  if(sec.types.indexOf('party')>=0 && typeof seed.party === 'object') {
    if(!content.party || typeof content.party !== 'object') {
      content.party = JSON.parse(JSON.stringify(seed.party));
      needSave = true;
    }
  }
  if(needSave) {
    allContent[sec.id]=content;
    saveContent(allContent);
  }

  var html='<div class="container-fluid">';

  // 顶部：板块基础信息
  html+='<div class="row"><div class="col-md-8"><div class="card card-primary card-outline"><div class="card-header"><h3 class="card-title"><i class="'+sec.icon+'" style="color:'+sec.color+'"></i> '+sec.name+' — 内容管理</h3>';
  html+='<div class="card-tools"><button class="btn btn-sm btn-accent btn-save-content" data-section="'+sec.id+'"><i class="fas fa-save mr-1"></i>保存全部</button></div>';
  html+='</div><div class="card-body" id="section-editor-body">';

  // ====== index 首页专属编辑器 ======
  if (sec.id === 'index') {
    html += renderIndexEditor(content);
    html += '</div></div></div></div>'; // close card-body, card, col, row
    return html;
  }

  // ---- Hero 编辑区 ----
  if (sec.types.indexOf('hero')>=0) {
    var hero=content.hero||{};
    html+='<div class="content-section"><h5 class="content-section-title"><i class="fas fa-image text-info mr-2"></i>页面头部 Hero</h5>';
    html+='<div class="form-row"><div class="col-md-6"><label>背景图片URL</label><input class="form-control form-control-sm hero-bg" data-key="bgImage" value="'+escHtml(hero.bgImage||'')+'"></div>';
    html+='<div class="col-md-6"><label>板块编号</label><input class="form-control form-control-sm hero-num" data-key="num" value="'+escHtml(hero.num||'')+'"></div></div>';
    html+='<div class="form-row mt-2"><div class="col-md-6"><label>标题</label><input class="form-control form-control-sm hero-title" data-key="title" value="'+escHtml(hero.title||'')+'"></div>';
    html+='<div class="col-md-6"><label>副标题</label><input class="form-control form-control-sm hero-subtitle" data-key="subtitle" value="'+escHtml(hero.subtitle||'')+'"></div></div>';
    html+='<div class="form-row mt-2"><div class="col-12"><label>描述</label><textarea class="form-control" rows="4" style="width:100%">'+(hero.desc||'')+'</textarea></div></div>';
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

  // ---- Leaders 编辑区 (02-people院长/书记) ----
  if (sec.types.indexOf('leader')>=0 && Array.isArray(content.leaders)) {
    html+='<div class="content-section" id="leaders-section"><h5 class="content-section-title"><i class="fas fa-user-tie text-warning mr-2"></i>历任院领导';
    html+=' <button class="btn btn-xs btn-outline-success ml-2 btn-add-leader" data-section="'+sec.id+'"><i class="fas fa-plus"></i> 新增</button></h5>';
    content.leaders.forEach(function(l,i){
      html+='<div class="leader-item-editor border rounded p-2 mb-2">';
      html+='<div class="form-row"><div class="col-md-3"><label>姓名</label><input class="form-control form-control-sm ld-name" value="'+escHtml(l.name||'')+'"></div>';
      html+='<div class="col-md-3"><label>职位</label><input class="form-control form-control-sm ld-position" value="'+escHtml(l.position||l.category||'')+'" placeholder="院长 / 党委书记 / 副院长…"></div>';
      html+='<div class="col-md-2"><label>任期</label><input class="form-control form-control-sm ld-years" value="'+escHtml(l.years||'')+'"></div>';
      html+='<div class="col-md-2"><label>治院标签</label><input class="form-control form-control-sm ld-era" value="'+escHtml(l.era||'')+'"></div>';
      html+='<div class="col-md-2"><label>简介</label><div class="input-group input-group-sm"><input class="form-control ld-desc" value="'+escHtml(l.desc||'')+'"><div class="input-group-append"><button class="btn btn-outline-danger btn-del-leader" data-gidx="'+i+'"><i class="fas fa-trash"></i></button></div></div></div></div>';
      html+='<div class="form-row mt-1"><div class="col-12"><label><i class="fas fa-portrait text-warning mr-1"></i>照片URL <small class="text-muted">(留空则显示姓名首字占位)</small></label>';
      html+='<input class="form-control form-control-sm ld-photo" value="'+escHtml(l.photo||'')+'" placeholder="https://... 或 ../assets/images/xxx.jpg"></div></div>';
      html+='</div>';
    });
    html+='</div>';
  }

  // ---- Profiles 编辑区（专家群像/医学人才） ----
  if (sec.types.indexOf('profile')>=0) {
    // profiles (p1)
    // 职工名录：始终渲染（即使 profiles 为空），靠 initStaffAdmin() 填充表格
    if (sec.id === 'staff') {
      html+='<div class="content-section"><h5 class="content-section-title"><i class="fas fa-address-book mr-2" style="color:#0288d1"></i>职工名录';
      html+=' <button class="btn btn-xs btn-outline-info ml-1" id="btn-staff-batch-import"><i class="fas fa-file-import"></i> 文本导入</button>';
      html+=' <button class="btn btn-xs btn-outline-primary ml-1" id="btn-staff-csv-import"><i class="fas fa-file-csv"></i> CSV导入</button>';
      html+=' <input type="file" id="staffCsvFileInput" accept=".csv" style="display:none">';
      html+=' <span class="float-right"><input class="form-control form-control-sm" id="staffAdminSearch" placeholder="🔍 搜索姓名/科室/职称…" style="width:240px;display:inline-block"></span>';
      html+='</h5>';
      html+='<div id="staffAdminContainer"></div></div>';
    } else if (Array.isArray(content.profiles) && content.profiles.length>0) {
      html+='<div class="content-section"><h5 class="content-section-title"><i class="fas fa-user-md text-orange mr-2"></i>人物简介（第一组）';
      html+=' <button class="btn btn-xs btn-outline-success ml-2 btn-add-profile" data-section="'+sec.id+'" data-group="profiles"><i class="fas fa-plus"></i> 新增</button>';
      html+='</h5>';
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

  // ---- StatsCards 编辑区（people: 专家群像数据卡片） ----
  if (sec.types.indexOf('dataCard')>=0 && sec.id==='people' && Array.isArray(content.statsCards)) {
    html+='<div class="content-section"><h5 class="content-section-title"><i class="fas fa-chart-pie text-info mr-2"></i>专家群像数据卡片';
    html+=' <button class="btn btn-xs btn-outline-success ml-2 btn-add-statscard" data-section="'+sec.id+'"><i class="fas fa-plus"></i> 新增</button></h5>';
    content.statsCards.forEach(function(d,i){
      html+='<div class="form-row statscard-row"><div class="col-md-2"><label>数值</label><input class="form-control form-control-sm sc-value" value="'+escHtml(d.value||'')+'"></div>';
      html+='<div class="col-md-4"><label>标签</label><input class="form-control form-control-sm sc-label" value="'+escHtml(d.label||'')+'"></div>';
      html+='<div class="col-md-2"><label>&nbsp;</label><button class="btn btn-sm btn-outline-danger btn-block btn-del-statscard" data-idx="'+i+'"><i class="fas fa-trash"></i></button></div></div>';
    });
    html+='</div>';
  }

  // ---- Party 党建力量编辑区 ----
  if (sec.types.indexOf('party')>=0 && sec.id==='people') {
    var party = content.party || seedContent().people.party || {};
    html+='<div class="content-section"><h5 class="content-section-title"><i class="fas fa-flag text-danger mr-2"></i>党建力量 · 先锋模范</h5>';
    html+='<div class="form-row"><div class="col-md-2"><label>党总支数</label><input class="form-control form-control-sm py-branches" value="'+escHtml(party.branches||'')+'"></div>';
    html+='<div class="col-md-2"><label>党支部数</label><input class="form-control form-control-sm py-subBranches" value="'+escHtml(party.subBranches||'')+'"></div>';
    html+='<div class="col-md-2"><label>党员总数</label><input class="form-control form-control-sm py-members" value="'+escHtml(party.members||'')+'"></div>';
    html+='<div class="col-md-2"><label>教工党员</label><input class="form-control form-control-sm py-staffMembers" value="'+escHtml(party.staffMembers||'')+'"></div>';
    html+='<div class="col-md-2"><label>研究生党员</label><input class="form-control form-control-sm py-gradMembers" value="'+escHtml(party.gradMembers||'')+'"></div></div>';
    html+='<div class="form-row mt-2"><div class="col-md-6"><label>正文标题1</label><input class="form-control form-control-sm py-textTitle" value="'+escHtml(party.textTitle||'')+'"></div>';
    html+='<div class="col-md-6"><label>正文标题2</label><input class="form-control form-control-sm py-textTitle2" value="'+escHtml(party.textTitle2||'')+'"></div></div>';
    html+='<div class="form-row mt-2"><div class="col-md-6"><label>正文内容1</label><textarea class="form-control form-control-sm py-text" rows="3">'+(party.text||'')+'</textarea></div>';
    html+='<div class="col-md-6"><label>正文内容2</label><textarea class="form-control form-control-sm py-text2" rows="3">'+(party.text2||'')+'</textarea></div></div>';
    html+='<div class="form-row mt-2"><div class="col-md-2"><label>配图图标</label><input class="form-control form-control-sm py-imgIcon" value="'+escHtml(party.imgIcon||'')+'"></div>';
    html+='<div class="col-md-5"><label>配图标签</label><input class="form-control form-control-sm py-imgLabel" value="'+escHtml(party.imgLabel||'')+'"></div>';
    html+='<div class="col-md-3"><label>配图尺寸</label><input class="form-control form-control-sm py-imgSize" value="'+escHtml(party.imgSize||'')+'"></div></div>';
    html+='</div>';
  }

  // ---- RoleModels 榜样的力量编辑区 ----
  if (sec.types.indexOf('roleModel')>=0 && sec.id==='people' && Array.isArray(content.roleModels)) {
    html+='<div class="content-section"><h5 class="content-section-title"><i class="fas fa-star text-warning mr-2"></i>榜样的力量 · 优秀员工';
    html+=' <button class="btn btn-xs btn-outline-success ml-2 btn-add-rolemodel" data-section="'+sec.id+'"><i class="fas fa-plus"></i> 新增</button></h5>';
    content.roleModels.forEach(function(r,i){
      html+='<div class="rolemodel-item-editor border rounded p-2 mb-2">';
      html+='<div class="form-row"><div class="col-md-3"><label>姓名</label><input class="form-control form-control-sm rm-name" value="'+escHtml(r.name||'')+'"></div>';
      html+='<div class="col-md-3"><label>荣誉/头衔</label><input class="form-control form-control-sm rm-title" value="'+escHtml(r.title||'')+'"></div>';
      html+='<div class="col-md-2"><label>科室</label><input class="form-control form-control-sm rm-dept" value="'+escHtml(r.dept||'')+'"></div>';
      html+='<div class="col-md-2"><label>简介</label><div class="input-group input-group-sm"><input class="form-control rm-desc" value="'+escHtml(r.desc||'')+'"><div class="input-group-append"><button class="btn btn-outline-danger btn-del-rolemodel" data-idx="'+i+'"><i class="fas fa-trash"></i></button></div></div></div></div>';
      html+='<div class="form-row mt-1"><div class="col-12"><label><i class="fas fa-portrait text-warning mr-1"></i>照片URL <small class="text-muted">(留空则显示姓名首字占位)</small></label>';
      html+='<input class="form-control form-control-sm rm-photo" value="'+escHtml(r.photo||'')+'" placeholder="https://... 或 ../assets/images/xxx.jpg"></div></div>';
      html+='</div>';
    });
    html+='</div>';
  }
  if (sec.types.indexOf('leadership')>=0 && Array.isArray(content.leaders)) {
    html+='<div class="content-section"><h5 class="content-section-title"><i class="fas fa-crown text-danger mr-2"></i>领导班子成员';
    html+=' <button class="btn btn-xs btn-outline-success ml-2 btn-add-leadership" data-section="'+sec.id+'"><i class="fas fa-plus"></i> 新增</button></h5>';
    content.leaders.forEach(function(l,i){
      html+='<div class="leadership-item-editor">';
      html+='<div class="form-row"><div class="col-md-3"><label>姓名</label><input class="form-control form-control-sm lsh-name" value="'+escHtml(l.name||'')+'"></div>';
      html+='<div class="col-md-3"><label>职务</label><input class="form-control form-control-sm lsh-role" value="'+escHtml(l.role||'')+'"></div>';
      html+='<div class="col-md-6"><label>职责</label><input class="form-control form-control-sm lsh-duty" value="'+escHtml(l.duty||'')+'"></div></div>';
      html+='<div class="form-row mt-1"><div class="col-md-10"><label>简历</label><textarea class="form-control form-control-sm" rows="4" style="width:100%">'+(l.resume||'')+'</textarea></div>';
      html+='<div class="col-md-2 d-flex flex-column justify-content-end"><button class="btn btn-outline-danger btn-sm btn-del-leadership" data-idx="'+i+'"><i class="fas fa-trash"></i></button></div></div>';
      html+='<div class="form-row mt-1"><div class="col-12"><label><i class="fas fa-portrait text-warning mr-1"></i>照片URL <small class="text-muted">(留空则显示姓名首字占位)</small></label>';
      html+='<input class="form-control form-control-sm lsh-photo" value="'+escHtml(l.photo||'')+'" placeholder="https://... 或 ../assets/images/xxx.jpg"></div></div>';
      html+='</div>';
    });
    html+='</div>';
  }

  // ---- Data Cards 编辑区 ----
  if (sec.types.indexOf('dataCard')>=0 && Array.isArray(content.dataCards)) {
    html+='<div class="content-section"><h5 class="content-section-title"><i class="fas fa-chart-bar text-success mr-2"></i>数据卡片';
    html+=' <button class="btn btn-xs btn-outline-success ml-2 btn-add-datacard" data-section="'+sec.id+'"><i class="fas fa-plus"></i> 新增</button></h5>';
    content.dataCards.forEach(function(d,i){
      html+='<div class="form-row datacard-row"><div class="col-md-2"><label>数值</label><input class="form-control form-control-sm dc-value" value="'+escHtml(d.value||'')+'"></div>';
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
    html+='<small class="text-muted d-block mb-2"><i class="fas fa-info-circle mr-1"></i>填写图片/资料URL后，前台画廊将显示真实图片并支持点击放大。留空则显示占位Emoji图标。</small>';
    content.gallery.forEach(function(g,i){
      html+='<div class="gallery-row border rounded p-2 mb-2">';
      html+='<div class="form-row align-items-end"><div class="col-md-1"><label>图标</label><input class="form-control form-control-sm ga-icon" value="'+escHtml(g.icon||'')+'" maxlength="4" placeholder="📷"></div>';
      html+='<div class="col-md-10"><label>标签/说明</label><input class="form-control form-control-sm ga-label" value="'+escHtml(g.label||'')+'" placeholder="图片说明文字"></div>';
      html+='<div class="col-md-1 d-flex align-items-end"><button class="btn btn-sm btn-outline-danger btn-block btn-del-gallery" data-idx="'+i+'"><i class="fas fa-trash"></i></button></div></div>';
      html+='<div class="form-row mt-1"><div class="col-12"><label><i class="fas fa-link mr-1 text-primary"></i>图片或资料URL <small class="text-muted">(可填图片URL或文件链接，留空则显示占位Emoji图标)</small></label>';
      html+='<div class="input-group input-group-sm">';
      html+='<div class="input-group-prepend"><span class="input-group-text"><i class="fas fa-image"></i></span></div>';
      html+='<input class="form-control ga-url" value="'+escHtml(g.url||'')+'" placeholder="https://... 或 ../assets/images/xxx.jpg">';
      html+='</div></div></div>';
      // 预览缩略图（如有URL）
      if(g.url) {
        html+='<div class="mt-1"><small class="text-muted">预览：</small> <img src="'+escHtml(g.url)+'" style="max-height:60px;max-width:120px;border-radius:4px;object-fit:cover;" onerror="this.style.display=\'none\'"></div>';
      }
      html+='</div>';
    });
    html+='</div>';
  }

  html+='</div></div></div>'; // card+col

  // 侧边信息
  html+='<div class="col-md-4"><div class="card card-accent card-outline"><div class="card-header"><h3 class="card-title">页面信息</h3></div>';
  html+='<div class="card-body"><p><strong>前台页面：</strong><br><code>pages/'+sec.page+'</code></p>';
  html+='<p><strong>状态：</strong><br><span id="info-status" class="status-badge '+(data.status==='published'?'status-published':(data.status==='review'?'status-review':'status-draft'))+'">'+(data.status==='published'?'已发布・前台可见':(data.status==='review'?'审核中・内部预览':'草稿・前台隐藏'))+'</span></p>';
  html+='<p><strong>快速切换：</strong><br>';
  html+='<button class="btn-workflow-action act-publish btn-set-status" data-section="'+sec.id+'" data-status="published"><i class="fas fa-check mr-1"></i>发布</button>';
  html+='<button class="btn-workflow-action act-review btn-set-status" data-section="'+sec.id+'" data-status="review"><i class="fas fa-clock mr-1"></i>审核中</button>';
  html+='<button class="btn-workflow-action act-draft btn-set-status" data-section="'+sec.id+'" data-status="draft"><i class="fas fa-pencil-alt mr-1"></i>退回</button>';
  html+='</p>';
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
  h+='<div class="form-row mt-1"><div class="col-12"><label>正文</label><textarea class="form-control" rows="6" style="width:100%">'+(b.text||'')+'</textarea></div></div>';
  h+='<div class="form-row mt-1"><div class="col-md-2"><label>图片Emoji</label><input class="form-control form-control-sm bl-imgIcon" value="'+escHtml(b.imgIcon||'')+'"></div>';
  h+='<div class="col-md-7"><label>图片描述</label><input class="form-control form-control-sm bl-imgLabel" value="'+escHtml(b.imgLabel||'')+'"></div>';
  h+='<div class="col-md-3"><label>尺寸比例</label><input class="form-control form-control-sm bl-imgSize" value="'+escHtml(b.imgSize||'')+'"></div></div>';
  h+='<div class="form-row mt-1"><div class="col-12"><label><i class="fas fa-link text-primary mr-1"></i>图片URL <small class="text-muted">(填入后前台将显示真实图片，留空则显示占位图标)</small> <button class="btn-img-picker ml-2" onclick="openMediaPickerFor(this)" data-target=".bl-imgUrl"><i class="fas fa-image mr-1"></i>从媒体库选择</button></label>';
  h+='<input class="form-control form-control-sm bl-imgUrl" value="'+escHtml(b.imgUrl||'')+'" placeholder="https://... 或 ../assets/images/xxx.jpg" style="word-break:break-all;"></div></div>';
  h+='</div>';
  return h;
}

// Profile行组件
function renderProfileRow(group,p,i){
  var h='<div class="profile-row-editor">';
  h+='<div class="form-row"><div class="col-md-3"><label>姓名</label><input class="form-control form-control-sm pr-name" data-group="'+group+'" value="'+escHtml(p.name||'')+'"></div>';
  h+='<div class="col-md-3"><label>职称/称号</label><input class="form-control form-control-sm pr-title" value="'+escHtml(p.title||'')+'"></div>';
  h+='<div class="col-md-6"><label>科室</label><input class="form-control form-control-sm pr-dept" value="'+escHtml(p.dept||'')+'"></div></div>';
  h+='<div class="form-row mt-1"><div class="col-md-6"><label>职位 <small class="text-muted">(如：科室主任、护理部主任)</small></label><input class="form-control form-control-sm pr-position" value="'+escHtml(p.position||'')+'" placeholder="科主任 / 护士长 / 组长 …"></div>';
  h+='<div class="col-md-6"><label>简介/贡献</label><div class="input-group input-group-sm"><input class="form-control pr-desc" value="'+escHtml(p.desc||'')+'" placeholder="简述该职工的贡献…"><div class="input-group-append"><button class="btn btn-outline-danger btn-del-profile" data-group="'+group+'" data-idx="'+i+'"><i class="fas fa-trash"></i></button></div></div></div></div>';
  h+='<div class="form-row mt-1"><div class="col-12"><label><i class="fas fa-portrait text-warning mr-1"></i>照片URL <small class="text-muted">(留空则显示姓名首字占位)</small></label>';
  h+='<input class="form-control form-control-sm pr-photo" value="'+escHtml(p.photo||'')+'" placeholder="https://... 或 ../assets/images/xxx.jpg"></div></div>';
  h+='</div>';
  return h;
}
// ====== 首页保存逻辑 ======
function saveIndexContent() {
  var content = getContent();
  if (!content.index) content.index = {};

  // Hero
  content.index.hero = {
    bgImage: $('#section-editor-body .hero-bg').val() || '',
    title: $('#section-editor-body .hero-index-title').val() || '',
    tag: $('#section-editor-body .hero-index-tag').val() || '',
    desc: $('#section-editor-body textarea').first().val() || '',
    flipItems: [],
    cta1Text: $('#section-editor-body .hero-index-cta1-text').val() || '',
    cta1Link: $('#section-editor-body .hero-index-cta1-link').val() || '',
    cta2Text: $('#section-editor-body .hero-index-cta2-text').val() || ''
  };
  $('#flip-items-container .flip-item-val').each(function() {
    var v = $(this).val().trim();
    if (v) content.index.hero.flipItems.push(v);
  });

  // Section Cards
  content.index.sectionCards = [];
  $('#section-editor-body .index-card-row').each(function() {
    content.index.sectionCards.push({
      num: $(this).find('.ic-num').val() || '',
      icon: $(this).find('.ic-icon').val() || '',
      title: $(this).find('.ic-title').val() || '',
      sub: $(this).find('.ic-sub').val() || '',
      desc: $(this).find('.ic-desc').val() || '',
      link: $(this).find('.ic-link').val() || ''
    });
  });

  // Footer
  content.index.footer = {
    slogan: $('#section-editor-body .idx-footer-slogan').val() || '',
    addr: $('#section-editor-body .idx-footer-addr').val() || '',
    phones: $('#section-editor-body .idx-footer-phones').val() || '',
    copyright: $('#section-editor-body .idx-footer-copyright').val() || ''
  };

  // Stats-bar
  content.index.statsBar = [];
  $('#section-editor-body .idx-stat-row').each(function() {
    var v = $(this).find('.is-val').val();
    if (v) content.index.statsBar.push({
      value: v,
      unit: $(this).find('.is-unit').val() || '',
      label: $(this).find('.is-label').val() || ''
    });
  });

  // Gallery
  content.index.gallery = [];
  $('#idx-gallery-container .idx-gallery-item').each(function() {
    content.index.gallery.push({
      icon: $(this).find('.ig-icon').val() || '',
      label: $(this).find('.ig-label').val() || '',
      url: $(this).find('.ig-url').val() || ''
    });
  });

  saveContent(content);
  $(document).Toasts('create', { class:'bg-success', title:'保存成功', body:'首页内容已更新，刷新前台即可查看', autohide:true, delay:3000 });
}

// ====== 保存全部内容 ======
function saveSectionContent(secId) {
  // index 首页专属保存逻辑
  if (secId === 'index') {
    saveIndexContent();
    return;
  }

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
      desc: $('#section-editor-body textarea').first().val()||''
    };
  }

  // Blocks
  if(sec.types.indexOf('block')>=0) {
    content[secId].blocks=[];
    $('#section-editor-body .block-item-editor').each(function(idx){
      var textValue = $(this).find('textarea').val() || '';
      content[secId].blocks.push({
        num: $(this).find('.bl-num').val()||'',
        title: $(this).find('.bl-title').val()||'',
        subtitle: $(this).find('.bl-subtitle').val()||'',
        text: textValue,
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

  // Leaders (院长/书记)
  if(sec.types.indexOf('leader')>=0) {
    content[secId].leaders=[];
    var allLeaderEditors=$('#section-editor-body .leader-item-editor');
    allLeaderEditors.each(function(i){
      content[secId].leaders.push({
        id: 'l'+Date.now()+i,
        position: $(this).find('.ld-position').val()||'',
        category: $(this).find('.ld-position').val()||'',  // 兼容旧字段
        name: $(this).find('.ld-name').val()||'',
        years: $(this).find('.ld-years').val()||'',
        era: $(this).find('.ld-era').val()||'',
        eraColor: '',
        desc: $(this).find('.ld-desc').val()||'',
        photo: $(this).find('.ld-photo').val()||''
      });
    });
  }

  // Profiles
  ['profiles','profiles2'].forEach(function(group){
    if(sec.types.indexOf('profile')>=0 && Array.isArray(content[secId][group])) {
      // 职工名录：数据已在内存中维护，跳过DOM读取
      if (secId === 'staff' && group === 'profiles') return;
      content[secId][group]=[];
      $('#section-editor-body .profile-row-editor').each(function(){
        var grp=$(this).find('.pr-name').data('group');
        if(grp!==group) return;
        content[secId][group].push({
          id: 'p'+Date.now()+Math.random(),
          name: $(this).find('.pr-name').val()||'',
          title: $(this).find('.pr-title').val()||'',
          dept: $(this).find('.pr-dept').val()||'',
          position: $(this).find('.pr-position').val()||'',
          desc: $(this).find('.pr-desc').val()||'',
          photo: $(this).find('.pr-photo').val()||''
        });
      });
      if(content[secId][group].length===0) delete content[secId][group];
    }
  });

  // Leadership (12-领导团队)
  if(sec.types.indexOf('leadership')>=0) {
    content[secId].leaders=[];
    $('#section-editor-body .leadership-item-editor').each(function(){
      content[secId].leaders.push({
        id: 'ld'+Date.now()+Math.random(),
        name: $(this).find('.lsh-name').val()||'',
        role: $(this).find('.lsh-role').val()||'',
        duty: $(this).find('.lsh-duty').val()||'',
        resume: $(this).find('textarea').val()||'',
        photo: $(this).find('.lsh-photo').val()||''
      });
    });
  }

  // Data Cards
  if(sec.types.indexOf('dataCard')>=0) {
    content[secId].dataCards=[];
    $('#section-editor-body .datacard-row').each(function(){
      content[secId].dataCards.push({
        value: $(this).find('.dc-value').val()||'',
        label: $(this).find('.dc-label').val()||'',
        note: $(this).find('.dc-note').val()||''
      });
    });
  }

  // StatsCards (people: 专家群像数据)
  if(secId==='people') {
    content[secId].statsCards=[];
    $('#section-editor-body .statscard-row').each(function(){
      content[secId].statsCards.push({
        value: $(this).find('.sc-value').val()||'',
        label: $(this).find('.sc-label').val()||''
      });
    });
  }

  // Party (people: 党建力量)
  if(secId==='people') {
    var pyBranches = $('#section-editor-body .py-branches').val();
    if(typeof pyBranches !== 'undefined') {
      content[secId].party = {
        branches: pyBranches||'',
        subBranches: $('#section-editor-body .py-subBranches').val()||'',
        members: $('#section-editor-body .py-members').val()||'',
        staffMembers: $('#section-editor-body .py-staffMembers').val()||'',
        gradMembers: $('#section-editor-body .py-gradMembers').val()||'',
        textTitle: $('#section-editor-body .py-textTitle').val()||'',
        text: $('#section-editor-body .py-text').val()||'',
        textTitle2: $('#section-editor-body .py-textTitle2').val()||'',
        text2: $('#section-editor-body .py-text2').val()||'',
        imgIcon: $('#section-editor-body .py-imgIcon').val()||'',
        imgLabel: $('#section-editor-body .py-imgLabel').val()||'',
        imgSize: $('#section-editor-body .py-imgSize').val()||''
      };
    }
  }

  // RoleModels (people: 榜样的力量)
  if(secId==='people') {
    content[secId].roleModels=[];
    $('#section-editor-body .rolemodel-item-editor').each(function(){
      content[secId].roleModels.push({
        id: 'r'+Date.now()+Math.random(),
        name: $(this).find('.rm-name').val()||'',
        title: $(this).find('.rm-title').val()||'',
        dept: $(this).find('.rm-dept').val()||'',
        desc: $(this).find('.rm-desc').val()||'',
        photo: $(this).find('.rm-photo').val()||''
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
        url: $(this).find('.ga-url').val()||''
      });
    });
  }

  saveContent(content);
  // Update updatedAt，保留原有状态
  var sd=JSON.parse(localStorage.getItem('hm_admin_sections')||'{}');
  var oldStatus = sd[secId] ? sd[secId].status : 'draft';
  if(!sd[secId]) sd[secId]={title:sec.name,status:oldStatus,updatedAt:'',notes:''};
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
  html+='<div class="col-12 mt-2"><label>正文</label><textarea class="form-control" id="ann-content" rows="8" style="width:100%"></textarea></div>';
  html+='</div><input type="hidden" id="ann-edit-id"><button type="button" class="btn btn-accent mt-2" id="btn-save-ann"><i class="fas fa-check mr-1"></i>提交</button> ';
  html+='<button type="button" class="btn btn-outline-secondary mt-2" id="btn-cancel-ann">取消</button></div></div></div></div>';
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
  html+='<div class="card-body"><p class="text-muted mb-0">修改后前台刷新生效。</p></div></div></div></div></div>';
  return html;
}

// ====== 导出数据为 data.js ======
function exportDataJs() {
  var content      = localStorage.getItem('hm_content')      || '{}';
  var settings     = localStorage.getItem('hm_settings')     || '{}';
  var announcements= localStorage.getItem('hm_announcements')|| '[]';
  var sections     = localStorage.getItem('hm_admin_sections')|| '{}';
  var now          = new Date().toLocaleString('zh-CN');

  // 使用 JSON.stringify 保证输出合法 JSON（属性名带引号）
  var data;
  try { data = JSON.parse(content); } catch(e) { data = {}; }
  var setObj;
  try { setObj = JSON.parse(settings); } catch(e) { setObj = {}; }
  var annArr;
  try { annArr = JSON.parse(announcements); } catch(e) { annArr = []; }
  var secObj;
  try { secObj = JSON.parse(sections); } catch(e) { secObj = {}; }

  // 构建合法 JSON 字符串（属性名带引号）
  var jsonStr = JSON.stringify({
    content: data,
    settings: setObj,
    announcements: annArr,
    sections: secObj
  }, null, '  ');

  var code = '/**\n'
    + ' * 云端院史馆 · 持久化数据文件\n'
    + ' * 自动生成于: ' + now + '\n'
    + ' * 请勿手动编辑，由后台「导出数据」功能生成\n'
    + ' */\n'
    + 'window.HM_DATA = ' + jsonStr + ';\n';

  var blob = new Blob([code], { type: 'text/javascript;charset=utf-8' });
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement('a');
  a.href   = url;
  a.download = 'data.js';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  $(document).Toasts('create', { class:'bg-success', title:'导出成功', body:'data.js 已下载，请替换网站 js/data.js 并重新部署', autohide:true, delay:4000 });
}

// ====== 导入 data.js 文件 ======
var _importPendingData = null;

// 通用文件编码自动检测（UTF-8 BOM / UTF-8 / GBK）
function decodeImportFile(buffer) {
  var arr = new Uint8Array(buffer);
  var hasUtf8Bom = arr.length >= 3 && arr[0] === 0xEF && arr[1] === 0xBB && arr[2] === 0xBF;

  // 先用 UTF-8 解码
  var utfText = new TextDecoder('utf-8', { fatal: false }).decode(buffer);
  // 有 BOM 或文本中存在合法中文 → 直接返回 UTF-8
  if (hasUtf8Bom || /[\u4e00-\u9fff]/.test(utfText)) {
    return utfText;
  }

  // UTF-8 无中文 → 尝试 GBK 解码
  try {
    var gbkText = new TextDecoder('gbk', { fatal: false }).decode(buffer);
    if (/[\u4e00-\u9fff]/.test(gbkText)) {
      return gbkText;
    }
  } catch(e) { console.warn('[Admin] GBK decoder not available, using UTF-8 fallback'); }

  return utfText;
}

function importDataJs(file) {
  var reader = new FileReader();
  reader.onload = function(e) {
    var buffer = e.target.result; // ArrayBuffer
    var text = decodeImportFile(buffer);
    // ... rest of parsing
    var startIdx = text.indexOf('window.HM_DATA');
    if (startIdx === -1) {
      $(document).Toasts('create', { class:'bg-danger', title:'格式错误', body:'文件不是有效的 data.js，未找到 window.HM_DATA 定义', autohide:true, delay:5000 });
      return;
    }

    var assignIdx = text.indexOf('=', startIdx);
    if (assignIdx === -1) {
      $(document).Toasts('create', { class:'bg-danger', title:'格式错误', body:'文件中 window.HM_DATA 后缺少赋值符号 =', autohide:true, delay:5000 });
      return;
    }

    // 从 = 之后找第一个 {
    var jsonStart = -1;
    for (var i = assignIdx + 1; i < text.length; i++) {
      if (text[i] === '{') { jsonStart = i; break; }
    }
    if (jsonStart === -1) {
      $(document).Toasts('create', { class:'bg-danger', title:'格式错误', body:'未找到 JSON 数据起始位置', autohide:true, delay:5000 });
      return;
    }

    // 括号计数法：精确匹配最外层 {...}
    var braceCount = 0;
    var inString = false;
    var escapeNext = false;
    var jsonEnd = -1;
    for (var i = jsonStart; i < text.length; i++) {
      var ch = text[i];
      if (escapeNext) { escapeNext = false; continue; }
      if (ch === '\\') { escapeNext = true; continue; }
      if (ch === '"' && !escapeNext) { inString = !inString; continue; }
      if (inString) continue;
      if (ch === '{') braceCount++;
      if (ch === '}') {
        braceCount--;
        if (braceCount === 0) { jsonEnd = i; break; }
      }
    }
    if (jsonEnd === -1) {
      $(document).Toasts('create', { class:'bg-danger', title:'格式错误', body:'JSON 数据结构不完整，括号未闭合', autohide:true, delay:5000 });
      return;
    }

    var jsonStr = text.substring(jsonStart, jsonEnd + 1);
    var data;
    try { data = JSON.parse(jsonStr); } catch(err1) {
      // 回退：尝试 JavaScript 对象字面量解析（兼容旧版未带引号的 key）
      try {
        data = (new Function('return ' + jsonStr))();
      } catch(err2) {
        $(document).Toasts('create', { class:'bg-danger', title:'数据解析失败', body:'文件格式无法识别：' + err1.message, autohide:true, delay:8000 });
        return;
      }
    }

    if (!data.content || typeof data.content !== 'object') {
      $(document).Toasts('create', { class:'bg-danger', title:'数据不完整', body:'文件中缺少 content 字段', autohide:true, delay:5000 });
      return;
    }

    // 统计导入数据概览
    var stats = [];
    var sectionCount = 0;
    Object.keys(data.content).forEach(function(key) {
      sectionCount++;
      var c = data.content[key] || {};
      var parts = [];
      if (c.hero) parts.push('Hero✓');
      if (c.blocks && c.blocks.length) parts.push('Blocks×' + c.blocks.length);
      if (c.gallery && c.gallery.length) parts.push('Gallery×' + c.gallery.length);
      if (c.timeline && c.timeline.length) parts.push('Timeline×' + c.timeline.length);
      if (c.leaders && c.leaders.length) parts.push('Leaders×' + c.leaders.length);
      if (c.profiles && c.profiles.length) parts.push('Profiles1×' + c.profiles.length);
      if (c.profiles2 && c.profiles2.length) parts.push('Profiles2×' + c.profiles2.length);
      if (c.roleModels && c.roleModels.length) parts.push('RoleModels×' + c.roleModels.length);
      if (c.statsCards && c.statsCards.length) parts.push('StatsCards×' + c.statsCards.length);
      if (c.party && typeof c.party === 'object') parts.push('Party');
      if (c.dataCards && c.dataCards.length) parts.push('Cards×' + c.dataCards.length);
      if (parts.length) stats.push(key + ': ' + parts.join(', '));
    });
    var annCount = (data.announcements && Array.isArray(data.announcements)) ? data.announcements.length : 0;

    // 构建预览 HTML
    var previewHtml = '<div style="max-height:300px;overflow-y:auto;font-size:13px;">';
    previewHtml += '<table class="table table-sm table-bordered mb-0"><thead class="text-muted"><tr><th>字段</th><th>内容</th></tr></thead><tbody>';
    previewHtml += '<tr><td width="100">content 板块</td><td>' + sectionCount + ' 个</td></tr>';
    if (stats.length) {
      previewHtml += '<tr><td>板块详情</td><td style="line-height:1.8">' + stats.join('<br>') + '</td></tr>';
    }
    previewHtml += '<tr><td>公告</td><td>' + annCount + ' 条</td></tr>';
    previewHtml += '<tr><td>设置</td><td>' + (data.settings && data.settings.siteTitle ? escHtml(data.settings.siteTitle) : '<em class="text-muted">无</em>') + '</td></tr>';
    previewHtml += '<tr><td>文件大小</td><td>' + (text.length/1024).toFixed(1) + ' KB</td></tr>';
    previewHtml += '</tbody></table></div>';

    previewHtml += '<p class="mt-3 mb-0 text-danger"><i class="fas fa-exclamation-triangle mr-1"></i><strong>导入将覆盖当前所有 CMS 数据！</strong>此操作不可撤销。</p>';

    _importPendingData = data;
    showConfirmModal('确认导入数据', previewHtml, function() {
      // 执行导入
      localStorage.setItem('hm_content', JSON.stringify(data.content));
      localStorage.setItem('hm_last_edit', Date.now().toString());
      if (data.settings) localStorage.setItem('hm_settings', JSON.stringify(data.settings));
      if (data.announcements) localStorage.setItem('hm_announcements', JSON.stringify(data.announcements));
      if (data.sections) localStorage.setItem('hm_admin_sections', JSON.stringify(data.sections));
      $(document).Toasts('create', { class:'bg-success', title:'导入成功', body:'已导入 ' + sectionCount + ' 个板块、' + annCount + ' 条公告，页面即将刷新', autohide:true, delay:3000 });
      setTimeout(function() { location.reload(); }, 1500);
    });
  };
  reader.readAsArrayBuffer(file);
}

// ====== 通用确认弹窗 ======
function showConfirmModal(title, bodyHtml, onConfirm) {
  // 移除已有弹窗
  $('#import-confirm-modal').remove();
  var modal = $(
    '<div class="modal fade" id="import-confirm-modal" tabindex="-1">' +
    '<div class="modal-dialog"><div class="modal-content">' +
    '<div class="modal-header"><h5 class="modal-title">' + title + '</h5>' +
    '<button type="button" class="close" data-dismiss="modal">&times;</button></div>' +
    '<div class="modal-body">' + bodyHtml + '</div>' +
    '<div class="modal-footer">' +
    '<button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>' +
    '<button type="button" class="btn btn-success" id="btn-import-confirm">确认导入</button>' +
    '</div></div></div></div>'
  );
  $('body').append(modal);
  modal.modal('show');
  modal.on('hidden.bs.modal', function() { modal.remove(); _importPendingData = null; });
  $('#btn-import-confirm').off('click').on('click', function() {
    modal.modal('hide');
    if (onConfirm) onConfirm();
  });
}

// 渲染"数据管理"页
function renderDataManager() {
  var content      = getContent();
  var settings     = JSON.parse(localStorage.getItem('hm_settings')||'{}');
  var announcements= JSON.parse(localStorage.getItem('hm_announcements')||'[]');

  // 统计各板块数据量
  var rows = '';
  SECTIONS.forEach(function(sec) {
    var c = content[sec.id] || {};
    var counts = [];
    if (c.blocks)     counts.push('块×' + c.blocks.length);
    if (c.gallery)    counts.push('画廊×' + c.gallery.length);
    if (c.dataCards)  counts.push('数据×' + c.dataCards.length);
    if (c.timeline)   counts.push('时间线×' + c.timeline.length);
    if (c.leaders)    counts.push('领导×' + c.leaders.length);
    if (c.profiles)   counts.push('人物1×' + c.profiles.length);
    if (c.profiles2)  counts.push('人物2×' + c.profiles2.length);
    if (c.roleModels) counts.push('榜样×' + c.roleModels.length);
    if (c.statsCards) counts.push('学科统计×' + c.statsCards.length);
    if (c.party && typeof c.party === 'object') counts.push('党建');
    rows += '<tr><td><i class="' + sec.icon + ' mr-1" style="color:' + sec.color + '"></i>' + sec.name + '</td>'
          + '<td>' + (c.hero && c.hero.title ? escHtml(c.hero.title) : '<span class="text-muted">-</span>') + '</td>'
          + '<td>' + (counts.length ? counts.join(', ') : '<span class="text-muted">无数据</span>') + '</td></tr>';
  });

  var html = '<div class="container-fluid">';
  html += '<div class="row"><div class="col-12"><div class="callout callout-info">';
  html += '<h5><i class="fas fa-info-circle mr-1"></i>数据持久化说明</h5>';
  html += '<p class="mb-1">当前所有内容编辑后保存在 <strong>浏览器 localStorage</strong> 中（仅本机可见）。</p>';
  html += '<p class="mb-1">点击下方「<strong>⬇ 下载 data.js</strong>」将所有数据固化为文件 → 替换网站 <code>js/data.js</code> → 重新部署后 <strong>所有访客</strong> 均可看到最新内容。</p>';
  html += '<p class="mb-0 text-muted">提示：若网站部署在 GitHub Pages，push 更新后即可自动同步。</p>';
  html += '</div></div></div>';

  html += '<div class="row mb-3"><div class="col-md-6">';
  html += '<div class="card card-primary card-outline"><div class="card-body">';
  html += '<h5><i class="fas fa-database mr-1 text-primary"></i>数据导入/导出</h5>';
  html += '<hr class="mb-2 mt-1">';
  html += '<p class="mb-2 text-muted"><strong>导出：</strong>将当前全部 CMS 数据固化为 <code>data.js</code> 文件</p>';
  html += '<button class="btn btn-primary btn-block" id="btn-export-datajs"><i class="fas fa-download mr-1"></i>⬇ 下载 data.js</button>';
  html += '<hr class="mb-2 mt-3">';
  html += '<p class="mb-2 text-muted"><strong>导入：</strong>从之前导出的 <code>data.js</code> 文件恢复全部数据</p>';
  html += '<button class="btn btn-outline-success btn-block" id="btn-import-datajs"><i class="fas fa-upload mr-1"></i>⬆ 导入 data.js</button>';
  html += '<input type="file" id="import-file-input" accept=".js" style="display:none">';
  html += '</div></div></div>';

  html += '<div class="col-md-3">';
  html += '<div class="card card-success card-outline"><div class="card-body text-center">';
  html += '<i class="fab fa-github fa-3x text-success mb-2"></i>';
  html += '<p class="mb-2">推送至 GitHub Pages 后全网访问</p>';
  html += '<div class="bg-dark text-light rounded p-2 text-left" style="font-size:12px;font-family:monospace;">';
  html += 'git add js/data.js<br>git commit -m "update: 更新展馆内容"<br>git push';
  html += '</div>';
  html += '</div></div></div>';

  html += '<div class="col-md-3">';
  html += '<div class="card card-warning card-outline"><div class="card-body">';
  html += '<h6 class="card-title"><i class="fas fa-shield-alt mr-1 text-warning"></i>数据统计</h6>';
  html += '<ul class="list-unstyled mb-0">';
  html += '<li><i class="fas fa-cube mr-1 text-primary"></i>' + SECTIONS.length + ' 个板块</li>';
  html += '<li><i class="fas fa-bullhorn mr-1 text-danger"></i>' + announcements.length + ' 条公告</li>';
  html += '<li><i class="fas fa-cog mr-1 text-info"></i>网站标题：' + escHtml(settings.siteTitle || '-') + '</li>';
  var total = JSON.stringify(getContent()).length + JSON.stringify(settings).length;
  html += '<li><i class="fas fa-hdd mr-1 text-success"></i>数据大小：' + (total/1024).toFixed(1) + ' KB</li>';
  html += '</ul></div></div></div></div>';

  // 各板块数据概览表
  html += '<div class="row"><div class="col-12"><div class="card"><div class="card-header"><h3 class="card-title">各板块数据概览</h3></div>';
  html += '<div class="card-body p-0"><table class="table table-sm table-hover mb-0"><thead><tr><th>板块</th><th>主标题</th><th>内容概况</th></tr></thead><tbody>' + rows + '</tbody></table></div></div></div></div>';
  html += '</div>';
  return html;
}

// ====== 事件绑定 ======
$(document).ready(function() {
  initAllData();

  // 侧边栏导航
  $(document).on('click','.nav-sidebar .nav-link[data-page]',function(e){ e.preventDefault(); navigateTo($(this).data('page')); });
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
    content[currentPage].blocks.splice(idx,1);
    saveContent(content);
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
    content[currentPage].timeline.splice(idx,1);
    saveContent(content);
    navigateTo(currentPage);
  });

  // 新增/删除 Leader
  $(document).on('click','.btn-add-leader',function(){
    var secId=$(this).data('section');
    var content=getContent();
    if(!content[secId]) content[secId]={};
    if(!content[secId].leaders) content[secId].leaders=[];
    content[secId].leaders.push({id:'l'+Date.now(),position:'院长',category:'院长',name:'新姓名',years:'2000–2005',era:'标签',eraColor:'',desc:'简介',photo:''});
    saveContent(content);
    navigateTo(secId);
  });
  $(document).on('click','.btn-del-leader',function(){
    var gidx=parseInt($(this).data('gidx'));
    var content=getContent();
    content[currentPage].leaders.splice(gidx,1);
    saveContent(content);
    navigateTo(currentPage);
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
    content[currentPage][group].splice(idx,1);
    saveContent(content);
    navigateTo(currentPage);
  });

  // 新增/删除 StatsCard（people: 专家群像数据）
  $(document).on('click','.btn-add-statscard',function(){
    var secId=$(this).data('section');
    var content=getContent();
    if(!content[secId]) content[secId]={};
    if(!content[secId].statsCards) content[secId].statsCards=[];
    content[secId].statsCards.push({value:'0',label:'新指标'});
    saveContent(content);
    navigateTo(secId);
  });
  $(document).on('click','.btn-del-statscard',function(){
    var idx=parseInt($(this).data('idx'));
    var content=getContent();
    content[currentPage].statsCards.splice(idx,1);
    saveContent(content);
    navigateTo(currentPage);
  });

  // 新增/删除 RoleModel（people: 榜样的力量）
  $(document).on('click','.btn-add-rolemodel',function(){
    var secId=$(this).data('section');
    var content=getContent();
    if(!content[secId]) content[secId]={};
    if(!content[secId].roleModels) content[secId].roleModels=[];
    content[secId].roleModels.push({id:'r'+Date.now(),name:'新姓名',title:'荣誉/头衔',dept:'科室',desc:'简介',photo:''});
    saveContent(content);
    navigateTo(secId);
  });
  $(document).on('click','.btn-del-rolemodel',function(){
    var idx=parseInt($(this).data('idx'));
    var content=getContent();
    content[currentPage].roleModels.splice(idx,1);
    saveContent(content);
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
    content[currentPage].leaders.splice(idx,1);
    saveContent(content);
    navigateTo(currentPage);
  });

  // 首页轮播词 增删
  $(document).on('click','.btn-add-flip',function(){
    var h = '<div class="input-group input-group-sm mb-1 flip-item">';
    h += '<input class="form-control flip-item-val" value="" placeholder="例如: 三级甲等综合医院">';
    h += '<div class="input-group-append"><button class="btn btn-outline-danger btn-del-flip"><i class="fas fa-trash"></i></button></div>';
    h += '</div>';
    $('#flip-items-container').append(h);
  });
  $(document).on('click','.btn-del-flip',function(){
    $(this).closest('.flip-item').remove();
  });

  // 首页画廊 增删
  $(document).on('click','.btn-add-idx-gallery',function(){
    var h = '<div class="idx-gallery-item border rounded p-2 mb-2">';
    h += '<div class="form-row"><div class="col-md-1"><label>图标</label><input class="form-control form-control-sm ig-icon" value="📷" style="font-size:18px"></div>';
    h += '<div class="col-md-4"><label>标签 (支持&lt;br&gt;)</label><input class="form-control form-control-sm ig-label" value="" placeholder="例如: 1992年奠基典礼<small>历史影像</small>"></div>';
    h += '<div class="col-md-5"><label>图片URL</label><input class="form-control form-control-sm ig-url" value="" placeholder="https://... 或 ../assets/images/xxx.jpg"></div>';
    h += '<div class="col-md-2"><label>&nbsp;</label><button class="btn btn-outline-danger btn-sm btn-del-idx-gallery"><i class="fas fa-trash"></i> 删除</button></div></div>';
    h += '</div>';
    $('#idx-gallery-container').append(h);
  });
  $(document).on('click','.btn-del-idx-gallery',function(){
    $(this).closest('.idx-gallery-item').remove();
  });

  // 新增/删除 Gallery
  $(document).on('click','.btn-add-gallery',function(){
    var secId=$(this).data('section');
    var content=getContent();
    if(!content[secId]) content[secId]={};
    if(!content[secId].gallery) content[secId].gallery=[];
    content[secId].gallery.push({icon:'📷',label:'新图片',url:''});
    saveContent(content);
    navigateTo(secId);
  });
  $(document).on('click','.btn-del-gallery',function(){
    var idx=parseInt($(this).data('idx'));
    var content=getContent();
    content[currentPage].gallery.splice(idx,1);
    saveContent(content);
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
    content[currentPage].dataCards.splice(idx,1);
    saveContent(content);
    navigateTo(currentPage);
  });

  // 全部保存
  $('#btn-save-all').click(function(e){
    e.preventDefault();
    var sd=JSON.parse(localStorage.getItem('hm_admin_sections')||'{}');
    SECTIONS.forEach(function(s){
      if(!sd[s.id]) sd[s.id]={title:s.name,status:'published',updatedAt:new Date().toISOString().split('T')[0],notes:''};
    });
    localStorage.setItem('hm_admin_sections',JSON.stringify(sd));
    $(document).Toasts('create',{class:'bg-success',title:'全部保存',body:'12板块已全部设为已发布',autohide:true,delay:2000});
  });

  $(document).on('click','#btn-add-ann',function(){
    $('#ann-form-title').text('新增公告'); $('#ann-edit-id').val('');
    $('#ann-title').val(''); $('#ann-date').val(''); $('#ann-cat').val('notice'); $('#ann-dept').val('');
    $('#ann-content').val('');
    $('#btn-save-ann').prop('disabled', false).html('<i class="fas fa-check mr-1"></i>提交');
    $('#add-ann-form').slideDown();
  });

  $(document).on('click','#btn-cancel-ann',function(){ $('#add-ann-form').slideUp(); });

  $(document).on('click','.btn-edit-ann',function(){
    var anns=JSON.parse(localStorage.getItem('hm_announcements')||'[]');
    var $this=$(this);
    var a=anns.find(function(x){return x.id===parseInt($this.data('id'));});
    if(!a) return;
    $('#ann-form-title').text('编辑公告 #'+a.id); $('#ann-edit-id').val(a.id);
    $('#ann-title').val(a.title); $('#ann-date').val(a.date); $('#ann-cat').val(a.category);
    $('#ann-dept').val(a.dept);
    $('#ann-content').val(a.content || '');
    $('#btn-save-ann').prop('disabled', false).html('<i class="fas fa-check mr-1"></i>提交');
    $('#add-ann-form').slideDown();
  });

  $(document).on('click','#btn-save-ann',function(e){
    e.preventDefault();
    var $btn = $(this);
    if ($btn.prop('disabled')) return;
    $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin mr-1"></i>保存中…');
    try {
      var anns=JSON.parse(localStorage.getItem('hm_announcements')||'[]');
      var editId=$('#ann-edit-id').val();
      var annContent = $('#ann-content').val() || '';
      console.log('[save-ann] editId='+editId+' contentLen='+annContent.length);

      if(editId){
        anns=anns.map(function(a){ if(a.id===parseInt(editId)){ a.title=$('#ann-title').val(); a.date=$('#ann-date').val(); a.category=$('#ann-cat').val(); a.dept=$('#ann-dept').val(); a.content=annContent; } return a; });
      } else {
        var maxId=0; anns.forEach(function(a){if(a.id>maxId)maxId=a.id;});
        anns.push({id:maxId+1,title:$('#ann-title').val(),date:$('#ann-date').val(),category:$('#ann-cat').val(),dept:$('#ann-dept').val(),content:annContent,published:true});
      }
      localStorage.setItem('hm_announcements',JSON.stringify(anns));
      console.log('[save-ann] saved, total='+anns.length);
      navigateTo('announcements');
      $(document).Toasts('create',{class:'bg-success',title:editId?'更新成功':'新增成功',body:'公告已保存',autohide:true,delay:2000});
    } catch(err) {
      console.error('[save-ann] ERROR:', err);
      $btn.prop('disabled', false).html('<i class="fas fa-check mr-1"></i>提交');
      $(document).Toasts('create',{class:'bg-danger',title:'保存失败',body:'保存公告时出错: '+err.message,autohide:true,delay:5000});
    }
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
  });

  // 保存设置
  $(document).on('click','#btn-save-settings',function(){
    var settings={siteTitle:$('#set-title').val(),siteSubtitle:$('#set-subtitle').val(),officialUrl:$('#set-url').val(),contactEmail:$('#set-email').val(),contactPhone:$('#set-phone').val(),foundedYear:parseInt($('#set-founded-year').val())||1991};
    localStorage.setItem('hm_settings',JSON.stringify(settings));
    $(document).Toasts('create',{class:'bg-success',title:'已保存',body:'网站设置已更新',autohide:true,delay:2000});
  });

  // 导出数据为 data.js（页面内按钮 + 顶部快捷按钮）
  $(document).on('click','#btn-export-datajs, #btn-quick-export',function(e){
    e.preventDefault();
    exportDataJs();
  });

  // 导入 data.js
  $(document).on('click','#btn-import-datajs',function(){
    $('#import-file-input').click();
  });
  $(document).on('change','#import-file-input',function(){
    var file = this.files && this.files[0];
    if (!file) return;
    importDataJs(file);
    // 重置 input 以允许重复导入同一文件
    $(this).val('');
  });

  // ====== 职工名录后台：分页列表 + 编辑弹窗 + CSV导入 ======
  var staffAdminState = { page:1, pageSize:20, search:'', content:null };

  function initStaffAdmin() {
    // 读取最新数据
    var allContent = getContent();
    // 确保 staff 数据结构存在
    if (!allContent.staff) allContent.staff = {};
    if (!Array.isArray(allContent.staff.profiles)) allContent.staff.profiles = [];
    // 给老数据补上 employeeId（如果没有的话）
    allContent.staff.profiles.forEach(function(p, i) {
      if (!p.employeeId) p.employeeId = 'S' + String(i + 1).padStart(4, '0');
    });
    staffAdminState.content = allContent;
    staffAdminState.page = 1;
    renderStaffTable();
    bindStaffAdminEvents();
  }

  function getStaffProfiles() {
    var c = staffAdminState.content;
    if (!c || !c.staff || !Array.isArray(c.staff.profiles)) return [];
    return c.staff.profiles;
  }

  function setStaffProfiles(arr) {
    if (!staffAdminState.content.staff) staffAdminState.content.staff = {};
    staffAdminState.content.staff.profiles = arr;
  }

  function getStaffFiltered() {
    var profiles = getStaffProfiles();
    var q = (staffAdminState.search || '').toLowerCase();
    if (!q) return profiles;
    return profiles.filter(function(p) {
      return (p.name||'').toLowerCase().indexOf(q) >= 0
          || (p.dept||'').toLowerCase().indexOf(q) >= 0
          || (p.title||'').toLowerCase().indexOf(q) >= 0
          || (p.position||'').toLowerCase().indexOf(q) >= 0;
    });
  }

  function renderStaffTable() {
    var filtered = getStaffFiltered();
    var total = filtered.length;
    var totalPages = Math.ceil(total / staffAdminState.pageSize) || 1;
    var page = staffAdminState.page;
    if (page > totalPages) { page = totalPages; staffAdminState.page = page; }
    var start = (page - 1) * staffAdminState.pageSize;
    var batch = filtered.slice(start, start + staffAdminState.pageSize);

    var h = '';
    // 统计栏 + 批量操作按钮
    h += '<div class="staff-admin-bar"><span class="text-muted">共 <b>' + total + '</b> 人';
    if (staffAdminState.search) h += '（搜索结果）';
    h += ' · 第 <b>' + page + '</b>/<b>' + totalPages + '</b> 页</span>';
    h += '<span class="float-right">';
    h += '<button class="btn btn-xs btn-outline-danger ml-2 btn-staff-batch-del" disabled id="btn-staff-batch-del"><i class="fas fa-trash-alt"></i> 批量删除</button>';
    h += '<button class="btn btn-xs btn-outline-warning ml-1 btn-staff-batch-edit" disabled id="btn-staff-batch-edit"><i class="fas fa-edit"></i> 批量改科室</button>';
    h += '<button class="btn btn-xs btn-outline-success ml-2 btn-staff-add"><i class="fas fa-plus"></i> 新增职工</button>';
    h += '</span></div>';

    // 表格
    h += '<div class="table-responsive"><table class="table table-sm table-hover staff-admin-table">';
    h += '<thead><tr>';
    h += '<th style="width:30px"><input type="checkbox" id="staff-select-all" title="全选/取消"></th>';
    h += '<th style="width:40px">#</th><th style="width:80px">工号</th><th style="width:80px">姓名</th><th style="width:130px">职称</th><th style="width:130px">科室</th><th style="width:110px">职位</th><th>简介</th><th style="width:100px">照片</th><th style="width:120px">操作</th></tr></thead><tbody>';

    if (batch.length === 0) {
      h += '<tr><td colspan="11" class="text-center text-muted py-4">暂无数据，点击「新增职工」或「导入」添加</td></tr>';
    } else {
      batch.forEach(function(p, i) {
        var idx = start + i;
        h += '<tr>';
        h += '<td><input type="checkbox" class="staff-checkbox" data-idx="' + idx + '"></td>';
        h += '<td>' + (idx + 1) + '</td>';
        h += '<td><code>' + escHtml(p.employeeId || '-') + '</code></td>';
        h += '<td><b>' + escHtml(p.name || '-') + '</b></td>';
        h += '<td>' + escHtml(p.title || '-') + '</td>';
        h += '<td><span class="badge badge-light">' + escHtml(p.dept || '-') + '</span></td>';
        h += '<td>' + escHtml(p.position || '-') + '</td>';
        h += '<td class="text-muted" style="font-size:12px">' + escHtml((p.desc || '').substring(0, 40) + ((p.desc||'').length > 40 ? '…' : '')) + '</td>';
        h += '<td>' + (p.photo ? '<span class="badge badge-success">有</span>' : '<span class="badge badge-secondary">无</span>') + '</td>';
        h += '<td>';
        h += '<button class="btn btn-xs btn-outline-primary btn-staff-edit" data-idx="' + (start + i) + '"><i class="fas fa-edit"></i></button> ';
        h += '<button class="btn btn-xs btn-outline-danger btn-staff-del" data-idx="' + (start + i) + '"><i class="fas fa-trash"></i></button>';
        h += '</td></tr>';
      });
    }
    h += '</tbody></table></div>';

    // 分页
    if (totalPages > 1) {
      h += '<div class="staff-admin-pager">';
      h += '<button class="btn btn-xs btn-outline-secondary btn-staff-page" data-page="1"' + (page <= 1 ? ' disabled' : '') + '>«</button>';
      h += '<button class="btn btn-xs btn-outline-secondary btn-staff-page" data-page="' + (page - 1) + '"' + (page <= 1 ? ' disabled' : '') + '>‹</button>';
      var pages = [];
      if (totalPages <= 7) {
        for (var i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        if (page > 3) pages.push('...');
        var ps = Math.max(2, page - 1);
        var pe = Math.min(totalPages - 1, page + 1);
        for (var i = ps; i <= pe; i++) pages.push(i);
        if (page < totalPages - 2) pages.push('...');
        pages.push(totalPages);
      }
      pages.forEach(function(p) {
        if (p === '...') h += '<span class="staff-pager-ellipsis">…</span>';
        else h += '<button class="btn btn-xs btn-outline-secondary btn-staff-page' + (p === page ? ' active' : '') + '" data-page="' + p + '">' + p + '</button>';
      });
      h += '<button class="btn btn-xs btn-outline-secondary btn-staff-page" data-page="' + (page + 1) + '"' + (page >= totalPages ? ' disabled' : '') + '>›</button>';
      h += '<button class="btn btn-xs btn-outline-secondary btn-staff-page" data-page="' + totalPages + '"' + (page >= totalPages ? ' disabled' : '') + '>»</button>';
      h += '</div>';
    }

    $('#staffAdminContainer').html(h);
  }

  function bindStaffAdminEvents() {
    // 搜索
    $('#staffAdminSearch').off('input').on('input', function() {
      staffAdminState.search = this.value;
      staffAdminState.page = 1;
      renderStaffTable();
    });

    // 分页
    $(document).off('click.staffPage').on('click.staffPage', '.btn-staff-page', function() {
      if (this.disabled) return;
      var p = parseInt(this.getAttribute('data-page'), 10);
      if (!isNaN(p)) { staffAdminState.page = p; renderStaffTable(); }
    });

    // 新增
    $(document).off('click.staffAdd').on('click.staffAdd', '.btn-staff-add', function() {
      openStaffEditor(-1);
    });

    // 编辑
    $(document).off('click.staffEdit').on('click.staffEdit', '.btn-staff-edit', function() {
      var idx = parseInt(this.getAttribute('data-idx'), 10);
      openStaffEditor(idx);
    });

    // 删除
    $(document).off('click.staffDel').on('click.staffDel', '.btn-staff-del', function() {
      var idx = parseInt(this.getAttribute('data-idx'), 10);
      var profiles = getStaffProfiles();
      var p = profiles[idx];
      if (!p) return;
      if (!confirm('确定删除「' + p.name + '」吗？此操作不可恢复。')) return;
      profiles.splice(idx, 1);
      saveContent(staffAdminState.content);
      renderStaffTable();
      $(document).Toasts('create', {class:'bg-warning', title:'已删除', body:'「' + p.name + '」已移除', autohide:true, delay:2000});
    });

    // 全选/取消全选
    $(document).off('change.staffSelectAll').on('change.staffSelectAll', '#staff-select-all', function() {
      $('.staff-checkbox').prop('checked', this.checked).trigger('change');
    });

    // 单个复选框变化 → 更新批量按钮状态
    $(document).off('change.staffCheckbox').on('change.staffCheckbox', '.staff-checkbox', function() {
      var checked = $('.staff-checkbox:checked').length;
      $('#btn-staff-batch-del, #btn-staff-batch-edit').prop('disabled', checked === 0);
      // 更新全选复选框状态
      var total = $('.staff-checkbox').length;
      $('#staff-select-all').prop('checked', total > 0 && checked === total);
    });

    // 批量删除
    $(document).off('click.staffBatchDel').on('click.staffBatchDel', '#btn-staff-batch-del', function() {
      var checked = $('.staff-checkbox:checked');
      if (checked.length === 0) return;
      var names = [];
      checked.each(function() { 
        var idx = parseInt(this.getAttribute('data-idx'), 10);
        var p = getStaffProfiles()[idx];
        if (p) names.push(p.name);
      });
      if (!confirm('确定删除以下 ' + checked.length + ' 名职工吗？\n\n' + names.slice(0, 10).join('、') + (names.length > 10 ? '…等' + names.length + '人' : '') + '\n\n此操作不可恢复！')) return;
      // 从后往前删除（避免索引错乱）
      var indices = [];
      checked.each(function() { indices.push(parseInt(this.getAttribute('data-idx'), 10)); });
      indices.sort(function(a, b) { return b - a; });
      var profiles = getStaffProfiles();
      indices.forEach(function(idx) { profiles.splice(idx, 1); });
      saveContent(staffAdminState.content);
      renderStaffTable();
      $(document).Toasts('create', {class:'bg-warning', title:'批量删除完成', body:'已删除 ' + checked.length + ' 名职工', autohide:true, delay:2000});
    });

    // 批量修改科室
    $(document).off('click.staffBatchEdit').on('click.staffBatchEdit', '#btn-staff-batch-edit', function() {
      var checked = $('.staff-checkbox:checked');
      if (checked.length === 0) return;
      var dept = prompt('请输入新的科室名称（将对选中的 ' + checked.length + ' 人统一修改）：');
      if (!dept || !dept.trim()) return;
      dept = dept.trim();
      // 修改所有选中行
      var profiles = getStaffProfiles();
      checked.each(function() {
        var idx = parseInt(this.getAttribute('data-idx'), 10);
        if (profiles[idx]) profiles[idx].dept = dept;
      });
      saveContent(staffAdminState.content);
      renderStaffTable();
      $(document).Toasts('create', {class:'bg-success', title:'批量修改完成', body:'已将 ' + checked.length + ' 人的科室改为「' + dept + '」', autohide:true, delay:2000});
    });
  }

  function openStaffEditor(idx) {
    var profiles = getStaffProfiles();
    var isNew = (idx < 0 || idx >= profiles.length);
    var p = isNew ? {employeeId:'',name:'',title:'',dept:'',position:'',desc:'',photo:''} : profiles[idx];

    var modalHtml = [
      '<div class="modal fade show" id="staffEditModal" style="display:block;background:rgba(0,0,0,0.5)" tabindex="-1">',
      '<div class="modal-dialog"><div class="modal-content">',
      '<div class="modal-header bg-primary"><h5 class="modal-title"><i class="fas fa-user-edit mr-2"></i>' + (isNew ? '新增职工' : '编辑职工') + '</h5>',
      '<button type="button" class="close" id="btn-close-staff-edit">&times;</button></div>',
      '<div class="modal-body">',
      '<div class="form-group"><label>工号 <span class="text-danger">*</span><small class="text-muted ml-2">唯一标识，不可重复</small></label><input class="form-control" id="se-employeeId" value="' + escHtml(p.employeeId || '') + '" placeholder="如：001"></div>',
      '<div class="form-group"><label>姓名 <span class="text-danger">*</span></label><input class="form-control" id="se-name" value="' + escHtml(p.name) + '"></div>',
      '<div class="form-group"><label>职称/称号</label><input class="form-control" id="se-title" value="' + escHtml(p.title) + '"></div>',
      '<div class="form-group"><label>科室</label><input class="form-control" id="se-dept" value="' + escHtml(p.dept) + '"></div>',
      '<div class="form-group"><label>职位</label><input class="form-control" id="se-position" value="' + escHtml(p.position) + '"></div>',
      '<div class="form-group"><label>简介/贡献</label><textarea class="form-control" id="se-desc" rows="3">' + escHtml(p.desc) + '</textarea></div>',
      '<div class="form-group"><label>照片URL</label><input class="form-control" id="se-photo" value="' + escHtml(p.photo) + '" placeholder="https://..."></div>',
      '</div>',
      '<div class="modal-footer">',
      '<button class="btn btn-secondary" id="btn-cancel-staff-edit">取消</button>',
      '<button class="btn btn-primary" id="btn-save-staff-edit"><i class="fas fa-save mr-1"></i>保存</button>',
      '</div></div></div></div>'
    ].join('');
    $('body').append(modalHtml);

    function closeModal() { $('#staffEditModal').remove(); }
    $('#btn-close-staff-edit, #btn-cancel-staff-edit').click(closeModal);

    $('#btn-save-staff-edit').click(function() {
      var employeeId = $('#se-employeeId').val().trim();
      var name = $('#se-name').val().trim();
      if (!employeeId) { alert('工号不能为空'); return; }
      if (!name) { alert('姓名不能为空'); return; }
      // 工号唯一性检查（排除自己）
      var dup = profiles.some(function(pr, i) { return pr.employeeId === employeeId && i !== idx; });
      if (dup) { alert('工号「' + employeeId + '」已存在，请使用不同的工号'); return; }
      var newP = {
        id: p.id || ('s' + Date.now() + Math.random()),
        employeeId: employeeId,
        name: name,
        title: $('#se-title').val().trim(),
        dept: $('#se-dept').val().trim(),
        position: $('#se-position').val().trim(),
        desc: $('#se-desc').val().trim(),
        photo: $('#se-photo').val().trim()
      };

      if (isNew) {
        profiles.push(newP);
      } else {
        profiles[idx] = newP;
      }
      // 按工号排序
      profiles.sort(function(a, b) { return (a.employeeId || '').localeCompare(b.employeeId || ''); });
      saveContent(staffAdminState.content);
      closeModal();
      renderStaffTable();
      $(document).Toasts('create', {class:'bg-success', title: isNew ? '已添加' : '已更新', body: '「' + name + '」' + (isNew ? ' 已加入职工名录' : ' 已更新'), autohide:true, delay:2000});
    });
  }

  // ====== CSV 导入 ======
  $(document).on('click', '#btn-staff-csv-import', function() {
    $('#staffCsvFileInput').click();
  });

  $(document).on('change', '#staffCsvFileInput', function(e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
      var buffer = ev.target.result; // ArrayBuffer
      var text = decodeCsv(buffer);
      var parsed = parseCSV(text);
      if (!parsed.length) { alert('CSV 文件为空或无法解析'); return; }
      showCsvPreview(parsed);
    };
    reader.readAsArrayBuffer(file);
    // 重置以便重复选择同一文件
    this.value = '';
  });

  // CSV 编码自动检测（UTF-8 / GBK）
  function decodeCsv(buffer) {
    var arr = new Uint8Array(buffer);
    // 检测 BOM：UTF-8 BOM = EF BB BF
    var hasUtf8Bom = arr.length >= 3 && arr[0] === 0xEF && arr[1] === 0xBB && arr[2] === 0xBF;

    // 先用 UTF-8 解码
    var utfText = new TextDecoder('utf-8', { fatal: false }).decode(buffer);

    // 有 BOM 或文本中存在合法中文 → 直接返回 UTF-8
    if (hasUtf8Bom || /[\u4e00-\u9fff]/.test(utfText)) {
      return utfText;
    }

    // UTF-8 无中文 → 尝试 GBK 解码
    try {
      var gbkText = new TextDecoder('gbk', { fatal: false }).decode(buffer);
      if (/[\u4e00-\u9fff]/.test(gbkText)) {
        return gbkText;
      }
    } catch(e) {}

    // 都不行，返回 UTF-8 结果
    return utfText;
  }

  function parseCSV(text) {
    // 去除 BOM
    if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
    var lines = text.split(/\r?\n/).filter(function(l) { return l.trim(); });
    if (!lines.length) return [];

    // 自动检测是否有表头行（第一行包含中文/字母，不全是数据）
    var firstRow = parseCSVLine(lines[0]);
    var hasHeader = firstRow.some(function(cell) {
      var t = cell.trim();
      return t === '工号' || t === 'employeeId' || t === '姓名' || t === 'name' || t === '职称' || t === 'title' || t === '科室' || t === 'dept' || t === '职位' || t === 'position';
    });

    var startIdx = hasHeader ? 1 : 0;
    var result = [];
    for (var i = startIdx; i < lines.length; i++) {
      var cols = parseCSVLine(lines[i]);
      if (cols.length < 1 || !cols[0].trim()) continue;
      result.push({
        employeeId: (cols[0] || '').trim(),
        name: (cols[1] || '').trim(),
        title: (cols[2] || '').trim(),
        dept: (cols[3] || '').trim(),
        position: (cols[4] || '').trim(),
        desc: (cols[5] || '').trim(),
        photo: (cols[6] || '').trim()
      });
    }
    return result;
  }

  function parseCSVLine(line) {
    var result = [];
    var current = '';
    var inQuotes = false;
    for (var i = 0; i < line.length; i++) {
      var ch = line[i];
      if (inQuotes) {
        if (ch === '"') {
          if (i + 1 < line.length && line[i + 1] === '"') {
            current += '"'; i++;
          } else {
            inQuotes = false;
          }
        } else {
          current += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ',') {
          result.push(current); current = '';
        } else {
          current += ch;
        }
      }
    }
    result.push(current);
    return result;
  }

  function showCsvPreview(parsed) {
    var modalHtml = [
      '<div class="modal fade show" id="csvPreviewModal" style="display:block;background:rgba(0,0,0,0.5)" tabindex="-1">',
      '<div class="modal-dialog modal-lg"><div class="modal-content">',
      '<div class="modal-header bg-primary"><h5 class="modal-title"><i class="fas fa-file-csv mr-2"></i>CSV 导入预览</h5>',
      '<button type="button" class="close" id="btn-close-csv-preview">&times;</button></div>',
      '<div class="modal-body">',
      '<div class="alert alert-info"><i class="fas fa-info-circle mr-2"></i>解析成功：<b>' + parsed.length + '</b> 条记录</div>',
      '<div class="table-responsive" style="max-height:360px;overflow:auto"><table class="table table-sm table-bordered">',
      '<thead><tr><th>#</th><th>工号</th><th>姓名</th><th>职称</th><th>科室</th><th>职位</th><th>简介</th><th>照片</th></tr></thead><tbody>'
    ];
    parsed.forEach(function(p, i) {
      if (i >= 200) return; // 预览最多200条
      modalHtml.push('<tr><td>' + (i + 1) + '</td><td>' + escHtml(p.employeeId) + '</td><td>' + escHtml(p.name) + '</td><td>' + escHtml(p.title) + '</td><td>' + escHtml(p.dept) + '</td><td>' + escHtml(p.position || '') + '</td><td style="font-size:12px">' + escHtml((p.desc || '').substring(0, 30)) + '</td><td>' + (p.photo ? '<span class="badge badge-success">有</span>' : '<span class="badge badge-secondary">-</span>') + '</td></tr>');
    });
    if (parsed.length > 200) modalHtml.push('<tr><td colspan="8" class="text-center text-muted">… 仅显示前 200 条，共 ' + parsed.length + ' 条</td></tr>');
    modalHtml.push('</tbody></table></div></div>');
    modalHtml.push('<div class="modal-footer">');
    modalHtml.push('<button class="btn btn-secondary" id="btn-cancel-csv-import">取消</button>');
    modalHtml.push('<button class="btn btn-success" id="btn-execute-csv-import"><i class="fas fa-check mr-1"></i>确认导入 ' + parsed.length + ' 条</button>');
    modalHtml.push('</div></div></div></div>');
    $('body').append(modalHtml.join(''));

    function closeModal() { $('#csvPreviewModal').remove(); }
    $('#btn-close-csv-preview, #btn-cancel-csv-import').click(closeModal);

    $('#btn-execute-csv-import').click(function() {
      var allContent = getContent();
      if (!allContent.staff) allContent.staff = {};
      if (!allContent.staff.profiles) allContent.staff.profiles = [];

      var existingIds = {};
      allContent.staff.profiles.forEach(function(p) { if (p.employeeId) existingIds[p.employeeId] = true; });

      var added = 0, skipped = 0;
      parsed.forEach(function(p) {
        // 工号去重：不允许重复工号
        if (p.employeeId && existingIds[p.employeeId]) { skipped++; return; }
        // 工号为空则跳过（工号必需）
        if (!p.employeeId) { skipped++; return; }
        allContent.staff.profiles.push({
          id: 's' + Date.now() + Math.random(),
          employeeId: p.employeeId,
          name: p.name, title: p.title, dept: p.dept,
          position: p.position, desc: p.desc, photo: p.photo || ''
        });
        existingIds[p.employeeId] = true;
        added++;
      });

      // 按工号排序
      allContent.staff.profiles.sort(function(a, b) { return (a.employeeId || '').localeCompare(b.employeeId || ''); });
      saveContent(allContent);
      closeModal();
      $(document).Toasts('create', {class:'bg-success', title:'CSV导入完成', body:'成功导入 ' + added + ' 条（跳过 ' + skipped + ' 条重复）', autohide:true, delay:3000});
      // 刷新表格
      staffAdminState.content = allContent;
      staffAdminState.page = 1;
      renderStaffTable();
    });
  }

  // ====== 职工名录批量导入（文本）======
  $(document).on('click', '#btn-staff-batch-import', function() {
    var modalHtml = [
      '<div class="modal fade show" id="staffBatchModal" style="display:block;background:rgba(0,0,0,0.5)" tabindex="-1">',
      '<div class="modal-dialog modal-lg"><div class="modal-content">',
      '<div class="modal-header bg-info"><h5 class="modal-title"><i class="fas fa-file-import mr-2"></i>批量导入职工数据</h5>',
      '<button type="button" class="close" id="btn-close-batch-modal">&times;</button></div>',
      '<div class="modal-body">',
      '<div class="alert alert-info"><i class="fas fa-info-circle mr-2"></i>',
      '请按格式粘贴数据：每行一条记录，用 <b>Tab</b> 或 <b>逗号</b> 分隔，顺序为：<br>',
      '<code>姓名  职称  科室  职位  简介  照片URL(可选)</code><br>',
      '<small class="text-muted">示例：张三\t主任医师\t心血管内科\t科室主任\t深耕冠脉介入30年\thttps://...</small></div>',
      '<textarea class="form-control" id="batchImportText" rows="12" placeholder="粘贴职工数据…"></textarea>',
      '<div class="mt-2" id="batchImportPreview" style="max-height:200px;overflow:auto"></div></div>',
      '<div class="modal-footer">',
      '<button class="btn btn-secondary" id="btn-cancel-batch">取消</button>',
      '<button class="btn btn-info" id="btn-preview-batch"><i class="fas fa-eye mr-1"></i>预览解析</button>',
      '<button class="btn btn-success" id="btn-execute-batch" disabled><i class="fas fa-check mr-1"></i>确认导入</button>',
      '</div></div></div></div>'
    ].join('');
    $('body').append(modalHtml);

    var parsedData = [];

    function closeModal() { $('#staffBatchModal').remove(); }
    $('#btn-close-batch-modal, #btn-cancel-batch').click(closeModal);

    $('#btn-preview-batch').click(function() {
      var raw = $('#batchImportText').val().trim();
      if (!raw) { alert('请先粘贴职工数据'); return; }
      parsedData = [];
      var lines = raw.split(/[\n\r]+/).filter(function(l) { return l.trim(); });
      lines.forEach(function(line) {
        var cols;
        if (line.indexOf('\t') >= 0) {
          cols = line.split('\t');
        } else {
          cols = line.split(',');
        }
        if (cols.length < 1) return;
        parsedData.push({
          name: (cols[0]||'').trim(),
          title: (cols[1]||'').trim(),
          dept: (cols[2]||'').trim(),
          position: (cols[3]||'').trim(),
          desc: (cols[4]||'').trim(),
          photo: (cols[5]||'').trim()
        });
      });

      var previewHtml = '<div class="table-responsive"><table class="table table-sm table-bordered">';
      previewHtml += '<thead><tr><th>#</th><th>姓名</th><th>职称</th><th>科室</th><th>职位</th><th>简介</th></tr></thead><tbody>';
      parsedData.forEach(function(p, i) {
        previewHtml += '<tr><td>' + (i+1) + '</td><td>' + escHtml(p.name) + '</td><td>' + escHtml(p.title) + '</td><td>' + escHtml(p.dept) + '</td><td>' + escHtml(p.position||'') + '</td><td>' + escHtml((p.desc||'').substring(0,30)) + '</td></tr>';
      });
      previewHtml += '</tbody></table></div>';
      previewHtml += '<div class="text-success"><i class="fas fa-check-circle mr-1"></i>解析成功：<b>' + parsedData.length + '</b> 条记录</div>';
      $('#batchImportPreview').html(previewHtml);
      $('#btn-execute-batch').prop('disabled', parsedData.length === 0);
    });

    $('#btn-execute-batch').click(function() {
      if (!parsedData.length) return;
      var content = getContent();
      if (!content.staff) content.staff = {};
      if (!content.staff.profiles) content.staff.profiles = [];

      var existingNames = {};
      content.staff.profiles.forEach(function(p) { existingNames[p.name] = true; });

      var addedCount = 0;
      parsedData.forEach(function(p) {
        if (existingNames[p.name]) return;
        content.staff.profiles.push({
          id: 's' + Date.now() + Math.random(),
          name: p.name,
          title: p.title,
          dept: p.dept,
          position: p.position,
          desc: p.desc,
          photo: p.photo || ''
        });
        existingNames[p.name] = true;
        addedCount++;
      });

      saveContent(content);
      closeModal();
      $(document).Toasts('create', {class:'bg-success', title:'导入成功', body:'成功导入 ' + addedCount + ' 条职工记录（跳过 ' + (parsedData.length - addedCount) + ' 条重复）', autohide:true, delay:3000});
      navigateTo('staff');
    });
  });

  // 检测 file:// 协议，提示用户切换到 localhost
  if (window.location.protocol === 'file:') {
    $('#main-content').html(
      '<div class="container-fluid pt-4">' +
      '<div class="callout callout-danger" style="max-width:700px;margin:0 auto;">' +
      '<h5><i class="fas fa-exclamation-triangle mr-2"></i>请通过本地服务器访问管理后台</h5>' +
      '<p>当前使用 <code>file://</code> 协议直接打开文件，管理后台和前台页面的 localStorage <strong>相互隔离</strong>，编辑的数据无法同步到前台。</p>' +
      '<hr>' +
      '<p class="mb-1"><strong>正确做法：</strong></p>' +
      '<ol class="mb-2">' +
      '<li>打开命令行，进入项目根目录：<br><code>cd E:\\my-web\\hospital-museum</code></li>' +
      '<li>启动本地服务器：<br><code>python serve.py</code></li>' +
      '<li>访问：<a href="http://localhost:8000/admin/" style="color:#fff;text-decoration:underline;">http://localhost:8000/admin/</a></li>' +
      '</ol>' +
      '<p class="mb-0 text-muted">提示：如果已经启动了服务器，<a href="http://localhost:8000/admin/" style="color:#fff;">点此跳转</a></p>' +
      '</div></div>'
    );
    return;  // 阻止后续初始化，避免混淆 localStorage
  }

  if(!$('.toasts-top-right').length) $('body').append('<div class="toasts-top-right fixed" style="position:fixed;top:70px;right:20px;z-index:9999"></div>');

  // ====== 功能二：拖拽媒体上传系统 ======
  var _mediaStore = {};  // { filename: base64data, ... }

  function initMediaStore() {
    try {
      var raw = localStorage.getItem('hm_media_library');
      if (raw) _mediaStore = JSON.parse(raw);
      else _mediaStore = {};
    } catch(e) { _mediaStore = {}; }
  }

  function saveMediaStore() {
    try {
      localStorage.setItem('hm_media_library', JSON.stringify(_mediaStore));
    } catch(e) {
      $(document).Toasts('create', {class:'bg-danger', title:'存储不足', body:'媒体库数据过大，请清理旧图片', autohide:true, delay:3000});
    }
  }

  function updateMediaCount() {
    var keys = Object.keys(_mediaStore);
    $('#media-count').text(keys.length > 0 ? keys.length + ' 张图片' : '暂无图片');
  }

  function addMedia(filename, base64) {
    _mediaStore[filename] = base64;
    saveMediaStore();
    updateMediaCount();
  }

  function deleteMedia(filename) {
    delete _mediaStore[filename];
    saveMediaStore();
    updateMediaCount();
  }

  function getMediaList() {
    return Object.keys(_mediaStore).map(function(k) {
      return { name: k, data: _mediaStore[k] };
    });
  }

  // 将图片文件转为 Base64
  function fileToBase64(file, callback) {
    var reader = new FileReader();
    reader.onload = function(e) {
      callback(null, e.target.result, file.name);
    };
    reader.onerror = function() {
      callback('文件读取失败: ' + file.name);
    };
    reader.readAsDataURL(file);
  }

  // 媒体上传处理
  function handleMediaFiles(files) {
    if (!files || !files.length) return;
    var $status = $('#media-upload-status');
    var total = files.length;
    var done = 0;
    $status.html('<span class="text-info"><i class="fas fa-spinner fa-spin mr-1"></i>正在上传 ' + total + ' 个文件…</span>');

    for (var i = 0; i < files.length; i++) {
      (function(file) {
        if (!file.type.match(/^image\//)) {
          done++;
          $status.append('<div class="text-danger">跳过非图片文件: ' + file.name + '</div>');
          if (done >= total) updateMediaCount();
          return;
        }
        fileToBase64(file, function(err, base64, fname) {
          done++;
          if (err) {
            $status.append('<div class="text-danger">' + err + '</div>');
          } else {
            addMedia(fname, base64);
            $status.append('<div class="media-upload-item"><img class="thumb" src="' + base64 + '"><span class="url-input">data:image/… (Base64)</span><span class="copied-tip">已存储</span></div>');
          }
          if (done >= total) {
            setTimeout(function() { updateMediaCount(); }, 300);
            $(document).Toasts('create', {class:'bg-success', title:'上传完成', body:'成功存入 ' + (done - (files.length - total)) + ' 张图片到媒体库', autohide:true, delay:2500});
          }
        });
      })(files[i]);
    }
  }

  // 拖拽上传事件
  $(document).on('dragover', '#media-drop-zone', function(e) {
    e.preventDefault(); e.stopPropagation();
    $(this).addClass('drag-over');
  });
  $(document).on('dragleave', '#media-drop-zone', function(e) {
    e.preventDefault(); e.stopPropagation();
    $(this).removeClass('drag-over');
  });
  $(document).on('drop', '#media-drop-zone', function(e) {
    e.preventDefault(); e.stopPropagation();
    $(this).removeClass('drag-over');
    handleMediaFiles(e.originalEvent.dataTransfer.files);
  });
  $(document).on('click', '#media-drop-zone', function() {
    $('#media-file-input').click();
  });
  $(document).on('change', '#media-file-input', function() {
    handleMediaFiles(this.files);
    this.value = '';
  });

  // 浏览媒体库弹窗
  $(document).on('click', '#btn-browse-media, #btn-open-media-library', function(e) {
    e.preventDefault();
    showMediaGallery();
  });

  function showMediaGallery(onSelect) {
    var list = getMediaList();
    var html = '';
    if (list.length === 0) {
      html = '<div class="text-center text-muted py-4"><i class="fas fa-images fa-2x mb-2"></i><p>媒体库为空</p><small>将图片拖入顶部「媒体库」面板开始使用</small></div>';
    } else {
      html = '<div class="media-gallery-grid">';
      list.forEach(function(m) {
        var itemOnClick = onSelect
          ? ('window._mediaSelectCb(\'' + m.name.replace(/'/g,'\\\'') + '\')')
          : ('copyMediaUrl(\'' + m.name.replace(/'/g,'\\\'') + '\')');
        html += '<div class="media-gallery-item" onclick="' + itemOnClick + '">';
        html += '<img src="' + m.data + '" alt="' + escHtml(m.name) + '">';
        html += '<div class="media-name">' + escHtml(m.name) + '</div>';
        if (!onSelect) {
          html += '<button class="copy-btn" onclick="event.stopPropagation();copyMediaUrl(\'' + m.name.replace(/'/g,'\\\'') + '\')"><i class="fas fa-copy"></i> 复制</button>';
        } else {
          html += '<button class="select-btn" onclick="event.stopPropagation();window._mediaSelectCb(\'' + m.name.replace(/'/g,'\\\'') + '\')"><i class="fas fa-check"></i> 选择</button>';
        }
        html += '</div>';
      });
      html += '</div>';
    }

    var modal = [
      '<div class="modal fade show" id="mediaGalleryModal" style="display:block;background:rgba(0,0,0,0.5)" tabindex="-1">',
      '<div class="modal-dialog modal-lg"><div class="modal-content">',
      '<div class="modal-header bg-primary"><h5 class="modal-title"><i class="fas fa-images mr-2"></i>媒体库（' + list.length + ' 张）</h5>',
      '<button type="button" class="close" id="btn-close-media-gallery">&times;</button></div>',
      '<div class="modal-body">',
      '<div class="alert alert-info"><i class="fas fa-info-circle mr-2"></i>点击图片复制 Base64 URL，可粘贴到任意图片URL输入框中</div>',
      html,
      '</div>',
      '<div class="modal-footer">',
      '<button class="btn btn-outline-danger" id="btn-clear-media"><i class="fas fa-trash-alt mr-1"></i>清空媒体库</button>',
      '<button class="btn btn-secondary" id="btn-close-media-gallery-btn">关闭</button>',
      '</div></div></div></div>'
    ].join('');
    $('body').append(modal);

    // ===== 上传区域 =====
    $('#mediaGalleryModal .modal-body').prepend(
      '<div id="media-upload-area" class="media-drop-zone mb-3">' +
      '<i class="fas fa-cloud-upload-alt fa-2x text-muted mb-2"></i>' +
      '<p class="mb-1 text-muted">拖拽图片到此处或点击选择</p>' +
      '<small class="text-muted">自动转为 Base64 存入媒体库</small>' +
      '<input type="file" id="media-gallery-file-input" accept="image/*" multiple style="display:none">' +
      '</div>' +
      '<div id="media-upload-progress" class="mb-2" style="font-size:12px"></div>'
    );

    function doUpload(files) {
      if (!files || !files.length) return;
      var $prog = $('#media-upload-progress');
      $prog.html('<span class="text-info"><i class="fas fa-spinner fa-spin mr-1"></i>上传中…</span>');
      var done = 0;
      for (var i = 0; i < files.length; i++) {
        (function(file) {
          if (!file.type.match(/^image\//)) { done++; return; }
          var reader = new FileReader();
          reader.onload = function(e) {
            addMedia(file.name, e.target.result);
            done++;
            if (done >= files.length) {
              $prog.html('<span class="text-success"><i class="fas fa-check mr-1"></i>上传完成！</span>');
              setTimeout(function() { $prog.empty(); }, 2000);
              $('#mediaGalleryModal').remove();
              showMediaGallery(onSelect);
            }
          };
          reader.onerror = function() { done++; };
          reader.readAsDataURL(file);
        })(files[i]);
      }
    }

    $('#media-upload-area').off('click').on('click', function() { $('#media-gallery-file-input').click(); });
    $('#media-gallery-file-input').off('change').on('change', function() { doUpload(this.files); this.value = ''; });
    $('#media-upload-area').off('dragover').on('dragover', function(e) { e.preventDefault(); e.stopPropagation(); $(this).addClass('drag-over'); });
    $('#media-upload-area').off('dragleave').on('dragleave', function(e) { e.preventDefault(); e.stopPropagation(); $(this).removeClass('drag-over'); });
    $('#media-upload-area').off('drop').on('drop', function(e) { e.preventDefault(); e.stopPropagation(); $(this).removeClass('drag-over'); doUpload(e.originalEvent.dataTransfer.files); });

    if (onSelect) {
      window._mediaSelectCb = function(filename) {
        var data = _mediaStore[filename];
        if (data && onSelect) onSelect(data);
        $('#mediaGalleryModal').remove();
      };
    }

    function closeModal() { $('#mediaGalleryModal').remove(); }
    $('#btn-close-media-gallery, #btn-close-media-gallery-btn').click(closeModal);

    $('#btn-clear-media').click(function() {
      if (!confirm('确定清空所有媒体库图片吗？此操作不可恢复！')) return;
      _mediaStore = {};
      saveMediaStore();
      closeModal();
      updateMediaCount();
      $(document).Toasts('create', {class:'bg-warning', title:'已清空', body:'媒体库已清空', autohide:true, delay:2000});
    });
  }

  // 全局函数：复制媒体 URL 到剪贴板
  window.copyMediaUrl = function(filename) {
    var data = _mediaStore[filename];
    if (!data) return;
    // 复制到剪贴板
    if (navigator.clipboard) {
      navigator.clipboard.writeText(data).then(function() {
        $(document).Toasts('create', {class:'bg-success', title:'已复制', body:'图片URL已复制到剪贴板，可粘贴到任意图片URL输入框', autohide:true, delay:2000});
      });
    } else {
      // 降级方案
      var textarea = document.createElement('textarea');
      textarea.value = data;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      $(document).Toasts('create', {class:'bg-success', title:'已复制', body:'图片URL已复制到剪贴板', autohide:true, delay:2000});
    }
  };

  // 全局函数：从媒体库选择图片（按钮点击）
  window.openMediaPickerFor = function(btn) {
    var targetSelector = $(btn).data('target');
    var $target = $(btn).closest('.block-item-editor, .gallery-row, .profile-row-editor, .leader-item-editor').find(targetSelector);
    var list = getMediaList();
    if (list.length === 0) {
      alert('媒体库为空，请先将图片拖入顶部「媒体库」面板');
      return;
    }
    var optionsHtml = list.map(function(m) {
      return '<option value="' + escHtml(m.data) + '">' + escHtml(m.name) + '</option>';
    }).join('');
    var modalHtml = [
      '<div class="modal fade show" id="mediaPickerModal" style="display:block;background:rgba(0,0,0,0.5)" tabindex="-1">',
      '<div class="modal-dialog"><div class="modal-content">',
      '<div class="modal-header bg-info"><h5 class="modal-title"><i class="fas fa-image mr-2"></i>选择图片</h5><button type="button" class="close" id="btn-close-picker">&times;</button></div>',
      '<div class="modal-body">',
      '<select class="form-control" id="media-picker-select" size="8">' + optionsHtml + '</select>',
      '<div class="mt-2 text-center"><img id="media-picker-preview" style="max-height:120px;max-width:100%;border-radius:6px;display:none"></div>',
      '</div>',
      '<div class="modal-footer">',
      '<button class="btn btn-secondary" id="btn-cancel-picker">取消</button>',
      '<button class="btn btn-primary" id="btn-confirm-picker"><i class="fas fa-check mr-1"></i>选择此图片</button>',
      '</div></div></div></div>'
    ].join('');
    $('body').append(modalHtml);

    function closePicker() { $('#mediaPickerModal').remove(); }
    $('#btn-close-picker, #btn-cancel-picker').click(closePicker);

    $('#media-picker-select').on('change', function() {
      var val = $(this).val();
      if (val) { $('#media-picker-preview').attr('src', val).show(); }
      else { $('#media-picker-preview').hide(); }
    }).trigger('change');

    $('#btn-confirm-picker').click(function() {
      var val = $('#media-picker-select').val();
      if (val && $target.length) {
        $target.val(val);
        $(document).Toasts('create', {class:'bg-success', title:'已插入', body:'图片URL已填入输入框', autohide:true, delay:1500});
      }
      closePicker();
    });
  };

  // ====== 功能三：审核发布工作流 ======
  window.updateSidebarBadges = function() {
    var sd = JSON.parse(localStorage.getItem('hm_admin_sections') || '{}');
    $('.sidebar-status-badge').each(function() {
      var sectionId = $(this).data('section');
      var info = sd[sectionId] || { status: 'draft' };
      $(this).removeClass('status-published status-draft status-review')
             .addClass('status-' + info.status)
             .attr('title', info.status === 'published' ? '已发布' : (info.status === 'review' ? '审核中' : '草稿'));
    });
  }

  function renderWorkflowDashboard() {
    var sd = JSON.parse(localStorage.getItem('hm_admin_sections') || '{}');
    var content = getContent();
    var published = 0, draft = 0, review = 0;

    var html = '<div class="container-fluid">';
    // 统计概览
    html += '<div class="workflow-stats">';
    html += '<div class="workflow-stat-item published"><div class="count" id="wf-pub-count">0</div><div class="label">已发布</div></div>';
    html += '<div class="workflow-stat-item draft"><div class="count" id="wf-draft-count">0</div><div class="label">草稿</div></div>';
    html += '<div class="workflow-stat-item review"><div class="count" id="wf-review-count">0</div><div class="label">审核中</div></div>';
    html += '</div>';

    html += '<div class="card card-primary card-outline"><div class="card-header">';
    html += '<h3 class="card-title"><i class="fas fa-tasks mr-2"></i>审核发布工作流</h3>';
    html += '<div class="card-tools">';
    html += '<button class="btn btn-xs btn-outline-success ml-1" id="btn-wf-publish-all"><i class="fas fa-check-double mr-1"></i>全部发布</button>';
    html += '<button class="btn btn-xs btn-outline-warning ml-1" id="btn-wf-draft-all"><i class="fas fa-undo mr-1"></i>全部退回草稿</button>';
    html += '</div></div>';

    html += '<div class="card-body p-0"><div class="table-responsive"><table class="table table-hover workflow-table mb-0">';
    html += '<thead><tr><th>序号</th><th>板块</th><th>状态</th><th>内容条目</th><th>最后更新</th><th>快速切换</th></tr></thead><tbody>';

    SECTIONS.forEach(function(s, i) {
      var info = sd[s.id] || { title: s.name, status: 'draft', updatedAt: '-', notes: '' };
      var statusText = info.status === 'published' ? '已发布' : (info.status === 'review' ? '审核中' : '草稿');
      var statusClass = info.status === 'published' ? 'status-published' : (info.status === 'review' ? 'status-review' : 'status-draft');
      if (info.status === 'published') published++;
      else if (info.status === 'review') review++;
      else draft++;

      var itemCount = 0;
      var c = content[s.id] || {};
      ['leaders','profiles','profiles2','roleModels','statsCards','timeline','blocks','gallery','dataCards'].forEach(function(t) {
        if (Array.isArray(c[t])) itemCount += c[t].length;
      });

      html += '<tr>';
      html += '<td>' + pad2(i + 1) + '</td>';
      html += '<td><i class="' + s.icon + '" style="color:' + s.color + ';margin-right:8px"></i><strong>' + s.name + '</strong></td>';
      html += '<td><span class="status-badge ' + statusClass + '" id="wf-status-' + s.id + '">' + statusText + '</span></td>';
      html += '<td>' + itemCount + ' 条</td>';
      html += '<td>' + (info.updatedAt || '-') + '</td>';
      html += '<td>';
      html += '<button class="btn-workflow-action act-publish btn-set-status" data-section="' + s.id + '" data-status="published"><i class="fas fa-check mr-1"></i>发布</button>';
      html += '<button class="btn-workflow-action act-review btn-set-status" data-section="' + s.id + '" data-status="review"><i class="fas fa-clock mr-1"></i>审核中</button>';
      html += '<button class="btn-workflow-action act-draft btn-set-status" data-section="' + s.id + '" data-status="draft"><i class="fas fa-pencil-alt mr-1"></i>退回</button>';
      html += '</td></tr>';
    });

    html += '</tbody></table></div></div></div>';
    html += '</div>';

    // 注入动态数据
    setTimeout(function() {
      $('#wf-pub-count').text(published);
      $('#wf-draft-count').text(draft);
      $('#wf-review-count').text(review);
    }, 50);

    return html;
  }

  // 设置板块状态
  function setSectionStatus(sectionId, status) {
    var sd = JSON.parse(localStorage.getItem('hm_admin_sections') || '{}');
    if (!sd[sectionId]) sd[sectionId] = { title: sectionId, status: status, updatedAt: new Date().toISOString().split('T')[0], notes: '' };
    else {
      sd[sectionId].status = status;
      sd[sectionId].updatedAt = new Date().toISOString().split('T')[0];
    }
    localStorage.setItem('hm_admin_sections', JSON.stringify(sd));
    updateSidebarBadges();
  }

  // 按钮事件：设置状态
  $(document).on('click', '.btn-set-status', function() {
    var sectionId = $(this).data('section');
    var status = $(this).data('status');
    setSectionStatus(sectionId, status);
    // 刷新当前视图
    var statusText = status === 'published' ? '已发布' : (status === 'review' ? '审核中' : '草稿');
    var statusClass = status === 'published' ? 'status-published' : (status === 'review' ? 'status-review' : 'status-draft');
    $('#wf-status-' + sectionId).text(statusText).removeClass().addClass('status-badge ' + statusClass);
    // 同步更新板块编辑器内的状态标签
    if (currentSection && currentSection.id === sectionId) {
      var fullText = status === 'published' ? '已发布·前台可见' : (status === 'review' ? '审核中·内部预览' : '草稿·前台隐藏');
      $('#info-status').text(fullText).removeClass().addClass('status-badge ' + statusClass);
    }
    $(document).Toasts('create', {class:'bg-success', title:'状态已更新', body:'板块已设为 "' + statusText + '"', autohide:true, delay:1500});
  });

  // 全部发布
  $(document).on('click', '#btn-wf-publish-all', function() {
    if (!confirm('确认将所有板块设为「已发布」？')) return;
    SECTIONS.forEach(function(s) { setSectionStatus(s.id, 'published'); });
    navigateTo('dashboard');
    $(document).Toasts('create', {class:'bg-success', title:'全部发布', body:'所有板块已设为已发布', autohide:true, delay:2000});
  });

  // 全部退回草稿
  $(document).on('click', '#btn-wf-draft-all', function() {
    if (!confirm('确认将所有板块退回「草稿」状态？前台将隐藏这些内容。')) return;
    SECTIONS.forEach(function(s) { setSectionStatus(s.id, 'draft'); });
    navigateTo('dashboard');
    $(document).Toasts('create', {class:'bg-warning', title:'全部退回', body:'所有板块已退回草稿状态', autohide:true, delay:2000});
  });

  // 审核工作流面板入口
  $(document).on('click', '#btn-workflow-dashboard', function(e) {
    e.preventDefault();
    $('#main-content').html(renderWorkflowDashboard());
    $('#page-title').text('审核发布工作流');
    $('#breadcrumb').html('<li class="breadcrumb-item"><a href="#" data-nav="dashboard">控制台</a></li><li class="breadcrumb-item active">审核工作流</li>');
    $('#breadcrumb a[data-nav]').click(function(e2){ e2.preventDefault(); navigateTo($(this).data('nav')); });
    updateSidebarBadges();
  });

  // 初始化媒体库
  initMediaStore();
  updateMediaCount();
  // 初始化侧边栏徽章
  setTimeout(updateSidebarBadges, 200);

  navigateTo('dashboard');
});
