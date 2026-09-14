import Link from "next/link";
import { contact, navItems, site } from "@/lib/site";
import { legalPages } from "@/lib/legal";
import { Wordmark } from "./logo";
import { InstagramIcon } from "@/components/ui/instagram-icon";

/**
 * The footer is the one part of the page that is not part of the film. It is
 * plain on purpose: a mark, two columns of links that all resolve, and a line
 * of small print. No glow, no gradient rule, no decorative type.
 */
export function Footer() {
  return (
    <footer className="relative z-10 border-t border-cloud/10 bg-void">
      <div className="shell py-20 md:py-24">
        <div className="grid gap-14 md:grid-cols-[1fr_auto] md:gap-24">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center" aria-label={`${site.name} home`}>
              <Wordmark className="text-[1.5rem]" />
            </Link>
            <p className="mt-6 text-[0.9375rem] leading-relaxed text-mist">
              A plain account of the route to an Indian commercial pilot licence — the exams, the
              medicals, the hours and the cost, in the order you meet them.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-14 gap-y-10 sm:grid-cols-3 sm:gap-x-16">
            <nav aria-label="Sections">
              <h2 className="mono-label text-mist-deep">Guide</h2>
              <ul className="mt-6 space-y-3">
                {navItems.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Legal">
              <h2 className="mono-label text-mist-deep">Legal</h2>
              <ul className="mt-6 space-y-3">
                {legalPages.map((p) => (
                  <li key={p.slug}>
                    <FooterLink href={p.href}>{p.title}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="mono-label text-mist-deep">Contact</h2>
              <ul className="mt-6 space-y-3 text-[0.9375rem]">
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-cloud-dim transition-colors duration-300 hover:text-cloud"
                  >
                    {contact.email}
                  </a>
                </li>
                <li>
                  <a
                    href={contact.phoneHref}
                    className="text-cloud-dim transition-colors duration-300 hover:text-cloud"
                  >
                    {contact.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={contact.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-cloud-dim transition-colors duration-300 hover:text-cloud"
                  >
                    <InstagramIcon className="h-4 w-4" />
                    <span className="sr-only">Instagram </span>
                    {contact.instagramHandle}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-cloud/10 pt-8 text-[0.8125rem] text-mist-deep sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          <p className="max-w-md sm:text-right">
            Independent guidance. Not affiliated with the DGCA or any airline.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-[0.9375rem] text-cloud-dim transition-colors duration-300 hover:text-cloud"
    >
      {children}
    </Link>
  );
}
