import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#070F1D] text-white/80">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Powrót do sklepu
        </Link>
        <h1 className="mb-8 text-3xl font-bold text-white">Polityka Prywatności</h1>

        <div className="space-y-6 text-sm leading-relaxed text-white/65">
          <p><strong className="text-white/90">Data wejścia w życie:</strong> 1 stycznia 2026</p>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white/90">1. Administrator danych</h2>
            <p>Administratorem Twoich danych osobowych jest HEXATECH z siedzibą w Polsce. Kontakt: kontakt@hexatech.pl</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white/90">2. Jakie dane zbieramy</h2>
            <ul className="ml-4 list-disc space-y-1">
              <li>Dane identyfikacyjne (imię, nazwisko, adres e-mail)</li>
              <li>Dane adresowe (adres dostawy i rozliczeniowy)</li>
              <li>Dane dotyczące zamówień i transakcji</li>
              <li>Dane techniczne (adres IP, typ przeglądarki, pliki cookies)</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white/90">3. Cel przetwarzania danych</h2>
            <ul className="ml-4 list-disc space-y-1">
              <li>Realizacja zamówień i obsługa klienta</li>
              <li>Prowadzenie konta użytkownika</li>
              <li>Marketing bezpośredni (za zgodą)</li>
              <li>Analityka i usprawnianie usług</li>
              <li>Wypełnianie obowiązków prawnych</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white/90">4. Podstawa prawna</h2>
            <p>Przetwarzamy dane na podstawie: wykonania umowy (art. 6 ust. 1 lit. b RODO), zgody (art. 6 ust. 1 lit. a RODO), prawnie uzasadnionego interesu (art. 6 ust. 1 lit. f RODO) oraz obowiązków prawnych (art. 6 ust. 1 lit. c RODO).</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white/90">5. Udostępnianie danych</h2>
            <p>Dane mogą być przekazywane: firmom kurierskim, operatorom płatności, dostawcom usług IT (hosting, e-mail) oraz organom państwowym na żądanie zgodne z prawem.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white/90">6. Okres przechowywania</h2>
            <p>Dane przechowujemy przez okres niezbędny do realizacji celów przetwarzania, nie dłużej niż wymaga tego prawo (np. 5 lat dla dokumentacji podatkowej).</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white/90">7. Twoje prawa</h2>
            <ul className="ml-4 list-disc space-y-1">
              <li>Prawo dostępu do swoich danych</li>
              <li>Prawo do sprostowania danych</li>
              <li>Prawo do usunięcia danych („prawo do bycia zapomnianym")</li>
              <li>Prawo do ograniczenia przetwarzania</li>
              <li>Prawo do przenoszenia danych</li>
              <li>Prawo do cofnięcia zgody w dowolnym momencie</li>
              <li>Prawo do wniesienia skargi do Prezesa UODO</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white/90">8. Pliki cookies</h2>
            <p>Strona korzysta z plików cookies w celu zapewnienia prawidłowego funkcjonowania, analizy ruchu i personalizacji treści. Możesz zarządzać cookies w ustawieniach swojej przeglądarki.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white/90">9. Kontakt</h2>
            <p>W sprawach dotyczących ochrony danych osobowych skontaktuj się z nami: kontakt@hexatech.pl</p>
          </section>
        </div>
      </div>
    </div>
  );
}
