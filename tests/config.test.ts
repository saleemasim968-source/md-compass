// @vitest-environment node
import { DEFAULT_REGION_ID, getRegion } from "@/lib/config";

describe("getRegion", () => {
  it("falls back to the default region when MDC_REGION is not set", () => {
    expect(getRegion(undefined).id).toBe(DEFAULT_REGION_ID);
    expect(getRegion("  ").id).toBe(DEFAULT_REGION_ID);
  });

  it("fails loudly on an unknown region instead of showing the wrong emergency details", () => {
    expect(() => getRegion("nowhere")).toThrow(/Unknown region "nowhere"/);
  });
});
