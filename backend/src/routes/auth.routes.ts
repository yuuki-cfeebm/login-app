import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import crypto from "node:crypto";
import {
  authMiddleware,
  type AuthRequest,
} from "../middlewares/auth.middleware";

export const authRoutes = Router();

const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

const recoverySchema = z.object({
  email: z.string().email("E-mail inválido"),
});

// 1. CADASTRO
authRoutes.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message });
  }

  const { name, email, password } = parsed.data;

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    return res.status(409).json({ error: "E-mail já cadastrado" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, passwordHash },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  return res.status(201).json({ user });
});

// 2. LOGIN
authRoutes.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message });
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "E-mail ou senha inválidos" });
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    return res.status(401).json({ error: "E-mail ou senha inválidos" });
  }

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true, // JS do navegador não consegue ler (protege contra XSS)
    sameSite: "lax", // funciona bem em localhost entre portas diferentes
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias em ms
  });

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

// 3. USUÁRIO LOGADO (ROTA PROTEGIDA)
authRoutes.get("/me", authMiddleware, async (req: AuthRequest, res) => {
  if (!req.userId) {
    return res.status(401).json({ error: "Não autenticado"})
  }
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  return res.json({ user });
});

// 4. LOGOUT
authRoutes.post("/logout", (_req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Logout realizado com sucesso" });
});

// 5. Recovery Pass
authRoutes.post('/recovery-pass', async (req, res) => {
  const parsed = recoverySchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: parsed.error.issues[0]?.message ?? "E-mail inválido" });
  }

  const { email } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    // Gera um código numérico de 6 dígitos (ex: "394812")
    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetCode: code,
        resetCodeExpiresAt: expiresAt,
      },
    });

    // Para testar agora sem configurar servidor de e-mail:
    console.log(`[RECUPERAÇÃO] Código para ${email}: ${code}`);
  }

  return res.json({
    message: "Se o e-mail existir, um código de recuperação foi enviado.",
  });
})