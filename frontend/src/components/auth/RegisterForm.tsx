"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerRequest } from "@/api/auth";
import FieldForm from "./FieldForm";
import HeaderForm from "./HeaderForm";
import SubmitButton from "./SubmitButton";

export default function RegisterForm() {

  const router = useRouter();

  const [name, setName] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerRequest({ name, email, password });
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return( 
    <div>
      <HeaderForm title="Cadastrar-se" description="Crie uma conta" />

      <form
        onSubmit={handleSubmitForm}
        className="flex flex-col items-center mt-4 gap-5"
      >
        <FieldForm
          label="Nome:"
          placeholder="Digite seu Nome"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <FieldForm
          label="Email:"
          placeholder="Digite seu Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <FieldForm
          label="Senha:"
          placeholder="Digite sua Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-sm text-red-500 w-full">{error}</p>}

        <SubmitButton label={loading ? "Entrando..." : "Entrar"} />
      </form>
    </div>
  )
}