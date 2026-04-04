import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-20 left-4 right-4 z-[60] mx-auto max-w-lg rounded-2xl border border-white/10 bg-[#0D1B2E]/95 p-5 shadow-2xl backdrop-blur sm:bottom-24"
        >
          <button onClick={decline} className="absolute right-3 top-3 text-white/40 hover:text-white/70">
            <X size={16} />
          </button>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#0946F6]/15">
              <Cookie size={20} className="text-[#4B8BF5]" />
            </div>
            <div>
              <h3 className="mb-1 text-[14px] font-bold text-white">Ciasteczka 🍪</h3>
              <p className="mb-4 text-[12px] leading-relaxed text-white/60">
                Używamy plików cookies, aby zapewnić najlepsze doświadczenia na naszej stronie. Klikając „Akceptuję", zgadzasz się na ich użycie zgodnie z naszą{" "}
                <a href="/polityka-prywatnosci" className="text-[#4B8BF5] hover:underline">
                  polityką prywatności
                </a>.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={accept}
                  className="rounded-xl bg-white px-5 py-2 text-[12px] font-bold uppercase tracking-wider text-[#0A1628] transition-transform hover:scale-[1.02]"
                >
                  Akceptuję
                </button>
                <button
                  onClick={decline}
                  className="rounded-xl border border-white/15 px-5 py-2 text-[12px] font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white/80"
                >
                  Odrzucam
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
