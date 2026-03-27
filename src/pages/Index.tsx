import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ShoppingCart, Menu, ImageIcon, Star, Check, Lock, Truck, RotateCcw,
  ChevronDown, Package, Shield, X, Minus, Plus, Loader2, Heart,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useCartStore, type ShopifyProduct } from "@/store/cartStore";

/* ─── PRODUCT DATA ─── */
const PRODUCT = {
  name: "[NAZWA PRODUKTU]",
  price: 149.99,
  compareAtPrice: 249.99,
  omnibusPrice: 139.99,
  variantId: "gid://shopify/ProductVariant/PLACEHOLDER",
  handle: "placeholder-product",
  images: Array(5).fill(null) as (string | null)[],
  benefits: [
    "Lorem ipsum dolor sit amet, consectetur adipiscing",
    "Sed do eiusmod tempor incididunt ut labore et dolore",
    "Ut enim ad minim veniam, quis nostrud exercitation",
  ],
  features: [
    "Lorem ipsum dolor sit amet consectetur",
    "Adipiscing elit sed do eiusmod tempor",
    "Incididunt ut labore et dolore magna aliqua",
    "Ut enim ad minim veniam quis nostrud",
  ],
  problems: [
    "Lorem ipsum dolor sit amet consectetur",
    "Adipiscing elit sed do eiusmod tempor",
    "Incididunt ut labore et dolore magna",
    "Ut enim ad minim veniam quis nostrud",
  ],
};

const discount = Math.round(((PRODUCT.compareAtPrice - PRODUCT.price) / PRODUCT.compareAtPrice) * 100);
const fmt = (n: number) => n.toFixed(2).replace(".", ",") + " zł";

const toShopifyProduct = (): ShopifyProduct => ({
  id: `gid://shopify/Product/PLACEHOLDER`,
  title: PRODUCT.name,
  handle: PRODUCT.handle,
  images: { edges: PRODUCT.images.map((url) => ({ node: { url: url || "", altText: PRODUCT.name } })) },
  variants: {
    edges: [
      {
        node: {
          id: PRODUCT.variantId,
          title: "Default",
          price: { amount: String(PRODUCT.price), currencyCode: "PLN" },
        },
      },
    ],
  },
});

/* ─── ANIMATION HELPERS ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ─── ACCORDION ITEM ─── */
function AccItem({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left text-[14px] font-semibold text-white"
      >
        <span className="flex items-center gap-2">
          <Icon size={16} className="text-white/50" />
          {title}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={16} className="text-white/40" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-[13px] text-white/60 leading-relaxed">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── REVIEW CARD ─── */
function ReviewCard({ name, text }: { name: string; text: string }) {
  const [expanded, setExpanded] = useState(false);
  const short = text.length > 120;
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl border border-white/10 bg-[#0F1E36] p-5"
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1A3A6B] to-[#0946F6] text-[14px] font-bold text-white">
          {name[0]}
        </div>
        <div>
          <p className="text-[14px] font-semibold text-white">{name}</p>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} fill="#F5A623" stroke="#F5A623" />
            ))}
          </div>
        </div>
      </div>
      <span className="mb-2 inline-block rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/50">
        Zweryfikowany
      </span>
      <p className="text-[13px] leading-relaxed text-white/70">
        {short && !expanded ? text.slice(0, 120) + "..." : text}
      </p>
      {short && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-[12px] font-medium text-[#4B8BF5]"
        >
          {expanded ? "Zwiń ↑" : "Czytaj więcej →"}
        </button>
      )}
    </motion.div>
  );
}

/* ─── PLACEHOLDER IMAGE ─── */
function PlaceholderImg({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F1E36] to-[#162D50] ${className}`}>
      <ImageIcon size={48} className="text-white/20" />
    </div>
  );
}

