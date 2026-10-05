"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthActions } from "@/src/features/auth/hooks";
import { setSession } from "@/src/utils/session";
import { Button, Card } from "flxtheme";
import { ThemeModeToggle } from "@/src/components/ThemeModeToggle";
import { cln } from "@/src/utils/cln";

export const LoginPage = () => {
  const router = useRouter();
  const { signIn } = useAuthActions();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await signIn({ username, password });
      setSession("accessToken", response.data.token);
      router.push("/admin");
    } catch (err) {
      console.log(err);
      setError("Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-8 text-foreground">
      <div aria-hidden="true" className="hero-dot-grid pointer-events-none absolute inset-0" />
      <div className="absolute top-4 right-4">
        <ThemeModeToggle />
      </div>

      <Card padding="lg" className={cln("relative w-full max-w-sm rounded-2xl border border-foreground/10 bg-background/80 p-8 shadow-lg backdrop-blur-md")}>
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-mono font-bold tracking-tighter uppercase">Admin Login</h1>
          <p className="text-sm text-foreground/40 font-mono">
            Secure access to content management
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-1.5">
            <label
              className="text-[10px] font-mono font-bold text-foreground/30 uppercase px-1"
              htmlFor="username"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-10 bg-transparent border border-border px-3 rounded focus:outline-none focus:ring-1 focus:ring-primary text-sm font-mono transition-shadow"
              placeholder="Enter username"
            />
          </div>
          <div className="space-y-1.5">
            <label
              className="text-[10px] font-mono font-bold text-foreground/30 uppercase px-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 bg-transparent border border-border px-3 rounded focus:outline-none focus:ring-1 focus:ring-primary text-sm font-mono transition-shadow"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-2 bg-red-500/10 border border-red-500/20 rounded text-[11px] font-mono text-red-500 text-center uppercase">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="rounded"
            size="lg"
            disabled={isLoading}
            fullWidth
          >
            {isLoading ? "PROCESSING..." : "SIGN IN"}
          </Button>
        </form>
      </Card>

    </main>
  );
};

export default LoginPage;
