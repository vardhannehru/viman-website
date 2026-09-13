import type { Metadata } from "next";
import { LegalShell } from "@/components/layout/legal-shell";
import { legalPages, legalPlaceholders as P } from "@/lib/legal";

const page = legalPages.find((p) => p.slug === "cookie-policy")!;

export const metadata: Metadata = {
  title: page.title,
  description: page.summary,
};

export default function CookiePolicyPage() {
  return (
    <LegalShell title={page.title} summary={page.summary} current={page.slug}>
      <p>
        This page describes what this website stores in your browser. It is deliberately short,
        because the site stores very little.
      </p>

      <h2>Cookies</h2>
      <p>
        This site sets no cookies of its own. There is no analytics cookie, no advertising cookie
        and no tracking pixel, which is why you are not being asked to dismiss a consent banner.
      </p>

      <h2>What is stored instead</h2>
      <p>
        Two values are written to your browser&rsquo;s own storage. Neither is ever sent to our
        servers.
      </p>
      <ul>
        <li>
          <strong>
            <code>viman:booted</code>
          </strong>{" "}
          (session storage) — records that you have already seen the opening sequence, so it does
          not replay every time you navigate within the site. Cleared when the tab closes.
        </li>
        <li>
          <strong>
            <code>viman:progress</code>
          </strong>{" "}
          (local storage) — the roadmap steps you have ticked as completed, so your progress is
          still there next time you visit. Written only when you tick a step; it stays until you
          untick the step or clear this site&rsquo;s storage.
        </li>
      </ul>
      <p>
        Your browser will also cache the site&rsquo;s fonts, images and 3D assets in the ordinary
        way, so that returning pages load quickly. That cache is managed by your browser, not by us.
      </p>

      <h2>Motion preferences</h2>
      <p>
        The site reads your operating system&rsquo;s reduced-motion setting to decide how much of
        the flight sequence to animate. It reads that setting live; it does not store it and it
        cannot see anything else about your system configuration.
      </p>

      <h2>Third parties</h2>
      <p>
        Fonts and site assets are served as part of the site itself. When you follow a link away
        from VIMAN — to a DGCA portal, a flying school or an airline careers page — that site may
        set its own cookies under its own policy, which we do not control.
      </p>

      <h2>Controlling storage</h2>
      <p>
        Every major browser lets you view and clear cookies and site storage, usually under privacy
        settings. Clearing this site&rsquo;s storage replays the opening sequence once and
        removes any steps you have ticked as completed.
      </p>

      <h2>If this changes</h2>
      <p>
        If VIMAN later introduces analytics or any cookie that is not strictly necessary, this page
        will be updated first and consent will be requested before anything is set.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this page: <span className="placeholder">{P.privacyEmail}</span>
      </p>
    </LegalShell>
  );
}
