import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#070F1D] text-white/80">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Powrót do sklepu
        </Link>
        <h1 className="mb-8 text-3xl font-bold text-white">Regulamin Sklepu</h1>

        <div className="space-y-6 text-sm leading-relaxed text-white/65">
          <p><strong className="text-white/90">Data wejścia w życie:</strong> 1 stycznia 2026</p>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white/90">1. Postanowienia ogólne</h2>
            <p>Niniejszy regulamin określa zasady korzystania ze sklepu internetowego HEXATECH, składania zamówień, dostawy oraz reklamacji. Sklep prowadzony jest przez HEXATECH z siedzibą w Polsce.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white/90">2. Składanie zamówień</h2>
            <ul className="ml-4 list-disc space-y-1">
              <li>Zamówienia można składać 24/7 przez stronę internetową</li>
              <li>Złożenie zamówienia stanowi ofertę zawarcia umowy sprzedaży</li>
              <li>Potwierdzenie przyjęcia zamówienia następuje drogą e-mailową</li>
              <li>Ceny podane w sklepie są cenami brutto (zawierają VAT)</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white/90">3. Płatności</h2>
            <p>Akceptujemy następujące metody płatności: karty kredytowe/debetowe (Visa, Mastercard), przelewy bankowe, BLIK oraz płatności za pośrednictwem PayU/Przelewy24. Zamówienie jest realizowane po zaksięgowaniu płatności.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white/90">4. Dostawa</h2>
            <ul className="ml-4 list-disc space-y-1">
              <li>Czas realizacji zamówienia: 1-3 dni robocze</li>
              <li>Dostawa na terenie Polski: kurier (DPD, InPost) lub paczkomaty InPost</li>
              <li>Koszt dostawy jest podawany przed finalizacją zamówienia</li>
              <li>Darmowa dostawa przy zamówieniach powyżej 200 zł</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white/90">5. Gwarancja</h2>
            <p>Wszystkie produkty HEXATECH objęte są 24-miesięczną gwarancją producenta. Gwarancja obejmuje wady materiałowe i produkcyjne. Nie obejmuje uszkodzeń mechanicznych powstałych z winy użytkownika.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white/90">6. Reklamacje</h2>
            <p>Reklamacje można zgłaszać drogą e-mailową na adres: reklamacje@hexatech.pl. Reklamacja zostanie rozpatrzona w ciągu 14 dni od jej otrzymania. W przypadku uznania reklamacji, klient otrzyma produkt wolny od wad lub zwrot pieniędzy.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white/90">7. Odpowiedzialność</h2>
            <p>HEXATECH nie ponosi odpowiedzialności za szkody wynikłe z nieprawidłowego użytkowania produktu, niezgodnego z instrukcją obsługi. Odpowiedzialność HEXATECH ograniczona jest do wartości zamówienia.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white/90">8. Postanowienia końcowe</h2>
            <p>W sprawach nieuregulowanych niniejszym regulaminem zastosowanie mają przepisy prawa polskiego. Wszelkie spory będą rozstrzygane przez sąd właściwy dla siedziby HEXATECH. HEXATECH zastrzega sobie prawo do zmiany regulaminu.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white/90">9. Kontakt</h2>
            <p>E-mail: kontakt@hexatech.pl | Czas odpowiedzi: do 24 godzin w dni robocze.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
