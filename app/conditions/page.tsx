import type { Metadata } from "next";
import { ConditionSearch } from "@/components/ConditionSearch";
import { getVisibleConditions } from "@/lib/content/loader";
import { buildIndex } from "@/lib/search";

export const metadata: Metadata = {
  title: "Conditions A to Z",
  // TODO(content): condition index description for search engines — source + clinical review required
  description: "Conditions A to Z",
};

/**
 * Condition index (PRD F2) with on-device search (PRD F3). The index is built
 * here at build time; only titles, synonyms and links are sent to the browser.
 */
export default async function ConditionsIndexPage() {
  const index = buildIndex(await getVisibleConditions());

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Conditions A to Z</h1>
      <ConditionSearch index={index} />
    </div>
  );
}
