import * as React from "react";
import { adminApi, getImageUrl } from "@/lib/api";
import type { Project } from "@/lib/api";
import { useToast } from "./AdminShell";

interface ProjectFormData {
  title: string;
  description: string;
  short_description: string;
  tech_stack: string;
  github_url: string;
  live_url: string;
  featured: boolean;
  status: "draft" | "published";
  seo_title: string;
  seo_description: string;
  order_index: string;
}

const emptyForm: ProjectFormData = {
  title: "",
  description: "",
  short_description: "",
  tech_stack: "",
  github_url: "",
  live_url: "",
  featured: false,
  status: "published",
  seo_title: "",
  seo_description: "",
  order_index: "0",
};

function ProjectForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Project;
  onSave: (data: FormData) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = React.useState<ProjectFormData>(
    initial
      ? {
          title: initial.title,
          description: initial.description || "",
          short_description: initial.short_description || "",
          tech_stack: initial.tech_stack.join(", "),
          github_url: initial.github_url || "",
          live_url: initial.live_url || "",
          featured: initial.featured,
          status: initial.status,
          seo_title: initial.seo_title || "",
          seo_description: initial.seo_description || "",
          order_index: String(initial.order_index),
        }
      : emptyForm
  );
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string>(
    initial?.image_url ? getImageUrl(initial.image_url) : ""
  );
  const [saving, setSaving] = React.useState(false);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (imageFile) fd.append("image", imageFile);
      await onSave(fd);
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-white/5 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30";
  const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className={labelClass}>Title *</label>
          <input required className={inputClass} placeholder="Project Title" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Short Description</label>
          <input className={inputClass} placeholder="Brief one-liner..." value={form.short_description}
            onChange={(e) => setForm({ ...form, short_description: e.target.value })} />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Description</label>
          <textarea rows={4} className={inputClass} placeholder="Full project description..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>

        <div>
          <label className={labelClass}>Tech Stack (comma-separated)</label>
          <input className={inputClass} placeholder="React, TypeScript, Node.js" value={form.tech_stack}
            onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} />
        </div>

        <div>
          <label className={labelClass}>Order Index</label>
          <input type="number" className={inputClass} value={form.order_index}
            onChange={(e) => setForm({ ...form, order_index: e.target.value })} />
        </div>

        <div>
          <label className={labelClass}>GitHub URL</label>
          <input type="url" className={inputClass} placeholder="https://github.com/..." value={form.github_url}
            onChange={(e) => setForm({ ...form, github_url: e.target.value })} />
        </div>

        <div>
          <label className={labelClass}>Live URL</label>
          <input type="url" className={inputClass} placeholder="https://..." value={form.live_url}
            onChange={(e) => setForm({ ...form, live_url: e.target.value })} />
        </div>

        <div>
          <label className={labelClass}>SEO Title</label>
          <input className={inputClass} placeholder="SEO title..." value={form.seo_title}
            onChange={(e) => setForm({ ...form, seo_title: e.target.value })} />
        </div>

        <div>
          <label className={labelClass}>SEO Description</label>
          <input className={inputClass} placeholder="SEO description..." value={form.seo_description}
            onChange={(e) => setForm({ ...form, seo_description: e.target.value })} />
        </div>

        <div>
          <label className={labelClass}>Status</label>
          <select className={inputClass} value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" })}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-border bg-white/5 px-4 py-3">
          <input type="checkbox" id="featured-check" checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="h-4 w-4 rounded border-border accent-primary" />
          <label htmlFor="featured-check" className="text-sm font-medium text-foreground">
            Featured project
          </label>
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Project Image</label>
          <div className="flex items-start gap-4">
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="h-24 w-40 rounded-lg object-cover ring-1 ring-border" />
            )}
            <label className="flex-1 cursor-pointer rounded-lg border border-dashed border-border bg-white/5 px-4 py-6 text-center transition-colors hover:border-primary/40">
              <svg className="mx-auto mb-2 h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-muted-foreground">Click to upload image</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-border pt-4">
        <button type="button" onClick={onCancel}
          className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-white/5">
          Cancel
        </button>
        <button type="submit" disabled={saving}
          className="btn-gradient rounded-lg px-6 py-2.5 text-sm font-semibold disabled:opacity-60">
          {saving ? "Saving..." : initial ? "Update Project" : "Create Project"}
        </button>
      </div>
    </form>
  );
}

