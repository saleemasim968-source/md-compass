import type { Metadata } from "next";
import type { MDXComponents } from "mdx/types";
import { notFound } from "next/navigation";
import { EmergencyHelp } from "@/components/EmergencyHelp";
import { ReviewInfo } from "@/components/ReviewInfo";
import { SafetyNotice } from "@/components/SafetyNotice";
import { SourcesList } from "@/components/SourcesList";
import { compileBody, getCondition, getVisibleConditions } from "@/lib/content/loader";

type Props = { params: Promise<{ slug: string }> };

// Only pages generated at build time exist; any other slug is a 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  // Loads and validates every content file: invalid content fails the build here.
  const conditions = await getVisibleConditions();
  return conditions.map((condition) => ({ slug: condition.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const condition = await getCondition((await params).slug);
  if (!condition) return {};
  return {
    title: condition.title,
    description: condition.summary,
    // Drafts must never be indexed by search engines.
    robots: condition.status === "draft" ? { index: false, follow: false } : undefined,
  };
}

const mdxComponents: MDXComponents = {
  EmergencyHelp,
};

export default async function ConditionPage({ params }: Props) {
  const condition = await getCondition((await params).slug);
  if (!condition) notFound();

  const Body = await compileBody(condition.body);

  return (
    <article className="condition space-y-8">
      {condition.status === "draft" && (
        <p className="border-2 border-dashed border-notice-line px-4 py-2 font-semibold">
          Draft: not clinically reviewed. This page is not shown on the live site.
        </p>
      )}

      <header className="space-y-4">
        <h1 className="text-3xl font-bold">{condition.title}</h1>
        <p className="text-lg">{condition.summary}</p>
      </header>

      <SafetyNotice />

      <div className="space-y-4">
        <Body components={mdxComponents} />
      </div>

      <SourcesList sources={condition.sources} />

      <ReviewInfo
        reviewedBy={condition.reviewedBy}
        reviewedOn={condition.reviewedOn}
        nextReviewDue={condition.nextReviewDue}
      />
    </article>
  );
}
