import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import numpy as np

# 统一配色
c_primary = "#023047"      # 深蓝
c_secondary = "#219ebc"  # 中蓝
c_accent = "#fb8500"     # 橙色
c_light = "#8ecae6"      # 浅蓝
c_bg = "#ffffff"         # 白色
c_text = "#023047"       # 文字色

plt.rcParams['font.sans-serif'] = ['SimHei', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False

def save_clean(fig, path, dpi=200):
    fig.savefig(path, dpi=dpi, bbox_inches='tight', pad_inches=0.05, facecolor=c_bg)
    plt.close(fig)

# ========== 图1：三层雷达系统架构图 ==========
fig, ax = plt.subplots(figsize=(10, 5.5))
ax.set_xlim(0, 10)
ax.set_ylim(0, 5.5)
ax.axis('off')
ax.set_facecolor(c_bg)
fig.patch.set_facecolor(c_bg)

# 标题
ax.text(5, 5.2, "三层雷达系统架构", fontsize=20, weight='bold', color=c_primary, ha='center', va='center')
ax.text(5, 4.85, "L1采集 → L2洞察 → L3传导，层层递进", fontsize=11, color=c_secondary, ha='center', va='center')

# 三层卡片
layers = [
    {"y": 3.5, "h": 1.1, "title": "L3 跨市场传导层", "desc": "时差预测 · 机会窗口 · 传导路径", "color": c_accent},
    {"y": 2.1, "h": 1.1, "title": "L2 洞察分析层", "desc": "文心大模型 · 变化检测 · 影响推演", "color": c_secondary},
    {"y": 0.7, "h": 1.1, "title": "L1 信号采集层", "desc": "百度AI搜索 · 多源信源 · 实时抓取", "color": c_primary},
]

for layer in layers:
    rect = FancyBboxPatch((1.0, layer["y"]), 8.0, layer["h"], boxstyle="round,pad=0.08", 
                          facecolor=layer["color"], edgecolor='none', alpha=0.12, linewidth=0)
    ax.add_patch(rect)
    # 左侧色条
    bar = FancyBboxPatch((1.0, layer["y"]), 0.12, layer["h"], boxstyle="round,pad=0.02",
                         facecolor=layer["color"], edgecolor='none', alpha=1.0)
    ax.add_patch(bar)
    ax.text(1.25, layer["y"] + layer["h"] - 0.22, layer["title"], fontsize=13, weight='bold', color=layer["color"], va='center')
    ax.text(1.25, layer["y"] + layer["h"] - 0.52, layer["desc"], fontsize=10, color=c_text, va='center', alpha=0.8)

# 箭头连接
arrow_style = dict(arrowstyle='->', color=c_secondary, lw=2, mutation_scale=15)
ax.annotate('', xy=(5, 3.4), xytext=(5, 3.2), arrowprops=arrow_style)
ax.annotate('', xy=(5, 2.0), xytext=(5, 1.8), arrowprops=arrow_style)

# 右侧输出
out_box = FancyBboxPatch((8.5, 1.8), 1.2, 1.8, boxstyle="round,pad=0.06",
                          facecolor=c_accent, edgecolor='none', alpha=0.15)
ax.add_patch(out_box)
ax.text(9.1, 3.0, "战略", fontsize=11, weight='bold', color=c_accent, ha='center', va='center')
ax.text(9.1, 2.7, "简报", fontsize=11, weight='bold', color=c_accent, ha='center', va='center')
ax.annotate('', xy=(8.4, 2.7), xytext=(7.2, 2.7), arrowprops=dict(arrowstyle='->', color=c_accent, lw=2, mutation_scale=12))

save_clean(fig, '/workspace/app-btvkxctz25mp/tasks/ppt_images/architecture.png')
print("架构图已生成")

# ========== 图2：多Agent协作流程图 ==========
fig, ax = plt.subplots(figsize=(10, 3.8))
ax.set_xlim(0, 10)
ax.set_ylim(0, 3.8)
ax.axis('off')
ax.set_facecolor(c_bg)
fig.patch.set_facecolor(c_bg)

ax.text(5, 3.5, "多Agent协作流水线", fontsize=18, weight='bold', color=c_primary, ha='center', va='center')

agents = [
    {"x": 1.0, "title": "采集Agent", "sub": "多源搜索", "color": c_primary},
    {"x": 3.2, "title": "分析Agent", "sub": "深度洞察", "color": c_secondary},
    {"x": 5.4, "title": "Validator", "sub": "风控校验", "color": c_accent},
    {"x": 7.6, "title": "人工复核", "sub": "终审发布", "color": "#2a9d8f"},
]

for agent in agents:
    rect = FancyBboxPatch((agent["x"]-0.55, 1.3), 1.1, 1.3, boxstyle="round,pad=0.08",
                          facecolor=agent["color"], edgecolor='none', alpha=0.12)
    ax.add_patch(rect)
    # 顶部色条
    bar = FancyBboxPatch((agent["x"]-0.55, 2.35), 1.1, 0.12, boxstyle="round,pad=0.02",
                         facecolor=agent["color"], edgecolor='none', alpha=1.0)
    ax.add_patch(bar)
    ax.text(agent["x"], 2.05, agent["title"], fontsize=11, weight='bold', color=agent["color"], ha='center', va='center')
    ax.text(agent["x"], 1.75, agent["sub"], fontsize=9, color=c_text, ha='center', va='center', alpha=0.7)

# 连接箭头
for i in range(len(agents)-1):
    ax.annotate('', xy=(agents[i+1]["x"]-0.55, 1.95), xytext=(agents[i]["x"]+0.55, 1.95),
                arrowprops=dict(arrowstyle='->', color=c_secondary, lw=2, mutation_scale=14))

# 底部状态指示
statuses = ["信号采集", "解析分析", "验证输出", "人工复核"]
for i, s in enumerate(statuses):
    ax.text(agents[i]["x"], 0.9, s, fontsize=8, color=c_text, ha='center', va='center', alpha=0.6)

save_clean(fig, '/workspace/app-btvkxctz25mp/tasks/ppt_images/agent_pipeline.png')
print("Agent流程图已生成")

# ========== 图3：风控体系模型图 ==========
fig, ax = plt.subplots(figsize=(10, 4.5))
ax.set_xlim(0, 10)
ax.set_ylim(0, 4.5)
ax.axis('off')
ax.set_facecolor(c_bg)
fig.patch.set_facecolor(c_bg)

ax.text(5, 4.2, "工业级风控安全体系", fontsize=18, weight='bold', color=c_primary, ha='center', va='center')
ax.text(5, 3.9, "20%错误率熔断 + 降级策略 + 人工接管", fontsize=10, color=c_secondary, ha='center', va='center')

# 风控流程
steps = [
    {"x": 1.0, "title": "多源评分", "desc": "信源×30%\n可靠×40%\n一致×30%", "color": c_primary},
    {"x": 3.0, "title": "幻觉检测", "desc": "异常数据识别\n疑似幻觉拦截", "color": c_secondary},
    {"x": 5.0, "title": "熔断器", "desc": "阈值：20%\n触发即暂停", "color": c_accent},
    {"x": 7.2, "title": "降级策略", "desc": "精简版/应急版\n自动切换", "color": "#e76f51"},
    {"x": 9.0, "title": "人工接管", "desc": "一键接管\n回滚重审", "color": "#2a9d8f"},
]

for step in steps:
    rect = FancyBboxPatch((step["x"]-0.65, 1.0), 1.3, 2.0, boxstyle="round,pad=0.08",
                          facecolor=step["color"], edgecolor='none', alpha=0.1)
    ax.add_patch(rect)
    bar = FancyBboxPatch((step["x"]-0.65, 2.75), 1.3, 0.12, boxstyle="round,pad=0.02",
                         facecolor=step["color"], edgecolor='none', alpha=1.0)
    ax.add_patch(bar)
    ax.text(step["x"], 2.45, step["title"], fontsize=10, weight='bold', color=step["color"], ha='center', va='center')
    ax.text(step["x"], 1.75, step["desc"], fontsize=8, color=c_text, ha='center', va='center', alpha=0.75, linespacing=1.5)

# 箭头
for i in range(len(steps)-1):
    ax.annotate('', xy=(steps[i+1]["x"]-0.65, 2.0), xytext=(steps[i]["x"]+0.65, 2.0),
                arrowprops=dict(arrowstyle='->', color=c_secondary, lw=1.8, mutation_scale=12))

save_clean(fig, '/workspace/app-btvkxctz25mp/tasks/ppt_images/risk_control.png')
print("风控体系图已生成")

print("所有图片生成完毕")
