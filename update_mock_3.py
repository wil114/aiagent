import re

with open('/workspace/app-btvkxctz25mp/src/data/mockData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# For evt-002 original structure
content = content.replace('''    actionSuggestions: [
      {
        text: '本周内启动美国区全部电商详情页的合规审查，确保6月下旬前完成标签更新',
        priority: 1,
        deadline: '2026-06-15',
      },
      {
        text: '通知供应链合作伙伴提供CVD/HPHT工艺认证文件',
        priority: 2,
      },
    ],''', '''    actionSuggestions: [
      {
        id: 'act-002-1',
        level: 'hq',
        levelLabel: '总部决策',
        text: '法务部联合产品部出台全球培育钻石及天然钻石合规标签标准作业指导书(SOP)。',
        priority: 1,
        expectedOutcome: '确保全球各市场合规，规避潜在的集体诉讼与巨额罚款。',
        deadline: '2026-05-25',
      },
      {
        id: 'act-002-2',
        level: 'regional',
        levelLabel: '区域管理',
        text: '美国区域：90天内清查所有线上商城商品详情页及门店实体宣发物料，完成合规替换。',
        priority: 1,
        expectedOutcome: '平稳过渡缓冲期，消除FTC监管风险。',
        deadline: '2026-08-20',
      },
      {
        id: 'act-002-3',
        level: 'store',
        levelLabel: '门店执行',
        text: '美国及跨境门店销售全员：使用最新合规话术应对消费者对生产工艺的问询。',
        priority: 2,
        expectedOutcome: '提升消费者信任度，避免现场虚假宣传投诉。',
      },
    ],''')

# For evt-003 original structure
content = content.replace('''    actionSuggestions: [
      {
        text: '立即联系TikTok美区达人合作，借势话题热度推广品牌内容',
        priority: 1,
        deadline: '2026-05-28',
      },
      {
        text: '同步布局抖音和小红书培育钻石内容，抢占国内市场窗口期',
        priority: 2,
      },
      {
        text: '评估引入直播带货模式',
        priority: 3,
      },
    ],''', '''    actionSuggestions: [
      {
        id: 'act-003-1',
        level: 'hq',
        levelLabel: '总部决策',
        text: '市场营销中心：将美国KOL营销策略向「环保/高性价比」话题转移。',
        priority: 2,
        expectedOutcome: '降低整体KOL获客成本约30%，提高品牌真实口碑声量。',
        deadline: '2026-06-15',
      },
      {
        id: 'act-003-2',
        level: 'regional',
        levelLabel: '区域管理',
        text: '大中华区市场部：建立监测机制，评估此热点是否向国内小红书传导。',
        priority: 3,
        expectedOutcome: '提前布局国内小红书等平台的新型内容策略。',
      },
      {
        id: 'act-003-3',
        level: 'store',
        levelLabel: '门店执行',
        text: '美国区域门店与客服：在互动中引入TikTok热点话术，强掉「性价比」与「环保」属性。',
        priority: 3,
        expectedOutcome: '迎合目标客群热点认知，提升成交转化率。',
      },
    ],''')

# For evt-004 original structure
content = content.replace('''    actionSuggestions: [
      {
        text: '核实佣金率调整是否适用于所有培育钻石SKU，确认生效日期',
        priority: 1,
        deadline: '2026-05-25',
      },
      {
        text: '评估申请亚马逊"可持续发展标签"的认证流程和成本',
        priority: 2,
      },
      {
        text: '重新核算产品利润模型',
        priority: 1,
      },
    ],''', '''    actionSuggestions: [
      {
        id: 'act-004-1',
        level: 'hq',
        levelLabel: '总部决策',
        text: '评估将主推的培育钻石产品线价格体系进行全局调整的可能性。',
        priority: 2,
        expectedOutcome: '最大化利用佣金下降带来的利润空间。',
      },
      {
        id: 'act-004-2',
        level: 'regional',
        levelLabel: '区域管理',
        text: '北美区域：向亚马逊官方申请"可持续发展标签"流量扶持计划资格。',
        priority: 1,
        expectedOutcome: '获取平台流量扶持加权，提升自然搜索排名。',
      },
    ],''')

# For evt-005 original structure
content = content.replace('''    actionSuggestions: [
      {
        text: '安排韩国本地团队实地走访江南区，验证快闪店真实性并收集竞品情报',
        priority: 1,
        deadline: '2026-05-27',
      },
      {
        text: '监测韩国主流媒体（朝鲜日报、中央日报）是否会跟进报道',
        priority: 2,
      },
    ],''', '''    actionSuggestions: [
      {
        id: 'act-005-1',
        level: 'hq',
        levelLabel: '总部决策',
        text: '暂缓对韩国市场追加培育钻石营销预算的决定，等待实地验证。',
        priority: 2,
        expectedOutcome: '避免跟风投资可能导致的不确定性风险。',
      },
      {
        id: 'act-005-2',
        level: 'regional',
        levelLabel: '区域管理',
        text: '韩国区域市场部：安排本地团队实地走访狎鸥亭快闪店，验证真实性。',
        priority: 1,
        expectedOutcome: '提供一线真实竞争情报，辅助总部决策。',
      },
    ],''')

# For evt-006 original structure
content = content.replace('''    actionSuggestions: [
      {
        text: '立即联系Shopee东南亚客户经理，确认入驻和扶持申请流程',
        priority: 1,
        deadline: '2026-05-30',
      },
      {
        text: '准备东南亚多国（新加坡/泰国/越南）的商品Listing和本地化素材',
        priority: 2,
        deadline: '2026-06-10',
      },
      {
        text: '优化跨境物流履约方案',
        priority: 3,
      },
    ],''', '''    actionSuggestions: [
      {
        id: 'act-006-1',
        level: 'hq',
        levelLabel: '总部决策',
        text: '加速探索并在东南亚市场铺设适配Shopee的高性价比饰品产品线。',
        priority: 2,
        expectedOutcome: '提前卡位东南亚电商红利期。',
      },
      {
        id: 'act-006-2',
        level: 'regional',
        levelLabel: '区域管理',
        text: '东南亚区域：立即联系Shopee客户经理，确认Q3直播资源包与补贴。',
        priority: 1,
        expectedOutcome: '抢占第一批红利流量，降低获客成本。',
        deadline: '2026-05-30',
      },
      {
        id: 'act-006-3',
        level: 'store',
        levelLabel: '门店执行',
        text: '海外仓及发货中心：自查并发起Shopee专属履约打包SOP优化。',
        priority: 2,
        expectedOutcome: '避免因发货问题错失平台补贴资格。',
      },
    ],''')

with open('/workspace/app-btvkxctz25mp/src/data/mockData.ts', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated all actionSuggestions successfully.")
