// Pure rendering logic for the download page (web/download/index.html).
// Extracted (R8) so the changelog/manifest rendering branches are directly
// unit-testable (tests/web-download-render.test.ts) — nothing here touches
// the DOM or the network; index.html's own script does that, using these
// functions. No markdown library, no bundler: this site stays
// dependency-free, loaded as a plain ES module (<script type="module">).

/** Escapes the five HTML-significant characters. */
export function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Escapes `s`, then renders `**bold**` spans. The only inline markdown this
 *  site's changelog format uses. */
export function inlineMd(s) {
  return escapeHtml(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
}

/**
 * Minimal renderer for this project's disciplined changelog format: a
 * "## v..." heading (skipped here — the version line elsewhere already shows
 * it), "- " bullets, and "**bold**" lead-ins. Returns an HTML STRING; never
 * touches the DOM (the caller assigns it to innerHTML) — that split is what
 * makes this testable without a browser.
 */
export function changelogToHtml(md) {
  const lines = md.split('\n');
  const html = [];
  let inList = false;
  lines.forEach((line) => {
    const bullet = line.match(/^-\s+(.*)$/);
    if (bullet) {
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }
      html.push('<li>' + inlineMd(bullet[1]) + '</li>');
      return;
    }
    if (inList) {
      html.push('</ul>');
      inList = false;
    }
    if (/^##\s+/.test(line) || !line.trim()) return;
    html.push('<p>' + inlineMd(line.trim()) + '</p>');
  });
  if (inList) html.push('</ul>');
  return html.join('\n') || 'No notes yet.';
}

/** Platform keys in the manifest, in the order their download buttons appear. */
export const PLATFORM_LABELS = {
  macos: 'macOS',
  windows: 'Windows',
  linuxDeb: 'Linux (.deb)',
  linuxRpm: 'Linux (.rpm)',
};

/**
 * Builds everything the page needs to render from the parsed `version.json`
 * manifest and the public downloads `base` URL — no DOM access, so this is
 * directly unit-testable. Platform buttons are emitted in
 * PLATFORM_LABELS's key order and a platform absent from the manifest is
 * skipped, never rendered as a broken link.
 */
export function buildDownloadView(manifest, base) {
  const buttons = Object.keys(PLATFORM_LABELS)
    .map((key) => {
      const platform = manifest.platforms && manifest.platforms[key];
      if (!platform) return null;
      return {
        key,
        label: 'Download for ' + PLATFORM_LABELS[key],
        href: base + platform.key.replace(/^latest\//, ''),
      };
    })
    .filter(Boolean);

  return {
    versionText: 'Version ' + manifest.version + ', released ' + manifest.date,
    buttons,
    testReportHref: base + 'test-report.md',
    shaHref: base + 'SHA256SUMS.txt',
  };
}
