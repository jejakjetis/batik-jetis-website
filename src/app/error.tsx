"use client";

import { Button, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

// Pesan umum; detail teknis tidak ditampilkan ke pengguna.
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="konten" className="bg-sand py-24 lg:py-32">
      <Container className="max-w-2xl">
        <Eyebrow>Terjadi kendala</Eyebrow>
        <h1 className="mt-3 font-serif text-5xl font-semibold text-ink">Maaf, halaman gagal dimuat</h1>
        <p className="mt-5 text-lg text-ink/85">Silakan coba lagi beberapa saat lagi.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={reset}>
            Coba Lagi
          </Button>
          <ButtonLink href="/" variant="outline" size="lg">
            Kembali ke Beranda
          </ButtonLink>
        </div>
      </Container>
    </main>
  );
}
