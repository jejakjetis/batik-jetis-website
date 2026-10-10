import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimateIn } from "@/components/ui/AnimateIn";
import type { PublicFaq } from "@/server/db/types";

// <details>/<summary>: bisa dibuka-tutup dengan keyboard tanpa JavaScript.
export function Faq({ items }: { items: PublicFaq[] }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-sand py-20 lg:py-28">
      <Container>
        <AnimateIn>
          <SectionHeading id="faq-title" eyebrow="FAQ" title="Pertanyaan Umum" />
        </AnimateIn>
        <AnimateIn delay={150}>
          <div className="mt-12 divide-y divide-line border-y border-line">
            {items.map((f, i) => (
              <details key={f.id} className="group py-6" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-serif text-2xl font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  {f.question}
                  <span aria-hidden="true" className="mt-1 text-terracotta-text transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-3xl text-lg leading-relaxed text-ink/85">{f.answer}</p>
              </details>
            ))}
          </div>
        </AnimateIn>
      </Container>
    </section>
  );
}
