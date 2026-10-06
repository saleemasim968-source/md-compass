/**
 * Safety notice shown on every condition page (PRD F4).
 *
 * The wording must come from the content team and be approved by the clinical
 * reviewer (docs/CONTENT_GUIDELINES.md §5). Emergency wording will come from the
 * region config (docs/ARCHITECTURE.md §5), never hard-coded here.
 */
export function SafetyNotice() {
  return (
    <aside
      aria-labelledby="safety-notice-heading"
      className="border-l-4 border-notice-line bg-notice px-4 py-3"
    >
      <h2 id="safety-notice-heading" className="font-semibold">
        {/* TODO(content): safety notice heading — source + clinical review required */}
        TODO(content): safety notice heading
      </h2>
      <p>
        {/* TODO(content): safety notice body — source + clinical review required */}
        TODO(content): safety notice body
      </p>
    </aside>
  );
}
