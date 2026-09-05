export function Footer() {
  return (
    <footer className="max-w-5xl mx-auto w-full px-4 py-10 text-center">
      <div className="text-caption text-muted uppercase tracking-widest">
        Bekenstein-Hawking Thermodynamics
      </div>
      <div className="text-caption text-muted mt-2 flex items-center justify-center gap-3">
        <a
          href="https://bhumikkhatwani.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent-cyan transition-colors"
        >
          bhumikkhatwani.com
        </a>
        <span>·</span>
        <a
          href="https://www.linkedin.com/in/bhumik-khatwani"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-accent-cyan transition-colors"
        >
          LinkedIn
        </a>
      </div>
    </footer>
  );
}
