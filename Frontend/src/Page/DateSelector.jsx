import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "selectedTaskDate";

const formatDateLabel = (value) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const createQuickOption = (offset) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().split("T")[0];
};

export default function DateSelector() {
  const navigate = useNavigate();
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [selectedDate, setSelectedDate] = useState(
    localStorage.getItem(STORAGE_KEY) || today
  );

  const quickOptions = useMemo(
    () => [
      { label: "Today", value: createQuickOption(0), copy: "Focus on current priorities." },
      { label: "Tomorrow", value: createQuickOption(1), copy: "Prepare the next work block." },
      { label: "Next 7 Days", value: createQuickOption(7), copy: "Jump ahead to upcoming work." },
    ],
    []
  );

  const handleContinue = () => {
    localStorage.setItem(STORAGE_KEY, selectedDate);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem(STORAGE_KEY);
    navigate("/");
  };

  return (
    <div className="app-shell min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />

      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="brand-panel rounded-[32px] p-8 text-white shadow-2xl sm:p-10">
          <div className="brand-badge mb-6">Workspace Setup</div>
          <h1 className="max-w-lg text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Choose the day you want to plan before opening tasks.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-200">
            Your backend now organizes work by date, so this step sets the task
            board context before you enter the dashboard.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {quickOptions.map((option) => {
              const isActive = selectedDate === option.value;

              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => setSelectedDate(option.value)}
                  className={`date-chip-card text-left ${isActive ? "date-chip-card-active" : ""}`}
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-300">
                    {option.label}
                  </p>
                  <p className="mt-3 text-lg font-semibold text-white">
                    {formatDateLabel(option.value)}
                  </p>
                  <p className="mt-2 text-sm text-slate-300">{option.copy}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="surface-card mx-auto w-full max-w-xl rounded-[28px] p-8 shadow-2xl sm:p-10">
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            Date Selection
          </div>

          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">
            Set your working date
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Pick the date you want the task page to load for. New tasks will be
            created against this same day.
          </p>

          <div className="date-highlight-panel mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Active selection
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {formatDateLabel(selectedDate)}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Tasks shown in the dashboard will be filtered to this date.
            </p>
          </div>

          <label className="mt-8 block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              Task date
            </span>
            <input
              type="date"
              className="input-field"
              value={selectedDate}
              min="2020-01-01"
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </label>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleContinue}
              className="primary-button w-full justify-center"
            >
              Open Task Dashboard
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="secondary-button w-full justify-center sm:w-auto"
            >
              Sign out
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
