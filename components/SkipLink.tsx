/**
 * First focusable element on every page. Hidden until it receives keyboard focus,
 * then lets keyboard and screen reader users jump past the header to the content.
 */
export function SkipLink({ targetId = "main-content" }: { targetId?: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-paper focus:px-4 focus:py-3 focus:font-semibold"
    >
      Skip to main content
    </a>
  );
}
