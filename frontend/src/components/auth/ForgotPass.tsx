"use client"
import { useState } from "react";
import FieldForm from "./FieldForm";
import HeaderForm from "./HeaderForm";
import SubmitButton from "./SubmitButton";
import { useRouter } from "next/navigation";
import { recoveryPassRequest } from "@/api/auth";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

export default function ForgotPass() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("")

  async function handleSubmitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true)
    try {
      await recoveryPassRequest({ email })
      // router.push("/dashboard");
      // router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao Recuperar a senha")
    } finally {
      setLoading(false)
    }
  }
  
  return( 
    <div>
      <HeaderForm title="Recuperar Senha" description="Recupere a sua senha, informando o email cadastrado" />

      <form
        onSubmit={handleSubmitForm}
        className="flex flex-col items-center mt-4 gap-5"
      >
        <FieldForm
          label="Email:"
          placeholder="Digite seu Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <p className="text-sm text-red-500 w-full">{error}</p>}

        <SubmitButton label={loading ? "Enviando..." : "Enviar"} />

        
      </form>
    </div>
  )
}