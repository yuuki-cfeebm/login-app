import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  let isAuthenticated = false;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333"}/auth/me`,
      {
        headers: {
          Cookie: `token=${token}`,
        },
        cache: "no-store",
      }
    );

    isAuthenticated = response.ok;
  } catch {
    isAuthenticated = false;
  }

  redirect("/login");
}