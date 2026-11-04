import React from 'react';
import { GameType } from '../types';
import { 
  Sparkles, 
  Brain, 
  Grid, 
  Link2, 
  Scale, 
  SpellCheck, 
  BookOpenCheck,
  Award,
  ChevronLeft
} from 'lucide-react';
import { soundManager } from '../utils/soundHelper';

interface GameSelectorProps {
  onSelectGame: (game: GameType) => void;
  gameStats: Record<GameType, number>;
}

interface GameCardMeta {
  id: GameType;
  title: string;
  badge: string;
  description: string;
  icon: React.ReactNode;
  themeColor: {
    bg: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    btnBg: string;
    iconBg: string;
  };
}

export const GameSelector: React.FC<GameSelectorProps> = ({ onSelectGame, gameStats }) => {
  const games: GameCardMeta[] = [
    {
      id: 'memory',
      title: 'كروت الذاكرة القرآنية',
      badge: 'تطابق وبصيرة',
      description: 'اقلب الكروت وطابق الكلمة القرآنية مع معناها أو نظيرتها لتقوية الذاكرة البصرية واللغوية.',
      icon: <Brain className="w-7 h-7 text-emerald-700" />,
      themeColor: {
        bg: 'bg-emerald-50/90 hover:bg-emerald-50',
        border: 'border-emerald-200 hover:border-emerald-400',
        badgeBg: 'bg-emerald-100',
        badgeText: 'text-emerald-800',
        btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        iconBg: 'bg-emerald-100',
      }
    },
    {
      id: 'crossword',
      title: 'الكلمات المتقاطعة',
      badge: 'تفكير وتركيز',
      description: 'حل شبكة الكلمات المتقاطعة باستخدام دلالات ومعاني آيات جزء عمّ خطوة بخطوة.',
      icon: <Grid className="w-7 h-7 text-sky-700" />,
      themeColor: {
        bg: 'bg-sky-50/90 hover:bg-sky-50',
        border: 'border-sky-200 hover:border-sky-400',
        badgeBg: 'bg-sky-100',
        badgeText: 'text-sky-800',
        btnBg: 'bg-sky-600 hover:bg-sky-700 text-white',
        iconBg: 'bg-sky-100',
      }
    },
    {
      id: 'match_meaning',
      title: 'توصيل المفردات بالمعنى',
      badge: 'فهم وتفسير',
      description: 'صل كل كلمة قرآنية مباركة بمعناها العربي الدقيق والمبسط واستمع لنطقها الصحيح.',
      icon: <Link2 className="w-7 h-7 text-teal-700" />,
      themeColor: {
        bg: 'bg-teal-50/90 hover:bg-teal-50',
        border: 'border-teal-200 hover:border-teal-400',
        badgeBg: 'bg-teal-100',
        badgeText: 'text-teal-800',
        btnBg: 'bg-teal-600 hover:bg-teal-700 text-white',
        iconBg: 'bg-teal-100',
      }
    },
    {
      id: 'match_opposites',
      title: 'الكلمة والنظير والمضاد',
      badge: 'بلاغة وفروق',
      description: 'طابق بين الكلمات القرآنية وأضدادها أو نظائرها الواردة في السور (مثل: يُسر وعُسر، سماء وأرض).',
      icon: <Scale className="w-7 h-7 text-amber-700" />,
      themeColor: {
        bg: 'bg-amber-50/90 hover:bg-amber-50',
        border: 'border-amber-200 hover:border-amber-400',
        badgeBg: 'bg-amber-100',
        badgeText: 'text-amber-900',
        btnBg: 'bg-amber-600 hover:bg-amber-700 text-white',
        iconBg: 'bg-amber-100',
      }
    },
    {
      id: 'missing_letter',
      title: 'الحرف الناقص في الكلمة',
      badge: 'هجاء وإملاء قرآني',
      description: 'املأ الفراغ بالحرف العربي الصحيح لتكملة الكلمة القرآنية واكتشف موضعها ومعناها في السورة.',
      icon: <SpellCheck className="w-7 h-7 text-indigo-700" />,
      themeColor: {
        bg: 'bg-indigo-50/90 hover:bg-indigo-50',
        border: 'border-indigo-200 hover:border-indigo-400',
        badgeBg: 'bg-indigo-100',
        badgeText: 'text-indigo-800',
        btnBg: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        iconBg: 'bg-indigo-100',
      }
    },
    {
      id: 'missing_word_ayah',
      title: 'الكلمة الناقصة في الآية',
      badge: 'حفظ وتثبيت',
      description: 'أكمل الآية الكريمة باختيار الكلمة القرآنية الناقصة الصحيحة مع التشكيل والتلاوة.',
      icon: <BookOpenCheck className="w-7 h-7 text-rose-700" />,
      themeColor: {
        bg: 'bg-rose-50/90 hover:bg-rose-50',
        border: 'border-rose-200 hover:border-rose-400',
        badgeBg: 'bg-rose-100',
        badgeText: 'text-rose-800',
        btnBg: 'bg-rose-600 hover:bg-rose-700 text-white',
        iconBg: 'bg-rose-100',
      }
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Banner */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-bold mb-3 shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>مخصصة لقصار سور جزء عمّ من القرآن الكريم</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800 tracking-tight font-cairo">
          اختر لعبتك اللغوية وابدأ التحدي!
        </h2>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto mt-2 font-tajawal">
          ست ألعاب تعليمية وتفاعلية مصممة بعناية لمساعدة المبتدئين والأطفال على حفظ وفهم مفردات جزء عمّ بكل سهولة ومرح.
        </p>
      </div>

      {/* Grid of 6 Game Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {games.map((game) => {
          const completedCount = gameStats[game.id] || 0;
          return (
            <div
              key={game.id}
              data-game={game.id}
              onClick={() => {
                soundManager.playCardFlip();
                onSelectGame(game.id);
              }}
              className={`group relative rounded-3xl p-6 border-2 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between ${game.themeColor.bg} ${game.themeColor.border}`}
            >
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className={`p-3.5 rounded-2xl ${game.themeColor.iconBg} shadow-xs group-hover:scale-110 transition-transform`}>
                    {game.icon}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${game.themeColor.badgeBg} ${game.themeColor.badgeText}`}>
                      {game.badge}
                    </span>
                    {completedCount > 0 && (
                      <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        {completedCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-800 transition-colors font-cairo">
                  {game.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed font-tajawal">
                  {game.description}
                </p>
              </div>

              {/* Start Button */}
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  {completedCount > 0 ? `أنجزت ${completedCount} جولات` : 'متاح للبدء الآن'}
                </span>
                <button
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-transform active:scale-95 group-hover:shadow-md ${game.themeColor.btnBg}`}
                >
                  <span>ابدأ اللعب</span>
                  <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

