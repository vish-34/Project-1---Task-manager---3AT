import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../Api/axios";
import TaskList from "../components/TaskList";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const res = await API.get("/task");
      setTasks(res.data);
      setStatusMessage("");
    } catch {
      setStatusMessage("Unable to load tasks right now.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) {
      setStatusMessage("Enter a task title before adding it.");
      return;
    }

    try {
      setIsSaving(true);
      await API.post("/task", { title: title.trim() });
      setTitle("");
      setStatusMessage("Task added successfully.");
      await fetchTasks();
    } catch {
      setStatusMessage("Could not add the task. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/task/${id}`);
      setStatusMessage("Task removed.");
      await fetchTasks();
    } catch {
      setStatusMessage("Could not delete the task.");
    }
  };

  const toggleTask = async (id, status) => {
    try {
      await API.put(`/task/${id}?isCompleted=${status}`);
      setStatusMessage(status ? "Task marked complete." : "Task marked pending.");
      await fetchTasks();
    } catch {
      setStatusMessage("Could not update the task.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.isCompleted).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  return (
    <div className="app-shell min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />

      <div className="mx-auto max-w-7xl">
        <header className="surface-card mb-6 rounded-[28px] p-6 shadow-2xl sm:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                TaskPilot Workspace
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Command your day with a sharper task dashboard.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
                Review priorities, track progress, and keep your workflow clean
                with a professional-grade task experience.
              </p>
            </div>

            <button onClick={logout} className="secondary-button self-start">
              Sign out
            </button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="metric-card">
              <p className="metric-label">Total Tasks</p>
              <p className="metric-value">{totalTasks}</p>
              <p className="metric-copy">All work items currently in your workspace.</p>
            </div>

            <div className="metric-card">
              <p className="metric-label">Completed</p>
              <p className="metric-value">{completedTasks}</p>
              <p className="metric-copy">Tasks that have already been closed out.</p>
            </div>

            <div className="metric-card">
              <p className="metric-label">Pending</p>
              <p className="metric-value">{pendingTasks}</p>
              <p className="metric-copy">Items still waiting for action or review.</p>
            </div>

            <div className="metric-card">
              <p className="metric-label">Completion Rate</p>
              <p className="metric-value">{completionRate}%</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-slate-900 transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.35fr]">
          <div className="surface-card rounded-[28px] p-6 shadow-2xl sm:p-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Quick Capture
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                Add a new task
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Create work items quickly and keep the board updated in real
                time.
              </p>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Task title
                </span>
                <input
                  className="input-field"
                  placeholder="Prepare sprint review presentation"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      addTask();
                    }
                  }}
                />
              </label>

              <button
                onClick={addTask}
                disabled={isSaving}
                className="primary-button"
              >
                {isSaving ? "Saving task..." : "Add Task"}
              </button>
            </div>

            <div className="mt-8 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-700">
                Workspace standard
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Keep titles specific and action-oriented so the table stays easy
                to scan and prioritize.
              </p>
            </div>

            {statusMessage ? (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                {statusMessage}
              </div>
            ) : null}
          </div>

          <div className="surface-card rounded-[28px] p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Task Registry
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  Operational overview
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Search, sort, and manage your tasks with a cleaner data table
                  experience.
                </p>
              </div>

              {isLoading ? (
                <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  Loading
                </div>
              ) : null}
            </div>

            <TaskList
              tasks={tasks}
              onDelete={deleteTask}
              onToggle={toggleTask}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
