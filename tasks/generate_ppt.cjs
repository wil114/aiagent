const pptxgen = require("pptxgenjs");

// ============================
//  全局常量与主题
// ============================
const SW = 10;
const SH = 5.625;
const PAD = 0.45;

const theme = {
  primary: "023047",    // 深蓝
  secondary: "219ebc", // 中蓝
  accent: "fb8500",     // 橙色
  light: "8ecae6",      // 浅蓝
  bg: "f8fafc",         // 浅灰白背景
  darkBg: "023047",     // 深色背景
  text: "023047",       // 主文字
  textLight: "ffffff",  // 浅色文字
  muted: "64748b",      // 次要文字
  cardBg: "ffffff",     // 卡片背景
  border: "e2e8f0",     // 边框
};

const IMG_DIR = "/workspace/app-btvkxctz25mp/tasks/ppt_images";

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "海外市场情报雷达团队";
pres.title = "海外市场情报雷达系统 — 项目展示";
pres.subject = "AI驱动的全球市场情报分析平台";

// ============================
//  辅助函数
// ============================
function addPageBadge(slide, num) {
  slide.addText(String(num), {
    x: 9.25, y: 5.15, w: 0.5, h: 0.25,
    fontSize: 10, color: theme.muted,
    align: "right", valign: "middle", fontFace: "Arial"
  });
}

function makeShadow() {
  return { type: "outer", color: "000000", blur: 6, offset: 2, angle: 135, opacity: 0.08 };
}

// ============================
//  第1页：封面（深色背景）
// ============================
const s1 = pres.addSlide();
s1.background = { color: theme.darkBg };

// 顶部装饰条
s1.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: SW, h: 0.08,
  fill: { color: theme.accent }
});

// 主标题
s1.addText("海外市场情报雷达系统", {
  x: PAD, y: 1.4, w: SW - PAD * 2, h: 0.9,
  fontSize: 44, bold: true, color: theme.textLight,
  fontFace: "微软雅黑", align: "center", valign: "middle",
  margin: 0, shrinkText: true
});

// 副标题
s1.addText("AI智览全球市场动态 · 多源分析生成战略简报", {
  x: PAD, y: 2.35, w: SW - PAD * 2, h: 0.45,
  fontSize: 18, color: theme.light,
  fontFace: "微软雅黑", align: "center", valign: "middle",
  margin: 0, shrinkText: true
});

// 分隔线
s1.addShape(pres.shapes.LINE, {
  x: 3.5, y: 3.0, w: 3.0, h: 0,
  line: { color: theme.accent, width: 2 }
});

// 团队信息
s1.addText("团队成员：3名九年级学生 + 1名指导老师", {
  x: PAD, y: 3.35, w: SW - PAD * 2, h: 0.4,
  fontSize: 16, color: theme.textLight,
  fontFace: "微软雅黑", align: "center", valign: "middle",
  margin: 0, shrinkText: true
});

// 底部标签
s1.addShape(pres.shapes.RECTANGLE, {
  x: 3.8, y: 4.0, w: 2.4, h: 0.4,
  fill: { color: theme.accent }, rectRadius: 0.2
});
s1.addText("科技创新项目", {
  x: 3.8, y: 4.0, w: 2.4, h: 0.4,
  fontSize: 14, bold: true, color: theme.textLight,
  fontFace: "微软雅黑", align: "center", valign: "middle",
  margin: 0, shrinkText: true
});

// ============================
//  第2页：目录（浅色背景）
// ============================
const s2 = pres.addSlide();
s2.background = { color: theme.bg };

s2.addText("目录", {
  x: PAD, y: PAD, w: 1.2, h: 0.7,
  fontSize: 36, bold: true, color: theme.primary,
  fontFace: "微软雅黑", align: "left", valign: "middle",
  margin: 0, shrinkText: true
});

// 底部色条
s2.addShape(pres.shapes.RECTANGLE, {
  x: PAD, y: PAD + 0.55, w: 0.6, h: 0.06,
  fill: { color: theme.accent }
});

const tocItems = [
  { num: "01", title: "痛点与市场机会", desc: "全球化企业的情报困境" },
  { num: "02", title: "系统解决方案", desc: "三层雷达 + 多Agent协作" },
  { num: "03", title: "技术创新与风控", desc: "分层分析 + 工业级安全" },
  { num: "04", title: "商业价值与ROI", desc: "量化成效与评分覆盖" },
  { num: "05", title: "团队与展望", desc: "成员介绍与项目总结" },
];

const tocStartY = 1.4;
const tocItemH = 0.65;
const tocGap = 0.18;

