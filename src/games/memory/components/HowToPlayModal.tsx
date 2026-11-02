import React from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, BookOpen, Volume2, Award, ArrowLeft } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="how-to-play-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-amber-300 relative text-slate-800"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              🎮
            </div>
            <div>
              <h2 className="text-xl font-bold font-['Readex_Pro',sans-serif] text-slate-900">
                كيف نلعب ونحفظ؟ 🌟
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                تعليمات سهلة وممتعة لأبطال القرآن
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 text-sm">
          {/* Step 1 */}
          <div className="flex items-start gap-3 bg-amber-50/70 p-3 rounded-2xl border border-amber-200">
            <span className="w-7 h-7 rounded-xl bg-amber-500 text-white font-black text-sm flex items-center justify-center flex-shrink-0">
              ١
            </span>
            <div>
              <h4 className="font-extrabold text-amber-950">اقلب الكرت الأول</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                اضغط على أي كرت لتفتحه وتشاهد كلمة قرآنية كريمة من جزء عم مع الرسم القرآني والتشكيل.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200">
            <span className="w-7 h-7 rounded-xl bg-emerald-500 text-white font-black text-sm flex items-center justify-center flex-shrink-0">
              ٢
            </span>
            <div>
              <h4 className="font-extrabold text-emerald-950">ابحث عن الكلمة المطابقة</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                تذكر أماكن الكروت، وافتح الكرت الثاني الذي يحمل نفس الكلمة تماماً.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 bg-sky-50/70 p-3 rounded-2xl border border-sky-200">
            <span className="w-7 h-7 rounded-xl bg-sky-500 text-white font-black text-sm flex items-center justify-center flex-shrink-0">
              ٣
            </span>
            <div>
              <h4 className="font-extrabold text-sky-950">إذا ظهرت الكلمة مرتين.. فوز! ✨</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                تصبح النقلة صحيحة وستكسب نجوماً، وتتعرف على معنى الكلمة وسياقها في الآية القرآنية.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3 bg-purple-50/70 p-3 rounded-2xl border border-purple-200">
            <span className="w-7 h-7 rounded-xl bg-purple-500 text-white font-black text-sm flex items-center justify-center flex-shrink-0">
              ٤
            </span>
            <div>
              <h4 className="font-extrabold text-purple-950">اجمع الأوسمة وتصدر التحدي</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                كلما أنهيت الكروت بنقلات أقل، حصلت على ٣ نجوم ذهبية وأوسمة شرفية جديدة!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-extrabold rounded-2xl shadow-lg hover:shadow-amber-200 cursor-pointer text-sm"
          >
            أنا جاهز، هيا نبدأ! 🚀
          </button>
        </div>
      </motion.div>
    </div>
  );
};
