/**
 * 竞赛预告的数据与倒计时计算。
 *
 * 数据来源：仓库根目录的《竞赛目录.md》（29 项国家级 / 行业级大学生竞赛）。
 * 目录只给出「赛期月份」，个别赛项写到了旬（上旬 / 中旬 / 下旬）；
 * 这里按这些口径把它拆成可计算的时间窗，逐日推算倒计时。
 * 日期只是备赛提醒，具体以各赛事官网通知为准。
 */

export type Tone = 'green' | 'yellow' | 'gray';

/** 一个赛项里的关键节点，例如「报名截止」「全国总决赛」。 */
export type Phase = {
  label: string;
  /** 目录里的原始口径，直接展示给成员看。 */
  span: string;
  /** [起始月, 结束月]，起始月大于结束月表示跨年（如报名 12 月–次年 2 月）。 */
  months: [number, number];
  /** [起始日, 结束日]，缺省按整月计算；用于「中旬」「下旬」等更细的口径。 */
  days?: [number, number];
};

export type Competition = {
  id: number;
  name: string;
  short: string;
  intro: string;
  schedule: string;
  site: string;
  siteUrl: string;
  format: string;
  category: string;
  /** 双年 / 单年举办的赛事，需要跳过不举办的年份。 */
  parity?: 'odd' | 'even';
  phases: Phase[];
};

export const CATEGORIES = ['创新创业', '程序设计', '电子硬件', '机器人', '信息安全', '通信ICT', '数字媒体', '人工智能'];