tocItems.forEach((item, i) => {
  const y = tocStartY + i * (tocItemH + tocGap);
  // 背景卡片
  s2.addShape(pres.shapes.RECTANGLE, {
    x: PAD, y: y, w: SW - PAD * 2, h: tocItemH,
    fill: { color: theme.cardBg }, rectRadius: 0.1,
    shadow: makeShadow()
  });
  // 左侧色块
  s2.addShape(pres.shapes.RECTANGLE, {
    x: PAD, y: y, w: 0.1, h: tocItemH,
    fill: { color: theme.accent }, rectRadius: 0.03
  });
  // 编号
  s2.addText(item.num, {
    x: PAD + 0.25, y: y, w: 0.5, h: tocItemH,
    fontSize: 20, bold: true, color: theme.accent,
    fontFace: "Arial", align: "left", valign: "middle",
    margin: 0, shrinkText: true
  });
  // 标题
  s2.addText(item.title, {
    x: PAD + 0.85, y: y, w: 3.0, h: tocItemH,
    fontSize: 16, bold: true, color: theme.primary,
    fontFace: "微软雅黑", align: "left", valign: "middle",
    margin: 0, shrinkText: true
  });
  // 描述
  s2.addText(item.desc, {
    x: PAD + 4.2, y: y, w: 4.5, h: tocItemH,
    fontSize: 13, color: theme.muted,
    fontFace: "微软雅黑", align: "left", valign: "middle",
    margin: 0, shrinkText: true
  });
});

addPageBadge(s2, 2);

// ============================
//  第3页：章节分隔 — 痛点与市场机会
// ============================
const s3 = pres.addSlide();
s3.background = { color: theme.darkBg };

s3.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: SW, h: 0.08,
  fill: { color: theme.accent }
});

s3.addText("01", {
  x: PAD, y: 1.6, w: 1.0, h: 1.0,
  fontSize: 72, bold: true, color: theme.accent,
  fontFace: "Arial", align: "left", valign: "middle",
  margin: 0, shrinkText: true
});

s3.addText("痛点与市场机会", {
  x: PAD, y: 2.7, w: SW - PAD * 2, h: 0.7,
  fontSize: 36, bold: true, color: theme.textLight,
  fontFace: "微软雅黑", align: "left", valign: "middle",
  margin: 0, shrinkText: true
});

s3.addText("全球化消费企业的情报分析困境与AI破局之道", {
  x: PAD, y: 3.45, w: SW - PAD * 2, h: 0.4,
  fontSize: 16, color: theme.light,
  fontFace: "微软雅黑", align: "left", valign: "middle",
  margin: 0, shrinkText: true
});

// ============================
//  第4页：全球化企业的情报困境（3大痛点卡片）
// ============================
const s4 = pres.addSlide();
s4.background = { color: theme.bg };

s4.addText("全球化企业的三大情报困境", {
  x: PAD, y: PAD, w: SW - PAD * 2, h: 0.6,
  fontSize: 28, bold: true, color: theme.primary,
  fontFace: "微软雅黑", align: "left", valign: "middle",
  margin: 0, shrinkText: true
});

s4.addShape(pres.shapes.RECTANGLE, {
  x: PAD, y: PAD + 0.48, w: 0.5, h: 0.05,
  fill: { color: theme.accent }
});

const painCards = [
  { icon: "⏳", title: "极度耗时", desc: "一篇包含多语种的跨市场情报简报，人工平均需要4-6小时完成。", color: "e76f51" },
  { icon: "🌫️", title: "幻觉与噪音", desc: "通用大模型常编造不存在的法规，或被单一水军帖误导判断。", color: "f4a261" },
  { icon: "📉", title: "错失窗口期", desc: "日本降价、美国合规收紧等信号，往往在两周后才传导到国内。", color: "2a9d8f" },
];

const cardW = (SW - PAD * 2 - 0.3 * 2) / 3;
const cardH = 2.8;
const cardY = 1.5;

painCards.forEach((card, i) => {
  const x = PAD + i * (cardW + 0.3);
  // 卡片背景
  s4.addShape(pres.shapes.RECTANGLE, {
    x: x, y: cardY, w: cardW, h: cardH,
    fill: { color: theme.cardBg }, rectRadius: 0.12,
    shadow: makeShadow()
  });
  // 顶部色条
  s4.addShape(pres.shapes.RECTANGLE, {
    x: x, y: cardY, w: cardW, h: 0.1,
    fill: { color: card.color }, rectRadius: 0.03
  });
  // 图标
  s4.addText(card.icon, {
    x: x + cardW / 2 - 0.3, y: cardY + 0.35, w: 0.6, h: 0.6,
    fontSize: 32, align: "center", valign: "middle",
    margin: 0, shrinkText: true
  });
  // 标题
  s4.addText(card.title, {
    x: x + 0.15, y: cardY + 1.05, w: cardW - 0.3, h: 0.4,
    fontSize: 18, bold: true, color: card.color,
    fontFace: "微软雅黑", align: "center", valign: "middle",
    margin: 0, shrinkText: true
  });
  // 描述
  s4.addText(card.desc, {
    x: x + 0.15, y: cardY + 1.5, w: cardW - 0.3, h: 1.1,
    fontSize: 14, color: theme.text,
    fontFace: "微软雅黑", align: "center", valign: "top",
    margin: 0.05, shrinkText: true
  });
});

