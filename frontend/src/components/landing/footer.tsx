export default function Footer() {
  return (
    <footer className="border-t border-white/10 pb-14 pt-16 md:pb-16 md:pt-20">
      <div className="landing-shell flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <img
              src="/nautrace-logo.png"
              alt=""
              className="h-9 w-9 rounded-md object-contain"
            />
            <span className="text-xl font-semibold tracking-wide text-white">
              Nautrace
            </span>
          </div>
          <p className="max-w-md text-[0.95rem] leading-relaxed text-muted">
            Oceanic forensic intelligence for maritime oil-spill investigation —
            hindcast, attribute, prove.
          </p>
        </div>

        <div className="flex flex-col gap-4 text-sm text-muted md:items-end">
          <a
            href="https://github.com/Sarthak702-droid/Nautrace"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            GitHub
          </a>
          <a href="/guide.html" className="transition hover:text-white">
            Architecture guide
          </a>
          <p className="pt-3 text-xs tracking-wide text-white/35">
            © 2026 Nautrace · SIH 2026 PS-26143
          </p>
        </div>
      </div>
    </footer>
  );
}
