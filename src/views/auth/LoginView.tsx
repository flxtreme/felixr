"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthActions } from "@/src/features/auth/hooks";
import { useTheme } from "@/src/contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { cln } from "@/src/utils/cln";
import { setSession } from "@/src/utils/session";

export const LoginPage = () => {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
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
    <div className="relative p-8 flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      {/* Theme toggle button at top right */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className={cln(
            "p-2 transition-colors hover:text-primary",
            theme === "light" ? "text-primary" : "text-amber-500"
          )}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
        </button>
      </div>

      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-mono font-bold tracking-tighter uppercase">Admin Login</h1>
          <p className="text-sm text-foreground/40 font-mono">
            Secure access to content management
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 bg-primary text-white rounded font-mono font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? "PROCESSING..." : "SIGN IN"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