addPageBadge(s4, 4);

// ============================
//  第5页：章节分隔 — 系统解决方案
// ============================
const s5 = pres.addSlide();
s5.background = { color: theme.darkBg };

s5.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: SW, h: 0.08,
  fill: { color: theme.accent }
});

s5.addText("02", {
  x: PAD, y: 1.6, w: 1.0, h: 1.0,
  fontSize: 72, bold: true, color: theme.accent,
  fontFace: "Arial", align: "left", valign: "middle",
  margin: 0, shrinkText: true
});

s5.addText("系统解决方案", {
  x: PAD, y: 2.7, w: SW - PAD * 2, h: 0.7,
  fontSize: 36, bold: true, color: theme.textLight,
  fontFace: "微软雅黑", align: "left", valign: "middle",
  margin: 0, shrinkText: true
});

s5.addText("三层雷达架构 × 多Agent协作 × 工业级风控", {
  x: PAD, y: 3.45, w: SW - PAD * 2, h: 0.4,
  fontSize: 16, color: theme.light,
  fontFace: "微软雅黑", align: "left", valign: "middle",
  margin: 0, shrinkText: true
});

// ============================
//  第6页：三层雷达系统架构（图片页）
// ============================
const s6 = pres.addSlide();
s6.background = { color: theme.bg };

s6.addText("三层雷达系统架构", {
  x: PAD, y: PAD, w: SW - PAD * 2, h: 0.6,
  fontSize: 28, bold: true, color: theme.primary,
  fontFace: "微软雅黑", align: "left", valign: "middle",
  margin: 0, shrinkText: true
});

s6.addShape(pres.shapes.RECTANGLE, {
  x: PAD, y: PAD + 0.48, w: 0.5, h: 0.05,
  fill: { color: theme.accent }
});

// 架构图片
s6.addImage({
  path: IMG_DIR + "/architecture.png",
  x: PAD, y: 1.1, w: SW - PAD * 2, h: 3.8,
  sizing: { type: "contain", w: SW - PAD * 2, h: 3.8 }
});

addPageBadge(s6, 6);

// ============================
//  第7页：多Agent协作流水线（图片页）
// ============================
const s7 = pres.addSlide();
s7.background = { color: theme.bg };

s7.addText("多Agent协作流水线", {
  x: PAD, y: PAD, w: SW - PAD * 2, h: 0.6,
  fontSize: 28, bold: true, color: theme.primary,
  fontFace: "微软雅黑", align: "left", valign: "middle",
  margin: 0, shrinkText: true
});

s7.addShape(pres.shapes.RECTANGLE, {
  x: PAD, y: PAD + 0.48, w: 0.5, h: 0.05,
  fill: { color: theme.accent }
});

s7.addImage({
  path: IMG_DIR + "/agent_pipeline.png",
  x: PAD, y: 1.1, w: SW - PAD * 2, h: 3.5,
  sizing: { type: "contain", w: SW - PAD * 2, h: 3.5 }
});

// 底部补充说明
s7.addText("采集Agent → 分析Agent → Validator风控校验 → 人工复核终审，四层把关确保输出质量", {
  x: PAD, y: 4.7, w: SW - PAD * 2, h: 0.35,
  fontSize: 13, color: theme.muted,
  fontFace: "微软雅黑", align: "center", valign: "middle",
  margin: 0, shrinkText: true
});

addPageBadge(s7, 7);

// ============================
//  第8页：章节分隔 — 技术创新与风控
// ============================
const s8 = pres.addSlide();
s8.background = { color: theme.darkBg };

s8.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: SW, h: 0.08,
  fill: { color: theme.accent }
});

s8.addText("03", {
  x: PAD, y: 1.6, w: 1.0, h: 1.0,
  fontSize: 72, bold: true, color: theme.accent,
  fontFace: "Arial", align: "left", valign: "middle",
  margin: 0, shrinkText: true
});

s8.addText("技术创新与风控", {
  x: PAD, y: 2.7, w: SW - PAD * 2, h: 0.7,
  fontSize: 36, bold: true, color: theme.textLight,
  fontFace: "微软雅黑", align: "left", valign: "middle",
  margin: 0, shrinkText: true
});

s8.addText("L1-L2-L3分层分析 × 跨市场时差雷达 × 工业级安全体系", {
  x: PAD, y: 3.45, w: SW - PAD * 2, h: 0.4,
  fontSize: 16, color: theme.light,
  fontFace: "微软雅黑", align: "left", valign: "middle",
  margin: 0, shrinkText: true
});

// ============================
//  第9页：L1-L2-L3分层分析详解（2x2网格）
// ============================
const s9 = pres.addSlide();
s9.background = { color: theme.bg };

