import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Settings,
  Globe,
  Bell,
  Bot,
  CheckCircle2,
  Loader2,
  Clock,
  Send,
  Link,
  History,
  CheckCheck,
  XCircle,
} from 'lucide-react';
import { supabase } from '@/db/supabase';
import type { MarketConfig, BriefVersion } from '@/types/intelligence';

const initialMarkets: MarketConfig[] = [
  { region: 'china', enabled: true, categories: ['competitor', 'regulation', 'social', 'platform'], keywords: ['培育钻石', '实验室钻石'] },
  { region: 'japan', enabled: true, categories: ['competitor', 'regulation', 'social', 'platform'], keywords: ['ラボグロウンダイヤモンド', '光輝珠寶'] },
  { region: 'korea', enabled: true, categories: ['competitor', 'social', 'platform'], keywords: ['랩그로운다이아몬드'] },
  { region: 'southeast_asia', enabled: true, categories: ['platform', 'competitor'], keywords: ['lab grown diamond', 'Shopee'] },
  { region: 'usa', enabled: true, categories: ['regulation', 'social', 'platform', 'competitor'], keywords: ['lab grown diamond', 'FTC', 'TikTok jewelry'] },
];

const agentStatusList = [
  { name: 'Scout Agent', role: '侦察兵', status: 'success', lastRun: '06:25', nextRun: '明日 06:00' },
  { name: 'Parser Agent', role: '解析员', status: 'success', lastRun: '06:28', nextRun: '明日 06:25' },
  { name: 'Analyst Agent', role: '分析师', status: 'success', lastRun: '06:32', nextRun: '明日 06:28' },
  { name: 'Validator Agent', role: '校验员', status: 'warning', lastRun: '06:38', nextRun: '明日 06:32' },
  { name: 'Briefing Agent', role: '简报员', status: 'success', lastRun: '06:42', nextRun: '明日 06:38' },
  { name: 'Human Agent', role: '人工接管', status: 'idle', lastRun: '-', nextRun: '按需触发' },
];

interface PushLog {
  id: string;
  platform: string;
  status: string;
  payload_summary: string;
  error_msg: string | null;
  created_at: string;
}

// 今日简报数据（实际场景从DB获取）
const SAMPLE_BRIEFING = {
  date: new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' }),
  overview: '全球培育钻石市场今日出现3项重大变化：日本竞品启动降价促销、美国FTC监管信号趋严、东南亚Shopee平台规则调整。企业X需重点关注日本市场竞争压力与合规动态。',
  topEvents: [
    { title: '日本竞品光輝珠寶降价30%并推出限定款', market: '🇯🇵 日本', confidence: 'confirmed', suggestion: '本周内制定应对方案，考虑限时促销策略' },
    { title: '美国FTC拟升级培育钻石标注监管要求', market: '🇺🇸 美国', confidence: 'speculated', suggestion: '提前准备标注合规自查，咨询当地法律顾问' },
    { title: '东南亚Shopee珠宝品类规则调整讨论升温', market: '🌏 东南亚', confidence: 'rumor', suggestion: '持续监控官方公告，暂缓新品上架决策' },
  ],
};

