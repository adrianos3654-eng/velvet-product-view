import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles, ShoppingBag, Truck, RotateCcw, ShieldCheck, Languages, Smartphone, BatteryFull,
  Headphones, Plus, Minus, ChevronLeft, ChevronRight, ArrowUpRight, X, Loader2, Check,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { storefrontApiRequest, PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";

const COMPARE_AT = 359.99;
const fmt = (n: number) => n.toFixed(2).replace(".", ",") + " zł";

const FEATURES = [
  { icon: Languages, title: "Tłumaczenie na 135 języków", text: "rozmawiaj swobodnie w podróży i w pracy" },
  { icon: Smartphone, title: "Wbudowana aplikacja", text: "tryby rozmowy, nauki i tłumaczenia jednym kliknięciem" },
  { icon: Headphones, title: "Aktywna redukcja szumów", text: "czysty dźwięk nawet na lotnisku czy dworcu" },
  { icon: BatteryFull, title: "Do 40 h z etui", text: "naładuj raz i zapomnij o ładowarce na cały wyjazd" },
];

const BUNDLES = [
  { id: 1, name: "PAKIET SOLO", label: "KUP 1 ☝🏼" },
  { id: 2, name: "PAKIET DUO", label: "KUP 2 ✌🏼", popular: true },
  { id: 3, name: "PAKIET TRIO", label: "KUP 3 🧑‍🧑‍🧒" },
];

const FAQ = [
  { q: "Jak działa tłumaczenie w czasie rzeczywistym?", a: ["Słuchawki przesyłają mowę do aplikacji", "AI tłumaczy ją w ułamku sekundy", "Słyszysz tłumaczenie bezpośrednio w uchu", "Rozmówca może słyszeć odpowiedź z telefonu"] },
  { q: "Gdzie HORIZON™ sprawdza się najlepiej?", a: ["Podróże i wakacje za granicą", "Spotkania biznesowe", "Nauka języków obcych", "Codzienna muzyka i rozmowy"] },
  { q: "Czy potrzebuję internetu?", a: ["Tłumaczenie online obsługuje wszystkie 135 języków", "Muzyka i rozmowy działają bez internetu", "Aplikacja jest darmowa na Android i iOS"] },
  { q: "Ile trwa dostawa?", a: ["Wysyłka nawet w 24 h", "Darmowa dostawa", "14 dni na zwrot bez podania przyczyny"] },
];

const STEPS = [
  { title: "Pobierz aplikację", text: "Zainstaluj darmową aplikację HEXATECH i włącz Bluetooth w telefonie." },
  { title: "Sparuj słuchawki", text: "Otwórz etui — słuchawki połączą się automatycznie w kilka sekund." },
  { title: "Wybierz języki", text: "Ustaw swój język i język rozmówcy spośród 135 dostępnych." },
  { title: "Mów i słuchaj", text: "Rozmawiaj naturalnie — tłumaczenie usłyszysz od razu w uchu." },
];

function useCountdown() {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    const tick = () => {
      const end = new Date(); end.setHours(24, 0, 0, 0);
      setLeft(Math.max(0, end.getTime() - Date.now()));
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  const s = Math.floor(left / 1000);
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((n) => String(n).padStart(2, "0"));
}

export default function FestiveStore() {
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [img, setImg] = useState(0);
  const [bundle, setBundle] = useState(2);
  const [adding, setAdding] = useState(false);
  const cart = useCartStore();
  const [h, m, s] = useCountdown();

  useEffect(() => {
    storefrontApiRequest(PRODUCTS_QUERY, { first: 1, query: "title:HEXATECH HORIZON" })
      .then((d) => setProduct(d?.data?.products?.edges?.[0] ?? null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const images = product?.node.images.edges.map((e) => e.node.url) ?? [];
  const variant = product?.node.variants.edges[0]?.node;
  const price = parseFloat(product?.node.priceRange.minVariantPrice.amount ?? "229.99");
  const discount = Math.round(((COMPARE_AT - price) / COMPARE_AT) * 100);
  const title = product?.node.title ?? "HEXATECH HORIZON™";

  const addToCart = async (qty = bundle) => {
    if (!product || !variant) return;
    setAdding(true);
    await cart.addItem({
      product, variantId: variant.id, variantTitle: variant.title,
      price: { amount: variant.price.amount, currencyCode: variant.price.currencyCode },
      quantity: qty, selectedOptions: variant.selectedOptions,
    });
    setAdding(false);
    cart.setOpen(true);
  };

  const scrollToBuy = () => document.getElementById("kup")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="theme-festive min-h-screen bg-background text-foreground">
      {/* Announcement + countdown */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 py-2.5 text-xs">
          <span className="flex items-center gap-2 font-bold tracking-[0.15em]">
            <Sparkles className="h-3.5 w-3.5 text-accent" /> DZISIAJ −{discount}% + DARMOWA DOSTAWA <Sparkles className="h-3.5 w-3.5 text-accent" />
          </span>
          <span className="flex items-center gap-3">
            <span className="hidden opacity-80 sm:inline">Do końca oferty</span>
            {[h, m, s].map((v, i) => (
              <span key={i} className="flex items-center gap-3">
                <span className="text-lg font-bold tabular-nums">{v}</span>
                {i < 2 && <span className="opacity-60">:</span>}
              </span>
            ))}
          </span>
          <button onClick={scrollToBuy} className="flex items-center gap-1 border-b border-primary-foreground/50 font-semibold">
            Odkryj ofertę <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-10">
            <Link to="/sklep" className="font-display text-2xl font-semibold tracking-tight">
              HEXA<span className="text-accent">TECH</span>
            </Link>
            <nav className="hidden gap-6 text-sm md:flex">
              <Link to="/">Strona główna</Link>
              <a href="#szczegoly">Szczegóły</a>
              <a href="#faq">Pytania</a>
            </nav>
          </div>
          <button onClick={() => cart.setOpen(true)} className="relative p-2" aria-label="Koszyk">
            <ShoppingBag className="h-6 w-6" />
            {cart.totalItems() > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {cart.totalItems()}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Product */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="mb-6 text-xs text-muted-foreground">Strona główna / Kolekcja / {title}</p>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          {/* Gallery */}
          <div className="h-fit rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-soft)] lg:sticky lg:top-24">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
              {loading ? (
                <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
              ) : images[img] ? (
                <img src={images[img]} alt={title} className="h-full w-full object-cover" />
              ) : null}
              {images.length > 1 && (
                <>
                  <button onClick={() => setImg((img - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-card/90 p-2" aria-label="Poprzednie"><ChevronLeft className="h-4 w-4" /></button>
                  <button onClick={() => setImg((img + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-card/90 p-2" aria-label="Następne"><ChevronRight className="h-4 w-4" /></button>
                </>
              )}
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((u, i) => (
                <button key={u} onClick={() => setImg(i)} className={cn("h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2", i === img ? "border-primary" : "border-transparent opacity-70")}>
                  <img src={u} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div id="kup">
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-primary/25 bg-primary/5 p-4">
              <Sparkles className="mt-0.5 h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-bold">Wybór HEXATECH</p>
                <p className="text-xs text-muted-foreground">Wybierz pakiet i przełam bariery językowe.</p>
              </div>
            </div>
            <h1 className="font-display text-4xl leading-tight md:text-5xl">{title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-2xl font-bold">{fmt(price)}</span>
              <span className="text-muted-foreground line-through">{fmt(COMPARE_AT)}</span>
              <span className="rounded-md bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">OSZCZĘDZASZ {discount}%</span>
            </div>

            <div className="mt-6 space-y-3">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"><f.icon className="h-5 w-5" /></span>
                  <p className="text-sm"><strong>{f.title}</strong> — <span className="text-muted-foreground">{f.text}</span></p>
                </div>
              ))}
            </div>

            <h3 className="mt-8 text-center text-sm font-bold tracking-[0.15em]">OSZCZĘDŹ KUPUJĄC WIĘCEJ</h3>
            <div className="mt-3 space-y-3">
              {BUNDLES.map((b) => {
                const active = bundle === b.id;
                return (
                  <button key={b.id} onClick={() => setBundle(b.id)} className={cn("relative flex w-full items-center justify-between rounded-xl border-2 bg-card p-4 text-left transition", active ? "border-primary shadow-[var(--shadow-soft)]" : "border-border")}>
                    {b.popular && <span className="absolute -top-2.5 right-4 rounded-full bg-accent px-3 py-0.5 text-[10px] font-bold text-accent-foreground">Najczęściej wybierane</span>}
                    <span className="flex items-center gap-3">
                      <span className={cn("flex h-5 w-5 items-center justify-center rounded-full border-2", active ? "border-primary bg-primary" : "border-border")}>
                        {active && <Check className="h-3 w-3 text-primary-foreground" />}
                      </span>
                      <span>
                        <span className="block text-sm font-bold">{b.name}</span>
                        <span className="text-xs text-muted-foreground">{b.label} · oszczędzasz {fmt((COMPARE_AT - price) * b.id)}</span>
                      </span>
                    </span>
                    <span className="text-right">
                      <span className="block font-bold italic">{fmt(price * b.id)}</span>
                      <span className="text-xs text-muted-foreground line-through">{fmt(COMPARE_AT * b.id)}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <button onClick={() => addToCart()} disabled={adding || !variant} className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-60">
              {adding ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Dodaj do koszyka</>}
            </button>
            <p className="mt-3 text-center text-xs text-muted-foreground">Apple Pay · BLIK · Google Pay · Klarna · Visa · Mastercard</p>

            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              {[{ i: Truck, t: "Darmowa dostawa", d: "Bez kosztów wysyłki" }, { i: RotateCcw, t: "14 dni na zwrot", d: "Spokojna decyzja" }, { i: ShieldCheck, t: "Bezpieczna płatność", d: "Wygodne zakupy" }].map((x) => (
                <div key={x.t} className="rounded-xl bg-secondary p-3">
                  <x.i className="mx-auto mb-1 h-5 w-5 text-primary" />
                  <p className="text-xs font-bold">{x.t}</p>
                  <p className="text-[11px] text-muted-foreground">{x.d}</p>
                </div>
              ))}
            </div>

            <div id="faq" className="mt-8">
              <Accordion type="single" collapsible className="rounded-xl border border-border bg-card px-4">
                {FAQ.map((f) => (
                  <AccordionItem key={f.q} value={f.q}>
                    <AccordionTrigger className="text-left text-sm font-bold">{f.q}</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-1.5">
                        {f.a.map((a) => <li key={a} className="flex gap-2 text-sm text-muted-foreground"><Check className="h-4 w-4 shrink-0 text-primary" />{a}</li>)}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <p className="mt-3 text-xs text-muted-foreground">Najniższa cena z ostatnich 30 dni: <strong>{fmt(price)}</strong></p>
            </div>
          </div>
        </div>
      </main>

      {/* Marquee */}
      <div className="overflow-hidden bg-primary py-3 text-primary-foreground">
        <div className="animate-festive-marquee flex w-max gap-10 whitespace-nowrap text-sm font-bold tracking-[0.15em]">
          {Array.from({ length: 12 }).map((_, i) => <span key={i}>14-DNIOWA GWARANCJA ZWROTU PIENIĘDZY ✦ KUPUJ BEZ OBAW!</span>)}
        </div>
      </div>

      {/* Story */}
      <section id="szczegoly" className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 md:grid-cols-2">
        {images[1] && <img src={images[1]} alt={title} className="aspect-square w-full rounded-2xl object-cover shadow-[var(--shadow-soft)]" />}
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-accent">HEXATECH ✦ ŚWIAT BEZ BARIER</p>
          <h2 className="mt-3 font-display text-4xl leading-tight">Załóż słuchawki. Zrozum każdego.</h2>
          <p className="mt-4 text-muted-foreground">Wysiadasz z samolotu w obcym kraju i zamiast szukać słów — po prostu rozmawiasz. HORIZON™ tłumaczy rozmowę na bieżąco, prosto do Twojego ucha.</p>
          {[{ t: "Rozmowy bez stresu", d: "Zamawiaj, pytaj o drogę i negocjuj — w 135 językach." }, { t: "Biznes bez tłumacza", d: "Spotkania z zagranicznymi partnerami stają się naturalne." }].map((x, i) => (
            <div key={x.t} className="mt-6 flex gap-4">
              <span className="font-display text-2xl text-accent">0{i + 1}</span>
              <div><h3 className="font-bold">{x.t}</h3><p className="text-sm text-muted-foreground">{x.d}</p></div>
            </div>
          ))}
          <button onClick={scrollToBuy} className="mt-8 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground">Wybieram pakiet</button>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-secondary py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-display text-4xl">Od rozpakowania do pierwszej rozmowy.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {STEPS.map((st, i) => (
              <div key={st.title} className="rounded-2xl border border-border bg-card p-6">
                <span className="font-display text-3xl text-accent">0{i + 1}</span>
                <h3 className="mt-3 font-bold">{st.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{st.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <button onClick={scrollToBuy} className="rounded-xl bg-primary px-8 py-3 font-bold text-primary-foreground">Wybierz i zamów</button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10 text-center text-xs text-muted-foreground">
        <div className="mb-3 flex justify-center gap-5">
          <Link to="/regulamin">Regulamin</Link>
          <Link to="/polityka-prywatnosci">Polityka prywatności</Link>
          <Link to="/zwroty">Zwroty</Link>
        </div>
        © 2026 HEXATECH
      </footer>

      {/* Cart */}
      <Sheet open={cart.isOpen} onOpenChange={cart.setOpen}>
        <SheetContent className="theme-festive flex w-full flex-col bg-background text-foreground sm:max-w-md">
          <SheetHeader><SheetTitle className="font-display text-2xl">Twój koszyk • {cart.totalItems()}</SheetTitle></SheetHeader>
          <div className="mt-4 flex-1 space-y-4 overflow-y-auto">
            {cart.items.length === 0 && <p className="text-sm text-muted-foreground">Twój koszyk jest pusty.</p>}
            {cart.items.map((it) => (
              <div key={it.variantId} className="flex gap-3 rounded-xl border border-border bg-card p-3">
                {it.product.node.images.edges[0] && <img src={it.product.node.images.edges[0].node.url} alt="" className="h-16 w-16 rounded-lg object-cover" />}
                <div className="flex-1">
                  <p className="text-sm font-bold leading-tight">{it.product.node.title}</p>
                  <p className="text-sm">{fmt(parseFloat(it.price.amount))}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button onClick={() => cart.updateQuantity(it.variantId, it.quantity - 1)} className="rounded border border-border p-1" aria-label="Mniej"><Minus className="h-3 w-3" /></button>
                    <span className="w-6 text-center text-sm">{it.quantity}</span>
                    <button onClick={() => cart.updateQuantity(it.variantId, it.quantity + 1)} className="rounded border border-border p-1" aria-label="Więcej"><Plus className="h-3 w-3" /></button>
                  </div>
                </div>
                <button onClick={() => cart.removeItem(it.variantId)} aria-label="Usuń"><X className="h-4 w-4 text-muted-foreground" /></button>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-4">
            <div className="mb-3 flex justify-between font-bold"><span>Łącznie:</span><span>{fmt(cart.totalPrice())}</span></div>
            <button
              disabled={!cart.checkoutUrl || cart.isLoading}
              onClick={() => { const u = cart.getCheckoutUrl(); if (u) window.open(u, "_blank"); }}
              className="h-12 w-full rounded-xl bg-primary font-bold text-primary-foreground disabled:opacity-50"
            >
              {cart.isLoading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "Realizuj zakup"}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