s9.addText("L1-L2-L3 分层分析详解", {
  x: PAD, y: PAD, w: SW - PAD * 2, h: 0.6,
  fontSize: 28, bold: true, color: theme.primary,
  fontFace: "微软雅黑", align: "left", valign: "middle",
  margin: 0, shrinkText: true
});

s9.addShape(pres.shapes.RECTANGLE, {
  x: PAD, y: PAD + 0.48, w: 0.5, h: 0.05,
  fill: { color: theme.accent }
});

const gridItems = [
  { title: "L1 信号采集层", color: theme.primary,
    points: ["百度AI搜索实时抓取全网情报", "多语种信源自动汇总与去重", "覆盖美/日/韩/东南亚/中国内地", "平均响应时间 < 30秒"] },
  { title: "L2 洞察分析层", color: theme.secondary,
    points: ["文心大模型深度语义解析", "变化检测：什么变了/和谁比/速度", "多源交叉验证提升置信度", "生成人话版战略解读"] },
  { title: "L3 跨市场传导层", color: theme.accent,
    points: ["识别领先市场 vs 滞后市场", "量化窗口期与传导路径", "时差雷达：提前5天预测波动", "命中率高达85%"] },
  { title: "输出：战略简报", color: "2a9d8f",
    points: ["完整版：全量数据+深度分析", "精简版：仅展示关键事件", "应急版：仅限紧急critical事件", "支持版本回滚与人工标记"] },
];

const gW = (SW - PAD * 2 - 0.25) / 2;
const gH = 1.75;
const gGap = 0.2;
const gStartY = 1.4;

gridItems.forEach((item, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = PAD + col * (gW + 0.25);
  const y = gStartY + row * (gH + gGap);

  s9.addShape(pres.shapes.RECTANGLE, {
    x: x, y: y, w: gW, h: gH,
    fill: { color: theme.cardBg }, rectRadius: 0.1,
    shadow: makeShadow()
  });
  // 顶部色条
  s9.addShape(pres.shapes.RECTANGLE, {
    x: x, y: y, w: gW, h: 0.08,
    fill: { color: item.color }, rectRadius: 0.02
  });
  // 标题
  s9.addText(item.title, {
    x: x + 0.12, y: y + 0.15, w: gW - 0.24, h: 0.35,
    fontSize: 15, bold: true, color: item.color,
    fontFace: "微软雅黑", align: "left", valign: "middle",
    margin: 0, shrinkText: true
  });
  // 要点
  const bulletText = item.points.map((p, idx) => ({
    text: p, options: { bullet: true, breakLine: idx < item.points.length - 1, fontSize: 13, color: theme.text }
  }));
  s9.addText(bulletText, {
    x: x + 0.12, y: y + 0.5, w: gW - 0.24, h: gH - 0.6,
    fontFace: "微软雅黑", align: "left", valign: "top",
    margin: 0.05
  });
});

addPageBadge(s9, 9);

// ============================
//  第10页：跨市场机会时差雷达
// ============================
const s10 = pres.addSlide();
s10.background = { color: theme.bg };

s10.addText("跨市场机会时差雷达", {
  x: PAD, y: PAD, w: SW - PAD * 2, h: 0.6,
  fontSize: 28, bold: true, color: theme.primary,
  fontFace: "微软雅黑", align: "left", valign: "middle",
  margin: 0, shrinkText: true
});

s10.addShape(pres.shapes.RECTANGLE, {
  x: PAD, y: PAD + 0.48, w: 0.5, h: 0.05,
  fill: { color: theme.accent }
});

// 左侧大数字
const bigNumY = 1.5;
const bigNumH = 1.3;
const bigNumW = 2.6;

s10.addShape(pres.shapes.RECTANGLE, {
  x: PAD, y: bigNumY, w: bigNumW, h: bigNumH,
  fill: { color: theme.accent }, rectRadius: 0.15, transparency: 12
});

s10.addText("85%", {
  x: PAD, y: bigNumY + 0.15, w: bigNumW, h: 0.85,
  fontSize: 56, bold: true, color: theme.accent,
  fontFace: "Arial", align: "center", valign: "middle",
  margin: 0, shrinkText: true
});

s10.addText("跨市场传导命中率", {
  x: PAD, y: bigNumY + 0.95, w: bigNumW, h: 0.3,
  fontSize: 13, color: theme.text,
  fontFace: "微软雅黑", align: "center", valign: "middle",
  margin: 0, shrinkText: true
});

// 右侧说明卡片
const rightX = PAD + bigNumW + 0.3;
const rightW = SW - rightX - PAD;

const radarPoints = [
  { label: "领先市场", desc: "政策变化/价格波动的首发地", color: theme.primary },
  { label: "滞后市场", desc: "信号尚未传导到的目标市场", color: theme.secondary },
  { label: "窗口期", desc: "提前5.2天预警的可行动时间", color: theme.accent },
];