export function ProjectsManager() {
  const { addToast } = useToast();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [mode, setMode] = React.useState<"list" | "create" | "edit">("list");
  const [editing, setEditing] = React.useState<Project | null>(null);
  const [deleting, setDeleting] = React.useState<number | null>(null);
  const [filter, setFilter] = React.useState<string>("all");
  const [search, setSearch] = React.useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await adminApi.getProjects({ limit: 50 });
      if (res.success && res.data) setProjects(res.data);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { load(); }, []);

  async function handleCreate(fd: FormData) {
    const res = await adminApi.createProject(fd);
    if (res.success) {
      addToast("success", "Project created successfully!");
      setMode("list");
      load();
    } else {
      addToast("error", res.message || "Failed to create project");
    }
  }

  async function handleUpdate(fd: FormData) {
    if (!editing) return;
    const res = await adminApi.updateProject(editing.id, fd);
    if (res.success) {
      addToast("success", "Project updated successfully!");
      setMode("list");
      setEditing(null);
      load();
    } else {
      addToast("error", res.message || "Failed to update project");
    }
  }

  async function handleDelete(id: number) {
    setDeleting(id);
    try {
      const res = await adminApi.deleteProject(id);
      if (res.success) {
        addToast("success", "Project deleted");
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } else {
        addToast("error", "Failed to delete project");
      }
    } finally {
      setDeleting(null);
    }
  }

  const filtered = projects.filter((p) => {
    if (filter === "published" && p.status !== "published") return false;
    if (filter === "draft" && p.status !== "draft") return false;
    if (filter === "featured" && !p.featured) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (mode === "create") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setMode("list")} className="text-muted-foreground hover:text-foreground">
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-foreground">New Project</h1>
        </div>
        <div className="rounded-2xl border border-border bg-card/50 p-6">
          <ProjectForm onSave={handleCreate} onCancel={() => setMode("list")} />
        </div>
      </div>
    );
  }

  if (mode === "edit" && editing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => { setMode("list"); setEditing(null); }} className="text-muted-foreground hover:text-foreground">
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-foreground">Edit Project</h1>
        </div>
        <div className="rounded-2xl border border-border bg-card/50 p-6">
          <ProjectForm initial={editing} onSave={handleUpdate} onCancel={() => { setMode("list"); setEditing(null); }} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground">{projects.length} total projects</p>
        </div>
        <button onClick={() => setMode("create")}
          className="btn-gradient inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold">
          <span>+</span> New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search projects..."
          className="rounded-lg border border-border bg-white/5 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {["all", "published", "draft", "featured"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-2 text-sm font-medium capitalize transition-colors ${
              filter === f ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            }`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="text-muted-foreground">No projects found.</p>
          <button onClick={() => setMode("create")} className="mt-4 text-primary hover:underline text-sm">
            Create your first project →
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <div key={project.id} className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 shadow-lg">
              {project.image_url && (
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <img src={getImageUrl(project.image_url)} alt={project.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              )}
              <div className="p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-foreground line-clamp-1">{project.title}</h3>
                  <div className="flex shrink-0 items-center gap-1">
                    {project.featured && (
                      <span className="rounded-full bg-yellow-400/20 px-2 py-0.5 text-xs font-medium text-yellow-400">
                        ★
                      </span>
                    )}
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      project.status === "published"
                        ? "bg-green-500/15 text-green-400"
                        : "bg-white/10 text-muted-foreground"
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>
                <p className="mb-3 text-xs text-muted-foreground line-clamp-2">
                  {project.short_description || project.description}
                </p>
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {project.tech_stack.slice(0, 3).map((t) => (
                    <span key={t} className="rounded bg-primary/15 px-2 py-0.5 text-xs text-primary">
                      {t}
                    </span>
                  ))}
                  {project.tech_stack.length > 3 && (
                    <span className="text-xs text-muted-foreground">+{project.tech_stack.length - 3}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditing(project); setMode("edit"); }}
                    className="flex-1 rounded-lg border border-border py-1.5 text-xs font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(project.id)} disabled={deleting === project.id}
                    className="flex-1 rounded-lg border border-red-500/20 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10 disabled:opacity-50">
                    {deleting === project.id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
