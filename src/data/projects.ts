export interface Project {
  id: string;
  title: string;
  summary: string;
  contribution: string;
  technologies: string[];
  image: string;
  imageAlt: string;
  imageCaption: string;
  github?: string;
  demo?: string;
  demoLabel?: string;
  demoCredentials?: { account: string; password: string };
}

// 文案与证据集中维护；没有公开仓库的项目不生成假链接。
export const projects: Project[] = [
  {
    id: 'openpangu',
    title: 'openPangu 领域知识增强',
    summary: '面向船舶建造中的专业知识查询，探索领域模型部署、轻量微调与问答接入，让分散的专业资料更便于使用。',
    contribution: '负责模型部署、微调测试，协助项目总体推进。',
    technologies: ['Python', 'PyTorch', 'Transformers', 'PEFT / QLoRA'],
    image: '/assets/openpangu-system.png',
    imageAlt: '广船知识应用的实际知识问答首页，展示场景导航与问题输入区',
    imageCaption: '广船知识应用 · 知识问答实际界面',
    demo: 'https://gcgj.ngsk.tech:7001/login',
    demoLabel: '访问系统（需登录）',
    // 用户已明确确认公开此组系统登录信息；其他项目不默认展示凭据。
    demoCredentials: { account: 'admin', password: '123456' },
  },
  {
    id: 'photo-collection',
    title: '摄影作品集',
    summary: '用时间与地点组织摄影作品，提供影集浏览、全屏灯箱与移动端体验，并通过图片处理管线生成适合不同屏幕的图片。',
    contribution: '独立完成 · AI 辅助开发',
    technologies: ['Astro', 'TypeScript', 'Tailwind CSS', 'GSAP', 'sharp'],
    image: '/assets/photo-collection.png',
    imageAlt: 'HAN 摄影作品集首页的真实桌面截图',
    imageCaption: '摄影网站 · 桌面首页',
    github: 'https://github.com/3125004494/photo-collection',
    demo: 'https://photo-collection-2l3.pages.dev/',
  },
  {
    id: 'time-series',
    title: '股票时序预测实验',
    summary: '复现 LSTM 次日收盘价预测，加入新闻情感特征，完成时间切分、基线对照与消融实验，建立可复现的数据处理和评估流程。',
    contribution: '独立完成 · AI 辅助开发',
    technologies: ['Python', 'PyTorch', 'pandas', 'scikit-learn', 'Matplotlib'],
    image: '/assets/stock-forecast.png',
    imageAlt: 'AAPL 的真实价格与 LSTM 预测曲线，以及对应的情感特征图',
    imageCaption: 'LSTM 实验 · 预测与真实价格对照',
  },
  {
    id: 'problem-solving',
    title: '概率统计练习网站',
    summary: '把历年试卷整理为逐题练习工具，提供作答反馈、答案解析与错题复习，支持浏览器本地保存进度和 JSON 导入导出。',
    contribution: '独立完成 · AI 辅助开发',
    technologies: ['JavaScript', 'HTML / CSS', 'MathJax', 'localStorage'],
    image: '/assets/probability-practice.png',
    imageAlt: '概率统计试卷档案馆的真实网页界面，包含试卷目录与练习内容',
    imageCaption: '练习网站 · 试卷与作答界面',
  },
  {
    id: 'english-practice',
    title: '英语练习系统',
    summary: '从 C 控制台课设扩展到 Flask 网页应用，提供英语练习、自动评分、错题回顾，以及教师题库和成绩管理，兼容原有文本数据格式。',
    contribution: '独立完成 · AI 辅助开发',
    technologies: ['C', 'Python', 'Flask', 'JavaScript', 'pytest'],
    image: '/assets/english-practice.png',
    imageAlt: '英语练习系统的真实网页界面，使用隔离的演示题目和示例学生数据',
    imageCaption: '英语练习系统 · 示例数据界面',
    github: 'https://github.com/3125004494/English-Practice-System',
  },
];