radarPoints.forEach((pt, i) => {
  const y = bigNumY + i * 0.72;
  s10.addShape(pres.shapes.RECTANGLE, {
    x: rightX, y: y, w: rightW, h: 0.58,
    fill: { color: theme.cardBg }, rectRadius: 0.08,
    shadow: makeShadow()
  });
  // 彩色圆点
  s10.addShape(pres.shapes.OVAL, {
    x: rightX + 0.15, y: y + 0.19, w: 0.2, h: 0.2,
    fill: { color: pt.color }
  });
  s10.addText(pt.label, {
    x: rightX + 0.45, y: y, w: 1.5, h: 0.58,
    fontSize: 14, bold: true, color: pt.color,
    fontFace: "微软雅黑", align: "left", valign: "middle",
    margin: 0, shrinkText: true
  });
  s10.addText(pt.desc, {
    x: rightX + 2.2, y: y, w: rightW - 2.4, h: 0.58,
    fontSize: 13, color: theme.text,
    fontFace: "微软雅黑", align: "left", valign: "middle",
    margin: 0, shrinkText: true
  });
});

// 底部案例
s10.addShape(pres.shapes.RECTANGLE, {
  x: PAD, y: 3.9, w: SW - PAD * 2, h: 0.9,
  fill: { color: theme.cardBg }, rectRadius: 0.1,
  shadow: makeShadow()
});

s10.addText("标杆案例", {
  x: PAD + 0.15, y: 3.9, w: 1.2, h: 0.35,
  fontSize: 13, bold: true, color: theme.accent,
  fontFace: "微软雅黑", align: "left", valign: "middle",
  margin: 0, shrinkText: true
});

s10.addText("日本市场培育钻石价格战信号，经L3层传导分析预测将在7-10天后影响东南亚Shopee平台。系统提前发出预警，客户及时调整定价策略，避免被动跟随降价。", {
  x: PAD + 0.15, y: 4.25, w: SW - PAD * 2 - 0.3, h: 0.5,
  fontSize: 13, color: theme.text,
  fontFace: "微软雅黑", align: "left", valign: "top",
  margin: 0.02, shrinkText: true
});

addPageBadge(s10, 10);

// ============================
//  第11页：工业级风控体系（图片页）
// ============================
const s11 = pres.addSlide();
s11.background = { color: theme.bg };

s11.addText("工业级风控安全体系", {
  x: PAD, y: PAD, w: SW - PAD * 2, h: 0.6,
  fontSize: 28, bold: true, color: theme.primary,
  fontFace: "微软雅黑", align: "left", valign: "middle",
  margin: 0, shrinkText: true
});

s11.addShape(pres.shapes.RECTANGLE, {
  x: PAD, y: PAD + 0.48, w: 0.5, h: 0.05,
  fill: { color: theme.accent }
});

s11.addImage({
  path: IMG_DIR + "/risk_control.png",
  x: PAD, y: 1.1, w: SW - PAD * 2, h: 3.8,
  sizing: { type: "contain", w: SW - PAD * 2, h: 3.8 }
});

addPageBadge(s11, 11);

// ============================
//  第12页：章节分隔 — 商业价值与ROI
// ============================
const s12 = pres.addSlide();
s12.background = { color: theme.darkBg };

s12.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: SW, h: 0.08,
  fill: { color: theme.accent }
});

s12.addText("04", {
  x: PAD, y: 1.6, w: 1.0, h: 1.0,
  fontSize: 72, bold: true, color: theme.accent,
  fontFace: "Arial", align: "left", valign: "middle",
  margin: 0, shrinkText: true
});

s12.addText("商业价值与ROI", {
  x: PAD, y: 2.7, w: SW - PAD * 2, h: 0.7,
  fontSize: 36, bold: true, color: theme.textLight,
  fontFace: "微软雅黑", align: "left", valign: "middle",
  margin: 0, shrinkText: true
});

s12.addText("量化成效展示与六大评分维度全覆盖", {
  x: PAD, y: 3.45, w: SW - PAD * 2, h: 0.4,
  fontSize: 16, color: theme.light,
  fontFace: "微软雅黑", align: "left", valign: "middle",
  margin: 0, shrinkText: true
});

// ============================
//  第13页：业务价值看板（4大数据卡片）
// ============================
const s13 = pres.addSlide();
s13.background = { color: theme.bg };

s13.addText("业务价值看板", {
  x: PAD, y: PAD, w: SW - PAD * 2, h: 0.6,
  fontSize: 28, bold: true, color: theme.primary,
  fontFace: "微软雅黑", align: "left", valign: "middle",
  margin: 0, shrinkText: true
});

s13.addShape(pres.shapes.RECTANGLE, {
  x: PAD, y: PAD + 0.48, w: 0.5, h: 0.05,
  fill: { color: theme.accent }
});

