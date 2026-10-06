"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/conditions", label: "Conditions A to Z" },
  { href: "/about", label: "About and sources" },
];

/**
 * Main site navigation. The current page or section is shown in bold and marked
 * with aria-current, so it is not shown by colour alone.
 */
export function MainNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main">
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {LINKS.map(({ href, label }) => {
          // "page" for the exact page; "true" when inside that section (e.g. a condition page).
          const current =
            pathname === href ? "page" : pathname.startsWith(`${href}/`) ? "true" : undefined;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={current}
                className={`inline-flex min-h-11 items-center ${current ? "font-bold" : ""}`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
