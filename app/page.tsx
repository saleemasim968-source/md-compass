import { SafetyNotice } from "@/components/SafetyNotice";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">MD Compass</h1>

      <p className="text-lg text-muted">
        {/* TODO(content): home page introduction — source + clinical review required */}
        TODO(content): home page introduction
      </p>

      {/* Shown here in Phase 0 so the slot can be checked; moves to condition pages in Phase 1. */}
      <SafetyNotice />
    </div>
  );
}