const kpiCards = [
  { value: "1,240", unit: "小时", label: "节省调研时间", sub: "≈ 3名全职分析师产能", color: theme.primary },
  { value: "12", unit: "项", label: "发现商机", sub: "已采纳4项战略动作", color: "2a9d8f" },
  { value: "8", unit: "次", label: "早期风险预警", sub: "平均提前5.2天预警", color: theme.accent },
  { value: "85%", unit: "", label: "跨市场传导命中率", sub: "成功预测6起市场波动", color: theme.secondary },
];

const kpiW = (SW - PAD * 2 - 0.25 * 3) / 4;
const kpiH = 2.0;
const kpiY = 1.4;

kpiCards.forEach((kpi, i) => {
  const x = PAD + i * (kpiW + 0.25);
  s13.addShape(pres.shapes.RECTANGLE, {
    x: x, y: kpiY, w: kpiW, h: kpiH,
    fill: { color: theme.cardBg }, rectRadius: 0.12,
    shadow: makeShadow()
  });
  // 顶部色条
  s13.addShape(pres.shapes.RECTANGLE, {
    x: x, y: kpiY, w: kpiW, h: 0.08,
    fill: { color: kpi.color }, rectRadius: 0.02
  });
  // 大数字
  s13.addText(kpi.value, {
    x: x, y: kpiY + 0.25, w: kpiW, h: 0.85,
    fontSize: 42, bold: true, color: kpi.color,
    fontFace: "Arial", align: "center", valign: "middle",
    margin: 0, shrinkText: true
  });
  // 单位
  if (kpi.unit) {
    s13.addText(kpi.unit, {
      x: x, y: kpiY + 1.05, w: kpiW, h: 0.25,
      fontSize: 12, color: theme.muted,
      fontFace: "微软雅黑", align: "center", valign: "middle",
      margin: 0, shrinkText: true
    });
  }
  // 标签
  s13.addText(kpi.label, {
    x: x, y: kpiY + 1.3, w: kpiW, h: 0.3,
    fontSize: 13, bold: true, color: theme.text,
    fontFace: "微软雅黑", align: "center", valign: "middle",
    margin: 0, shrinkText: true
  });
  // 子说明
  s13.addText(kpi.sub, {
    x: x + 0.08, y: kpiY + 1.58, w: kpiW - 0.16, h: 0.32,
    fontSize: 10, color: theme.muted,
    fontFace: "微软雅黑", align: "center", valign: "middle",
    margin: 0, shrinkText: true
  });
});

// 底部管理者视角
s13.addShape(pres.shapes.RECTANGLE, {
  x: PAD, y: 3.7, w: SW - PAD * 2, h: 1.1,
  fill: { color: theme.cardBg }, rectRadius: 0.1,
  shadow: makeShadow()
});

s13.addText("👋 早安，管理者！", {
  x: PAD + 0.15, y: 3.7, w: 2.5, h: 0.35,
  fontSize: 14, bold: true, color: theme.primary,
  fontFace: "微软雅黑", align: "left", valign: "middle",
  margin: 0, shrinkText: true
});

s13.addText("系统以「白话总结」替代晦涩技术指标，每日自动推送2项关键决策建议，让业务负责人无需阅读技术报告即可快速行动。", {
  x: PAD + 0.15, y: 4.05, w: SW - PAD * 2 - 0.3, h: 0.65,
  fontSize: 13, color: theme.text,
  fontFace: "微软雅黑", align: "left", valign: "top",
  margin: 0.02, shrinkText: true
});

addPageBadge(s13, 13);

// ============================
//  第14页：评分维度全面覆盖（表格页）
// ============================
const s14 = pres.addSlide();
s14.background = { color: theme.bg };

s14.addText("六大评分维度全覆盖", {
  x: PAD, y: PAD, w: SW - PAD * 2, h: 0.6,
  fontSize: 28, bold: true, color: theme.primary,
  fontFace: "微软雅黑", align: "left", valign: "middle",
  margin: 0, shrinkText: true
});

s14.addShape(pres.shapes.RECTANGLE, {
  x: PAD, y: PAD + 0.48, w: 0.5, h: 0.05,
  fill: { color: theme.accent }
});

const tableData = [
  [
    { text: "评分维度", options: { fill: { color: theme.primary }, color: theme.textLight, bold: true, fontSize: 13 } },
    { text: "权重", options: { fill: { color: theme.primary }, color: theme.textLight, bold: true, fontSize: 13 } },
    { text: "系统对应亮点", options: { fill: { color: theme.primary }, color: theme.textLight, bold: true, fontSize: 13 } },
  ],
  ["创新 Innovation", "15%", "三层雷达架构 + 跨市场时差预测 + 多Agent协作"],
  ["技术 Technical", "20%", "流式SSE实时推送 + 多源评分风控 + Validator二次校验"],
  ["商业 Business", "25%", "ROI看板 + 节省1240小时 + 12项商机 + 85%命中率"],
  ["风控 Risk Control", "20%", "20%熔断阈值 + 降级策略 + 人工接管 + 回滚机制"],
  ["演示 Demo", "10%", "5步故事线路演模式 + Demo引导页 + 版本切换"],
  ["非技术 Non-tech", "10%", "业务负责人视角 + 白话总结 + 今日行动指令"],
];

