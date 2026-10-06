const formatter = new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" });

/** Renders a YYYY-MM-DD date as readable text, keeping the machine-readable value. */
export function FormattedDate({ value }: { value: string }) {
  return <time dateTime={value}>{formatter.format(new Date(`${value}T00:00:00Z`))}</time>;
}