const SettingsPage: React.FC = () => {
  const [markets, setMarkets] = useState<MarketConfig[]>(initialMarkets);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [pushTime, setPushTime] = useState('08:00');
  const [pushVersion, setPushVersion] = useState<BriefVersion>('compact');
  const [saved, setSaved] = useState(false);
  // Webhook 配置
  const [feishuUrl, setFeishuUrl] = useState('');
  const [dingtalkUrl, setDingtalkUrl] = useState('');
  const [testingFeishu, setTestingFeishu] = useState(false);
  const [testingDingtalk, setTestingDingtalk] = useState(false);
  // 推送日志
  const [pushLogs, setPushLogs] = useState<PushLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

  useEffect(() => { loadPushLogs(); }, []);

  async function loadPushLogs() {
    setLogsLoading(true);
    const { data } = await supabase
      .from('push_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(8);
    setPushLogs((data as PushLog[]) ?? []);
    setLogsLoading(false);
  }

  async function handleTestPush(platform: 'feishu' | 'dingtalk') {
    const url = platform === 'feishu' ? feishuUrl : dingtalkUrl;
    if (!url.trim()) {
      toast.error(`请先填写${platform === 'feishu' ? '飞书' : '钉钉'} Webhook URL`);
      return;
    }
    if (platform === 'feishu') setTestingFeishu(true);
    else setTestingDingtalk(true);

    try {
      const resp = await fetch(`${SUPABASE_URL}/functions/v1/push-briefing`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          apikey: SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform,
          webhook_url: url,
          briefing_data: SAMPLE_BRIEFING,
        }),
      });
      const result = await resp.json();
      if (result.success) {
        toast.success(`${platform === 'feishu' ? '飞书' : '钉钉'}推送成功！`);
      } else {
        toast.error(`推送失败：${result.error ?? '未知错误'}`);
      }
    } catch (err) {
      toast.error(`推送请求失败：${(err as Error).message}`);
    } finally {
      if (platform === 'feishu') setTestingFeishu(false);
      else setTestingDingtalk(false);
      loadPushLogs();
    }
  }

  const toggleMarket = (region: string) => {
    setMarkets((prev) =>
      prev.map((m) => (m.region === region ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const handleSave = () => {
    setSaved(true);
    toast.success('设置已保存');
    setTimeout(() => setSaved(false), 2000);
  };

  const regionNames: Record<string, string> = {
    china: '🇨🇳 中国', japan: '🇯🇵 日本', korea: '🇰🇷 韩国',
    southeast_asia: '🌏 东南亚', usa: '🇺🇸 美国',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 max-w-4xl mx-auto space-y-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <Settings className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-bold text-foreground">系统设置</h1>
      </div>

      {/* 市场配置 */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold">市场配置</h2>
        </div>
        <div className="space-y-3">
          {markets.map((market) => (
            <div
              key={market.region}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Switch
                  checked={market.enabled}
                  onCheckedChange={() => toggleMarket(market.region)}
                />
                <div>
                  <p className="text-sm font-medium">{regionNames[market.region]}</p>
                  <p className="text-[10px] text-muted-foreground">
                    监控: {market.categories.map((c) => {
                      const labels: Record<string, string> = {
                        competitor: '竞品', regulation: '法规', social: '社媒',
                        platform: '平台', supply_chain: '供应链', pricing: '价格',
                      };
                      return labels[c] || c;
                    }).join(' · ')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground">关键词</p>
                <p className="text-[10px] text-foreground">{market.keywords.join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 推送设置 */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold">推送设置</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">每日自动推送</p>
              <p className="text-[10px] text-muted-foreground">在设定时间自动生成并推送战略简报</p>
            </div>
            <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium mb-1.5">推送时间</p>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={pushTime}
                  onChange={(e) => setPushTime(e.target.value)}
                  className="h-8 text-sm w-28"
                />
                <span className="text-xs text-muted-foreground">北京时间</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium mb-1.5">推送版本</p>
              <Select value={pushVersion} onValueChange={(v) => setPushVersion(v as BriefVersion)}>
                <SelectTrigger className="h-8 text-xs w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">完整版</SelectItem>
                  <SelectItem value="compact">精简版（推荐）</SelectItem>
                  <SelectItem value="emergency">应急版</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Webhook 配置 */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Link className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold">Webhook 推送配置</h2>
          <Badge variant="secondary" className="text-[10px]">真实推送</Badge>
        </div>
        <div className="space-y-4">
          {/* 飞书 */}
          <div className="p-3 rounded-lg border border-border bg-muted/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">🐦</span>
              <p className="text-sm font-medium">飞书机器人</p>
              <span className="text-[10px] text-muted-foreground">推送富文本卡片格式</span>
            </div>
            <div className="flex gap-2">
              <Input
                value={feishuUrl}
                onChange={(e) => setFeishuUrl(e.target.value)}
                placeholder="https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxx"
                className="text-xs h-8 flex-1"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleTestPush('feishu')}
                disabled={testingFeishu}
                className="h-8 gap-1.5 text-xs shrink-0"
              >
                {testingFeishu ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                测试推送
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">
              在飞书群 → 添加机器人 → 自定义机器人，复制 Webhook 地址
            </p>
          </div>

          {/* 钉钉 */}
          <div className="p-3 rounded-lg border border-border bg-muted/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">🔔</span>
              <p className="text-sm font-medium">钉钉机器人</p>
              <span className="text-[10px] text-muted-foreground">推送 Markdown 格式</span>
            </div>
            <div className="flex gap-2">
              <Input
                value={dingtalkUrl}
                onChange={(e) => setDingtalkUrl(e.target.value)}
                placeholder="https://oapi.dingtalk.com/robot/send?access_token=xxxxxxxx"
                className="text-xs h-8 flex-1"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleTestPush('dingtalk')}
                disabled={testingDingtalk}
                className="h-8 gap-1.5 text-xs shrink-0"
              >
                {testingDingtalk ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                测试推送
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">
              在钉钉群 → 群设置 → 机器人 → 添加自定义机器人，复制 Webhook 地址
            </p>
          </div>
        </div>
      </Card>

      {/* 推送历史日志 */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">推送历史</h2>
          </div>
          <button
            onClick={loadPushLogs}
            className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            刷新
          </button>
        </div>
        {logsLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground mr-2" />
            <span className="text-xs text-muted-foreground">加载中...</span>
          </div>
        ) : pushLogs.length === 0 ? (
          <div className="text-center py-6">
            <Send className="w-6 h-6 text-muted-foreground/30 mx-auto mb-1.5" />
            <p className="text-xs text-muted-foreground">暂无推送记录，先配置Webhook并测试推送</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {pushLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-card hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {log.status === 'success' ? (
                    <CheckCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-destructive shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">
                        {log.platform === 'feishu' ? '🐦 飞书' : '🔔 钉钉'}
                      </span>
                      <Badge
                        className={`text-[9px] ${log.status === 'success'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 border'
                          : 'bg-red-50 text-destructive border-red-200 border'}`}
                      >
                        {log.status === 'success' ? '成功' : '失败'}
                      </Badge>
                    </div>
                    {log.payload_summary && (
                      <p className="text-[10px] text-muted-foreground">{log.payload_summary}</p>
                    )}
                    {log.error_msg && (
                      <p className="text-[10px] text-destructive truncate max-w-xs">{log.error_msg}</p>
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">
                  {new Date(log.created_at).toLocaleString('zh-CN', {
                    month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Agent状态监控 */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold">Agent状态监控</h2>
        </div>
        <div className="space-y-2">
          {agentStatusList.map((agent) => (
            <div
              key={agent.name}
              className="flex items-center justify-between p-2.5 rounded-lg border border-border hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  agent.status === 'success' ? 'bg-emerald-500' :
                  agent.status === 'warning' ? 'bg-amber-500' :
                  agent.status === 'running' ? 'bg-blue-500 animate-pulse' :
                  'bg-muted-foreground/40'
                }`} />
                <div>
                  <p className="text-xs font-medium">{agent.name}</p>
                  <p className="text-[10px] text-muted-foreground">{agent.role}</p>
                </div>
              </div>
              <div className="text-right text-[10px] text-muted-foreground">
                <p>最近执行: {agent.lastRun}</p>
                <p>下次执行: {agent.nextRun}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 保存按钮 */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-1.5">
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              已保存
            </>
          ) : (
            '保存设置'
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
