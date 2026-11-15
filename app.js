(function () {
  const SC = window.SCORECARD, AREAS = window.AREAS, BRANI = window.BRANI, CREDITS = window.CREDITS;
  const W = window.WEIGHTS, CATS = window.CAT_NAMES;
  const STAGES = ['Conventional', 'GSTC compliant', 'Sustainable', 'Restorative', 'Regenerative'];
  const BANDS = [0, 1.5, 2.5, 3.5, 4.5];
  const STAGE_TEXT = [
    'The area obeys the law only. It causes harm that no one measures.',
    'The area meets the minimum of the Global Sustainable Tourism Council.',
    'The area causes no net harm. This is the neutral point.',
    'The area repairs damage to nature and community.',
    'The area gives back more than it takes. Nature and community become stronger each year.'
  ];

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const total = (s) => s.reduce((sum, v, i) => sum + v * W[i], 0);
  const stage = (v) => BANDS.reduce((idx, b, i) => (v >= b ? i : idx), 0);
  const f2 = (v) => v.toFixed(2);
  const f1 = (v) => (Math.round(v * 10) / 10).toFixed(1);
  const chip = (v) => `<span class="chip st-${stage(v)}">${STAGES[stage(v)]}</span>`;
  const list = (arr) => `<ul>${arr.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`;
  const $ = (sel, root) => (root || document).querySelector(sel);

  const allItems = {};
  SC.categories.forEach((c) => c.items.forEach((it) => { allItems[it.code] = it; }));
  const codes = (arr) => `<div class="codes">${arr.map((c) => allItems[c]
    ? `<button class="code" data-code="${c}" title="${esc(allItems[c].name)}">${c}</button>`
    : `<span class="code">${c}</span>`).join('')}</div>`;

  const PW = { Core: 3, Standard: 2, Supplementary: 0 };
  function simCategory(c, over) {
    let w = 0, s = 0, std = 0, stdOk = 0, bonus = 0;
    const coreFail = [];
    c.items.forEach((it) => {
      const v = over && over[it.code] != null ? Math.max(over[it.code], it.score) : it.score;
      w += PW[it.priority]; s += PW[it.priority] * v;
      if (it.priority === 'Core' && v < 2) coreFail.push(it);
      if (it.priority === 'Standard') { std += 1; if (v >= 2) stdOk += 1; }
      if (it.priority === 'Supplementary' && v >= 4) bonus += 0.15;
    });
    const base = s / w, share = stdOk / std;
    let score = base + Math.min(bonus, 0.5);
    if (share < 0.7) score = Math.min(score, 2);
    if (coreFail.length) score = Math.min(score, 1);
    return { base, score, coreFail, share };
  }
  // The No Compromise export is not complete, thus we keep the workbook score for it.
  const simFinal = (over) => SC.categories.reduce((sum, c) =>
    sum + (c.id === 'nc' ? c.score : simCategory(c, over).score) * c.weight, 0);
  const catOf = (code) => SC.categories.find((c) => c.items.some((it) => it.code === code));

  function nextLevel(it) {
    const target = Math.min(5, Math.max(2, Math.floor(it.score) + 1));
    const line = (it.tiers || '').split('\n').find((l) => l.trim().startsWith(target + ':'));
    if (!line) return '';
    const rel = it.relationship ? `. Relationship now: ${it.relationship}` : '';
    return `Level ${target}: ${line.split(':')[1].trim()}${rel}`;
  }
  function evidence(arr, compact) {
    const items = arr.map((c) => allItems[c]).filter(Boolean);
    if (compact) {
      return `<div class="ev-list">${items.map((it) => `<button class="ev st-${stage(it.score)}" data-code="${it.code}">
        <span class="code">${it.code}</span><span>${esc(it.name)}<small>${esc(it.metric)} now${nextLevel(it) ? ' · ' + esc(nextLevel(it)) : ''}</small></span>
        <span class="pill">${f1(it.score)}</span></button>`).join('')}</div>`;
    }
    return `<div class="table-scroll"><table class="ev-table"><thead><tr><th>Item</th><th>Metric (KPI)</th><th>Value now</th><th>Next level needs</th><th>Score</th></tr></thead><tbody>
      ${items.map((it) => `<tr><td><button class="code" data-code="${it.code}">${it.code}</button> ${esc(it.name)} <span class="prio ${it.priority}">${it.priority}</span></td>
        <td>${esc(it.kpi)}<small class="src">${esc(it.source)}</small></td><td class="num">${esc(it.metric)}</td><td>${esc(nextLevel(it))}</td>
        <td><span class="pill st-${stage(it.score)}">${f1(it.score)}</span></td></tr>`).join('')}
    </tbody></table></div>`;
  }

  function figure(key, alt) {
    const c = CREDITS[key];
    return `<figure><img src="assets/img/${key}.jpg" alt="${esc(alt)}" loading="lazy">
      <figcaption>Photo: ${esc(c.author)} · ${esc(c.license)} · Wikimedia Commons</figcaption></figure>`;
  }

  function catBars(now, after) {
    return `<div class="bars">${CATS.map((n, i) => `
      <div class="bar-row">
        <header><span>${n}</span><span class="num">${f1(now[i])}${after && after[i] !== now[i] ? ` → ${f1(after[i])}` : ''}</span></header>
        <div class="track">${after ? `<i class="next" style="width:${after[i] * 20}%"></i>` : ''}<i style="width:${now[i] * 20}%"></i></div>
      </div>`).join('')}</div>`;
  }

  const legend = () => `<div class="legend">${STAGES.map((s, i) =>
    `<span class="chip st-${i}">${s} · ${BANDS[i].toFixed(1)}${i < 4 ? '–' + (BANDS[i + 1] - 0.01).toFixed(2) : '–5.00'}</span>`).join('')}</div>`;

  /* ---------- Island Map ---------- */
  let mode = 'now', selected = null;

  function renderMap() {
    $('#map').innerHTML = `
      <h1>Island Map</h1>
      <p class="lead">Each pin is one area of Sentosa. The number is our estimated score from 0 to 5. Select a pin to see the summary and one improvement for SDC.</p>
      <div class="map-bar">
        <div class="toggle" role="group" aria-label="Score to show">
          <button data-mode="now" aria-pressed="true">Score now</button>
          <button data-mode="after" aria-pressed="false">After improvement</button>
        </div>
        ${legend()}
      </div>
      <div class="map-layout">
        <div>
          <div class="map-box">
            <img src="assets/img/sentosa-map.jpg" alt="Illustrated map of Sentosa island" width="1355" height="847">
            ${AREAS.map((a) => `<button class="pin" data-id="${a.id}" style="left:${a.x}%;top:${a.y}%" aria-pressed="false"><span></span></button>`).join('')}
          </div>
          <div class="area-list">${AREAS.map((a) => `<button data-id="${a.id}" aria-pressed="false"><span class="dot"></span>${esc(a.name)}</button>`).join('')}</div>
        </div>
        <aside class="card panel" id="panel" aria-live="polite"></aside>
      </div>`;
    paintPins();
    renderPanel();
  }

  function paintPins() {
    AREAS.forEach((a) => {
      const v = total(a[mode]), st = stage(v);
      document.querySelectorAll(`#map [data-id="${a.id}"]`).forEach((el) => {
        el.setAttribute('aria-pressed', String(selected === a.id));
        if (el.classList.contains('pin')) {
          el.className = `pin st-${st}`;
          el.firstElementChild.textContent = f1(v);
          el.setAttribute('aria-label', `${a.name}, score ${f2(v)}`);
        } else {
          el.firstElementChild.className = `dot st-${st}`;
          el.firstElementChild.textContent = f1(v);
        }
      });
    });
    document.querySelectorAll('.toggle button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
  }

  function renderPanel() {
    const a = AREAS.find((x) => x.id === selected);
    const panel = $('#panel');
    if (!a) {
      panel.innerHTML = `<div class="empty"><div class="big" aria-hidden="true">📍</div>
        <h2>Select a pin</h2><p>You will see the score, a short summary and one improvement that SDC can make.</p></div>`;
      return;
    }
    const n = total(a.now), f = total(a.after);
    panel.innerHTML = `
      ${figure(a.id, a.name)}
      <div class="panel-body">
        <h2>${esc(a.name)}</h2>
        <p class="kind">${esc(a.kind)}</p>
        <div class="shift">
          <div class="st-${stage(n)}"><small>Score now</small><span class="num">${f2(n)}</span><em>${STAGES[stage(n)]}</em></div>
          <span class="arrow" aria-hidden="true">→</span>
          <div class="st-${stage(f)}"><small>After improvement</small><span class="num">${f2(f)}</span><em>${STAGES[stage(f)]}</em></div>
        </div>
        <p class="gain">+${f2(f - n)} points</p>
        <h4>Summary</h4>
        ${list(a.summary)}
        <div class="improve">
          <h3>Improvement: ${esc(a.improveTitle)}</h3>
          ${list(a.improve)}
        </div>
        <h4>Score by category (now → after)</h4>
        ${catBars(a.now, a.after)}
        <h4>Why this score: evidence from the scorecard</h4>
        ${evidence(a.links, true)}
      </div>`;
    panel.scrollTop = 0;
  }

  function selectArea(id, scroll) {
    selected = id;
    paintPins();
    renderPanel();
    if (scroll && window.matchMedia('(max-width: 980px)').matches) $('#panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- Scorecard ---------- */
  function itemHtml(it, kind) {
    const lvl = Math.max(1, Math.min(5, Math.round(it.score)));
    const names = kind === 'stakeholder'
      ? ['1 Informed', '2 Committed', '3 Certified', '4 Collaborating', '5 Regenerative partner']
      : STAGES.map((s, i) => `${i + 1} ${s}`);
    const rows = [
      ['KPI', it.kpi], ['Latest value', it.metric], ['Thresholds', (it.tiers || '').replace(/\n/g, ' · ')],
      kind === 'stakeholder' ? ['Group', it.group] : ['Assessor level', it.qualitative],
      kind === 'stakeholder' ? ['Relationship', `${it.relationship || ''} · outlook: ${it.outlook || ''}`] : null,
      kind === 'stakeholder' ? ['Role', it.role] : null,
      ['Evidence', it.evidence], ['Benchmark', it.benchmark], ['Data source', it.source],
      ['Reference', [it.ref, it.sdg ? `UN SDG ${it.sdg}` : ''].filter(Boolean).join(' · ')]
    ].filter((r) => r && r[1]);
    return `<details class="item st-${stage(it.score)}" id="item-${it.code}">
      <summary><span class="code">${it.code}</span><strong>${esc(it.name)}</strong>
        <span class="prio ${it.priority}">${it.priority}</span><span class="metric">${esc(it.metric)}</span>
        <span class="pill">${f1(it.score)}</span></summary>
      <div class="item-body">
        <dl class="kv">${rows.map((r) => `<dt>${r[0]}</dt><dd>${esc(r[1])}</dd>`).join('')}</dl>
        <div class="ladder">${it.levels.map((t, i) => `<div class="st-${i}${i + 1 === lvl ? ' here' : ''}"><b>${names[i]}</b>${esc(t)}</div>`).join('')}</div>
      </div></details>`;
  }

  function renderScorecard() {
    const nc = SC.categories.find((c) => c.id === 'nc');
    $('#scorecard').innerHTML = `
      <h1>The Scorecard</h1>
      <p class="lead">The scorecard measures how far Greater Sentosa is from a regenerative destination. It has four categories and ${SC.final.assessed.split(' ')[0]} items. Each item gets a score from 0 to 5.</p>

      <div class="section-head"><h2>How we calculate a score</h2></div>
      <div class="grid g4 steps">
        <div class="card step"><h3>Measure</h3><p>Each item has one KPI. The KPI is a percentage. The value of the KPI gives the first score.</p></div>
        <div class="card step"><h3>Assess</h3><p>The assessor compares Sentosa with five descriptions. The assessor can move the score by one level at most.</p></div>
        <div class="card step"><h3>Apply the gates</h3><p>Core items are mandatory. If one Core item is below level 2, the category score cannot be more than 1.</p></div>
        <div class="card step"><h3>Add the weights</h3><p>Stakeholder Engagement is 35% of the final score. Each of the other three categories is 21.67%.</p></div>
      </div>

      <div class="section-head"><h2>The five stages</h2><p>The stages follow the trajectory of Bill Reed (2007). Level 3 is the neutral point. A regenerative destination must be at level 5.</p></div>
      <div class="ladder">${STAGES.map((s, i) => `<div class="st-${i}"><b>${i + 1} ${s}</b>${STAGE_TEXT[i]}<br><small>Score from ${BANDS[i].toFixed(1)}</small></div>`).join('')}</div>

      <div class="section-head"><h2>The four categories</h2><p>Select a category to see its items. Select an item to see the KPI, the evidence and the five levels.</p></div>
      ${SC.categories.map((c, i) => `
        <details class="cat st-${stage(c.score)}" id="cat-${c.id}">
          <summary><span class="num">${f2(c.score)}</span>
            <span><strong>${i + 1}. ${c.name}</strong> <small>${Math.round(c.weight * 10000) / 100}% of the final score · ${c.items.length} items shown · ${c.reed}</small></span></summary>
          <p class="cat-note">Score before gates: ${f2(c.base)}. Core gate: ${esc(c.coreGate)}. Standard gate: ${esc(c.standardGate)}.
            ${c.id === 'nc' ? ` This page shows ${nc.items.length} of the 17 items in this category. The full list is in the team workbook.` : ''}</p>
          ${c.items.map((it) => itemHtml(it, c.kind)).join('')}
        </details>`).join('')}

      <div class="section-head"><h2>Findings and how to improve the score</h2><p>Each finding shows the items that cause it, the metric, the value now and the value that the next level needs. The score effect uses the scorecard rules.</p></div>
      ${findingsHtml()}

      <div class="section-head"><h2>Priorities</h2></div>
      <div class="grid g3">
        <div class="card"><h3><span class="prio Core">Core</span> Mandatory</h3><p>Weight 3. Each Core item must be at level 2 or above. If not, the category score stops at 1.</p></div>
        <div class="card"><h3><span class="prio">Standard</span> Expected</h3><p>Weight 2. A minimum of 70% of Standard items must be at level 2 or above. If not, the category score stops at 2.</p></div>
        <div class="card"><h3><span class="prio">Supplementary</span> Bonus</h3><p>Weight 0. A Supplementary item at level 4 or above adds 0.15 points. A weak item does not decrease the score.</p></div>
      </div>`;
  }

  function findingsHtml() {
    const fin = SC.final.score, all = {};
    const cards = window.FINDINGS.map((f, i) => {
      let effect = '';
      if (f.whatIf) {
        Object.assign(all, f.whatIf);
        const after = simFinal(f.whatIf), c = catOf(Object.keys(f.whatIf)[0]);
        const cs = simCategory(c, f.whatIf);
        effect = after - fin > 0.004
          ? `<p class="effect"><strong>Score effect:</strong> if these items get to level 2, ${c.name} goes from ${f2(c.score)} to ${f2(cs.score)}. The final score goes from ${f2(fin)} to <strong>${f2(after)}</strong>.</p>`
          : `<p class="effect none"><strong>Score effect:</strong> no change if SDC does only this. ${cs.coreFail.length ? `The Core gate of ${c.name} stays closed because of ${cs.coreFail.map((x) => x.code).join(', ')}.` : `The Standard gate of ${c.name} stays closed.`} Do it together with the other findings.</p>`;
      }
      return `<article class="card finding">
        <h3><span class="n">${i + 1}</span>${esc(f.title)}</h3>
        <p>${esc(f.why)}</p>
        ${evidence(f.codes)}
        <div class="improve"><h3>${f.whatIf ? 'How to improve' : 'What to do'}</h3>${list(f.actions)}</div>
        ${effect}
      </article>`;
    }).join('');
    const total = simFinal(all);
    return `${cards}<div class="card total-effect st-${stage(total)}">
      <div><h3>If SDC does all of these</h3><p>All the items in findings 1 to 6 get to level 2. This is the minimum, not the target. No Compromise stays at its score from the workbook.</p></div>
      <div class="shift"><div class="st-${stage(fin)}"><small>Final score now</small><span class="num">${f2(fin)}</span><em>${STAGES[stage(fin)]}</em></div>
        <span class="arrow" aria-hidden="true">→</span>
        <div class="st-${stage(total)}"><small>After</small><span class="num">${f2(total)}</span><em>${STAGES[stage(total)]}</em></div></div>
    </div>`;
  }

  function renderSources() {
    $('#sources').innerHTML = `
      <h1>Sources</h1>
      <p class="lead">These are the documents and data that we used for the scorecard. In the scorecard, "Public" is a published figure, "Team" is our research, and "Assumption" is our estimate.</p>
      <div class="card table-scroll" style="margin-top:16px"><table><thead><tr><th>Source</th><th>Used for</th></tr></thead><tbody>
        ${SC.sources.map((s) => `<tr><td>${/^https?:\/\//.test(s.link) ? `<a href="${esc(s.link)}" target="_blank" rel="noopener">${esc(s.name)}</a>` : esc(s.name)}</td><td>${esc(s.use)}</td></tr>`).join('')}
      </tbody></table></div>`;
  }

  function openItem(code) {
    location.hash = '#scorecard';
    setTimeout(() => {
      const el = document.getElementById('item-' + code);
      if (!el) return;
      el.closest('details.cat').open = true;
      el.open = true;
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.remove('flash');
      void el.offsetWidth;
      el.classList.add('flash');
    }, 80);
  }

  /* ---------- Sentosa Score ---------- */
  function renderScore() {
    const fin = SC.final.score;
    const ungated = SC.categories.reduce((s, c) => s + c.base * c.weight, 0);
    const sorted = AREAS.slice().sort((a, b) => total(b.now) - total(a.now));
    const counts = SC.dashboard.reduce((acc, d) => acc.map((v, i) => v + d.counts[i]), [0, 0, 0, 0, 0]);
    const sum = counts.reduce((a, b) => a + b, 0);
    $('#score').innerHTML = `
      <h1>Sentosa Score: data dashboard</h1>
      <p class="lead">This is the baseline for ${SC.final.year}. We used public data and our research. Where no data was available, we made an estimate and wrote the reason in the scorecard.</p>

      <div class="hero">
        <div class="card hero-score">
          <span class="of">Final score</span>
          <span class="num">${f2(fin)}</span>
          <span class="of">of 5.00</span>
          <span class="chip st-${stage(fin)}">${STAGES[stage(fin)]}</span>
          <span class="of">Destination tier 1 of 5</span>
        </div>
        <div class="card">
          <h2>Where Sentosa is on the trajectory</h2>
          <div class="scale">
            <span class="marker" style="left:${fin * 20}%">Sentosa now · ${f2(fin)}</span>
            <div class="scale-bar">${STAGES.map((s, i) => `<i class="st-${i}"></i>`).join('')}</div>
            <div class="scale-labels">${STAGES.map((s) => `<span>${s}</span>`).join('')}</div>
            <span class="marker low" style="left:${ungated * 20}%">Without the gates · ${f2(ungated)}</span>
          </div>
          <p>Of ${sum} items, ${counts[0]} are Conventional, ${counts[1]} are GSTC compliant, ${counts[2]} are Sustainable, ${counts[3]} are Restorative and ${counts[4]} are Regenerative.</p>
          <div class="mix" role="img" aria-label="Share of items in each stage">${counts.map((n, i) => `<i class="st-${i}" style="width:${n / sum * 100}%"></i>`).join('')}</div>
        </div>
      </div>

      <div class="section-head"><h2>Score by category</h2></div>
      <div class="grid g4">
        ${SC.categories.map((c, i) => {
          const d = SC.dashboard[i];
          const fail = /Fail/.test(c.coreGate);
          return `<div class="card cat-card st-${stage(c.score)}">
            <h3>${c.name}</h3>
            <span class="num">${f2(c.score)}</span> ${chip(c.score)}
            <dl>
              <div><dt>Weight</dt><dd>${Math.round(c.weight * 10000) / 100}%</dd></div>
              <div><dt>Core gate</dt><dd class="gate ${fail ? 'fail' : 'pass'}">${fail ? `Fail. Score before the gate: ${f2(c.base)}` : 'Pass'}</dd></div>
              <div><dt>Strongest</dt><dd>${esc(d.strongest)}</dd></div>
              <div><dt>Weakest</dt><dd>${esc(d.weakest)}</dd></div>
            </dl>
          </div>`;
        }).join('')}
      </div>

      <div class="section-head"><h2>Gates</h2><p>A gate limits the category score. The table shows the items that close each gate.</p></div>
      <div class="card table-scroll"><table><thead><tr><th>Category</th><th>Score before gates</th><th>Core gate (each Core item at level 2 or above)</th><th>Standard gate (70% at level 2 or above)</th><th>Score</th></tr></thead><tbody>
        ${SC.categories.map((c) => {
          const s = simCategory(c), calc = c.id !== 'nc';
          return `<tr><td><strong>${c.name}</strong></td><td class="num">${f2(c.base)}</td>
            <td>${calc && s.coreFail.length ? `<span class="gate fail">Fail</span> ${codes(s.coreFail.map((x) => x.code))}` : `<span class="gate ${/Fail/.test(c.coreGate) ? 'fail' : 'pass'}">${esc(c.coreGate)}</span>`}</td>
            <td><span class="gate ${/Fail/.test(c.standardGate) ? 'fail' : 'pass'}">${/Fail/.test(c.standardGate) ? 'Fail' : 'Pass'}</span>${calc ? ` · ${Math.round(s.share * 100)}%` : ''}</td>
            <td><span class="pill st-${stage(c.score)}">${f2(c.score)}</span></td></tr>`;
        }).join('')}
      </tbody></table></div>

      <div class="section-head"><h2>Lowest items</h2><p>These are the items with a score below 2. Select a code to see the full evidence in the scorecard.</p></div>
      <div class="card">${evidence(Object.values(allItems).filter((it) => it.score < 2).sort((x, y) => x.score - y.score || PW[y.priority] - PW[x.priority]).map((it) => it.code))}</div>

      <div class="section-head"><h2>Score by area</h2><p>The solid bar is the score now. The light bar is the score after the improvement. Area scores do not use the gates. Select an area to open it on the map.</p></div>
      <div class="card rank">
        ${sorted.map((a) => {
          const n = total(a.now), f = total(a.after);
          return `<button class="rank-row st-${stage(n)}" data-area="${a.id}">
            <strong>${esc(a.name)}</strong>
            <span class="rank-track"><i class="after" style="width:${f * 20}%"></i><i class="now" style="width:${n * 20}%"></i></span>
            <span class="rank-val">${f2(n)} <small>→ ${f2(f)}</small></span></button>`;
        }).join('')}
      </div>

      <div class="section-head"><h2>Destination tier</h2><p>A tier needs a minimum score and a minimum share of island businesses that take part.</p></div>
      <div class="card table-scroll"><table><thead><tr><th>Tier</th><th>Minimum score</th><th>Participation necessary</th><th>Status</th></tr></thead><tbody>
        ${SC.tiers.map((t, i) => `<tr class="${t.met ? 'met' : ''}"><td><span class="chip st-${i}">${esc(t.tier)}</span></td><td class="num">${t.min.toFixed(1)}</td><td>${esc(t.req)}</td><td>${t.met ? 'Achieved' : 'Not yet'}</td></tr>`).join('')}
      </tbody></table></div>

      <div class="section-head"><h2>Tier inputs</h2></div>
      <div class="card table-scroll"><table><thead><tr><th>Input</th><th>Value</th><th>Share</th><th>Source or note</th></tr></thead><tbody>
        ${SC.tierInputs.map((t) => `<tr><td>${esc(t.input)}</td><td class="num">${t.value}</td><td class="num">${t.share == null ? '' : Math.round(t.share * 100) + '%'}</td><td>${esc(t.note)}</td></tr>`).join('')}
      </tbody></table></div>

      <div class="section-head"><h2>UN Sustainable Development Goals</h2><p>Each item connects to one goal. The number is the average score of the connected items.</p></div>
      <div class="sdgs">
        ${SC.sdgs.map((s) => s.avg == null
          ? `<div class="sdg none"><b>SDG ${s.n}</b>${esc(s.goal)}<br><span>Not linked</span></div>`
          : `<div class="sdg st-${stage(s.avg)}"><b>SDG ${s.n}</b>${esc(s.goal)}<br><span class="num">${f1(s.avg)}</span> · ${esc(s.status)}</div>`).join('')}
      </div>`;
  }

  /* ---------- Brani ---------- */
  function renderBrani() {
    $('#brani').innerHTML = `
      <h1>Pulau Brani</h1>
      <p class="lead">Brani is not yet in development. Thus it has no score today. We suggest three ideas and give each idea the score that it can get if SDC builds it as we describe.</p>

      <div class="card brani-hero">
        <div>
          <h2>The island of the brave</h2>
          ${list(BRANI.history)}
          <div class="grid g2">${BRANI.facts.map((f) => `<div class="fact"><span class="num">${f[0]}</span>${esc(f[1])}</div>`).join('')}</div>
        </div>
        ${figure('brani', 'Container port on Pulau Brani in 2024')}
      </div>

      <div class="grid g2 photo-pair" style="margin-top:16px">
        <figure><img src="assets/img/brani-village.jpg" alt="Malay village on stilts at Pulau Brani, about 1900" loading="lazy"><figcaption>Malay village at Pulau Brani, about 1900. Photo: G.R. Lambert &amp; Co. · Public domain · Wikimedia Commons</figcaption></figure>
        <figure><img src="assets/img/brani-tin.jpg" alt="Tin works at Pulau Brani, about 1910" loading="lazy"><figcaption>Tin works at Pulau Brani, about 1910. Photo: C.J. Kleingrothe · Public domain · Wikimedia Commons</figcaption></figure>
      </div>

      <div class="section-head"><h2>Three ideas for a regenerative Brani</h2><p>The scores use the same four categories and weights as the Sentosa scorecard.</p>${legend()}</div>
      ${BRANI.proposals.map((p) => {
        const v = total(p.s);
        return `<article class="card proposal">
          <aside>
            <img src="assets/img/${p.img}.jpg" alt="" loading="lazy">
            <figcaption>Photo: ${esc(CREDITS[p.img].author)} · ${esc(CREDITS[p.img].license)} · Wikimedia Commons</figcaption>
            <div class="side-body">
              <div><h4 style="margin-top:0">Projected score</h4>
                <div class="big-score st-${stage(v)}"><span class="num">${f2(v)}</span> ${chip(v)}</div></div>
              ${catBars(p.s)}
              <div><h4 style="margin-top:0">Related scorecard items</h4>${codes(p.links)}</div>
            </div>
          </aside>
          <div class="main">
            <span class="tag">${esc(p.tag)}</span>
            <h2>${esc(p.name)}</h2>
            <p class="lead">${esc(p.pitch)}</p>
            ${p.parts.map((part) => `<h3>${esc(part[0])}</h3>${list(part[1])}`).join('')}
            <h4>Why it gets this score</h4>
            ${list(p.why)}
            <p class="risk"><strong>Condition:</strong> ${esc(p.risk)}</p>
          </div>
        </article>`;
      }).join('')}
      <p class="note">Sentosa scores ${f2(SC.final.score)} today. Each idea is in the Restorative stage because we designed it from the scorecard. The projected scores are valid only if SDC writes the conditions into the lease and measures the results each year.</p>`;
  }

  /* ---------- Shell ---------- */
  const TABS = ['map', 'scorecard', 'score', 'brani', 'sources'];
  function route() {
    const id = TABS.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'map';
    TABS.forEach((t) => { document.getElementById(t).hidden = t !== id; });
    document.querySelectorAll('.tabs a').forEach((a) => {
      if (a.dataset.tab === id) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    window.scrollTo(0, 0);
  }

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-id], [data-mode], [data-code], [data-area]');
    if (!t) return;
    if (t.dataset.mode) { mode = t.dataset.mode; paintPins(); }
    else if (t.dataset.id) selectArea(t.dataset.id, true);
    else if (t.dataset.code) { e.preventDefault(); openItem(t.dataset.code); }
    else if (t.dataset.area) { location.hash = '#map'; setTimeout(() => selectArea(t.dataset.area, true), 80); }
  });

  renderMap(); renderScorecard(); renderScore(); renderBrani(); renderSources();
  $('#credits').innerHTML = Object.values(CREDITS).map((c) =>
    `<li><a href="${esc(c.page)}" target="_blank" rel="noopener">${esc(c.title)}</a> · ${esc(c.author)} · ${esc(c.license)}</li>`).join('');
  $('#site-url').textContent = location.origin + location.pathname;
  window.addEventListener('hashchange', route);
  route();
  const deepLink = new URLSearchParams(location.search).get('area');
  if (AREAS.some((a) => a.id === deepLink)) selectArea(deepLink, false);
})();
