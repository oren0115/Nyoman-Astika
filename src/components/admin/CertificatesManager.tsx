import * as React from "react";
import { adminApi, getImageUrl } from "@/lib/api";
import type { Certificate } from "@/lib/api";
import { useToast } from "./AdminShell";

export function CertificatesManager() {
  const ctx = useToast();
  const addToast = ctx?.addToast ?? (() => {});
  const [certificates, setCertificates] = React.useState<Certificate[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);
  const [editing, setEditing] = React.useState<Certificate | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState<number | null>(null);
  const [imageFile, setImageFile] = React.useState<File | null>(null);

  const [form, setForm] = React.useState({
    title: "",
    issuer: "",
    issue_date: "",
    credential_url: "",
    order_index: "0",
  });

  async function load() {
    setLoading(true);
    try {
      const res = await adminApi.getCertificates();
      if (res.success && res.data) setCertificates(res.data);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  function startEdit(cert: Certificate) {
    setEditing(cert);
    setForm({
      title: cert.title,
      issuer: cert.issuer,
      issue_date: cert.issue_date ?? "",
      credential_url: cert.credential_url ?? "",
      order_index: String(cert.order_index),
    });
    setImageFile(null);
    setShowForm(true);
  }

  function startCreate() {
    setEditing(null);
    setForm({ title: "", issuer: "", issue_date: "", credential_url: "", order_index: "0" });
    setImageFile(null);
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("issuer", form.issuer);
      fd.append("issue_date", form.issue_date);
      fd.append("credential_url", form.credential_url);
      fd.append("order_index", form.order_index);
      if (imageFile) fd.append("image", imageFile);

      let res;
      if (editing) {
        res = await adminApi.updateCertificate(editing.id, fd);
      } else {
        res = await adminApi.createCertificate(fd);
      }

      if (res.success) {
        addToast("success", editing ? "Sertifikat diupdate!" : "Sertifikat ditambah!");
        setShowForm(false);
        setEditing(null);
        setImageFile(null);
        load();
      } else {
        addToast("error", res.message || "Gagal menyimpan sertifikat");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    setDeleting(id);
    try {
      const res = await adminApi.deleteCertificate(id);
      if (res.success) {
        addToast("success", "Sertifikat dihapus");
        setCertificates((prev) => prev.filter((c) => c.id !== id));
      } else {
        addToast("error", "Gagal menghapus sertifikat");
      }
    } finally {
      setDeleting(null);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-white/5 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30";
  const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sertifikat Keahlian</h1>
          <p className="text-muted-foreground">{certificates.length} sertifikat</p>
        </div>
        <button
          onClick={startCreate}
          className="btn-gradient inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold"
        >
          + Tambah Sertifikat
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-border bg-card/50 p-6">
          <h2 className="mb-5 text-lg font-semibold text-foreground">
            {editing ? "Edit Sertifikat" : "Sertifikat Baru"}
          </h2>
          <form onSubmit={handleSave} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Judul Sertifikat *</label>
              <input
                required
                className={inputClass}
                placeholder="e.g. Professional React Developer"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Penerbit *</label>
              <input
                required
                className={inputClass}
                placeholder="e.g. Coursera, Udemy"
                value={form.issuer}
                onChange={(e) => setForm({ ...form, issuer: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Tanggal Terbit</label>
              <input
                type="text"
                className={inputClass}
                placeholder="e.g. 2023 atau Jan 2023"
                value={form.issue_date}
                onChange={(e) => setForm({ ...form, issue_date: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Link Verifikasi / Credential URL</label>
              <input
                type="url"
                className={inputClass}
                placeholder="https://..."
                value={form.credential_url}
                onChange={(e) => setForm({ ...form, credential_url: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Urutan</label>
              <input
                type="number"
                className={inputClass}
                value={form.order_index}
                onChange={(e) => setForm({ ...form, order_index: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Gambar Sertifikat</label>
              <div className="flex items-center gap-3">
                {(editing?.image_url || imageFile) && (
                  <div className="h-16 w-24 overflow-hidden rounded-lg border border-border bg-card/50">
                    {imageFile ? (
                      <img
                        src={URL.createObjectURL(imageFile)}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      editing?.image_url && (
                        <img
                          src={getImageUrl(editing.image_url)}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )
                    )}
                  </div>
                )}
                <label className="cursor-pointer rounded-lg border border-dashed border-border px-4 py-2 text-sm text-muted-foreground hover:border-primary/40">
                  {imageFile ? imageFile.name : "Pilih gambar"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
            </div>
            <div className="col-span-2 flex justify-end gap-3 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                  setImageFile(null);
                }}
                className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-white/5"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-gradient rounded-lg px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
              >
                {saving ? "Menyimpan..." : editing ? "Update" : "Buat"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="group rounded-2xl border border-border bg-card/50 p-5 shadow-lg transition-shadow hover:shadow-xl"
            >
              <div className="mb-4 aspect-video overflow-hidden rounded-xl bg-white/5">
                {cert.image_url ? (
                  <img
                    src={getImageUrl(cert.image_url)}
                    alt={cert.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <svg
                      className="h-12 w-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <h3 className="mb-1 font-semibold text-foreground">{cert.title}</h3>
              <p className="mb-2 text-sm text-muted-foreground">{cert.issuer}</p>
              {cert.issue_date && (
                <p className="mb-2 text-xs text-muted-foreground">{cert.issue_date}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    Verifikasi
                  </a>
                )}
                <button
                  onClick={() => startEdit(cert)}
                  className="rounded p-1 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                  title="Edit"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(cert.id)}
                  disabled={deleting === cert.id}
                  className="rounded p-1 text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                  title="Hapus"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
