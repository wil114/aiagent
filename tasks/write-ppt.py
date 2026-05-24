import os

js_code = r"""
const pptxgen = require("pptxgenjs");

const SW = 10, SH = 5.625, PAD = 0.4;
const theme = {
  primary: "0070F3", secondary: "4A4E69", accent: "D4AF37", dark: "0A0A0A",
  light: "F7F7F7", white: "FFFFFF", muted: "737373", success: "10B981",
  warning: "F59E0B", danger: "EF4444", info: "3B82F6",
};

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "翻斗花园牛爷爷";
pres.title = "海外市场情报雷达系统 - 项目路演";

function addPageBadge(slide, num) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 9.15, y: 5.2, w: 0.5, h: 0.25, fill: { color: theme.primary }, rectRadius: 0.12,
  });
  slide.addText(String(num), {
    x: 9.15, y: 5.2, w: 0.5, h: 0.25, fontSize: 10, color: theme.white, bold: true, align: "center", valign: "middle", margin: 0,
  });
}

// 1. 封面
const s1 = pres.addSlide();
s1.background = { color: theme.white };
s1.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: SW, h: 0.08, fill: { color: theme.accent }});
s1.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.2, w: 0.08, h: 3.5, fill: { color: theme.primary }, rectRadius: 0.04});
s1.addText("海外市场情报雷达系统", { x: 0.8, y: 1.3, w: 8, h: 1.0, fontSize: 44, bold: true, color: theme.dark, fontFace: "Microsoft YaHei", margin: 0, shrinkText: true});
s1.addText("AI驱动 · 3+1人机协同 · 实时战略决策", { x: 0.8, y: 2.4, w: 8, h: 0.5, fontSize: 20, color: theme.secondary, fontFace: "Microsoft YaHei", margin: 0});
s1.addShape(pres.shapes.LINE, { x: 0.8, y: 3.0, w: 5, h: 0, line: { color: theme.accent, width: 2 }});
s1.addText("翻斗花园牛爷爷", { x: 0.8, y: 3.3, w: 5, h: 0.4, fontSize: 16, bold: true, color: theme.primary, fontFace: "Microsoft YaHei", margin: 0});
s1.addText("3名人类 + 1名AI | 珠宝出海 × Vibe Coding", { x: 0.8, y: 3.7, w: 5, h: 0.3, fontSize: 12, color: theme.muted, fontFace: "Microsoft YaHei", margin: 0});

for (let i=0; i<3; i++) {
  s1.addShape(pres.shapes.OVAL, { x: 7.2 + (1.2 - (i+1)*0.35), y: 1.5 + (1.2 - (i+1)*0.35), w: (i+1)*0.7, h: (i+1)*0.7, fill: { color: theme.primary, transparency: 8 - i*2 }, line: { color: theme.primary, width: 1 }});
}

// 2. 目录
const s2 = pres.addSlide();
s2.background = { color: theme.light };
addPageBadge(s2, 2);
s2.addText("路演议程", { x: PAD, y: PAD, w: 4, h: 0.6, fontSize: 36, bold: true, color: theme.dark, fontFace: "Microsoft YaHei", margin: 0});
const tocItems = [
  { num: "01", title: "业务痛点", desc: "珠宝出海的真实现状" },
  { num: "02", title: "解决方案与Vibe Coding", desc: "Agent架构与技术实现" },
  { num: "03", title: "系统界面展示", desc: "核心功能与产品截图" },
  { num: "04", title: "风控与安全机制", desc: "幻觉校验与熔断降级" },
  { num: "05", title: "团队与落地价值", desc: "3+1人机协同与总结" },
];
tocItems.forEach((item, i) => {
  const cardX = PAD + (i % 2) * 4.8;
  const cardY = 1.1 + Math.floor(i / 2) * 1.4;
  s2.addShape(pres.shapes.RECTANGLE, { x: cardX, y: cardY, w: 4.4, h: 1.1, fill: { color: theme.white }, rectRadius: 0.1, shadow: { type: "outer", opacity: 0.08 }});
  s2.addText(item.num, { x: cardX+0.2, y: cardY+0.2, w: 0.8, h: 0.5, fontSize: 28, bold: true, color: theme.primary, align: "left", valign: "top", margin: 0});
  s2.addText(item.title, { x: cardX+1.1, y: cardY+0.2, w: 3.1, h: 0.4, fontSize: 18, bold: true, color: theme.dark, fontFace: "Microsoft YaHei", margin: 0, shrinkText: true});
  s2.addText(item.desc, { x: cardX+1.1, y: cardY+0.65, w: 3.1, h: 0.3, fontSize: 12, color: theme.muted, fontFace: "Microsoft YaHei", margin: 0});
});

// 3. 章节1
const s3 = pres.addSlide();
s3.background = { color: theme.secondary };
addPageBadge(s3, 3);
s3.addText("01", { x: PAD, y: 1.5, w: 2, h: 1.2, fontSize: 72, bold: true, color: "FFFFFF", fontFace: "Arial", margin: 0});
s3.addText("业务痛点", { x: PAD, y: 2.7, w: 6, h: 0.7, fontSize: 36, bold: true, color: "FFFFFF", fontFace: "Microsoft YaHei", margin: 0});
s3.addText("出海企业面临的决策困境", { x: PAD, y: 3.4, w: 6, h: 0.4, fontSize: 14, color: "C9ADA7", fontFace: "Microsoft YaHei", margin: 0});

// 4. 痛点详情
const s4 = pres.addSlide();
s4.background = { color: theme.white };
addPageBadge(s4, 4);
s4.addText("出海企业：信息即命脉，滞后即天价", { x: PAD, y: PAD, w: 8, h: 0.6, fontSize: 28, bold: true, color: theme.dark, fontFace: "Microsoft YaHei", margin: 0});
const painPoints = [
  { icon: "🌍", title: "市场极度分散", desc: "覆盖中/日/韩/美等市场，多语言信源人工监控成本极高" },
  { icon: "⏱️", title: "反应严重滞后", desc: "竞品降价后3周才获知，错失最佳防御窗口，损失大量营收" },
  { icon: "🤖", title: "AI幻觉风险", desc: "通用大模型易生成绝对化表述，未经校验直接用于业务决策会带来合规灾难" },
];
painPoints.forEach((p, i) => {
  s4.addShape(pres.shapes.RECTANGLE, { x: PAD + i*3.1, y: 1.1, w: 2.9, h: 3.0, fill: { color: theme.light }, rectRadius: 0.1});
  s4.addText(p.icon, { x: PAD + i*3.1 + 0.2, y: 1.3, w: 2.5, h: 0.5, fontSize: 32, margin: 0});
  s4.addText(p.title, { x: PAD + i*3.1 + 0.2, y: 1.85, w: 2.5, h: 0.4, fontSize: 18, bold: true, color: theme.dark, fontFace: "Microsoft YaHei", margin: 0, shrinkText: true});
  s4.addText(p.desc, { x: PAD + i*3.1 + 0.2, y: 2.3, w: 2.5, h: 1.6, fontSize: 13, color: theme.muted, fontFace: "Microsoft YaHei", margin: 0, autoFit: true});
});
s4.addShape(pres.shapes.RECTANGLE, { x: PAD, y: 4.35, w: SW-PAD*2, h: 0.7, fill: { color: "FEF9E7" }, rectRadius: 0.08, line: { color: theme.accent, width: 1 }});
s4.addText("目标用户：全球珠宝出海集团 | 业务痛点：情报分析人效低、准确率低、响应慢", { x: PAD+0.2, y: 4.35, w: SW-PAD*2-0.4, h: 0.7, fontSize: 13, color: theme.secondary, fontFace: "Microsoft YaHei", margin: 0});

// 5. 章节2
const s5 = pres.addSlide();
s5.background = { color: theme.primary };
addPageBadge(s5, 5);
s5.addText("02", { x: PAD, y: 1.5, w: 2, h: 1.2, fontSize: 72, bold: true, color: "FFFFFF", fontFace: "Arial", margin: 0});
s5.addText("解决方案与Vibe Coding", { x: PAD, y: 2.7, w: 7, h: 0.7, fontSize: 36, bold: true, color: "FFFFFF", fontFace: "Microsoft YaHei", margin: 0});
s5.addText("Agent协作流水线及创新开发范式", { x: PAD, y: 3.4, w: 6, h: 0.4, fontSize: 14, color: "A3CFFF", fontFace: "Microsoft YaHei", margin: 0});

// 6. Agent流水线
const s6 = pres.addSlide();
s6.background = { color: theme.white };
addPageBadge(s6, 6);
s6.addText("6大Agent协作流水线", { x: PAD, y: PAD, w: 7, h: 0.55, fontSize: 28, bold: true, color: theme.dark, fontFace: "Microsoft YaHei", margin: 0});
const ag = ["Scout", "Parser", "Analyst", "Validator", "Briefing", "Human"];
const agColors = [theme.success, theme.info, theme.primary, theme.warning, theme.secondary, theme.danger];
for(let i=0; i<6; i++) {
  let cx = 0.8 + i*1.68;
  s6.addShape(pres.shapes.OVAL, { x: cx-0.4, y: 1.8-0.4, w: 0.8, h: 0.8, fill: { color: agColors[i] }});
  s6.addText(String(i+1), { x: cx-0.4, y: 1.8-0.4, w: 0.8, h: 0.8, fontSize: 20, bold: true, color: "FFFFFF", align: "center", margin: 0});
  s6.addText(ag[i], { x: cx-0.8, y: 2.3, w: 1.6, h: 0.3, fontSize: 12, bold: true, align: "center", fontFace: "Microsoft YaHei", color: theme.dark, margin: 0});
  if(i<5) {
    s6.addShape(pres.shapes.RIGHT_TRIANGLE, { x: cx+0.64, y: 1.73, w: 0.14, h: 0.14, fill: {color: "94A3B8"}, rotate: 90 });
    s6.addShape(pres.shapes.LINE, { x: cx+0.4, y: 1.8, w: 0.24, h: 0, line: { color: "94A3B8", width: 2 }});
  }
}
s6.addShape(pres.shapes.RECTANGLE, { x: PAD, y: 3.2, w: SW-PAD*2, h: 1.8, fill: { color: theme.light }, rectRadius: 0.1 });
s6.addText([
  { text: "Scout: 抓取多市场情报 ", options: { color: theme.success, bold: true } },
  { text: "| Parser: 提取竞品实体 ", options: { color: theme.info, bold: true } },
  { text: "| Validator: 校验打分拦截幻觉\n", options: { color: theme.warning, bold: true } },
  { text: "Analyst: 文心模型战略分析 ", options: { color: theme.primary, bold: true } },
  { text: "| Briefing: 结构化分发 ", options: { color: theme.secondary, bold: true } },
  { text: "| Human: 人工复核兜底", options: { color: theme.danger, bold: true } },
], { x: PAD+0.2, y: 3.4, w: 8.8, h: 1.4, fontSize: 13, align: "center", valign: "middle", fontFace: "Microsoft YaHei", margin: 0});

// 7. 技术实现与Vibe Coding
const s7 = pres.addSlide();
s7.background = { color: theme.white };
addPageBadge(s7, 7);
s7.addText("技术实现与 Vibe Coding 范式", { x: PAD, y: PAD, w: 8.5, h: 0.55, fontSize: 26, bold: true, color: theme.dark, fontFace: "Microsoft YaHei", margin: 0});
s7.addShape(pres.shapes.RECTANGLE, { x: PAD, y: 1.1, w: SW-PAD*2, h: 1.4, fill: { color: "F3F4F6" }, rectRadius: 0.1 });
s7.addText("Vibe Coding 开发流程", { x: PAD+0.2, y: 1.2, w: 4, h: 0.4, fontSize: 16, bold: true, color: theme.primary, fontFace: "Microsoft YaHei", margin: 0});
s7.addText([
  { text: "步骤1 需求解析：", options: { bold: true, color: theme.dark, fontSize: 12 } },
  { text: "使用 Kimi 深度解析图片素材与赛题要求，梳理业务逻辑树。\n", options: { color: theme.muted, fontSize: 12 } },
  { text: "步骤2 AI全栈开发：", options: { bold: true, color: theme.dark, fontSize: 12 } },
  { text: "在 百度秒哒 平台完成系统架构、组件开发与迭代测试，实现全代码自动化编写。\n", options: { color: theme.muted, fontSize: 12 } },
  { text: "步骤3 部署与交付：", options: { bold: true, color: theme.dark, fontSize: 12 } },
  { text: "基于秒哒一键部署前端与云函数，快速拉通闭环。", options: { color: theme.muted, fontSize: 12 } },
], { x: PAD+0.2, y: 1.6, w: 8.8, h: 0.8, fontFace: "Microsoft YaHei", align: "left", margin: 0 });

s7.addShape(pres.shapes.RECTANGLE, { x: PAD, y: 2.7, w: SW-PAD*2, h: 2.2, fill: { color: "E0EFFF" }, rectRadius: 0.1 });
s7.addText("核心技术底座", { x: PAD+0.2, y: 2.8, w: 4, h: 0.4, fontSize: 16, bold: true, color: theme.primary, fontFace: "Microsoft YaHei", margin: 0});
s7.addText([
  { text: "前端架构：", options: { bold: true, color: theme.dark, fontSize: 12 } },
  { text: "React + Vite + Tailwind CSS + shadcn/ui，全响应式设计。\n", options: { color: theme.secondary, fontSize: 12 } },
  { text: "后端与通信：", options: { bold: true, color: theme.dark, fontSize: 12 } },
  { text: "Supabase Edge Functions 无服务器架构，SSE 流式输出保障零延迟体验。\n", options: { color: theme.secondary, fontSize: 12 } },
  { text: "AI引擎集成：", options: { bold: true, color: theme.dark, fontSize: 12 } },
  { text: "百度AI搜索（实时数据侦察） + 文心大模型（战略分析与简报生成）。", options: { color: theme.secondary, fontSize: 12 } },
], { x: PAD+0.2, y: 3.3, w: 8.8, h: 1.4, fontFace: "Microsoft YaHei", align: "left", margin: 0});

// 8. 章节3
const s8 = pres.addSlide();
s8.background = { color: theme.dark };
addPageBadge(s8, 8);
s8.addText("03", { x: PAD, y: 1.5, w: 2, h: 1.2, fontSize: 72, bold: true, color: "FFFFFF", fontFace: "Arial", margin: 0});
s8.addText("系统界面展示", { x: PAD, y: 2.7, w: 6, h: 0.7, fontSize: 36, bold: true, color: "FFFFFF", fontFace: "Microsoft YaHei", margin: 0});
s8.addText("产品截图与核心交互", { x: PAD, y: 3.4, w: 6, h: 0.4, fontSize: 14, color: "9CA3AF", fontFace: "Microsoft YaHei", margin: 0});

// 9. 产品截图
const s9 = pres.addSlide();
s9.background = { color: theme.white };
addPageBadge(s9, 9);
s9.addText("核心产品界面：高管全局视野与风控追踪", { x: PAD, y: PAD, w: 8.5, h: 0.55, fontSize: 26, bold: true, color: theme.dark, fontFace: "Microsoft YaHei", margin: 0});

// 截图1
const imgW = 4.2;
const imgH = 3.2;
s9.addShape(pres.shapes.RECTANGLE, { x: PAD, y: 1.2, w: imgW, h: imgH, fill: { color: "F8FAFC" }, line: { type: "dash", color: "CBD5E1", width: 2 }, rectRadius: 0.05 });
s9.addText("产品截图位置 1\n\n【高管情报仪表盘与多源置信度】\n\n(请在此处插入真实产品界面截图)", { x: PAD, y: 1.2, w: imgW, h: imgH, fontSize: 14, color: theme.muted, align: "center", valign: "middle", fontFace: "Microsoft YaHei", margin: 0});
s9.addText("亮点：机会/风险四象限分布，红绿灯置信度一眼看懂", { x: PAD, y: 4.5, w: imgW, h: 0.4, fontSize: 12, bold: true, color: theme.primary, align: "center", fontFace: "Microsoft YaHei", margin: 0});

// 截图2
s9.addShape(pres.shapes.RECTANGLE, { x: PAD + imgW + 0.4, y: 1.2, w: imgW, h: imgH, fill: { color: "F8FAFC" }, line: { type: "dash", color: "CBD5E1", width: 2 }, rectRadius: 0.05 });
s9.addText("产品截图位置 2\n\n【人工复核与风控日志页】\n\n(请在此处插入真实产品界面截图)", { x: PAD + imgW + 0.4, y: 1.2, w: imgW, h: imgH, fontSize: 14, color: theme.muted, align: "center", valign: "middle", fontFace: "Microsoft YaHei", margin: 0});
s9.addText("亮点：熔断状态监控、历史错误分布图表、四级降级记录", { x: PAD + imgW + 0.4, y: 4.5, w: imgW, h: 0.4, fontSize: 12, bold: true, color: theme.primary, align: "center", fontFace: "Microsoft YaHei", margin: 0});

// 10. 章节4
const s10 = pres.addSlide();
s10.background = { color: theme.danger };
addPageBadge(s10, 10);
s10.addText("04", { x: PAD, y: 1.5, w: 2, h: 1.2, fontSize: 72, bold: true, color: "FFFFFF", fontFace: "Arial", margin: 0});
s10.addText("风控安全体系", { x: PAD, y: 2.7, w: 6, h: 0.7, fontSize: 36, bold: true, color: "FFFFFF", fontFace: "Microsoft YaHei", margin: 0});
s10.addText("解决AI幻觉，保障业务安全可运行", { x: PAD, y: 3.4, w: 6, h: 0.4, fontSize: 14, color: "FECACA", fontFace: "Microsoft YaHei", margin: 0});

// 11. 风控1
const s11 = pres.addSlide();
s11.background = { color: theme.white };
addPageBadge(s11, 11);
s11.addText("多源评分 + Validator：让AI输出可信任", { x: PAD, y: PAD, w: 8.5, h: 0.55, fontSize: 26, bold: true, color: theme.dark, fontFace: "Microsoft YaHei", margin: 0});
s11.addShape(pres.shapes.RECTANGLE, { x: PAD, y: 1.1, w: 4.4, h: 3.6, fill: { color: theme.light }, rectRadius: 0.1 });
s11.addText("多源置信度打分公式", { x: PAD+0.2, y: 1.2, w: 4, h: 0.4, fontSize: 16, bold: true, color: theme.dark, fontFace: "Microsoft YaHei", margin: 0});
s11.addText("Score = (独立来源数 x 30%) \n        + (信源可靠度 x 40%) \n        + (信息一致性 x 30%)", { x: PAD+0.2, y: 1.8, w: 4, h: 1.0, fontSize: 14, color: theme.primary, fontFace: "Consolas", margin: 0, bold: true });
s11.addText("结果分级：\n>80分: 绿灯(已确认) | 50-80分: 黄灯(推测) | <50分: 红灯(传闻拦截)", { x: PAD+0.2, y: 3.0, w: 4, h: 1.0, fontSize: 12, color: theme.muted, fontFace: "Microsoft YaHei", margin: 0 });

s11.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.1, w: 4.4, h: 3.6, fill: { color: "FEF9E7" }, line: { color: theme.accent, width: 1 }, rectRadius: 0.1 });
s11.addText("Validator 幻觉校验机制", { x: 5.4, y: 1.2, w: 4, h: 0.4, fontSize: 16, bold: true, color: theme.dark, fontFace: "Microsoft YaHei", margin: 0});
s11.addText([
  { text: "1. 绝对化表述检测：\n", options: { bold: true, color: theme.dark, fontSize: 12 } },
  { text: "拦截包含“绝对、一定、最”的情报。\n\n", options: { color: theme.muted, fontSize: 12 } },
  { text: "2. 冲突判定：\n", options: { bold: true, color: theme.dark, fontSize: 12 } },
  { text: "对来源间的互相矛盾进行标记。\n\n", options: { color: theme.muted, fontSize: 12 } },
  { text: "3. 实时性校验：\n", options: { bold: true, color: theme.dark, fontSize: 12 } },
  { text: "超期陈旧数据降级处理。", options: { color: theme.muted, fontSize: 12 } }
], { x: 5.4, y: 1.8, w: 4, h: 2.5, fontFace: "Microsoft YaHei", align: "left", margin: 0 });

// 12. 风控2
const s12 = pres.addSlide();
s12.background = { color: theme.white };
addPageBadge(s12, 12);
s12.addText("熔断器 + 降级策略：系统失控时的安全网", { x: PAD, y: PAD, w: 8.5, h: 0.55, fontSize: 26, bold: true, color: theme.dark, fontFace: "Microsoft YaHei", margin: 0});
s12.addShape(pres.shapes.RECTANGLE, { x: PAD, y: 1.1, w: 4.4, h: 3.6, fill: { color: theme.light }, rectRadius: 0.1 });
s12.addText("全局熔断器触发机制", { x: PAD+0.2, y: 1.2, w: 4, h: 0.4, fontSize: 16, bold: true, color: theme.dark, fontFace: "Microsoft YaHei", margin: 0});
const fuseSteps = ["1. 监控：单日接口错误率实时计算", "2. 触发：错误率 > 20% 自动熔断", "3. 拦截：停止AI自动化发布简报", "4. 恢复：错误率 < 15% 且人工确认"];
fuseSteps.forEach((fs, i) => {
  s12.addShape(pres.shapes.RECTANGLE, { x: PAD+0.4, y: 1.8 + i*0.7, w: 3.6, h: 0.5, fill: { color: theme.danger, transparency: 10 }, rectRadius: 0.05 });
  s12.addText(fs, { x: PAD+0.5, y: 1.8 + i*0.7, w: 3.4, h: 0.5, fontSize: 12, bold: true, color: theme.danger, fontFace: "Microsoft YaHei", margin: 0});
});

s12.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.1, w: 4.4, h: 3.6, fill: { color: "F3F4F6" }, rectRadius: 0.1 });
s12.addText("四级降级与人工接管", { x: 5.4, y: 1.2, w: 4, h: 0.4, fontSize: 16, bold: true, color: theme.dark, fontFace: "Microsoft YaHei", margin: 0});
const dgs = [
  "L1 缓存降级：API超时 > 30s，返回缓存数据",
  "L2 置信降级：高危幻觉强制降至30分提示",
  "L3 人工接管：触发熔断后转入人工复核队列",
  "L4 一键回滚：已发布错误内容可立刻撤销"
];
dgs.forEach((dg, i) => {
  s12.addShape(pres.shapes.RECTANGLE, { x: 5.4, y: 1.8 + i*0.7, w: 4.0, h: 0.5, fill: { color: theme.white }, line:{ color: theme.secondary, width: 1 }, rectRadius: 0.05 });
  s12.addText(dg, { x: 5.5, y: 1.8 + i*0.7, w: 3.8, h: 0.5, fontSize: 11, bold: true, color: theme.dark, fontFace: "Microsoft YaHei", margin: 0});
});

// 13. 章节5
const s13 = pres.addSlide();
s13.background = { color: theme.success };
addPageBadge(s13, 13);
s13.addText("05", { x: PAD, y: 1.5, w: 2, h: 1.2, fontSize: 72, bold: true, color: "FFFFFF", fontFace: "Arial", margin: 0});
s13.addText("团队与落地价值", { x: PAD, y: 2.7, w: 6, h: 0.7, fontSize: 36, bold: true, color: "FFFFFF", fontFace: "Microsoft YaHei", margin: 0});
s13.addText("3+1人机协同与项目总结", { x: PAD, y: 3.4, w: 6, h: 0.4, fontSize: 14, color: "A7F3D0", fontFace: "Microsoft YaHei", margin: 0});

// 14. 团队介绍
const s14 = pres.addSlide();
s14.background = { color: theme.white };
addPageBadge(s14, 14);
s14.addText("团队介绍：翻斗花园牛爷爷", { x: PAD, y: PAD, w: 8.5, h: 0.55, fontSize: 26, bold: true, color: theme.dark, fontFace: "Microsoft YaHei", margin: 0});
s14.addShape(pres.shapes.RECTANGLE, { x: PAD, y: 1.1, w: SW-PAD*2, h: 1.0, fill: { color: theme.light }, rectRadius: 0.1 });
s14.addText("组织架构：全新的「3+1」人机协同模式", { x: PAD, y: 1.2, w: SW-PAD*2, h: 0.4, fontSize: 20, bold: true, color: theme.primary, align: "center", fontFace: "Microsoft YaHei", margin: 0});
s14.addText("在Vibe Coding时代，AI已成为最核心的“第四位团队成员”", { x: PAD, y: 1.6, w: SW-PAD*2, h: 0.3, fontSize: 14, color: theme.muted, align: "center", fontFace: "Microsoft YaHei", margin: 0});

s14.addShape(pres.shapes.RECTANGLE, { x: PAD, y: 2.4, w: 4.4, h: 2.4, fill: { color: "FEF3C7" }, line:{color: theme.warning, width: 1}, rectRadius: 0.1 });
s14.addText("🧑‍💻 3名人类成员", { x: PAD+0.2, y: 2.6, w: 4, h: 0.4, fontSize: 16, bold: true, color: theme.dark, fontFace: "Microsoft YaHei", margin: 0});
s14.addText("· 业务分析与产品架构设计\n· 核心Prompt工程调优\n· 界面体验与风控逻辑把控\n\n负责“做正确的事”", { x: PAD+0.2, y: 3.1, w: 4, h: 1.5, fontSize: 13, color: theme.secondary, fontFace: "Microsoft YaHei", margin: 0 });

s14.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 2.4, w: 4.4, h: 2.4, fill: { color: "DBEAFE" }, line:{color: theme.info, width: 1}, rectRadius: 0.1 });
s14.addText("🤖 1名AI成员（百度秒哒）", { x: 5.4, y: 2.6, w: 4, h: 0.4, fontSize: 16, bold: true, color: theme.primary, fontFace: "Microsoft YaHei", margin: 0});
s14.addText("· 全栈应用与组件代码编写\n· Bug修复与自动化调试\n· 一键打包与云端部署\n\n负责“正确的做事”", { x: 5.4, y: 3.1, w: 4, h: 1.5, fontSize: 13, color: theme.secondary, fontFace: "Microsoft YaHei", margin: 0 });

// 15. 落地价值
const s15 = pres.addSlide();
s15.background = { color: theme.white };
addPageBadge(s15, 15);
s15.addText("落地价值：打通情报到执行的闭环", { x: PAD, y: PAD, w: 8.5, h: 0.55, fontSize: 26, bold: true, color: theme.dark, fontFace: "Microsoft YaHei", margin: 0});

s15.addShape(pres.shapes.RECTANGLE, { x: PAD, y: 1.1, w: SW-PAD*2, h: 1.5, fill: { color: theme.light }, rectRadius: 0.1 });
s15.addText("【三级架构分发网络】", { x: PAD+0.2, y: 1.3, w: 8.8, h: 0.4, fontSize: 16, bold: true, color: theme.dark, fontFace: "Microsoft YaHei", margin: 0});
s15.addText("· 总部决策 (HQ)：评估全盘战略，如针对日本竞品降价调整亚太定价\n· 区域管理 (Region)：区域化资源调度，如北美市场的合规宣发自查\n· 门店执行 (Store)：末端行动指南，如一线导购的话术更新", { x: PAD+0.2, y: 1.8, w: 8.8, h: 0.8, fontSize: 12, color: theme.secondary, fontFace: "Microsoft YaHei", margin: 0 });

const stats = [ { n: "80%", l: "节省人工分析成本" }, { n: "5大", l: "核心语种无缝覆盖" }, { n: "24h", l: "缩短战略反应周期" } ];
stats.forEach((st, i) => {
  s15.addShape(pres.shapes.RECTANGLE, { x: PAD + i*3.1, y: 2.8, w: 2.9, h: 2.0, fill: { color: "F3F4F6" }, rectRadius: 0.1 });
  s15.addText(st.n, { x: PAD + i*3.1, y: 3.1, w: 2.9, h: 0.8, fontSize: 44, bold: true, color: theme.primary, align: "center", margin: 0});
  s15.addText(st.l, { x: PAD + i*3.1, y: 4.1, w: 2.9, h: 0.4, fontSize: 14, bold: true, color: theme.dark, align: "center", fontFace: "Microsoft YaHei", margin: 0});
});

// 16. 总结
const s16 = pres.addSlide();
s16.background = { color: theme.secondary };
addPageBadge(s16, 16);
s16.addText("落地价值与总结", { x: PAD, y: PAD, w: 8, h: 0.6, fontSize: 36, bold: true, color: "FFFFFF", fontFace: "Microsoft YaHei", margin: 0});

s16.addText([
  { text: "创新性 (15%)：\n", options: { bold: true, color: theme.accent, fontSize: 14 } },
  { text: "多Agent架构直击“情报->决策”刚需，重塑作业流。\n\n", options: { color: "FFFFFF", fontSize: 12 } },
  { text: "技术实现 (20%)：\n", options: { bold: true, color: theme.accent, fontSize: 14 } },
  { text: "Kimi解析 + 百度秒哒开发 的Vibe Coding，Edge Functions+流式高可用。\n\n", options: { color: "FFFFFF", fontSize: 12 } },
  { text: "业务潜力 (25%)：\n", options: { bold: true, color: theme.accent, fontSize: 14 } },
  { text: "解决出海企业真实痛点，高度标准化，具备极强付费SaaS潜力。\n\n", options: { color: "FFFFFF", fontSize: 12 } },
  { text: "风控安全 (20%)：\n", options: { bold: true, color: theme.accent, fontSize: 14 } },
  { text: "评分体系+幻觉校验+熔断降级，坚守业务安全底线。\n\n", options: { color: "FFFFFF", fontSize: 12 } },
  { text: "非技术可理解度 (10%)：\n", options: { bold: true, color: theme.accent, fontSize: 14 } },
  { text: "红绿灯式展示、白话交互，真正赋能业务决策层。", options: { color: "FFFFFF", fontSize: 12 } },
], { x: PAD, y: 1.1, w: 9.2, h: 4.0, fontFace: "Microsoft YaHei", align: "left", margin: 0 });

// 输出
pres.writeFile({ fileName: "/workspace/app-btvkxctz25mp/tasks/海外市场情报雷达系统_路演.pptx" }).then(() => {
    console.log("PPT generated successfully.");
});
"""

with open("/workspace/app-btvkxctz25mp/tasks/generate-ppt.cjs", "w", encoding="utf-8") as f:
    f.write(js_code)