export const COMPETITIONS: Competition[] = [
  {
    id: 1,
    name: '中国国际“互联网+”大学生创新创业大赛（中国国际大学生创新大赛）',
    short: '互联网+ / 国创赛',
    intro: '由教育部等部委主办，覆盖“青年红色筑梦之旅”、职教、产业等多赛道，是全球规模最大的大学生创新创业赛事。',
    schedule: '每年一届，7–11 月举办，报名通常 8–9 月截止',
    site: 'cy.ncss.cn',
    siteUrl: 'https://cy.ncss.cn',
    format: '校级初赛 → 省级复赛 → 全国总决赛三级赛制；团队通过全国大学生创业服务网报名。',
    category: '创新创业',
    phases: [
      { label: '报名截止', span: '8–9 月', months: [8, 9] },
      { label: '全国总决赛', span: '7–11 月', months: [7, 11] }
    ]
  },
  {
    id: 2,
    name: '“挑战杯”全国大学生课外学术科技作品竞赛（大挑）',
    short: '挑战杯 · 大挑',
    intro: '共青团中央、中国科协、教育部等主办，被誉为大学生课外学术科技创新的“奥林匹克”。',
    schedule: '每两年一届（奇数年），报名 3–4 月，校赛 3–4 月，省赛 4–6 月，国赛 10–11 月',
    site: 'www.tiaozhanbei.net',
    siteUrl: 'https://www.tiaozhanbei.net',
    format: '校级 → 省级 → 全国三级赛制；以自然科学论文、科技发明制作、哲学社科调查报告等作品参赛。',
    category: '创新创业',
    parity: 'odd',
    phases: [
      { label: '报名与校赛', span: '3–4 月', months: [3, 4] },
      { label: '省级复赛', span: '4–6 月', months: [4, 6] },
      { label: '全国终审决赛', span: '10–11 月', months: [10, 11] }
    ]
  },
  {
    id: 3,
    name: '“挑战杯”中国大学生创业计划竞赛（小挑）',
    short: '挑战杯 · 小挑',
    intro: '与“大挑”并列，借用风险投资运作模式，要求团队提出具有市场前景的技术 / 产品 / 服务并完成创业计划。',
    schedule: '每两年一届（偶数年），与“大挑”交叉轮流；通常 2–3 月启动，校赛 3–5 月，国赛 10–11 月',
    site: 'www.tiaozhanbei.net',
    siteUrl: 'https://www.tiaozhanbei.net',
    format: '校级 → 省级 → 全国三级赛制；以创业计划书 + 答辩形式参赛。',
    category: '创新创业',
    parity: 'even',
    phases: [
      { label: '报名与校赛', span: '2–5 月', months: [2, 5] },
      { label: '全国决赛', span: '10–11 月', months: [10, 11] }
    ]
  },
  {
    id: 4,
    name: 'ACM-ICPC 国际大学生程序设计竞赛',
    short: 'ACM-ICPC',
    intro: '全球计算机领域最具影响力的大学生程序设计竞赛之一，考察团队在压力下的算法设计与编程能力。',
    schedule: '每年一届，区域赛 9–12 月，全球总决赛次年 3–5 月',
    site: 'icpc.global',
    siteUrl: 'https://icpc.global',
    format: '3 人一队，5 小时内解决 8–13 道算法题，按解题数和罚时排名；通常需先参加校内 / 省赛选拔。',
    category: '程序设计',
    phases: [
      { label: '区域赛', span: '9–12 月', months: [9, 12] },
      { label: '全球总决赛', span: '次年 3–5 月', months: [3, 5] }
    ]
  },
  {
    id: 5,
    name: '全国大学生电子设计竞赛',
    short: '电赛 NUEDC',
    intro: '教育部与工信部联合主办，聚焦电子系统设计、智能控制、嵌入式等，要求 4 天 3 夜封闭完成作品。',
    schedule: '全国赛每两年一届（奇数年 9 月），赛期四天三夜；双数年举办模拟电子系统专题赛（TI 杯）',
    site: 'nuedc.xjtu.edu.cn',
    siteUrl: 'https://nuedc.xjtu.edu.cn',
    format: '3 人一队，全国组委会统一命题，封闭完成理论设计与实物制作，提交作品并答辩评审。',
    category: '电子硬件',
    parity: 'odd',
    phases: [{ label: '全国竞赛', span: '9 月（奇数年）', months: [9, 9] }]
  },
  {
    id: 6,
    name: '全国大学生智能汽车竞赛',
    short: '智能车竞赛',
    intro: '以智能汽车为对象的创意性科技竞赛，涵盖控制、传感、人工智能等，教育部倡导的 A 类学科竞赛。',
    schedule: '每年一届，10 月公布题目并报名，次年 3 月培训，7 月分赛区赛，8 月全国总决赛',
    site: 'smartcarrace.com',
    siteUrl: 'https://www.smartcarrace.com',
    format: '团队参赛，分竞速赛、创意赛等大类；需制作能自主识别道路的智能模型汽车完成竞速任务。',
    category: '机器人',
    phases: [
      { label: '赛题公布与报名', span: '10 月', months: [10, 10] },
      { label: '分赛区赛', span: '7 月', months: [7, 7] },
      { label: '全国总决赛', span: '8 月', months: [8, 8] }
    ]
  },
  {
    id: 7,
    name: '全国大学生创新创业训练计划年会展示',
    short: '国创年会',
    intro: '教育部高教司主办，为“国创计划”项目学生提供学术论文交流、成果展示与项目推介平台。',
    schedule: '每年一届，通常在 10–12 月举办（近年多在 12 月）',
    site: 'gjcxcy.bjtu.edu.cn',
    siteUrl: 'https://gjcxcy.bjtu.edu.cn',
    format: '非自主报名，由各高校从国家级 / 省级“国创计划”项目中遴选推荐优秀论文和项目参会展示。',
    category: '创新创业',
    phases: [{ label: '年会展示', span: '10–12 月', months: [10, 12] }]
  },
  {
    id: 8,
    name: '全国大学生机器人大赛（CURC）',
    short: 'CURC 机器人',
    intro: '含 ROBOCON、RoboMaster、ROBOTAC 三大赛项，是国内最具影响力的大学生机器人学科竞赛之一。',
    schedule: '每年一届，比赛时间通常 3–8 月，RoboMaster 报名多在 10–11 月启动',
    site: 'cnrobocon.net / robomaster.com / robotac.cn',
    siteUrl: 'https://www.robomaster.com',
    format: '团队参赛，按各赛项规则设计、制作机器人并完成对抗 / 任务赛；需通过校内选拔后报名。',
    category: '机器人',
    phases: [
      { label: 'RoboMaster 报名', span: '10–11 月', months: [10, 11] },
      { label: '赛季比赛', span: '3–8 月', months: [3, 8] }
    ]
  },
  {
    id: 9,
    name: '中国大学生服务外包创新创业大赛',
    short: '服务外包大赛',
    intro: '教育部、商务部联合主办，服务外包领域唯一的国家级创新创业赛事，分企业命题、创业实践、OPC 创客等类别。',
    schedule: '每年一届，2–8 月举办，报名通常 3 月截止，全国决赛 8 月',
    site: 'www.fwwb.org.cn',
    siteUrl: 'https://www.fwwb.org.cn',
    format: '团队参赛，按 A 类企业命题 / B 类创业实践 / C 类 OPC 创客 / D 类等赛道提交方案与作品，经区域赛选拔进入全国赛。',
    category: '创新创业',
    phases: [
      { label: '报名截止', span: '3 月', months: [3, 3] },
      { label: '全国决赛', span: '8 月', months: [8, 8] }
    ]
  },
  {
    id: 10,
    name: '中国大学生计算机设计大赛（4C）',
    short: '4C 计算机设计',
    intro: '我国高校面向本科生最早的赛事之一，覆盖软件应用、数字媒体、人工智能等多个大类。',
    schedule: '每年一届，1–4 月报名，4–8 月校赛 / 省赛 / 国赛',
    site: 'jsjds.blcu.edu.cn',
    siteUrl: 'https://jsjds.blcu.edu.cn',
    format: '团队参赛，按大赛分类提交作品，经校级选拔 → 省级赛 → 全国决赛逐级评审。',
    category: '数字媒体',
    phases: [
      { label: '报名', span: '1–4 月', months: [1, 4] },
      { label: '校赛 / 省赛 / 国赛', span: '4–8 月', months: [4, 8] }
    ]
  },
  {
    id: 11,
    name: '中国高校计算机大赛',
    short: '高校计算机大赛',
    intro: '下设大数据挑战赛、团体程序设计天梯赛、移动应用创新赛、网络技术挑战赛、人工智能创意赛等多个独立赛道。',
    schedule: '每年一届，各赛道时间不同，整体集中在 3–11 月；如网络技术挑战赛报名 3–4 月，大数据挑战赛报名 3–7 月',
    site: 'net.c4best.cn / appcontest.net',
    siteUrl: 'https://net.c4best.cn',
    format: '团队 / 个人按赛道报名，各赛道赛制不同（线上赛 → 复赛 → 决赛，或作品评审 + 答辩）。',
    category: '程序设计',
    phases: [
      { label: '各赛道赛期', span: '3–11 月', months: [3, 11] },
      { label: '网络技术挑战赛报名', span: '3–4 月', months: [3, 4] }
    ]
  },
  {
    id: 12,
    name: '蓝桥杯全国软件和信息技术专业人才大赛',
    short: '蓝桥杯',
    intro: '全国普通高校大学生竞赛榜单重要赛事，设软件赛、电子赛、人工智能赛等，以个人编程 / 设计能力为核心。',
    schedule: '每年一届，校赛 12 月，省赛次年 4 月，全国总决赛次年 6 月中上旬；报名通常 10–12 月',
    site: 'dasai.lanqiao.cn',
    siteUrl: 'https://dasai.lanqiao.cn',
    format: '个人赛，分软件 / 电子 / 人工智能等科目，闭卷上机编程或设计；校赛 → 省赛 → 全国总决赛三级。',
    category: '程序设计',
    phases: [
      { label: '报名', span: '10–12 月', months: [10, 12] },
      { label: '校赛', span: '12 月', months: [12, 12] },
      { label: '省赛', span: '4 月', months: [4, 4] },
      { label: '全国总决赛', span: '6 月中上旬', months: [6, 6], days: [1, 20] }
    ]
  },
  {
    id: 13,
    name: '全国大学生信息安全竞赛',
    short: '全国大学生信安赛',
    intro: '教育部网络空间安全教指委主办，分作品赛与创新赛，是国内网络安全领域核心赛事之一。',
    schedule: '每年一届，作品赛报名 4–6 月，决赛 8 月；创新赛报名 4–5 月，决赛 7–8 月',
    site: 'www.ciscn.cn',
    siteUrl: 'https://www.ciscn.cn',
    format: '团队参赛，作品赛提交网络安全作品并进行答辩；创新赛以攻防对抗 / 创新方案形式进行。',
    category: '信息安全',
    phases: [
      { label: '作品赛报名', span: '4–6 月', months: [4, 6] },
      { label: '决赛', span: '7–8 月', months: [7, 8] }
    ]
  },
  {
    id: 14,
    name: '中国机器人大赛暨 RoboCup 机器人世界杯中国赛',
    short: 'RoboCup 中国赛',
    intro: '中国自动化学会主办，RoboCup 赛区与专项赛并行，涵盖服务机器人、救援机器人、足球机器人等多项目。',
    schedule: '每年一届，RoboCup 赛区通常在 5 月，专项赛 / 全国赛在 8 月，部分赛区在 10 月',
    site: 'rcccaa.drct-caa.org.cn',
    siteUrl: 'https://rcccaa.drct-caa.org.cn',
    format: '团队参赛，按各赛项规则设计机器人并完成指定任务 / 对抗赛；需通过区域赛或专项赛选拔。',
    category: '机器人',
    phases: [
      { label: 'RoboCup 赛区', span: '5 月', months: [5, 5] },
      { label: '专项赛 / 全国赛', span: '8 月', months: [8, 8] },
      { label: '专项赛区', span: '10 月', months: [10, 10] }
    ]
  },
  {
    id: 15,
    name: '“中国软件杯”大学生软件设计大赛',
    short: '中国软件杯',
    intro: '面向高校学生的软件设计赛事，以企业真实命题为导向，强调工程实践与创新能力。',
    schedule: '每年一届，报名 3–6 月，作品提交 6 月底，全国总决赛 8 月',
    site: 'www.cnsoftbei.com',
    siteUrl: 'https://www.cnsoftbei.com',
    format: '团队参赛，按大赛公布的命题 / 赛题开发软件作品并提交，经初赛评审进入全国总决赛答辩。',
    category: '程序设计',
    phases: [
      { label: '报名', span: '3–6 月', months: [3, 6] },
      { label: '作品提交', span: '6 月底', months: [6, 6], days: [20, 30] },
      { label: '全国总决赛', span: '8 月', months: [8, 8] }
    ]
  },
  {
    id: 16,
    name: '中美青年创客大赛',
    short: '中美青年创客',
    intro: '教育部主办，中美人文交流高层磋商机制成果之一，聚焦创客创新与社区可持续发展。',
    schedule: '每年一届，4–6 月报名及分赛区选拔，7–8 月全国 / 全球总决赛',
    site: 'chinaus-maker.cscse.edu.cn',
    siteUrl: 'https://chinaus-maker.cscse.edu.cn',
    format: '团队参赛，提交创客作品原型 / 方案，经分赛区选拔后进入决赛；强调动手制作与现场展示。',
    category: '创新创业',
    phases: [
      { label: '报名与分赛区选拔', span: '4–6 月', months: [4, 6] },
      { label: '全国 / 全球总决赛', span: '7–8 月', months: [7, 8] }
    ]
  },
  {
    id: 17,
    name: '睿抗机器人开发者大赛（RAICOM）',
    short: '睿抗 RAICOM',
    intro: '工信部人才交流中心主办，面向机器人、人工智能、数字创意等专业，设多个赛道。',
    schedule: '每年一届，4–7 月报名 / 校赛，6–9 月省赛 / 区域赛，7–10 月全国总决赛',
    site: 'www.raicom.com.cn',
    siteUrl: 'https://www.raicom.com.cn',
    format: '团队参赛（指导教师 1–2 人），按赛道完成机器人 / 算法 / 创意作品，经省赛选拔进入总决赛。',
    category: '机器人',
    phases: [
      { label: '报名与校赛', span: '4–7 月', months: [4, 7] },
      { label: '省赛 / 区域赛', span: '6–9 月', months: [6, 9] },
      { label: '全国总决赛', span: '7–10 月', months: [7, 10] }
    ]
  },
  {
    id: 18,
    name: '大唐杯全国大学生新一代信息通信技术大赛',
    short: '大唐杯',
    intro: '工信部人才交流中心、中国通信企业协会等主办，聚焦 5G / 6G、信息通信工程实践。',
    schedule: '每年一届，报名 12–2 月，省赛 4–5 月，全国总决赛 6–7 月',
    site: 'dtcup.dtxiaotangren.com',
    siteUrl: 'https://dtcup.dtxiaotangren.com',
    format: '团队参赛，分省份选拔赛 → 全国总决赛二级赛制，含理论测试与工程实践 / 仿真操作。',
    category: '通信ICT',
    phases: [
      { label: '报名', span: '12–2 月', months: [12, 2] },
      { label: '省赛', span: '4–5 月', months: [4, 5] },
      { label: '全国总决赛', span: '6–7 月', months: [6, 7] }
    ]
  },
  {
    id: 19,
    name: '华为 ICT 大赛',
    short: '华为 ICT',
    intro: '华为打造的全球性 ICT 年度赛事，设实践赛、创新赛、编程赛、挑战赛等主题赛道。',
    schedule: '每年一届，报名通常 8–10 月，初赛次年 2 月前后，中国总决赛次年 4 月，全球总决赛次年 5 月',
    site: 'e.huawei.com（大赛专区）',
    siteUrl: 'https://e.huawei.com/cn/talent',
    format: '团队参赛，采用校赛 / 省赛 → 中国总决赛 → 全球总决赛多级赛制；部分赛道分初赛、总决赛两级。',
    category: '通信ICT',
    phases: [
      { label: '报名', span: '8–10 月', months: [8, 10] },
      { label: '中国总决赛', span: '4 月', months: [4, 4] },
      { label: '全球总决赛', span: '5 月', months: [5, 5] }
    ]
  },
  {
    id: 20,
    name: '全国大学生嵌入式芯片与系统设计竞赛',
    short: '嵌入式芯片赛',
    intro: '设芯片应用、芯片设计、FPGA 创新设计等赛道，考察嵌入式系统与芯片应用开发能力。',
    schedule: '每年一届，芯片应用赛道报名 3–4 月，作品提交 7 月上旬，决赛 8 月；FPGA 赛道报名 9 月，决赛 11 月',
    site: 'www.socchina.net',
    siteUrl: 'https://www.socchina.net',
    format: '团队参赛（1–3 人同校），开放式报名，经赛区初赛 / 复赛 → 全国总决赛，提交作品并演示答辩。',
    category: '电子硬件',
    phases: [
      { label: '芯片应用报名', span: '3–4 月', months: [3, 4] },
      { label: '作品提交', span: '7 月上旬', months: [7, 7], days: [1, 10] },
      { label: '芯片应用决赛', span: '8 月', months: [8, 8] },
      { label: 'FPGA 赛道报名', span: '9 月', months: [9, 9] },
      { label: 'FPGA 赛道决赛', span: '11 月', months: [11, 11] }
    ]
  },
  {
    id: 21,
    name: 'iCAN 大学生创新创业大赛',
    short: 'iCAN 大赛',
    intro: '设创新、创业、挑战三大赛道，覆盖智慧家庭、智慧农业、智慧医疗等方向，强调原始创新。',
    schedule: '每年一届，4–11 月举办；报名截止 6 月，校赛 6–7 月，分赛区 9 月，全国总决赛 11 月',
    site: 'www.g-ican.com',
    siteUrl: 'https://www.g-ican.com',
    format: '团队参赛（3 人），提交创新项目 / 作品，经校内赛 → 分赛区选拔 → 全国总决赛逐级晋级。',
    category: '创新创业',
    phases: [
      { label: '报名截止', span: '6 月', months: [6, 6] },
      { label: '校赛', span: '6–7 月', months: [6, 7] },
      { label: '分赛区', span: '9 月', months: [9, 9] },
      { label: '全国总决赛', span: '11 月', months: [11, 11] }
    ]
  },
  {
    id: 22,
    name: '中国高校智能机器人创意大赛',
    short: '智能机器人创意',
    intro: '以“更好、更快、更强”为主题，培养提出问题、解决方案、技术创新到工程实现的全链条能力。',
    schedule: '每年一届，报名 4–5 月，省级 / 区域赛 5–6 月，全国总决赛 7 月中旬',
    site: 'www.robotcontest.cn',
    siteUrl: 'https://www.robotcontest.cn',
    format: '团队参赛，按主题设计智能机器人创意作品 / 方案，经预赛（省赛 / 区域赛）选拔进入全国决赛。',
    category: '机器人',
    phases: [
      { label: '报名', span: '4–5 月', months: [4, 5] },
      { label: '省级 / 区域赛', span: '5–6 月', months: [5, 6] },
      { label: '全国总决赛', span: '7 月中旬', months: [7, 7], days: [11, 20] }
    ]
  },
  {
    id: 23,
    name: '中国机器人及人工智能大赛',
    short: '机器人及 AI 大赛',
    intro: '历史悠久、影响广泛的全国性学科竞赛，设创新赛、应用赛、竞技赛、挑战赛等，已列入竞赛榜单。',
    schedule: '每年一届，报名 3 月启动，省赛 5–6 月，全国赛 7 月中下旬',
    site: 'www.caairobot.com',
    siteUrl: 'https://www.caairobot.com',
    format: '团队参赛，按赛道提交机器人 / 人工智能作品或参加竞技对抗，经校赛 → 省赛 → 全国赛三级。',
    category: '机器人',
    phases: [
      { label: '报名', span: '3 月', months: [3, 3] },
      { label: '省赛', span: '5–6 月', months: [5, 6] },
      { label: '全国赛', span: '7 月中下旬', months: [7, 7], days: [15, 31] }
    ]
  },
  {
    id: 24,
    name: '百度之星 · 程序设计大赛',
    short: '百度之星',
    intro: '百度公司举办的年度程序设计赛事，已举办 20 余届，是国内互联网行业知名度最高的编程竞赛之一。',
    schedule: '每年一届，初赛通常 8 月和 9 月各一场（线上），总决赛线下举行（时间地点另行通知）',
    site: 'astar.baidu.com',
    siteUrl: 'https://astar.baidu.com',
    format: '个人赛，初赛 3 小时 / 8 道算法题，总决赛 5 小时 / 12 道题；使用 C/C++/Python/Java 等语言在线编程。',
    category: '程序设计',
    phases: [{ label: '线上初赛', span: '8–9 月', months: [8, 9] }]
  },
  {
    id: 25,
    name: '全国大学生计算机系统能力大赛',
    short: '系统能力大赛',
    intro: '设操作系统设计、编译系统、数据库、CPU 设计（龙芯杯）、智能系统（小米杯）等多个赛道，培养系统级设计能力。',
    schedule: '每年一届，3 月启动报名，各赛道初赛 / 作品提交 5–6 月，全国总决赛 8 月',
    site: 'www.nscscc.com',
    siteUrl: 'https://www.nscscc.com',
    format: '团队参赛，按赛道完成系统设计 / 实现并提交作品，经初赛评审进入全国总决赛答辩与测试。',
    category: '程序设计',
    phases: [
      { label: '报名', span: '3 月', months: [3, 3] },
      { label: '初赛 / 作品提交', span: '5–6 月', months: [5, 6] },
      { label: '全国总决赛', span: '8 月', months: [8, 8] }
    ]
  },
  {
    id: 26,
    name: '全国大学生物联网设计竞赛',
    short: '物联网设计赛',
    intro: '聚焦物联网系统设计与应用，涵盖硬件、软件、云平台等全栈能力，分赛区选拔后进入全国总决赛。',
    schedule: '每年一届，报名通常 4–6 月，作品提交 7 月底，分赛区决赛 8 月上中旬，全国总决赛 8 月下旬',
    site: 'iot.sjtu.edu.cn',
    siteUrl: 'https://iot.sjtu.edu.cn',
    format: '团队参赛，提交物联网作品方案与演示视频，经网评 → 分赛区决赛 → 全国总决赛逐级选拔。',
    category: '电子硬件',
    phases: [
      { label: '报名', span: '4–6 月', months: [4, 6] },
      { label: '作品提交', span: '7 月底', months: [7, 7], days: [20, 31] },
      { label: '分赛区决赛', span: '8 月上中旬', months: [8, 8], days: [1, 20] },
      { label: '全国总决赛', span: '8 月下旬', months: [8, 8], days: [21, 31] }
    ]
  },
  {
    id: 27,
    name: '全国大学生信息安全与对抗技术竞赛（ISCC）',
    short: 'ISCC 信息安全',
    intro: '国内首个网络空间安全类技术竞赛（2004 年创办），设破阵夺旗赛、智能安全赛、密码安全赛等。',
    schedule: '每年一届，校赛 3–5 月，省赛 / 区域赛 4–10 月，国赛 8–12 月；不同赛道时间略有差异',
    site: 'www.isclab.org.cn',
    siteUrl: 'https://www.isclab.org.cn',
    format: '个人 / 团队按赛道参赛；破阵夺旗赛为线上解题（CTF），智能安全赛 / 密码安全赛等需提交作品或方案并答辩。',
    category: '信息安全',
    phases: [
      { label: '校赛', span: '3–5 月', months: [3, 5] },
      { label: '省赛 / 区域赛', span: '4–10 月', months: [4, 10] },
      { label: '国赛', span: '8–12 月', months: [8, 12] }
    ]
  },
  {
    id: 28,
    name: '全国大学生数字媒体科技作品及创意竞赛',
    short: '数字媒体竞赛',
    intro: '面向数字媒体、科技艺术、创意设计等方向，设校赛 → 赛区选拔赛 → 全国总决赛三级赛制。',
    schedule: '每年一届，报名 / 作品提交 10 月下旬截止，校赛审核 10 月底，赛区赛 11 月上中旬，全国总决赛 11 月下旬',
    site: 'www.cmit.cn',
    siteUrl: 'https://www.cmit.cn',
    format: '团队参赛，通过官网提交数字媒体科技作品 / 创意作品，经校级初赛 → 赛区选拔 → 全国终审答辩。',
    category: '数字媒体',
    phases: [
      { label: '报名 / 作品提交截止', span: '10 月下旬', months: [10, 10], days: [21, 31] },
      { label: '校赛审核', span: '10 月底', months: [10, 10], days: [24, 31] },
      { label: '赛区赛', span: '11 月上中旬', months: [11, 11], days: [1, 20] },
      { label: '全国总决赛', span: '11 月下旬', months: [11, 11], days: [21, 30] }
    ]
  },
  {
    id: 29,
    name: '全球校园人工智能算法精英大赛',
    short: '全球校园 AI 算法',
    intro: '设算法挑战赛、算法创新赛、算法应用赛、算法主题赛、产业命题赛、算法专项赛等 6 大赛道。',
    schedule: '每年一届，4 月开放报名，省赛 / 区域赛 10 月前后，全国总决赛 11 月中下旬',
    site: 'www.aicomp.cn',
    siteUrl: 'https://www.aicomp.cn',
    format: '个人或团队按赛道报名，提交算法方案 / 作品，经校赛 → 省赛 / 区域赛 → 全国总决赛逐级选拔。',
    category: '人工智能',
    phases: [
      { label: '报名', span: '4 月', months: [4, 4] },
      { label: '省赛 / 区域赛', span: '10 月前后', months: [10, 10] },
      { label: '全国总决赛', span: '11 月中下旬', months: [11, 11], days: [11, 30] }
    ]
  }
];

