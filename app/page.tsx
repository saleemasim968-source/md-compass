import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">MD Compass</h1>

      <p className="text-lg text-muted">
        {/* TODO(content): home page introduction — source + clinical review required */}
        TODO(content): home page introduction
      </p>

      <ul className="space-y-2 text-lg">
        <li>
          <Link href="/conditions" className="font-semibold">
            Find a condition in the A to Z list
          </Link>
        </li>
        <li>
          <Link href="/about">Read how our information is sourced and reviewed</Link>
        </li>
      </ul>
    </div>
  );
}
