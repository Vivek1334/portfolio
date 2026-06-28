import { useState, useEffect } from 'react'
import { PlusCircle, Trash2, ArrowLeft, ArrowRight, ClipboardList } from 'lucide-react'

interface Task {
  id?: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

const COLUMNS = [
  { id: 'TODO', title: 'To Do', color: 'border-slate-300 text-slate-500 bg-slate-50/50' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'border-blue-300 text-blue-600 bg-blue-50/20' },
  { id: 'DONE', title: 'Done', color: 'border-green-300 text-green-600 bg-green-50/20' }
] as const;

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('API server returned error');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError('Could not connect to backend server. Make sure it is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newTask: Task = {
      title,
      description,
      priority,
      status: 'TODO'
    };

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });

      if (!res.ok) throw new Error('Failed to create task');

      setTitle('');
      setDescription('');
      setPriority('medium');
      setShowModal(false);
      fetchTasks(); // Refresh
    } catch (err) {
      alert('Error creating task.');
    }
  };

  const handleUpdateStatus = async (task: Task, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    const updatedTask: Task = {
      ...task,
      status: newStatus
    };

    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask)
      });

      if (!res.ok) throw new Error('Failed to update task');
      fetchTasks(); // Refresh
    } catch (err) {
      alert('Error updating status.');
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete task');
      fetchTasks(); // Refresh
    } catch (err) {
      alert('Error deleting task.');
    }
  };

  const getPriorityColor = (p: string) => {
    if (p === 'high') return 'bg-red-100 text-red-700';
    if (p === 'medium') return 'bg-amber-100 text-amber-700';
    return 'bg-slate-100 text-slate-600';
  };

  return (
    <div className="min-h-screen p-6 font-sans text-slate-800 bg-[#fafcf2]">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8 flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <ClipboardList className="text-brand" /> Interactive Kanban Board
          </h1>
          <p className="text-sm text-slate-500 font-light mt-1">
            Java 21 Spring Boot + React Full-Stack Portfolio Project
          </p>
        </div>
        <div className="flex gap-2">
          <span className="text-xs bg-slate-200 px-3 py-1.5 rounded-full font-mono text-slate-700">
            Port: 5175
          </span>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 text-xs bg-slate-900 hover:opacity-90 text-white px-4 py-2 rounded-full font-semibold transition"
          >
            <PlusCircle size={14} /> New Task
          </button>
        </div>
      </header>

      {error && (
        <div className="max-w-6xl mx-auto mb-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Main Board Layout */}
      {loading ? (
        <div className="text-center py-40 text-slate-400 font-light">
          Loading Kanban board database tasks...
        </div>
      ) : (
        <main className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 items-start">
          {COLUMNS.map(column => {
            const columnTasks = tasks.filter(t => t.status === column.id);

            return (
              <div
                key={column.id}
                className={`rounded-2xl border-2 ${column.color} p-4 min-h-[500px] flex flex-col space-y-4`}
              >
                {/* Column Title */}
                <div className="flex items-center justify-between border-b border-slate-200/50 pb-2 mb-2">
                  <h2 className="font-extrabold text-sm uppercase tracking-wider text-slate-800">
                    {column.title}
                  </h2>
                  <span className="text-xs bg-white/80 px-2 py-0.5 rounded-full font-bold shadow-sm border text-slate-600">
                    {columnTasks.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="flex-1 flex flex-col space-y-3">
                  {columnTasks.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200/40 rounded-xl py-20 text-xs text-slate-400 font-light select-none">
                      No cards here
                    </div>
                  ) : (
                    columnTasks.map(task => (
                      <div
                        key={task.id}
                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col space-y-3 hover:shadow-md transition"
                      >
                        {/* Card Header Info */}
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-sm text-slate-900 leading-snug">
                            {task.title}
                          </h3>
                          <span className={`text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>

                        {/* Description */}
                        {task.description && (
                          <p className="text-xs text-slate-500 leading-relaxed font-light">
                            {task.description}
                          </p>
                        )}

                        {/* Card Footer Actions */}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 mt-2">
                          {/* Delete Action */}
                          <button
                            onClick={() => task.id && handleDeleteTask(task.id)}
                            className="text-slate-300 hover:text-red-500 transition"
                            aria-label="Delete card"
                          >
                            <Trash2 size={14} />
                          </button>

                          {/* Navigation Controls */}
                          <div className="flex items-center gap-1">
                            {/* Move Left */}
                            {column.id !== 'TODO' && (
                              <button
                                onClick={() => {
                                  const prevIdx = COLUMNS.findIndex(c => c.id === column.id) - 1;
                                  handleUpdateStatus(task, COLUMNS[prevIdx].id);
                                }}
                                className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                                aria-label="Move left"
                              >
                                <ArrowLeft size={12} />
                              </button>
                            )}

                            {/* Move Right */}
                            {column.id !== 'DONE' && (
                              <button
                                onClick={() => {
                                  const nextIdx = COLUMNS.findIndex(c => c.id === column.id) + 1;
                                  handleUpdateStatus(task, COLUMNS[nextIdx].id);
                                }}
                                className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                                aria-label="Move right"
                              >
                                <ArrowRight size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </main>
      )}

      {/* New Task Dialog / Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xl max-w-sm w-full mx-4 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-extrabold text-slate-900">Create Task Card</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-[0.65rem] font-bold text-slate-500 uppercase mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Write integration test"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition"
                />
              </div>

              <div>
                <label className="block text-[0.65rem] font-bold text-slate-500 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Implement mocks for RestController methods..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition resize-none"
                />
              </div>

              <div>
                <label className="block text-[0.65rem] font-bold text-slate-500 uppercase mb-1">
                  Task Priority
                </label>
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                  {(['low', 'medium', 'high'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-1.5 text-xs font-semibold capitalize rounded-lg transition-all ${
                        priority === p ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white hover:opacity-90 font-semibold text-sm transition"
              >
                Add Card to Board
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
