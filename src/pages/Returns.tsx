import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Returns() {
  return (
    <div className="min-h-screen bg-[#070F1D] text-white/80">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Powrót do sklepu
        </Link>
        <h1 className="mb-8 text-3xl font-bold text-white">Polityka Zwrotów</h1>

        <div className="space-y-6 text-sm leading-relaxed text-white/65">
          <p><strong className="text-white/90">Data wejścia w życie:</strong> 1 stycznia 2026</p>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white/90">1. Prawo do odstąpienia od umowy</h2>
            <p>Zgodnie z ustawą o prawach konsumenta, masz prawo odstąpić od umowy zawartej na odległość w terminie <strong className="text-white/90">14 dni</strong> od dnia otrzymania produktu, bez podania przyczyny.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white/90">2. Jak dokonać zwrotu</h2>
            <ol className="ml-4 list-decimal space-y-2">
              <li>Wyślij oświadczenie o odstąpieniu od umowy na adres: zwroty@hexatech.pl</li>
              <li>Otrzymasz potwierdzenie przyjęcia zwrotu wraz z instrukcją wysyłki</li>
              <li>Zapakuj produkt w oryginalne opakowanie (jeśli to możliwe)</li>
              <li>Wyślij paczkę na wskazany adres w ciągu 14 dni od złożenia oświadczenia</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white/90">3. Warunki zwrotu</h2>
            <ul className="ml-4 list-disc space-y-1">
              <li>Produkt musi być w stanie nienaruszonym, bez śladów użytkowania</li>
              <li>Produkt powinien być zwrócony w oryginalnym opakowaniu wraz ze wszystkimi akcesoriami</li>
              <li>Do przesyłki dołącz dowód zakupu (paragon lub faktura)</li>
              <li>Koszt wysyłki zwrotnej pokrywa kupujący, chyba że produkt jest wadliwy</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white/90">4. Zwrot pieniędzy</h2>
            <p>Zwrot środków nastąpi w ciągu <strong className="text-white/90">14 dni</strong> od otrzymania zwróconego produktu. Pieniądze zostaną zwrócone tą samą metodą płatności, której użyto przy zakupie.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white/90">5. Wymiana produktu</h2>
            <p>Jeśli chcesz wymienić produkt na inny wariant, skontaktuj się z nami na: kontakt@hexatech.pl. Wymiana jest bezpłatna, jeśli produkt jest w nienaruszonym stanie.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white/90">6. Produkty wadliwe</h2>
            <p>W przypadku otrzymania produktu wadliwego lub uszkodzonego podczas transportu, skontaktuj się z nami niezwłocznie. Pokryjemy koszty wysyłki zwrotnej i wymienimy produkt lub zwrócimy pełną kwotę.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white/90">7. Wyjątki</h2>
            <p>Zwrotowi nie podlegają produkty, których opakowanie zostało otwarte po dostarczeniu, jeśli produkt nie nadaje się do zwrotu ze względu na ochronę zdrowia lub higienę — nie dotyczy to przypadków wad fabrycznych.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-white/90">8. Kontakt</h2>
            <p>Dział zwrotów: zwroty@hexatech.pl | Czas odpowiedzi: do 24 godzin w dni robocze.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