const TBL_W = SW - PAD * 2;
const colW = [2.0, 1.2, 5.6];

s14.addTable(tableData, {
  x: PAD, y: 1.3, w: TBL_W,
  colW: colW,
  rowH: 0.52,
  fontSize: 12,
  fontFace: "微软雅黑",
  border: { pt: 0.5, color: theme.border },
  fill: { color: theme.cardBg },
  color: theme.text,
  valign: "middle",
});

// 底部总结
s14.addText("系统在设计之初即围绕评分标准进行针对性优化，确保每个维度都有明确的功能支撑和数据验证。", {
  x: PAD, y: 4.55, w: SW - PAD * 2, h: 0.4,
  fontSize: 13, color: theme.muted,
  fontFace: "微软雅黑", align: "center", valign: "middle",
  margin: 0, shrinkText: true
});

addPageBadge(s14, 14);

// ============================
//  第15页：章节分隔 — 团队与展望
// ============================
const s15 = pres.addSlide();
s15.background = { color: theme.darkBg };

s15.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: SW, h: 0.08,
  fill: { color: theme.accent }
});

s15.addText("05", {
  x: PAD, y: 1.6, w: 1.0, h: 1.0,
  fontSize: 72, bold: true, color: theme.accent,
  fontFace: "Arial", align: "left", valign: "middle",
  margin: 0, shrinkText: true
});

s15.addText("团队与展望", {
  x: PAD, y: 2.7, w: SW - PAD * 2, h: 0.7,
  fontSize: 36, bold: true, color: theme.textLight,
  fontFace: "微软雅黑", align: "left", valign: "middle",
  margin: 0, shrinkText: true
});

s15.addText("三名九年级学生 + 一名指导老师，共同构建全球化情报雷达", {
  x: PAD, y: 3.45, w: SW - PAD * 2, h: 0.4,
  fontSize: 16, color: theme.light,
  fontFace: "微软雅黑", align: "left", valign: "middle",
  margin: 0, shrinkText: true
});

// ============================
//  第16页：团队介绍
// ============================
const s16 = pres.addSlide();
s16.background = { color: theme.bg };

s16.addText("团队介绍", {
  x: PAD, y: PAD, w: SW - PAD * 2, h: 0.6,
  fontSize: 28, bold: true, color: theme.primary,
  fontFace: "微软雅黑", align: "left", valign: "middle",
  margin: 0, shrinkText: true
});

s16.addShape(pres.shapes.RECTANGLE, {
  x: PAD, y: PAD + 0.48, w: 0.5, h: 0.05,
  fill: { color: theme.accent }
});

const members = [
  { role: "队长 / 全栈开发", name: "学生A", desc: "负责系统架构设计、前端开发、Agent流水线实现", color: theme.primary },
  { role: "算法与数据分析", name: "学生B", desc: "负责AI模型对接、风控算法、跨市场传导模型", color: theme.secondary },
  { role: "产品与设计", name: "学生C", desc: "负责UI/UX设计、PPT制作、路演演示策划", color: theme.accent },
  { role: "指导老师", name: "老师", desc: "负责项目方向把控、技术指导、答辩策略", color: "2a9d8f" },
];

const memW = (SW - PAD * 2 - 0.2 * 3) / 4;
const memH = 2.6;
const memY = 1.4;

members.forEach((mem, i) => {
  const x = PAD + i * (memW + 0.2);
  s16.addShape(pres.shapes.RECTANGLE, {
    x: x, y: memY, w: memW, h: memH,
    fill: { color: theme.cardBg }, rectRadius: 0.15,
    shadow: makeShadow()
  });
  // 顶部色条
  s16.addShape(pres.shapes.RECTANGLE, {
    x: x, y: memY, w: memW, h: 0.1,
    fill: { color: mem.color }, rectRadius: 0.03
  });
  // 头像占位圆形
  s16.addShape(pres.shapes.OVAL, {
    x: x + memW / 2 - 0.35, y: memY + 0.3, w: 0.7, h: 0.7,
    fill: { color: mem.color }, transparency: 15
  });
  s16.addText("👤", {
    x: x + memW / 2 - 0.25, y: memY + 0.38, w: 0.5, h: 0.5,
    fontSize: 22, align: "center", valign: "middle",
    margin: 0, shrinkText: true
  });
  // 姓名
  s16.addText(mem.name, {
    x: x, y: memY + 1.1, w: memW, h: 0.35,
    fontSize: 16, bold: true, color: mem.color,
    fontFace: "微软雅黑", align: "center", valign: "middle",
    margin: 0, shrinkText: true
  });
  // 角色
  s16.addText(mem.role, {
    x: x, y: memY + 1.45, w: memW, h: 0.25,
    fontSize: 12, bold: true, color: theme.text,
    fontFace: "微软雅黑", align: "center", valign: "middle",
    margin: 0, shrinkText: true
  });
  // 描述
  s16.addText(mem.desc, {
    x: x + 0.1, y: memY + 1.75, w: memW - 0.2, h: 0.7,
    fontSize: 11, color: theme.muted,
    fontFace: "微软雅黑", align: "center", valign: "top",
    margin: 0.05, shrinkText: true
  });
});

