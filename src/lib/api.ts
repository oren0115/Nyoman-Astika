import { API_BASE } from "./env";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{ msg?: string; message?: string }>;
  meta?: { total: number; page: number; limit: number; totalPages: number };
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  featured: boolean;
  tech_stack: string[];
  github_url: string | null;
  live_url: string | null;
  image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  status: "draft" | "published";
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: number;
  category: string;
  name: string;
  level: number;
  icon_url: string | null;
  order_index: number;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  duration: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  achievements: string[];
  order_index: number;
}

export interface Testimonial {
  id: number;
  client_name: string;
  company: string | null;
  feedback: string;
  avatar_url: string | null;
  rating: number;
  order_index: number;
  is_active: boolean;
}

export interface SeoSettings {
  id: number;
  site_title: string;
  site_description: string;
  og_title: string;
  og_description: string;
  og_image_url: string | null;
  favicon_url: string | null;
  keywords: string | null;
}

export interface SiteSettings {
  hero_badge?: string;
  hero_title?: string;
  hero_subtitle?: string;
  hero_cta_primary?: string;
  hero_cta_secondary?: string;
  hero_image_url?: string;
  about_bio?: string;
  about_years?: string;
  about_projects?: string;
  about_stack?: string;
  contact_email?: string;
  contact_github?: string;
  contact_linkedin?: string;
  footer_copyright?: string;
  [key: string]: string | undefined;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface AdminUser {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  avatar_url: string | null;
  bio: string | null;
  cv_url: string | null;
}

export interface DashboardStats {
  projects: number;
  skills: number;
  messages: number;
  unread_messages: number;
  experiences: number;
  testimonials: number;
}

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint}`;
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(url, { ...options, headers });
  let data: ApiResponse<T>;
  try {
    const text = await response.text();
    data = text ? (JSON.parse(text) as ApiResponse<T>) : { success: false, message: "Empty response" };
  } catch {
    data = { success: false, message: `Request failed${response.ok ? "" : ` ${response.status}`}` };
  }
  if (!response.ok && data.success !== false) {
    data = { success: false, message: (data as { message?: string }).message || `HTTP ${response.status}` };
  }
  return data;
}

// Public API
export const publicApi = {
  getProjects: (params?: { featured?: boolean; page?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.featured) q.set("featured", "true");
    if (params?.page) q.set("page", String(params.page));
    if (params?.limit) q.set("limit", String(params.limit));
    return apiFetch<Project[]>(`/api/projects?${q}`);
  },
  getProject: (slug: string) => apiFetch<Project>(`/api/projects/${slug}`),
  getSkills: () => apiFetch<Skill[]>("/api/skills"),
  getExperiences: () => apiFetch<Experience[]>("/api/experience"),
  getTestimonials: () => apiFetch<Testimonial[]>("/api/testimonials"),
  getSeo: () => apiFetch<SeoSettings>("/api/seo"),
  getSettings: () => apiFetch<SiteSettings>("/api/settings"),
  getPublicProfile: () =>
    apiFetch<{ name: string; avatar_url: string | null }>("/api/public-profile"),
  submitContact: (body: { name: string; email: string; message: string }) =>
    apiFetch("/api/messages", { method: "POST", body: JSON.stringify(body) }),
};

// Admin API
export const adminApi = {
  login: (username: string, password: string) =>
    apiFetch<{ token: string; user: AdminUser }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  getMe: () => apiFetch<AdminUser>("/api/auth/me"),
  getStats: () => apiFetch<DashboardStats>("/api/settings/stats"),

  // Projects
  getProjects: (params?: { status?: string; page?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.status) q.set("status", params.status);
    if (params?.page) q.set("page", String(params.page));
    if (params?.limit) q.set("limit", String(params.limit));
    return apiFetch<Project[]>(`/api/projects?${q}`);
  },
  createProject: (data: FormData) =>
    apiFetch<Project>("/api/projects", { method: "POST", body: data }),
  updateProject: (id: number, data: FormData) =>
    apiFetch<Project>(`/api/projects/${id}`, { method: "PATCH", body: data }),
  deleteProject: (id: number) =>
    apiFetch(`/api/projects/${id}`, { method: "DELETE" }),

  // Skills
  getSkills: () => apiFetch<Skill[]>("/api/skills"),
  createSkill: (data: FormData) =>
    apiFetch<Skill>("/api/skills", { method: "POST", body: data }),
  updateSkill: (id: number, data: FormData) =>
    apiFetch<Skill>(`/api/skills/${id}`, { method: "PATCH", body: data }),
  deleteSkill: (id: number) =>
    apiFetch(`/api/skills/${id}`, { method: "DELETE" }),

  // Experience
  getExperiences: () => apiFetch<Experience[]>("/api/experience"),
  createExperience: (data: object) =>
    apiFetch<Experience>("/api/experience", { method: "POST", body: JSON.stringify(data) }),
  updateExperience: (id: number, data: object) =>
    apiFetch<Experience>(`/api/experience/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteExperience: (id: number) =>
    apiFetch(`/api/experience/${id}`, { method: "DELETE" }),

  // Testimonials
  getTestimonials: () => apiFetch<Testimonial[]>("/api/testimonials"),
  createTestimonial: (data: FormData) =>
    apiFetch<Testimonial>("/api/testimonials", { method: "POST", body: data }),
  updateTestimonial: (id: number, data: FormData) =>
    apiFetch<Testimonial>(`/api/testimonials/${id}`, { method: "PATCH", body: data }),
  deleteTestimonial: (id: number) =>
    apiFetch(`/api/testimonials/${id}`, { method: "DELETE" }),

  // Messages
  getMessages: (params?: { is_read?: boolean; page?: number }) => {
    const q = new URLSearchParams();
    if (params?.is_read !== undefined) q.set("is_read", String(params.is_read));
    if (params?.page) q.set("page", String(params.page));
    return apiFetch<ContactMessage[]>(`/api/messages?${q}`);
  },
  markRead: (id: number) =>
    apiFetch(`/api/messages/${id}/read`, { method: "PATCH" }),
  deleteMessage: (id: number) =>
    apiFetch(`/api/messages/${id}`, { method: "DELETE" }),

  // SEO
  getSeo: () => apiFetch<SeoSettings>("/api/seo"),
  updateSeo: (data: FormData) =>
    apiFetch<SeoSettings>("/api/seo", { method: "PATCH", body: data }),

  // Settings
  getSettings: () => apiFetch<SiteSettings>("/api/settings"),
  updateSettings: (data: SiteSettings) =>
    apiFetch<SiteSettings>("/api/settings", { method: "PATCH", body: JSON.stringify(data) }),
  updateSettingsFormData: (fd: FormData) =>
    apiFetch<SiteSettings>("/api/settings", { method: "PATCH", body: fd }),

  // Profile
  updateProfile: (data: FormData) =>
    apiFetch<AdminUser>("/api/auth/profile", { method: "PATCH", body: data }),
  uploadCv: (data: FormData) =>
    apiFetch("/api/auth/cv", { method: "POST", body: data }),
  changePassword: (current_password: string, new_password: string) =>
    apiFetch("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ current_password, new_password }),
    }),
};

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}

/** Public profile (name, avatar, cv) for navbar/header and Hero — no auth. */
export interface PublicProfile {
  name: string;
  avatar_url: string | null;
  cv_url: string | null;
}

export async function fetchPublicProfile(): Promise<PublicProfile | null> {
  try {
    const res = await fetch(`${API_BASE}/api/public-profile`).then((r) => r.json());
    return res?.success && res?.data ? (res.data as PublicProfile) : null;
  } catch {
    return null;
  }
}
