import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <main className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Lado direito: imagem (só aparece em telas grandes) */}
      <div className="relative hidden lg:block bg-zinc-900">
        <Image
          src="/auth-bg.jpg"
          alt="Ilustração de autenticação"
          fill
          priority
          className="object-cover"
        />
      </div>
    </div>
  );
}