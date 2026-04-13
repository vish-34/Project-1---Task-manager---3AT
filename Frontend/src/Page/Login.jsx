import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../Api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Enter both email and password to continue.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/date-selector");
    } catch {
      setErrorMessage("Invalid credentials. Please check your details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="app-shell min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />

      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="brand-panel hidden rounded-[32px] p-10 text-white shadow-2xl lg:block">
          <div className="brand-badge mb-6">TaskPilot Workspace</div>
          <h1 className="max-w-lg text-5xl font-semibold leading-tight tracking-tight">
            Professional task management for focused teams.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-200">
            Organize priorities, review progress, and keep execution visible in
            one refined dashboard built for everyday work.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="glass-card">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-300">
                Clarity
              </p>
              <p className="mt-3 text-2xl font-semibold">100%</p>
              <p className="mt-2 text-sm text-slate-300">
                View tasks, status, and actions in one streamlined table.
              </p>
            </div>

            <div className="glass-card">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-300">
                Control
              </p>
              <p className="mt-3 text-2xl font-semibold">Fast</p>
              <p className="mt-2 text-sm text-slate-300">
                Add, update, and remove work without leaving the dashboard.
              </p>
            </div>

            <div className="glass-card">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-300">
                Presence
              </p>
              <p className="mt-3 text-2xl font-semibold">Executive</p>
              <p className="mt-2 text-sm text-slate-300">
                A premium interface that feels like a real product.
              </p>
            </div>
          </div>
        </section>

        <section className="surface-card mx-auto w-full max-w-md rounded-[28px] p-8 shadow-2xl sm:p-10">
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            TaskPilot
          </div>

          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">
            Sign in to your workspace
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Access your task command center and continue where you left off.
          </p>

          <div className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </span>
              <input
                className="input-field"
                placeholder="name@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onKeyDown={handleKeyDown}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </span>
              <input
                type="password"
                className="input-field"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onKeyDown={handleKeyDown}
              />
            </label>
          </div>

          {errorMessage ? (
            <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          <button
            onClick={handleLogin}
            disabled={isSubmitting}
            className="primary-button mt-7 w-full justify-center"
          >
            {isSubmitting ? "Signing in..." : "Enter Dashboard"}
          </button>

          <p className="mt-5 text-xs leading-6 text-slate-400">
            Designed for a clean, professional workflow with fewer clicks and
            better visibility.
          </p>
        </section>
      </div>
    </div>
  );
}
