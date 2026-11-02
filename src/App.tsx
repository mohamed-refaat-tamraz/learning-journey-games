import { Component, lazy, Suspense, useEffect, useState, type MouseEvent, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, Gamepad2, Home, Layers, Sparkles, Star, Volume2, VolumeX } from 'lucide-react';
import { setSoundEnabled, useSoundEnabled } from './shared/soundPreference';

const NamesGame = lazy(() => import('./games/names/App'));
const MemoryGame = lazy(() => import('./games/memory/App'));
type Page = 'home' | 'names' | 'memory' | 'missing';

function pageFromLocation(): Page {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  return path === '/' ? 'home' : path === '/asma' ? 'names' : path === '/memory' ? 'memory' : 'missing';
}

class GameBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return (
      <div className="portal-message" role="alert">
        <BookOpen size={36} aria-hidden="true" />
        <h1>تعذّر فتح اللعبة</h1>
        <p>جرّب تحديث الصفحة، وسنعود إلى اللعب.</p>
        <button type="button" className="portal-primary" onClick={() => window.location.reload()}>تحديث الصفحة</button>
      </div>
    );
    return this.props.children;
  }
}

function HomePage({ navigate }: { navigate: (event: MouseEvent<HTMLAnchorElement>, path: string) => void }) {
  return (
    <main id="page-content" tabIndex={-1} className="portal-home">
      <section className="portal-intro" aria-labelledby="portal-title">
        <span className="portal-eyebrow"><Sparkles size={15} aria-hidden="true" /> كل لعبة.. اكتشاف جديد</span>
        <h1 id="portal-title">نتعلّم<span className="portal-title-star" aria-hidden="true">✦</span> ونلعب!</h1>
        <p>معاني جميلة، وذاكرة أقوى.<br />اختر لعبتك، وابدأ رحلة صغيرة مليئة بالمعرفة.</p>
        <span className="portal-intro-doodle portal-doodle-one" aria-hidden="true">✧</span>
        <span className="portal-intro-doodle portal-doodle-two" aria-hidden="true">✦</span>
      </section>
      <section className="portal-games" aria-label="اختر لعبة">
        <a className="portal-game-card portal-names-card" href="/asma" onClick={event => navigate(event, '/asma')}>
          <div className="portal-card-visual portal-names-visual" aria-hidden="true">
            <span className="portal-game-tag"><BookOpen size={14} /> تعلّم المعاني</span>
            <span className="portal-float-star portal-star-a">✦</span><span className="portal-float-star portal-star-b">✧</span>
            <div className="portal-name-tile portal-name-tile-back">الكريم</div>
            <div className="portal-name-tile portal-name-tile-front">الرَّحْمَنُ<span><Check size={15} /> إجابة صحيحة!</span></div>
            <div className="portal-mini-choice"><span>الرحيم</span><span>العليم</span><span>الكريم</span></div>
          </div>
          <div className="portal-card-content">
            <div className="portal-card-kicker">اعرف المعنى.. واختر الاسم</div>
            <h2>أسماء الله الحسنى</h2>
            <p>تعرّف على الأسماء ومعانيها المبسّطة، واجمع النجوم مع كل إجابة صحيحة.</p>
            <div className="portal-card-details"><span>٣٠ اسمًا</span><i aria-hidden="true" /><span>٥ مستويات</span><i aria-hidden="true" /><span>معجم وأدعية</span></div>
            <span className="portal-card-cta">هيا نتعلّم <ArrowLeft size={19} aria-hidden="true" /></span>
          </div>
        </a>
        <a className="portal-game-card portal-memory-card" href="/memory" onClick={event => navigate(event, '/memory')}>
          <div className="portal-card-visual portal-memory-visual" aria-hidden="true">
            <span className="portal-game-tag"><Layers size={14} /> تحدّي الذاكرة</span>
            <span className="portal-float-star portal-star-a">✦</span><span className="portal-float-star portal-star-b">✧</span>
            <div className="portal-memory-tiles"><span>✦</span><span>الشَّمْس</span><span>الشَّمْس</span><span>✦</span></div>
            <span className="portal-pair-badge"><Check size={14} /> وجدت الزوج!</span>
          </div>
          <div className="portal-card-content">
            <div className="portal-card-kicker">افتح كرتين.. واعثر على الزوج</div>
            <h2>ذاكرة مفردات جزء عم</h2>
            <p>درّب ذاكرتك بالكروت المتطابقة، واكتشف معاني مفردات القرآن الكريم.</p>
            <div className="portal-card-details"><span>٤ درجات صعوبة</span><i aria-hidden="true" /><span>كروت وأوسمة</span></div>
            <span className="portal-card-cta">هيا نلعب <ArrowLeft size={19} aria-hidden="true" /></span>
          </div>
        </a>
      </section>
      <div className="portal-home-note"><Star size={17} aria-hidden="true" /><p>كل خطوة صغيرة في اللعب، تضيف شيئًا جميلًا إلى معرفتك.</p></div>
      <footer className="portal-footer">رحلة التعلّم <span aria-hidden="true">✦</span> ألعاب تعليمية للأطفال</footer>
    </main>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>(pageFromLocation);
  const soundEnabled = useSoundEnabled();
  useEffect(() => {
    const onPopState = () => setPage(pageFromLocation());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);
  useEffect(() => {
    document.title = page === 'names' ? 'أسماء الله الحسنى | رحلة التعلّم' : page === 'memory' ? 'ذاكرة مفردات جزء عم | رحلة التعلّم' : 'رحلة التعلّم | ألعاب تعليمية للأطفال';
    window.scrollTo(0, 0);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    document.getElementById('page-content')?.focus({ preventScroll: true });
    return () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
  }, [page]);
  const navigate = (event: MouseEvent<HTMLAnchorElement>, path: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
    setPage(pageFromLocation());
  };
  return (
    <div className={`learning-portal ${page === 'home' ? 'portal-is-home' : 'portal-is-game'}`}>
      <a className="portal-skip-link" href="#page-content">انتقل إلى المحتوى</a>
      <header className="portal-header">
        <div className="portal-header-inner">
          <a className="portal-brand" href="/" onClick={event => navigate(event, '/')} aria-label="رحلة التعلّم، الرئيسية">
            <span className="portal-brand-icon"><BookOpen size={24} aria-hidden="true" /><span aria-hidden="true">✦</span></span>
            <span>رحلة التعلّم<small>نكتشف معًا</small></span>
          </a>
          <div className="portal-header-actions">
            {page !== 'home' && <a href="/" onClick={event => navigate(event, '/')} className="portal-home-link"><Home size={17} aria-hidden="true" /><span>كل الألعاب</span></a>}
            <button type="button" className="portal-sound" aria-label={soundEnabled ? 'كتم الصوت لكل الألعاب' : 'تشغيل الصوت لكل الألعاب'} aria-pressed={soundEnabled} onClick={() => setSoundEnabled(!soundEnabled)}>
              {soundEnabled ? <Volume2 size={19} aria-hidden="true" /> : <VolumeX size={19} aria-hidden="true" />}<span>{soundEnabled ? 'الصوت مفعّل' : 'الصوت مكتوم'}</span>
            </button>
          </div>
        </div>
      </header>
      {page === 'home' ? <HomePage navigate={navigate} /> : page === 'missing' ? (
        <main className="portal-message" id="page-content" tabIndex={-1}><Gamepad2 size={40} aria-hidden="true" /><h1>لم نجد هذه الصفحة</h1><a className="portal-primary" href="/" onClick={event => navigate(event, '/')}><ArrowRight size={17} /> العودة للألعاب</a></main>
      ) : (
        <div className="portal-game-stage" id="page-content" tabIndex={-1}>
          <nav className="portal-breadcrumb" aria-label="مسار الصفحة"><a href="/" onClick={event => navigate(event, '/')}>الرئيسية</a><span aria-hidden="true">/</span><span aria-current="page">{page === 'names' ? 'أسماء الله الحسنى' : 'ذاكرة مفردات جزء عم'}</span></nav>
          <GameBoundary key={page}>
            <Suspense fallback={<div className="portal-message" role="status"><span className="portal-loader" aria-hidden="true" /><p>لحظة صغيرة.. نجهّز لعبتك!</p></div>}>
              {page === 'names' ? <NamesGame /> : <MemoryGame />}
            </Suspense>
          </GameBoundary>
        </div>
      )}
    </div>
  );
}
