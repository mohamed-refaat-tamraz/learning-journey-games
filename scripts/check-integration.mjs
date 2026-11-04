import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { build } from 'esbuild';
import { Window } from 'happy-dom';

const project = process.cwd();
const cache = path.join(project, 'node_modules/.cache/learning-games-check');
await mkdir(cache, { recursive: true });
await build({
  stdin: {
    contents: "export { default } from './src/App'; export { NAMES_OF_ALLAH } from './src/games/names/data/namesData'; export { MISSING_LETTER_DATA, QURAN_WORDS } from './src/games/quran/data/quranJuzAmmaData';",
    resolveDir: project, loader: 'tsx',
  },
  bundle: true, platform: 'node', format: 'esm', jsx: 'automatic',
  banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" },
  external: ['react', 'react/*', 'react-dom', 'react-dom/*'],
  loader: { '.css': 'empty' },
  plugins: [{ name: 'confetti-test', setup(api) {
    api.onResolve({ filter: /^canvas-confetti$/ }, () => ({ path: 'confetti', namespace: 'test' }));
    api.onLoad({ filter: /.*/, namespace: 'test' }, () => ({ contents: 'function confetti() {} confetti.reset = () => {}; export default confetti;' }));
    // Exercise real game state and events, without a simulated animation engine.
    api.onResolve({ filter: /^motion\/react$/ }, () => ({ path: 'motion', namespace: 'motion-test' }));
    api.onLoad({ filter: /.*/, namespace: 'motion-test' }, () => ({ contents: `
      import React from 'react';
      const cache = {};
      export const motion = new Proxy({}, { get(_, tag) {
        return cache[tag] ||= React.forwardRef(function TestMotion(props, ref) {
          const { initial, animate, exit, transition, variants, layout, whileHover, whileTap, ...dom } = props;
          return React.createElement(tag, { ...dom, ref });
        });
      } });
      export const AnimatePresence = ({ children }) => children;
    ` }));
  } }],
  outfile: path.join(cache, 'app.mjs'), logLevel: 'silent',
});

const window = new Window({ url: 'https://asma.nourlearn.com/' });
for (const key of ['window', 'document', 'HTMLElement', 'HTMLInputElement', 'SVGElement', 'Element', 'Event', 'MouseEvent', 'StorageEvent', 'localStorage', 'getComputedStyle']) {
  Object.defineProperty(globalThis, key, { configurable: true, value: key === 'window' ? window : typeof window[key] === 'function' && key === 'getComputedStyle' ? window[key].bind(window) : window[key] });
}
globalThis.requestAnimationFrame = window.requestAnimationFrame.bind(window);
globalThis.cancelAnimationFrame = window.cancelAnimationFrame.bind(window);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const intervals = new Set();
const nativeInterval = window.setInterval.bind(window);
const nativeClear = window.clearInterval.bind(window);
window.setInterval = (...args) => { const id = nativeInterval(...args); intervals.add(id); return id; };
const clearInterval = id => { intervals.delete(id); nativeClear(id); };
window.clearInterval = clearInterval;
globalThis.clearInterval = clearInterval;

const oldProgress = { score: 37, stars: 8, streak: 0, activeLevel: 2, completedLevels: [1], soundEnabled: false, showTashkeel: true };
localStorage.setItem('asma_allah_kids_game_v1', JSON.stringify(oldProgress));
localStorage.setItem('juz_amma_badges', JSON.stringify([{ id: 'first_win', unlocked: true, unlockedAt: '2026-11-01T00:00:00Z' }]));
const { default: React, act } = await import('react');
const { createRoot } = await import('react-dom/client');
const { default: App, NAMES_OF_ALLAH, MISSING_LETTER_DATA, QURAN_WORDS } = await import(pathToFileURL(path.join(cache, 'app.mjs')).href);
const container = document.createElement('div');
document.body.append(container);
const root = createRoot(container);
const tick = ms => new Promise(resolve => setTimeout(resolve, ms));
async function settle(ms = 25) { await act(async () => { await tick(ms); }); }
async function click(element) {
  assert.ok(element, 'Requested control exists');
  await act(async () => { element.dispatchEvent(new window.MouseEvent('click', { bubbles: true, button: 0 })); await tick(20); });
  await settle();
}
const button = text => [...container.querySelectorAll('button')].find(element => element.textContent.includes(text));
const go = href => click(container.querySelector(`a[href="${href}"]`));

