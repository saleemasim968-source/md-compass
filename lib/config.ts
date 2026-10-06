/**
 * Region configuration (docs/ARCHITECTURE.md §5).
 *
 * Emergency and service wording lives here, never inside condition files, so the
 * site can stay region-neutral (docs/PRD.md §7). Every wording field is medical /
 * safety content and must be supplied by the content team and approved by the
 * clinical reviewer.
 */

export type Region = {
  /** Stable id used in the MDC_REGION environment variable. */
  id: string;
  /** Human-readable region name. */
  name: string;
  /** Emergency phone number for this region, or null if none is configured. */
  emergencyNumber: string | null;
  /** Heading for the "when to get help" emergency box. */
  emergencyHeading: string;
  /** Body text for the "when to get help" emergency box. */
  emergencyWording: string;
};

const regions: Record<string, Region> = {
  default: {
    id: "default",
    // TODO(decision): name and behaviour of the default, region-neutral setting (docs/PRD.md §7).
    name: "Region-neutral default",
    // TODO(content): default emergency number, if any — source + clinical review required
    emergencyNumber: null,
    // TODO(content): emergency box heading — source + clinical review required
    emergencyHeading: "TODO(content): emergency box heading",
    // TODO(content): emergency box wording — source + clinical review required
    emergencyWording: "TODO(content): emergency box wording",
  },
};

// TODO(decision): which region(s) to support first (docs/PRD.md §7).
export const DEFAULT_REGION_ID = "default";

/**
 * Returns the active region. The region is picked at build time from the
 * MDC_REGION environment variable; an unknown id fails loudly rather than
 * silently showing the wrong emergency details.
 */
export function getRegion(regionId: string | undefined = process.env.MDC_REGION): Region {
  const id = regionId?.trim() || DEFAULT_REGION_ID;
  const region = regions[id];
  if (!region) {
    throw new Error(
      `Unknown region "${id}" in MDC_REGION. Known regions: ${Object.keys(regions).join(", ")}.`,
    );
  }
  return region;
}