const DAY_MS = 86_400_000;

export const startOfDay = (value: Date) => new Date(value.getFullYear(), value.getMonth(), value.getDate());

const lastDayOfMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

/** 两个日期相差的自然日数，向上取整到天，避免跨夏令时 / 时分秒带来的误差。 */
export const daysBetween = (from: Date, to: Date) =>
  Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / DAY_MS);

/** 把「月份 + 旬」的口径展开成具体的起止日期；起始月大于结束月表示跨年。 */
export const phaseWindow = (phase: Phase, year: number) => {
  const [fromMonth, toMonth] = phase.months;
  const [fromDay, toDay] = phase.days ?? [1, 0];
  const endYear = toMonth < fromMonth ? year + 1 : year;
  const start = new Date(year, fromMonth - 1, Math.min(fromDay, lastDayOfMonth(year, fromMonth)));
  const end = new Date(endYear, toMonth - 1, Math.min(toDay || lastDayOfMonth(endYear, toMonth), lastDayOfMonth(endYear, toMonth)));
  return { start, end };
};

export type PhaseState = 'active' | 'upcoming';

export type PhaseStatus = {
  phase: Phase;
  start: Date;
  end: Date;
  state: PhaseState;
  /** 已开始：距该节点收官的自然日数；未开始：距该节点开始的自然日数。 */
  days: number;
};