/* ════════════════════════ MAIN PAGE ════════════════════════ */
export default function Index() {
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const cart = useCartStore();
  const heroRef = useRef<HTMLDivElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const handler = () => {
      if (!heroRef.current) return;
      const { bottom } = heroRef.current.getBoundingClientRect();
      setShowStickyBar(bottom < 0);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (cart.isOpen) cart.syncCart();
  }, [cart.isOpen]);

  const addToCart = () => {
    cart.addItem({
      product: toShopifyProduct(),
      variantId: PRODUCT.variantId,
      variantTitle: "Default",
      price: PRODUCT.price,
      quantity: qty,
      selectedOptions: [],
    });
    cart.setOpen(true);
  };

  const handleCheckout = () => {
    const url = cart.getCheckoutUrl();
    window.open(url, "_blank");
  };

  const totalItems = cart.totalItems();
  const totalPrice = cart.totalPrice();

  return (
    <div className="min-h-screen bg-[#0A1628] font-sans">
      {/* ─── 1. ANNOUNCEMENT BAR ─── */}
      <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-center bg-[#0946F6] px-4 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-white sm:text-[11px]">
          ✨ Lorem ipsum promo — darmowa dostawa od 199&nbsp;zł
        </p>
      </div>
      <div className="h-[32px] sm:h-[36px]" />

      {/* ─── 2. NAVBAR ─── */}
      <nav className="sticky top-[32px] z-40 border-b border-white/10 bg-[#0A1628]/90 backdrop-blur sm:top-[36px]">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          {/* Left */}
          <div className="flex items-center gap-6">
            <button className="lg:hidden" onClick={() => setMobileMenu(true)}>
              <Menu size={22} className="text-white" />
            </button>
            <div className="hidden items-center gap-4 lg:flex">
              <span className="rounded-md border border-white/30 px-3 py-1 text-[13px] font-medium text-white">
                Produkt
              </span>
              {["Lorem", "Lorem", "Lorem"].map((l, i) => (
                <span key={i} className="cursor-pointer text-[13px] text-white/50 hover:text-white">
                  {l}
                </span>
              ))}
            </div>
          </div>
          {/* Center */}
          <span className="absolute left-1/2 -translate-x-1/2 text-[18px] font-extrabold text-white">
            [LOGO SKLEPU]
          </span>
          {/* Right */}
          <button onClick={() => cart.setOpen(true)} className="relative">
            <ShoppingCart size={22} className="text-white" />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#0946F6] px-1 text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* ─── 3. MOBILE MENU ─── */}
      <Sheet open={mobileMenu} onOpenChange={setMobileMenu}>
        <SheetContent side="left" className="w-[280px] bg-[#0D1B2E] p-0 border-r border-white/10">
          <div className="border-b border-white/10 p-5">
            <span className="text-[18px] font-extrabold text-white">[LOGO SKLEPU]</span>
          </div>
          <div className="flex flex-col gap-1 p-4">
            {["Produkt", "Lorem", "Lorem", "Lorem"].map((l, i) => (
              <button
                key={i}
                onClick={() => setMobileMenu(false)}
                className={`rounded-lg px-3 py-2 text-left text-[14px] font-medium ${
                  i === 0 ? "border border-white/30 text-white" : "text-white/50 hover:bg-white/5"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* ─── 4. CART DRAWER ─── */}
      <Sheet open={cart.isOpen} onOpenChange={cart.setOpen}>
        <SheetContent side="right" className="flex w-full flex-col bg-[#0D1B2E] p-0 sm:max-w-md border-l border-white/10">
          {/* Header */}
          <div className="border-b border-white/10 px-5 py-4">
            <h2 className="text-[18px] font-extrabold text-white">
              Koszyk{" "}
              {totalItems > 0 && <span className="text-[14px] font-normal text-white/40">· {totalItems}</span>}
            </h2>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {cart.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <ShoppingCart size={48} className="mb-3 text-white/15" />
                <p className="text-[14px] text-white/40">Twój koszyk jest pusty</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {cart.items.map((item) => (
                  <div key={item.lineId} className="flex gap-3 rounded-2xl border border-white/10 bg-[#0A1628] p-3">
                    <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0F1E36] to-[#162D50]">
                      <ImageIcon size={24} className="text-white/20" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <p className="truncate text-[14px] font-bold text-white pr-2">{item.product.title}</p>
                        <button onClick={() => cart.removeItem(item.lineId)} className="text-white/30 hover:text-[#C41E1E]">
                          <X size={16} />
                        </button>
                      </div>
                      <p className="text-[13px] font-semibold text-[#C41E1E]">{fmt(item.price)}</p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => cart.updateQuantity(item.lineId, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center text-[13px] font-semibold text-white">{item.quantity}</span>
                        <button
                          onClick={() => cart.updateQuantity(item.lineId, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.items.length > 0 && (
            <div className="border-t border-white/10 px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[14px] text-white/50">Razem</span>
                <span className="text-[20px] font-extrabold text-white">{fmt(totalPrice)}</span>
              </div>
              {/* Terms checkbox */}
              <label className="mb-3 flex cursor-pointer items-start gap-2 text-[12px] text-white/50">
                <button
                  type="button"
                  onClick={() => setTermsAccepted(!termsAccepted)}
                  className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors ${
                    termsAccepted ? "border-[#0946F6] bg-[#0946F6]" : "border-white/30 bg-transparent"
                  }`}
                >
                  {termsAccepted && <Check size={12} className="text-white" />}
                </button>
                <span>
                  Akceptuję{" "}
                  <a href="#" target="_blank" rel="noopener" className="underline text-white/70">
                    Warunki świadczenia usług
                  </a>{" "}
                  i{" "}
                  <a href="#" target="_blank" rel="noopener" className="underline text-white/70">
                    Politykę prywatności
                  </a>
                </span>
              </label>
              <motion.button
                whileHover={termsAccepted ? { scale: 1.02 } : {}}
                whileTap={termsAccepted ? { scale: 0.98 } : {}}
                disabled={!termsAccepted}
                onClick={handleCheckout}
                className={`w-full rounded-2xl py-4 text-[14px] font-bold uppercase tracking-wider transition-colors ${
                  termsAccepted
                    ? "bg-[#0946F6] text-white hover:bg-[#0A3AD4]"
                    : "cursor-not-allowed bg-white/10 text-white/30"
                }`}
              >
                {cart.isLoading ? (
                  <Loader2 className="mx-auto animate-spin" size={20} />
                ) : (
                  `KUP TERAZ — ${fmt(totalPrice)}`
                )}
              </motion.button>
              <div className="mt-2 flex items-center justify-center gap-1 text-[10px] uppercase tracking-wider text-white/30">
                <Lock size={10} /> Bezpieczna płatność
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* ─── 5. HERO / PRODUCT ─── */}
      <div ref={heroRef}>
        <Section className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Gallery */}
            <div>
              <PlaceholderImg className="aspect-square w-full" />
              <div className="mt-3 grid grid-cols-5 gap-2">
                {PRODUCT.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`aspect-square rounded-xl bg-gradient-to-br from-[#0F1E36] to-[#162D50] flex items-center justify-center border-2 transition-colors ${
                      activeImg === i ? "border-[#0946F6]" : "border-transparent"
                    }`}
                  >
                    <ImageIcon size={16} className="text-white/20" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-5">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#F5A623" stroke="#F5A623" />
                  ))}
                </div>
                <span className="text-[14px] font-semibold text-white">4.9</span>
                <span className="text-[13px] text-white/40">— Lorem ipsum opinii</span>
              </div>

              <h1 className="text-[26px] font-extrabold leading-tight text-white sm:text-[32px]">
                {PRODUCT.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-[24px] font-extrabold text-[#C41E1E] sm:text-[26px]">{fmt(PRODUCT.price)}</span>
                <span className="text-[16px] text-white/30 line-through">{fmt(PRODUCT.compareAtPrice)}</span>
                <span className="rounded-full bg-[#C41E1E] px-2.5 py-0.5 text-[12px] font-bold text-white">
                  -{discount}%
                </span>
              </div>

              {/* Benefits */}
              <div className="flex flex-col gap-2">
                {PRODUCT.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#0946F6]/15">
                      <Check size={14} className="text-[#4B8BF5]" />
                    </div>
                    <span className="text-[13px] text-white/60">{b}</span>
                  </div>
                ))}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-medium text-white/60">Ilość:</span>
                <div className="flex items-center rounded-xl border border-white/10">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="flex h-10 w-10 items-center justify-center text-white/50">
                    <Minus size={16} />
                  </button>
                  <span className="flex h-10 w-10 items-center justify-center bg-white/5 text-[14px] font-semibold text-white">
                    {qty}
                  </span>
                  <button onClick={() => setQty(qty + 1)} className="flex h-10 w-10 items-center justify-center text-white/50">
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Add to cart */}
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(9,70,246,0.3)" }}
                whileTap={{ scale: 0.98 }}
                onClick={addToCart}
                className="w-full rounded-2xl bg-white py-[18px] text-[14px] font-bold uppercase tracking-wider text-[#0A1628]"
              >
                DODAJ DO KOSZYKA — {fmt(PRODUCT.price * qty)}
              </motion.button>

              {/* Trust */}
              <div className="flex items-center justify-center gap-5 text-[11px] uppercase tracking-wider text-white/40">
                <span className="flex items-center gap-1"><Lock size={12} /> Bezpieczna płatność</span>
                <span className="flex items-center gap-1"><Truck size={12} /> Szybka dostawa</span>
                <span className="flex items-center gap-1"><RotateCcw size={12} /> Łatwy zwrot</span>
              </div>

              {/* Accordion */}
              <div className="rounded-2xl border border-white/10 px-4">
                <AccItem icon={Package} title="Pytanie dotyczące produktu?">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </AccItem>
                <AccItem icon={Shield} title="Gwarancja?">
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </AccItem>
                <AccItem icon={RotateCcw} title="Zwroty?">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </AccItem>
              </div>

              {/* Omnibus */}
              <p className="text-[11px] text-white/30">
                Najniższa cena z ostatnich 30 dni: {fmt(PRODUCT.omnibusPrice)}
              </p>
            </div>
          </div>
        </Section>
      </div>

      {/* ─── 6. PROBLEM / SOLUTION ─── */}
      <Section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center gap-5">
            <span className="inline-block w-fit rounded-full bg-[#FF6B00]/15 px-3 py-1 text-[12px] font-semibold text-[#FF9F43]">
              Problem
            </span>
            <h2 className="text-[24px] font-extrabold text-white sm:text-[30px]">
              Lorem ipsum dolor sit amet consectetur
            </h2>
            <div className="flex flex-col gap-3">
              {PRODUCT.problems.map((p, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#FF6B00]/15 text-[14px]">
                    🔸
                  </span>
                  <span className="text-[14px] text-white/60">{p}</span>
                </div>
              ))}
            </div>
          </div>
          <PlaceholderImg className="aspect-square w-full" />
        </div>
      </Section>

      {/* ─── 7. FEATURE HIGHLIGHT ─── */}
      <Section className="bg-[#0D1B2E] py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-2 lg:gap-12">
          <PlaceholderImg className="aspect-square w-full order-1 lg:order-2" />
          <div className="flex flex-col justify-center gap-5 order-2 lg:order-1">
            <span className="inline-block w-fit rounded-full bg-[#0946F6]/15 px-3 py-1 text-[12px] font-semibold text-[#4B8BF5]">
              Rozwiązanie
            </span>
            <h2 className="text-[24px] font-extrabold text-white sm:text-[30px]">
              Lorem ipsum dolor sit amet consectetur
            </h2>
            <div className="flex flex-col gap-3">
              {PRODUCT.features.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#0946F6]/15">
                    <Check size={14} className="text-[#4B8BF5]" />
                  </div>
                  <span className="text-[14px] text-white/60">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ─── 8. HOW IT WORKS ─── */}
      <Section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center gap-4">
            <span className="inline-block w-fit rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold text-white/50">
              Jak to działa
            </span>
            <h2 className="text-[24px] font-extrabold text-white sm:text-[30px]">
              Lorem ipsum dolor sit amet
            </h2>
            <p className="text-[14px] leading-relaxed text-white/50">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.
            </p>
          </div>
          <PlaceholderImg className="aspect-square w-full" />
        </div>
      </Section>

      {/* ─── 9. TABS ─── */}
      <Section className="bg-[#0D1B2E] py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-8 text-[24px] font-extrabold text-white sm:text-[30px]">
            Dlaczego {PRODUCT.name}?
          </h2>
          <Tabs defaultValue="tab1" className="w-full">
            <TabsList className="mb-6 inline-flex rounded-xl bg-white/10 p-1">
              {["Dla kogo", "Korzyści", "Specyfikacja"].map((t, i) => (
                <TabsTrigger
                  key={i}
                  value={`tab${i + 1}`}
                  className="rounded-lg px-5 py-2 text-[13px] font-medium text-white/60 data-[state=active]:bg-[#0946F6] data-[state=active]:text-white data-[state=active]:shadow"
                >
                  {t}
                </TabsTrigger>
              ))}
            </TabsList>
            {[1, 2, 3].map((tab) => (
              <TabsContent key={tab} value={`tab${tab}`}>
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0A1628]">
                  <table className="w-full text-left text-[13px]">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-5 py-3 font-semibold text-white">Dla kogo</th>
                        <th className="px-5 py-3 font-semibold text-white">Zalety</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3].map((r) => (
                        <tr key={r} className="border-t border-white/10">
                          <td className="px-5 py-3 text-white/60">Lorem ipsum dolor sit</td>
                          <td className="px-5 py-3 text-white/60">Consectetur adipiscing elit</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </Section>

      {/* ─── 10. COMPARISON ─── */}
      <Section className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <h2 className="mb-8 text-center text-[24px] font-extrabold text-white sm:text-[30px]">
          Porównanie z konkurencją
        </h2>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0D1B2E]">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-white/5">
              <tr>
                <th className="px-5 py-3 font-semibold text-white">Cecha</th>
                <th className="px-5 py-3 text-center font-semibold text-white">{PRODUCT.name}</th>
                <th className="px-5 py-3 text-center font-semibold text-white">Konkurencja</th>
              </tr>
            </thead>
            <tbody>
              {["Lorem ipsum dolor", "Sit amet consectetur", "Adipiscing elit sed", "Do eiusmod tempor", "Incididunt ut labore", "Et dolore magna"].map((feat, i) => (
                <tr key={i} className="border-t border-white/10">
                  <td className="px-5 py-3 text-white/60">{feat}</td>
                  <td className="px-5 py-3 text-center">
                    <div className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-[#0946F6]/15">
                      <Check size={14} className="text-[#4B8BF5]" />
                    </div>
                  </td>
                  <td className="px-5 py-3 text-center text-white/20">✕</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ─── 11. REVIEWS ─── */}
      <Section className="bg-[#0D1B2E] py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <h2 className="text-[24px] font-extrabold text-white sm:text-[30px]">Co mówią klienci</h2>
            <span className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-[12px] font-medium text-white/50 border border-white/10">
              <Heart size={14} className="text-[#C41E1E]" fill="#C41E1E" /> 1200+ zadowolonych klientów
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Anna K.", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris." },
              { name: "Marcin W.", text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." },
              { name: "Kasia L.", text: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod." },
            ].map((r, i) => (
              <ReviewCard key={i} {...r} />
            ))}
          </div>
        </div>
      </Section>

      {/* ─── 12. CTA ─── */}
      <Section className="py-16 sm:py-20 text-center">
        <div className="mx-auto max-w-xl px-4">
          <h2 className="mb-3 text-[24px] font-extrabold text-white sm:text-[30px]">
            Zamów {PRODUCT.name} już teraz
          </h2>
          <p className="mb-6 text-[14px] text-white/50">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
          </p>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(9,70,246,0.3)" }}
            whileTap={{ scale: 0.98 }}
            onClick={addToCart}
            className="rounded-2xl bg-white px-10 py-[18px] text-[14px] font-bold uppercase tracking-wider text-[#0A1628]"
          >
            ZAMÓW TERAZ
          </motion.button>
        </div>
      </Section>

      {/* ─── 13. FAQ ─── */}
      <Section className="bg-[#0D1B2E] py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-8 text-center text-[24px] font-extrabold text-white sm:text-[30px]">
            Najczęstsze pytania
          </h2>
          <div className="rounded-2xl border border-white/10 bg-[#0A1628] px-5 shadow-sm">
            {[
              "Jak szybko otrzymam zamówienie?",
              "Czy mogę zwrócić produkt?",
              "Jakie metody płatności akceptujecie?",
              "Czy produkt ma gwarancję?",
              "Czy wysyłacie za granicę?",
            ].map((q, i) => (
              <AccItem key={i} icon={ChevronDown} title={q}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </AccItem>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── 14. FOOTER ─── */}
      <footer className="border-t border-white/10 bg-[#070F1D] py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 sm:flex-row">
          <div className="flex gap-3 text-[11px] text-white/40 sm:text-[12px]">
            <a href="#" className="hover:underline hover:text-white/60">Regulamin</a>
            <span>|</span>
            <a href="#" className="hover:underline hover:text-white/60">Polityka prywatności</a>
            <span>|</span>
            <a href="#" className="hover:underline hover:text-white/60">Zwroty</a>
          </div>
          <p className="text-[11px] text-white/25 sm:text-[12px]">
            © 2026 [NAZWA SKLEPU]. Wszelkie prawa zastrzeżone.
          </p>
        </div>
      </footer>

      {/* ─── 15. STICKY BUY BAR ─── */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#0A1628]/95 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] backdrop-blur"
          >
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <div className="hidden items-center gap-2 sm:flex">
                <span className="text-[18px] font-extrabold text-[#C41E1E]">{fmt(PRODUCT.price)}</span>
                <span className="text-[14px] text-white/30 line-through">{fmt(PRODUCT.compareAtPrice)}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addToCart}
                className="w-full rounded-xl bg-white px-8 py-3 text-[13px] font-bold uppercase tracking-wider text-[#0A1628] sm:w-auto"
              >
                DODAJ DO KOSZYKA
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 16. SPACER ─── */}
      <div className="h-16" />
    </div>
  );
}
