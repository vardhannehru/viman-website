"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navItems, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { LogoMark, Wordmark } from "./logo";

export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 24);
    // Hide on the way down, reveal instantly on the way up — never in the way,
    // never more than one gesture from reach.
    if (open) return;
    setHidden(latest > previous && latest > 220);
  });

  // A new route always closes the overlay.
  useEffect(() => setOpen(false), [pathname]);

  // Lock the page behind the overlay.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -110, opacity: 0 }}
        animate={{ y: hidden ? -110 : 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE, delay: hidden ? 0 : 0.1 }}
        className="fixed inset-x-0 top-0 z-[100] pt-3 md:pt-5"
      >
        <nav
          aria-label="Primary"
          className={cn(
            "mx-auto flex items-center justify-between gap-6 rounded-full px-3 py-2.5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:py-3",
            scrolled
              ? "w-[calc(100%-1.5rem)] max-w-4xl glass-strong shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)]"
              : "w-[calc(100%-2rem)] max-w-6xl border border-transparent bg-transparent",
          )}
        >
          <Link
            href="/"
            className="group flex shrink-0 items-center rounded-full py-1 pl-2 pr-3"
            aria-label={`${site.name} home`}
          >
            <motion.span
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="inline-flex"
            >
              <Wordmark className="text-[1.15rem]" />
            </motion.span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group relative block rounded-full px-4 py-2 text-[0.875rem] text-mist transition-colors duration-500 hover:text-cloud"
                >
                  {item.label}
                  <span className="pointer-events-none absolute bottom-[0.35rem] left-4 right-4 h-px origin-left scale-x-0 bg-gradient-to-r from-cyan to-sky transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Magnetic strength={0.22}>
              <Button asChild size="sm" variant="primary" magnetic={false} className="hidden sm:inline-flex">
                <Link href="/login">Log in</Link>
              </Button>
            </Magnetic>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-cloud/12 text-cloud transition-colors duration-500 hover:border-cyan/40 hover:bg-cyan/[0.06] lg:hidden"
            >
              <Menu className="h-[1.1rem] w-[1.1rem]" />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile / tablet overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4, ease: EASE, delay: 0.15 } }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 z-[150] bg-void/92 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between px-6 pt-6">
                <LogoMark className="h-6 w-6" />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-cloud/12 text-cloud"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <ul className="flex flex-1 flex-col justify-center gap-2 px-6">
                {[...navItems, { label: "Log in", href: "/login" }].map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.08 + i * 0.06 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline justify-between border-b border-cloud/8 py-5 text-[2rem] font-medium tracking-[-0.035em] text-cloud"
                    >
                      {item.label}
                      <span className="mono-label text-mist-deep">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.42 }}
                className="px-6 pb-10"
              >
                <Button asChild size="lg" variant="glow" className="w-full" magnetic={false}>
                  <Link href="/login" onClick={() => setOpen(false)}>
                    Log in
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}