const matchesParity = (competition: Competition, year: number) => {
  if (!competition.parity) return true;
  const isOdd = year % 2 === 1;
  return competition.parity === 'odd' ? isOdd : !isOdd;
};

/**
 * 计算每个节点「下一轮」的状态。
 * 已经结束的节点顺延到下一个举办年份（单数年 / 双数年赛事会自动跳过不举办的年份）。
 */
export const phaseStatuses = (competition: Competition, today: Date): PhaseStatus[] => {
  const baseYear = today.getFullYear();
  const result: PhaseStatus[] = [];
  competition.phases.forEach((phase) => {
    for (let offset = 0; offset <= 3; offset += 1) {
      const year = baseYear + offset;
      if (!matchesParity(competition, year)) continue;
      const { start, end } = phaseWindow(phase, year);
      if (daysBetween(today, end) < 0) continue;
      const state: PhaseState = daysBetween(today, start) <= 0 ? 'active' : 'upcoming';
      result.push({ phase, start, end, state, days: daysBetween(today, state === 'active' ? end : start) });
      return;
    }
  });
  return result.sort((a, b) => a.days - b.days);
};

/** 倒计时配色：7 天以内绿色，30 天以内黄色，30 天以上灰色。 */
export const toneForDays = (days: number): Tone => (days <= 7 ? 'green' : days <= 30 ? 'yellow' : 'gray');

export type CompetitionSchedule = {
  competition: Competition;
  phases: PhaseStatus[];
  nearest: PhaseStatus;
  tone: Tone;
};

/** 汇总单个赛项的倒计时：以最近的一个节点作为卡片主色。 */
export const scheduleCompetition = (competition: Competition, today: Date): CompetitionSchedule => {
  const phases = phaseStatuses(competition, today);
  const nearest = phases[0];
  return { competition, phases, nearest, tone: toneForDays(nearest.days) };
};

export const dayLabel = (value: Date) => `${value.getMonth() + 1} 月 ${value.getDate()} 日`;

export const fullDateLabel = (value: Date) => `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;

export const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export const countdownText = (status: PhaseStatus) =>
  status.state === 'active' ? `进行中 · 剩 ${status.days} 天` : `还有 ${status.days} 天`;

export const rangeText = (status: PhaseStatus) =>
  `${dayLabel(status.start)} – ${dayLabel(status.end)}`;
