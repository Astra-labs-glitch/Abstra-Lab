"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string; badge?: number };
export type NavGroup = { title: string; items: Item[] };

export function DashNav({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname();

  return (
    <nav className="adm-nav" aria-label="Member area">
      {groups.map((group) => (
        <div key={group.title} className="adm-nav__group">
          <p className="adm-nav__title">{group.title}</p>
          {group.items.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "is-active" : undefined}
                aria-current={active ? "page" : undefined}
              >
                <span>{item.label}</span>
                {item.badge ? <span className="adm-badge">{item.badge}</span> : null}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
