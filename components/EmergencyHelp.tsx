import { getRegion } from "@/lib/config";

/**
 * Emergency box placed by authors with <EmergencyHelp /> inside the
 * "When to get help" section. All wording comes from the region config
 * (lib/config.ts), never from the condition file.
 */
export function EmergencyHelp() {
  const region = getRegion();
  return (
    <div
      role="note"
      aria-labelledby="emergency-help-heading"
      className="my-4 border-l-4 border-notice-line bg-notice px-4 py-3"
    >
      <h3 id="emergency-help-heading" className="font-semibold">
        {region.emergencyHeading}
      </h3>
      <p>{region.emergencyWording}</p>
      {region.emergencyNumber && (
        <p>
          <a href={`tel:${region.emergencyNumber}`} className="font-semibold">
            {region.emergencyNumber}
          </a>
        </p>
      )}
    </div>
  );
}
