"use client"
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function AuthLayout({ children }: { children: React.ReactNode }) {

  const path = usePathname()

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 p-2">
      <main className="relative flex items-center justify-center p-6 sm:p-10">
        <a className="absolute top-1 right-1 text-sm" href={`${path == "/register" ? "/login" : "/register"}`}>
          {path === "/login" ? (
            <span>
              Não tem conta? <strong className="text-main hover:underline">Cadastre-se</strong>
            </span>
          ) : (
            <span>
              Já tem uma conta? <strong className="text-main hover:underline">Entrar</strong>
            </span>
          )}
        </a>
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Lado direito: imagem (só aparece em telas grandes) */}
      <div className="relative hidden lg:block rounded-2xl bg-gray-100">
        <Image
          src="/images/hero-img.svg"
          alt="Ilustração de autenticação"
          fill
          priority
          className="object-contain p-3"
        />
      </div>
    </div>
  );
}