try {
  await act(async () => { root.render(React.createElement(App)); await tick(25); });
  assert.ok(container.textContent.includes('نتعلّم'));
  assert.equal(container.querySelector('.portal-sound').getAttribute('aria-pressed'), 'false', 'Legacy mute migrates');
  await go('/asma');
  await settle(100);
  assert.equal(window.location.pathname, '/asma');
  assert.match(container.textContent, /مجموع النقاط:\s*37/, 'Existing score is retained');
  assert.ok(container.textContent.includes('المستوى الثاني'), 'Saved level is restored');
  const meaning = container.querySelector('#simplified-meaning-text').textContent;
  const target = NAMES_OF_ALLAH.find(name => meaning.includes(name.simplifiedMeaning));
  assert.ok([8, 9, 10, 14, 20, 26].includes(target.id), 'Restored question belongs to saved level');
  await click(container.querySelector(`#option-btn-${target.id}`));
  const updated = JSON.parse(localStorage.getItem('asma_allah_kids_game_v1'));
  assert.equal(updated.score, 49);
  assert.equal(updated.stars, 9);
  await go('/');
  await go('/memory');
  await settle(100);
  assert.equal(container.querySelectorAll('[id^="memory-card-"]').length, 12);
  await click(button('سهل (6 كرت)'));
  assert.equal(container.querySelectorAll('[id^="memory-card-"]').length, 6);
  const first = container.querySelector('[id^="memory-card-"]');
  const mate = container.querySelector(`[id="${first.id.replace(/-[ab]$/, first.id.endsWith('-a') ? '-b' : '-a')}"]`);
  await click(first);
  await click(mate);
  const badges = JSON.parse(localStorage.getItem('juz_amma_badges'));
  assert.ok(badges.some(badge => badge.id === 'first_match' && badge.unlocked), 'Matching unlocks an independent badge');
  assert.ok(badges.some(badge => badge.id === 'first_win' && badge.unlocked), 'Existing badge is retained');
  assert.ok(intervals.size > 0, 'Memory timer starts while playing');
  await click(container.querySelector('.portal-sound'));
  assert.equal(localStorage.getItem('learning_games_sound_enabled_v1'), 'true');
  await go('/');
  assert.equal(intervals.size, 0, 'Memory interval is cleared on navigation');
  await go('/asma');
  assert.equal(container.querySelector('.portal-sound').getAttribute('aria-pressed'), 'true', 'Sound is shared between games');
  assert.match(container.textContent, /مجموع النقاط:\s*49/, 'Names progress survives the other game');
  await go('/');
  await go('/memory');
  assert.equal(container.querySelectorAll('[id^="memory-card-"]').length, 6, 'Memory difficulty is restored');
  // A delayed mismatch from the old round must not affect a newly started round.
  const cards = [...container.querySelectorAll('[id^="memory-card-"]')];
  const different = cards.find(card => card.id.replace(/-[ab]$/, '') !== cards[0].id.replace(/-[ab]$/, ''));
  await click(cards[0]);
  await click(different);
  await click(button('جولة جديدة'));
  await settle(1000);
  assert.equal(container.querySelectorAll('[aria-label="كرت ذاكرة مخفي"]').length, 6);
  assert.equal(intervals.size, 0, 'Reset cancels the previous timer');
  await go('/');
  await act(async () => { window.history.back(); await tick(40); });
  await settle(100);
  assert.equal(window.location.pathname, '/memory', 'Browser back restores the game route');
  assert.ok(container.querySelector('#juz-amma-memory-app'));
  await go('/');
  localStorage.setItem('quran_juz_amma_stats_v1', JSON.stringify({score: 80, stars: 2, gamesCompleted: {memory: 1}}));
  await go('/quran');
  await settle(100);
  assert.ok(container.querySelector('#quran-games-app'));
  const gameTitles = ['كروت الذاكرة القرآنية', 'الكلمات المتقاطعة', 'توصيل المفردات بالمعنى', 'الكلمة والنظير والمضاد', 'الحرف الناقص في الكلمة', 'الكلمة الناقصة في الآية'];
  const selectQuranGame = async title => {
    const heading = [...container.querySelectorAll('#quran-games-app h3')].find(el => el.textContent === title);
    await click(heading.closest('[data-game]'));
  };
  for (const title of gameTitles) {
    await selectQuranGame(title);
    assert.ok([...container.querySelectorAll('h2')].some(el => el.textContent.includes(title)), title + ' opens');
    await click(container.querySelector('#quran-games-app button[title="العودة لقائمة الألعاب"]'));
    assert.equal(container.querySelectorAll('#quran-games-app [data-game]').length, 6);
  }
  // Both mute controls reflect the same preference, including spoken words.
  await click(container.querySelector('.portal-sound'));
  assert.equal(container.querySelector('#quran-games-app button[title="تفعيل الصوت"]') !== null, true);
  await click(container.querySelector('#quran-games-app button[title="تفعيل الصوت"]'));
  assert.equal(container.querySelector('.portal-sound').getAttribute('aria-pressed'), 'true');
  // Complete a real eight-question run and verify the final answer is counted once.
  await selectQuranGame('الحرف الناقص في الكلمة');
  for (let i = 0; i < 8; i++) {
    const word = container.querySelector('[data-question-word]').textContent.trim();
    const question = MISSING_LETTER_DATA.find(q => q.displayWord === word);
    assert.ok(question, 'Question is drawn from original data');
    await click([...container.querySelectorAll('#quran-games-app button')].find(el => el.textContent.trim() === question.correctLetter));
    await click(button(i === 7 ? 'عرض النتيجة' : 'السؤال التالي'));
  }
  assert.ok(container.textContent.includes('مبارك الإنجاز'));
  let stats = JSON.parse(localStorage.getItem('quran_juz_amma_stats_v1'));
  assert.equal(stats.score, 280, 'Exactly 200 added for eight correct answers');
  assert.equal(stats.gamesCompleted.missing_letter, 1);
  assert.equal(stats.gamesCompleted.memory, 1, 'Legacy collection stats survive');
  await click(button('العب مجدداً'));
  assert.ok(container.textContent.includes('السؤال 1 من 8'), 'Replay starts a fresh game');
  assert.equal(container.querySelectorAll('[data-question-word]').length, 1);
  await go('/');
  await go('/quran');
  stats = JSON.parse(localStorage.getItem('quran_juz_amma_stats_v1'));
  assert.equal(stats.score, 280, 'Collection score persists across navigation');
  // Leave with a pending match: no stale victory or points in another game.
  await selectQuranGame('كروت الذاكرة القرآنية');
  let pair = [...container.querySelectorAll('[data-pair-id]')];
  await click(pair[0]);
  await click(pair.find(el => el !== pair[0] && el.dataset.pairId === pair[0].dataset.pairId));
  await click(container.querySelector('#quran-games-app button[title="العودة لقائمة الألعاب"]'));
  await selectQuranGame('الكلمة الناقصة في الآية');
  await settle(1250);
  assert.ok(container.textContent.includes('الآية 1 من 8'));
  assert.equal(JSON.parse(localStorage.getItem('quran_juz_amma_stats_v1')).score, 280);
  assert.equal(JSON.parse(localStorage.getItem('asma_allah_kids_game_v1')).score, 49, 'Names score remains separate');
  console.log('PASS: eight games, six collection screens, legacy progress, scoring, replay, shared sound, persistence, navigation and timer cleanup.');
} finally {
  await act(async () => { root.unmount(); });
  await window.happyDOM.close();
}
