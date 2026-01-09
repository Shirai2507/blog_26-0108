import Link from "next/link";

const navItems = [
  { label: "トップ", href: "/" },
  { label: "about", href: "/about" },
  { label: "管理人", href: "/admin" },
];

export default function Header() {
  return (
    <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6 lg:px-6">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
            ProHack Journal
          </span>
          <span className="text-2xl font-semibold tracking-tight text-slate-900">
            Modern Tech Notes
          </span>
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
