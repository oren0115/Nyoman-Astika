import * as React from "react";
import { publicApi, getImageUrl, fetchPublicProfile } from "@/lib/api";
import type {
  Project, Skill, Experience, Testimonial, Certificate, SiteSettings,
} from "@/lib/api";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-white/5 ${className}`} />;
}

function HeroSection({ settings, cvUrl }: { settings: SiteSettings; cvUrl?: string | null }) {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden pb-16 pt-20 md:pb-24 md:pt-28"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(79,70,229,0.35), transparent)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full blur-[120px]"
        style={{ background: "rgba(79,70,229,0.1)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/4 h-[300px] w-[300px] rounded-full blur-[100px]"
        style={{ background: "rgba(6,182,212,0.1)" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 md:flex-row md:items-center md:justify-between md:gap-12 md:px-6">
        <div className="max-w-2xl text-center md:text-left">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
            {settings.hero_badge || "Web Developer"}
          </p>
          <h1 className="mb-6 text-4xl font-bold leading-[1.15] tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {settings.hero_title
              ? settings.hero_title.split("&").map((part, i, arr) =>
                  i < arr.length - 1 ? (
                    <React.Fragment key={i}>
                      {part}&amp;
                    </React.Fragment>
                  ) : (
                    <span key={i} className="portfolio-gradient-text">
                      {" "}{part}
                    </span>
                  )
                )
              : <>Building Scalable &amp; Modern{" "}<span className="portfolio-gradient-text">Web Applications</span></>
            }
          </h1>
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            {settings.hero_subtitle ||
              "I craft performant, accessible web experiences with modern stacks."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <a
              href="#projects"
              className="btn-gradient inline-flex items-center gap-2 rounded-lg px-6 py-3 text-base font-semibold shadow-lg"
            >
              {settings.hero_cta_primary || "View Projects"}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            {cvUrl ? (
              <a
                href={getImageUrl(cvUrl)}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/50 px-6 py-3 text-base font-semibold text-foreground transition-colors hover:bg-white/5"
              >
                {settings.hero_cta_secondary || "Download CV"}
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-lg border border-border/50 bg-card/30 px-6 py-3 text-base font-semibold text-muted-foreground">
                {settings.hero_cta_secondary || "Download CV"}
                <span className="text-xs font-normal">(upload in admin)</span>
              </span>
            )}
          </div>
        </div>

        <div className="mt-12 flex-shrink-0 md:mt-0 md:w-[380px] lg:w-[440px]" aria-hidden="true">
          <div className="relative mx-auto aspect-square max-w-[280px] md:max-w-none">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/30 to-cyan-400/30 blur-2xl" />
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-card/50 shadow-2xl backdrop-blur-sm">
              {settings.hero_image_url ? (
                <img
                  src={getImageUrl(settings.hero_image_url)}
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <div className="flex h-3/4 w-3/4 flex-wrap items-center justify-center gap-4 p-6">
                  <div className="h-14 w-14 rounded-xl bg-primary/20 shadow-inner" />
                  <div className="h-12 w-12 rounded-lg bg-cyan-400/20 shadow-inner" />
                  <div className="h-16 w-16 rounded-2xl bg-primary/15 shadow-inner" />
                  <div className="h-10 w-10 rounded-lg bg-cyan-400/25 shadow-inner" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillsSection({ skills }: { skills: Skill[] }) {
  const grouped = React.useMemo(() => {
    const map: Record<string, Skill[]> = {};
    skills.forEach((s) => {
      if (!map[s.category]) map[s.category] = [];
      map[s.category].push(s);
    });
    return Object.entries(map);
  }, [skills]);

  return (
    <section
      id="skills"
      className="relative border-t border-border py-20 md:py-28"
      aria-labelledby="skills-heading"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2
          id="skills-heading"
          className="section-reveal mb-4 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl"
          data-section-reveal
        >
          Skills &amp; Tech Stack
        </h2>
        <p className="section-reveal mx-auto mb-12 max-w-2xl text-center text-muted-foreground" data-section-reveal>
          Technologies I use to build modern, scalable applications.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {grouped.map(([cat, items], i) => (
            <div
              key={cat}
              className="section-reveal card-hover-lift rounded-2xl border border-border bg-card/50 p-6 shadow-lg"
              data-section-reveal
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <h3 className="mb-4 text-lg font-semibold text-foreground">{cat}</h3>
              <div className="space-y-3">
                {items.map((skill) => (
                  <div key={skill.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{skill.name}</span>
                      <span className="text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400 transition-all duration-700"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section
      id="projects"
      className="relative border-t border-border bg-card/30 py-20 md:py-28"
      aria-labelledby="projects-heading"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2
          id="projects-heading"
          className="section-reveal mb-4 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl"
          data-section-reveal
        >
          Featured Projects
        </h2>
        <p className="section-reveal mx-auto mb-12 max-w-2xl text-center text-muted-foreground" data-section-reveal>
          A selection of projects I've built—from full-stack apps to developer tools.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.id}
              className="section-reveal card-hover-lift group overflow-hidden rounded-2xl border border-border bg-card/50 shadow-lg"
              data-section-reveal
            >
              <div className="relative aspect-video overflow-hidden bg-muted">
                {project.image_url ? (
                  <img
                    src={getImageUrl(project.image_url)}
                    alt={project.title}
                    width={600}
                    height={360}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-cyan-400/20">
                    <svg className="h-12 w-12 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12-1a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                {project.featured && (
                  <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                    Featured
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="mb-2 text-lg font-semibold text-foreground">{project.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                  {project.short_description || project.description}
                </p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {(Array.isArray(project.tech_stack) ? project.tech_stack : []).map((tag) => (
                    <span
                      key={String(tag)}
                      className="rounded-md bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary ring-1 ring-primary/20"
                    >
                      {String(tag)}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary/20 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-primary/30"
                    >
                      Live Demo
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                    >
                      GitHub
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CertificatesSection({ certificates }: { certificates: Certificate[] }) {
  return (
    <section
      id="certificates"
      className="relative border-t border-border py-20 md:py-28"
      aria-labelledby="certificates-heading"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2
          id="certificates-heading"
          className="section-reveal mb-4 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl"
          data-section-reveal
        >
          Sertifikat Keahlian
        </h2>
        <p className="section-reveal mx-auto mb-14 max-w-2xl text-center text-muted-foreground" data-section-reveal>
          Sertifikat dan credential yang telah diperoleh.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <article
              key={cert.id}
              className="section-reveal group rounded-2xl border border-border bg-card/50 p-0 overflow-hidden shadow-lg transition-shadow hover:shadow-xl"
              data-section-reveal
            >
              <div className="aspect-video overflow-hidden bg-white/5">
                {cert.image_url ? (
                  <img
                    src={getImageUrl(cert.image_url)}
                    alt={cert.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="mb-1 font-semibold text-foreground">{cert.title}</h3>
                <p className="mb-2 text-sm text-muted-foreground">{cert.issuer}</p>
                {cert.issue_date && (
                  <p className="mb-3 text-xs text-muted-foreground">{cert.issue_date}</p>
                )}
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    Verifikasi credential
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  return (
    <section
      id="experience"
      className="relative border-t border-border py-20 md:py-28"
      aria-labelledby="experience-heading"
    >
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <h2
          id="experience-heading"
          className="section-reveal mb-4 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl"
          data-section-reveal
        >
          Experience
        </h2>
        <p className="section-reveal mx-auto mb-14 max-w-2xl text-center text-muted-foreground" data-section-reveal>
          Roles and impact over the years.
        </p>

        <div className="relative">
          <div className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-primary/50 via-primary/30 to-transparent md:left-1/2 md:-translate-x-px" aria-hidden="true" />
          <ul className="space-y-12" role="list">
            {experiences.map((exp) => (
              <li key={exp.id} className="section-reveal relative flex gap-8 md:gap-12" data-section-reveal>
                <div className="absolute left-4 flex h-3 w-3 -translate-x-1/2 items-center justify-center rounded-full border-2 border-primary bg-background md:left-1/2" aria-hidden="true" />
                <div className="ml-10 flex-1 md:ml-0 md:pr-12 md:text-right">
                  <span className="text-sm font-semibold text-primary">{exp.duration}</span>
                  <h3 className="mt-1 text-lg font-bold text-foreground">{exp.role}</h3>
                  <p className="text-muted-foreground">{exp.company}</p>
                </div>
                <div className="ml-10 flex-[1.2] md:ml-12 md:pl-12 md:text-left">
                  <ul className="space-y-2 text-muted-foreground" role="list">
                    {exp.achievements.map((a, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" aria-hidden="true" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) return null;

  return (
    <section
      id="testimonials"
      className="relative border-t border-border bg-card/30 py-20 md:py-28"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <h2
          id="testimonials-heading"
          className="section-reveal mb-4 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl"
          data-section-reveal
        >
          What People Say
        </h2>
        <p className="section-reveal mx-auto mb-12 max-w-2xl text-center text-muted-foreground" data-section-reveal>
          Feedback from clients and collaborators.
        </p>

        <div className="section-reveal" data-section-reveal>
          <Carousel opts={{ align: "start", loop: true }} className="mx-auto w-full max-w-2xl">
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((t) => (
                <CarouselItem key={t.id} className="pl-2 md:pl-4">
                  <div className="card-hover-lift rounded-2xl border border-border bg-card/80 p-6 shadow-lg">
                    <div className="mb-3 flex gap-1">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <blockquote className="text-lg leading-relaxed text-foreground md:text-xl">
                      &ldquo;{t.feedback}&rdquo;
                    </blockquote>
                    <footer className="mt-4 flex items-center gap-3">
                      {t.avatar_url && (
                        <img
                          src={getImageUrl(t.avatar_url)}
                          alt={t.client_name}
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/30"
                        />
                      )}
                      <cite className="not-italic">
                        <span className="font-semibold text-foreground">{t.client_name}</span>
                        {t.company && (
                          <span className="text-muted-foreground"> — {t.company}</span>
                        )}
                      </cite>
                    </footer>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-2 border-border bg-card/80 text-foreground hover:bg-card md:-left-12" />
            <CarouselNext className="-right-2 border-border bg-card/80 text-foreground hover:bg-card md:-right-12" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}

function ContactSection({ settings }: { settings: SiteSettings }) {
  const [form, setForm] = React.useState({ name: "", email: "", message: "" });
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await publicApi.submitContact(form);
      if (res.success) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
        const firstError = res.errors?.[0];
        const detail = firstError?.msg ?? (firstError as { message?: string })?.message;
        setErrorMsg(detail || res.message || "Failed to send message");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-card/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors";

  return (
    <section
      id="contact"
      className="relative border-t border-border py-20 md:py-28"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
        <h2
          id="contact-heading"
          className="section-reveal mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl"
          data-section-reveal
        >
          Let's Build Something Great Together
        </h2>
        <p className="section-reveal mb-10 text-muted-foreground" data-section-reveal>
          Have a project in mind? Get in touch—I'd love to hear about it.
        </p>

        {status === "success" ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-green-500/30 bg-green-500/10 px-8 py-12 text-center">
            <svg className="mx-auto mb-4 h-12 w-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mb-2 text-xl font-semibold text-foreground">Message sent!</h3>
            <p className="text-muted-foreground">I'll get back to you as soon as possible.</p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-6 rounded-lg px-6 py-2 text-sm font-medium text-primary hover:underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form
            className="section-reveal mx-auto max-w-xl space-y-6 text-left"
            data-section-reveal
            onSubmit={handleSubmit}
          >
            {status === "error" && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {errorMsg}
              </div>
            )}
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
                Name
              </label>
              <input
                type="text"
                id="name"
                required
                autoComplete="name"
                className={inputClass}
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                autoComplete="email"
                className={inputClass}
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-foreground">
                Message <span className="text-muted-foreground font-normal">(min. 10 characters)</span>
              </label>
              <textarea
                id="message"
                rows={4}
                required
                minLength={10}
                maxLength={2000}
                className={inputClass}
                placeholder="Tell me about your project..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-gradient inline-flex items-center gap-2 rounded-lg px-8 py-3 text-base font-semibold shadow-lg disabled:opacity-60"
              >
                {status === "loading" ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </div>
          </form>
        )}

        <div className="section-reveal mt-12 flex flex-wrap items-center justify-center gap-6" data-section-reveal>
          {settings.contact_email && (
            <a
              href={`mailto:${settings.contact_email}`}
              className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{settings.contact_email}</span>
            </a>
          )}
          {settings.contact_github && (
            <a href={settings.contact_github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span>GitHub</span>
            </a>
          )}
          {settings.contact_linkedin && (
            <a href={settings.contact_linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span>LinkedIn</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

export function PortfolioApp() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<{
    settings: SiteSettings;
    projects: Project[];
    skills: Skill[];
    experiences: Experience[];
    certificates: Certificate[];
    testimonials: Testimonial[];
    cvUrl: string | null;
  }>({
    settings: {},
    projects: [],
    skills: [],
    experiences: [],
    certificates: [],
    testimonials: [],
    cvUrl: null,
  });

  React.useEffect(() => {
    async function load() {
      try {
        const [settingsRes, projectsRes, skillsRes, expRes, certRes, testiRes, profileRes] = await Promise.allSettled([
          publicApi.getSettings(),
          publicApi.getProjects({ limit: 12 }),
          publicApi.getSkills(),
          publicApi.getExperiences(),
          publicApi.getCertificates(),
          publicApi.getTestimonials(),
          fetchPublicProfile(),
        ]);

        if (projectsRes.status === "rejected") {
          console.error("[Portfolio] Projects fetch failed:", projectsRes.reason);
        } else if (projectsRes.value?.success === false) {
          console.warn("[Portfolio] Projects API error:", (projectsRes.value as { message?: string }).message);
        }

        const rawProjects = projectsRes.status === "fulfilled" ? (projectsRes.value as { data?: unknown })?.data : undefined;
        const projectsList = Array.isArray(rawProjects) ? rawProjects : [];
        const publicProfile = profileRes.status === "fulfilled" ? profileRes.value : null;
        const cvUrl = publicProfile?.cv_url ?? null;

        setData({
          settings: settingsRes.status === "fulfilled" ? ((settingsRes.value as { data?: SiteSettings })?.data || {}) : {},
          projects: projectsList,
          skills: skillsRes.status === "fulfilled" ? ((skillsRes.value as { data?: Skill[] })?.data || []) : [],
          experiences: expRes.status === "fulfilled" ? ((expRes.value as { data?: Experience[] })?.data || []) : [],
          certificates: certRes.status === "fulfilled" ? ((certRes.value as { data?: Certificate[] })?.data || []) : [],
          testimonials: testiRes.status === "fulfilled" ? ((testiRes.value as { data?: Testimonial[] })?.data || []) : [],
          cvUrl,
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-sm text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <HeroSection settings={data.settings} cvUrl={data.cvUrl} />

      {/* About section is static in Astro for SSG — dynamic data injected below */}  

      {data.skills.length > 0 && <SkillsSection skills={data.skills} />}

      {data.projects.length > 0 && <ProjectsSection projects={data.projects} />}

      {data.experiences.length > 0 && <ExperienceSection experiences={data.experiences} />}

      {data.certificates.length > 0 && <CertificatesSection certificates={data.certificates} />}

      {data.testimonials.length > 0 && <TestimonialsSection testimonials={data.testimonials} />}

      <ContactSection settings={data.settings} />
    </>
  );
}