addPageBadge(s16, 16);

// ============================
//  第17页：项目特色总结（5个亮点）
// ============================
const s17 = pres.addSlide();
s17.background = { color: theme.bg };

s17.addText("五大项目特色", {
  x: PAD, y: PAD, w: SW - PAD * 2, h: 0.6,
  fontSize: 28, bold: true, color: theme.primary,
  fontFace: "微软雅黑", align: "left", valign: "middle",
  margin: 0, shrinkText: true
});

s17.addShape(pres.shapes.RECTANGLE, {
  x: PAD, y: PAD + 0.48, w: 0.5, h: 0.05,
  fill: { color: theme.accent }
});

const highlights = [
  { num: "01", title: "独创三层雷达", desc: "L1采集→L2洞察→L3传导，从信号到战略的完整链路" },
  { num: "02", title: "多Agent协作", desc: "4个AI Agent各司其职，流水线式作业，效率倍增" },
  { num: "03", title: "工业级风控", desc: "20%熔断阈值、降级策略、人工接管，保障系统安全" },
  { num: "04", title: "业务视角优先", desc: "白话总结替代技术指标，让非技术管理者秒懂情报" },
  { num: "05", title: "跨市场时差预测", desc: "85%命中率，平均提前5.2天预警市场波动" },
];

const hlStartY = 1.35;
const hlItemH = 0.58;
const hlGap = 0.15;

highlights.forEach((item, i) => {
  const y = hlStartY + i * (hlItemH + hlGap);
  // 背景
  s17.addShape(pres.shapes.RECTANGLE, {
    x: PAD, y: y, w: SW - PAD * 2, h: hlItemH,
    fill: { color: theme.cardBg }, rectRadius: 0.08,
    shadow: makeShadow()
  });
  // 编号圆形
  s17.addShape(pres.shapes.OVAL, {
    x: PAD + 0.15, y: y + 0.12, w: 0.35, h: 0.35,
    fill: { color: theme.accent }
  });
  s17.addText(item.num, {
    x: PAD + 0.15, y: y + 0.12, w: 0.35, h: 0.35,
    fontSize: 11, bold: true, color: theme.textLight,
    fontFace: "Arial", align: "center", valign: "middle",
    margin: 0, shrinkText: true
  });
  // 标题
  s17.addText(item.title, {
    x: PAD + 0.65, y: y, w: 2.2, h: hlItemH,
    fontSize: 15, bold: true, color: theme.primary,
    fontFace: "微软雅黑", align: "left", valign: "middle",
    margin: 0, shrinkText: true
  });
  // 描述
  s17.addText(item.desc, {
    x: PAD + 3.1, y: y, w: SW - PAD * 2 - 3.3, h: hlItemH,
    fontSize: 13, color: theme.text,
    fontFace: "微软雅黑", align: "left", valign: "middle",
    margin: 0, shrinkText: true
  });
});

addPageBadge(s17, 17);

// ============================
//  第18页：结尾（深色背景）
// ============================
const s18 = pres.addSlide();
s18.background = { color: theme.darkBg };

s18.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: SW, h: 0.08,
  fill: { color: theme.accent }
});

s18.addText("感谢聆听", {
  x: PAD, y: 1.6, w: SW - PAD * 2, h: 1.0,
  fontSize: 48, bold: true, color: theme.textLight,
  fontFace: "微软雅黑", align: "center", valign: "middle",
  margin: 0, shrinkText: true
});

s18.addText("海外市场情报雷达系统", {
  x: PAD, y: 2.7, w: SW - PAD * 2, h: 0.5,
  fontSize: 20, color: theme.light,
  fontFace: "微软雅黑", align: "center", valign: "middle",
  margin: 0, shrinkText: true
});

// 分隔线
s18.addShape(pres.shapes.LINE, {
  x: 3.5, y: 3.3, w: 3.0, h: 0,
  line: { color: theme.accent, width: 2 }
});

s18.addText("欢迎评委老师提问与指导", {
  x: PAD, y: 3.55, w: SW - PAD * 2, h: 0.4,
  fontSize: 16, color: theme.textLight,
  fontFace: "微软雅黑", align: "center", valign: "middle",
  margin: 0, shrinkText: true
});

// 保存
pres.writeFile({ fileName: "/workspace/app-btvkxctz25mp/tasks/海外市场情报雷达系统_项目展示.pptx" });
console.log("PPT已生成：/workspace/app-btvkxctz25mp/tasks/海外市场情报雷达系统_项目展示.pptx");
