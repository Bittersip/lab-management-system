import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import {
  CATEGORIES,
  COMPETITIONS,
  WEEKDAYS,
  countdownText,
  dayLabel,
  fullDateLabel,
  scheduleCompetition,
  toneForDays
} from './competitions';
import type { CompetitionSchedule, PhaseStatus, Tone } from './competitions';
import './management.css';
import './competitions.css';

/**
 * 竞赛预告：把《竞赛目录》里的 29 项赛事按「离下一个关键节点还有几天」排成一屏，
 * 越临近越靠前，并按 7 天 / 30 天两档自动变色。
 * 倒计时在页面打开时计算，跨天后自动刷新，也可以手动点「按今天重算」。
 */
export default {
  props: {
    /** 验收页面可以传入固定日期，让倒计时结果可复现；正式环境不传，取本机当天。 */
    now: { type: [Date, String], default: null }
  },
  setup(props: any) {
    const today = ref<Date>(props.now ? new Date(props.now) : new Date());
    const query = ref('');
    const tone = ref('');
    const category = ref('');
    const order = ref('nearest');
    let timer: number | undefined;

    // 页面长时间挂着时，跨过零点要重新计算，否则「还有 1 天」会一直停在昨天。
    const syncToday = () => {
      const next = new Date();
      if (fullDateLabel(next) !== fullDateLabel(today.value)) today.value = next;
    };
    onMounted(() => {
      timer = window.setInterval(syncToday, 60_000);
    });
    onBeforeUnmount(() => {
      if (timer) window.clearInterval(timer);
    });

    const board = computed<CompetitionSchedule[]>(() => COMPETITIONS.map(item => scheduleCompetition(item, today.value)));

    const counts = computed<Record<Tone, number>>(() => {
      const result: Record<Tone, number> = { green: 0, yellow: 0, gray: 0 };
      board.value.forEach(item => { result[item.tone] += 1; });
      return result;
    });

    const items = computed(() => {
      const keyword = query.value.trim();
      return board.value
        .filter(item => !tone.value || item.tone === tone.value)
        .filter(item => !category.value || item.competition.category === category.value)
        .filter(item => !keyword || `${item.competition.name}${item.competition.short}${item.competition.intro}${item.competition.site}`.includes(keyword))
        .slice()
        .sort((a, b) => (order.value === 'nearest' ? a.nearest.days - b.nearest.days || a.competition.id - b.competition.id : a.competition.id - b.competition.id));
    });

    const todayLabel = computed(() => `${today.value.getFullYear()} 年 ${dayLabel(today.value)}`);
    const weekdayLabel = computed(() => WEEKDAYS[today.value.getDay()]);
    const filtered = computed(() => items.value.length !== COMPETITIONS.length);
    const resetFilters = () => { query.value = ''; tone.value = ''; category.value = ''; };
    const recalculate = () => { today.value = new Date(); };
    // 某一档今天没有赛事时给一句实话，避免数字为 0 却仍写着「立即报名」。
    const bucketHint = (key: Tone) => {
      if (!counts.value[key]) return '当前没有赛事落在该区间';
      if (key === 'green') return '立即确认报名与组队';
      return key === 'yellow' ? '进入集中备赛阶段' : '提前规划训练与选题';
    };

    return {
      todayLabel,
      weekdayLabel,
      query,
      tone,
      category,
      order,
      categories: CATEGORIES,
      totals: COMPETITIONS.length,
      counts,
      items,
      filtered,
      resetFilters,
      recalculate,
      bucketHint,
      toneOf: (phase: PhaseStatus) => toneForDays(phase.days),
      countdownText,
      phaseRange: (phase: PhaseStatus) => `${dayLabel(phase.start)} – ${dayLabel(phase.end)}`
    };
  },
  template: `
  <section class="management competition-page">
    <header class="mg-heading">
      <div>
        <p class="mg-kicker">实验室 / 学科竞赛</p>
        <h1>竞赛预告</h1>
        <p>把《竞赛目录》里的 {{ totals }} 项赛事排成一张倒计时看板：离下一个关键节点越近越靠前，颜色提示备赛紧迫度。</p>
      </div>
      <div class="competition-legend" aria-label="倒计时颜色规则">
        <span data-tone="green"><i aria-hidden="true"></i>7 天以内</span>
        <span data-tone="yellow"><i aria-hidden="true"></i>7–30 天</span>
        <span data-tone="gray"><i aria-hidden="true"></i>30 天以上</span>
      </div>
    </header>

    <div class="competition-metrics">
      <article data-tone="green"><span>7 天内节点</span><b>{{ counts.green }}</b><small>{{ bucketHint('green') }}</small></article>
      <article data-tone="yellow"><span>7–30 天节点</span><b>{{ counts.yellow }}</b><small>{{ bucketHint('yellow') }}</small></article>
      <article data-tone="gray"><span>30 天以上节点</span><b>{{ counts.gray }}</b><small>{{ bucketHint('gray') }}</small></article>
      <article class="competition-today"><span>统计基准日</span><b>{{ todayLabel }}</b><small>{{ weekdayLabel }} · 每日自动重算</small></article>
    </div>

    <div class="mg-filters competition-filters">
      <label class="mg-search">检索赛事<input v-model="query" maxlength="40" placeholder="输入赛事名称、简称或官网"></label>
      <label>紧迫度<select v-model="tone"><option value="">全部</option><option value="green">7 天以内</option><option value="yellow">7–30 天</option><option value="gray">30 天以上</option></select></label>
      <label>赛项类别<select v-model="category"><option value="">全部类别</option><option v-for="name in categories" :key="name" :value="name">{{ name }}</option></select></label>
      <label>排列顺序<select v-model="order"><option value="nearest">临近优先</option><option value="catalog">按目录序号</option></select></label>
      <button type="button" class="mg-button primary" @click="recalculate">按今天重算</button>
      <button type="button" class="mg-button" :disabled="!filtered" @click="resetFilters">重置筛选</button>
    </div>

    <div class="mg-results-bar"><span>共 {{ items.length }} 项赛事{{ filtered ? '（已筛选）' : '' }}</span><span>倒计时终点：每一项最近的「报名 / 校赛 / 省赛 / 决赛」节点</span></div>

    <div class="competition-board">
      <article v-for="item in items" :key="item.competition.id" class="competition-card" :data-tone="item.tone">
        <header class="competition-card-head">
          <span class="competition-no">{{ String(item.competition.id).padStart(2, '0') }}</span>
          <div class="competition-title">
            <h2>{{ item.competition.name }}</h2>
            <p>{{ item.competition.short }}<i aria-hidden="true">·</i>{{ item.competition.category }}</p>
          </div>
          <div class="competition-count" :data-tone="item.tone">
            <small>{{ item.nearest.state === 'active' ? '还剩' : '还有' }}</small>
            <b>{{ item.nearest.days }}</b>
            <span>天</span>
          </div>
        </header>

        <p class="competition-intro">{{ item.competition.intro }}</p>

        <ul class="competition-phases" aria-label="关键节点与倒计时">
          <li v-for="phase in item.phases" :key="phase.phase.label" :data-tone="toneOf(phase)" :data-state="phase.state" :aria-label="phase.phase.label + ' ' + countdownText(phase)">
            <i class="competition-dot" aria-hidden="true"></i>
            <span class="competition-phase-label">{{ phase.phase.label }}</span>
            <span class="competition-phase-span">{{ phase.phase.span }}</span>
            <span class="competition-phase-days">{{ countdownText(phase) }}</span>
          </li>
        </ul>

        <dl class="competition-facts">
          <div><dt>赛期</dt><dd>{{ item.competition.schedule }}</dd></div>
          <div><dt>赛制</dt><dd>{{ item.competition.format }}</dd></div>
        </dl>

        <footer class="competition-foot">
          <span class="competition-next">下一节点 · <b>{{ item.nearest.phase.label }}</b> · {{ item.nearest.phase.span }} · 预计 {{ phaseRange(item.nearest) }}</span>
          <a class="competition-site" :href="item.competition.siteUrl" target="_blank" rel="noopener noreferrer">官网 {{ item.competition.site }} <i aria-hidden="true">↗</i></a>
        </footer>
      </article>

      <div v-if="!items.length" class="mg-empty">
        <h2>没有匹配的赛事</h2>
        <p>换个关键词，或把紧迫度、类别改回「全部」。</p>
      </div>
    </div>

    <p class="competition-note">倒计时口径：按《竞赛目录》给出的赛期月份与旬别推算，节点已开始显示「进行中 · 剩 N 天」，尚未开始显示「还有 N 天」；颜色规则为 7 天以内绿色、7–30 天黄色、30 天以上灰色。日期仅作备赛提醒，请以各赛事官网通知为准。</p>
  </section>`
};
