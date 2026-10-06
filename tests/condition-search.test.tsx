import { fireEvent, render, screen, within } from "@testing-library/react";
import { ConditionSearch } from "@/components/ConditionSearch";
import type { IndexEntry } from "@/lib/search";

// Made-up names only: tests must never contain medical content.
const index: IndexEntry[] = [
  { slug: "alpha-example", title: "Alpha example", synonyms: ["First sample"], draft: false },
  { slug: "bravo-example", title: "Bravo example", synonyms: [], draft: true },
];

function search(text: string) {
  fireEvent.change(screen.getByRole("searchbox", { name: "Search conditions" }), {
    target: { value: text },
  });
}

describe("ConditionSearch", () => {
  it("shows the A–Z list with letter links when there is no query", () => {
    render(<ConditionSearch index={index} />);
    expect(screen.getByRole("heading", { level: 2, name: "A" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "B" })).toBeInTheDocument();
    const letters = screen.getByRole("navigation", { name: "Jump to letter" });
    expect(within(letters).getByRole("link", { name: "A" })).toHaveAttribute("href", "#letter-A");
    expect(screen.getByRole("link", { name: "Alpha example" })).toHaveAttribute(
      "href",
      "/conditions/alpha-example",
    );
    expect(screen.getByText("(draft)")).toBeInTheDocument();
  });

  it("has a labelled search box with a hint, inside a search landmark", () => {
    render(<ConditionSearch index={index} />);
    const box = screen.getByRole("searchbox", { name: "Search conditions" });
    expect(box).toHaveAccessibleDescription("Type a condition name or another name for it.");
    expect(screen.getByRole("search")).toContainElement(box);
  });

  it("filters as you type and announces the number of results", () => {
    render(<ConditionSearch index={index} />);
    search("sample");
    expect(screen.getByRole("status")).toHaveTextContent("1 condition found.");
    expect(screen.getByRole("heading", { name: "Search results" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Alpha example" })).toBeInTheDocument();
    expect(screen.getByText("Also called: First sample")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Bravo example" })).not.toBeInTheDocument();
  });

  it("announces when nothing matches", () => {
    render(<ConditionSearch index={index} />);
    search("zzz");
    expect(screen.getByRole("status")).toHaveTextContent("No conditions found.");
  });

  it("returns to the A–Z list when the search is cleared", () => {
    render(<ConditionSearch index={index} />);
    search("alpha");
    search("");
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
    expect(screen.getByRole("heading", { level: 2, name: "A" })).toBeInTheDocument();
  });

  it("says so when there are no conditions yet", () => {
    render(<ConditionSearch index={[]} />);
    expect(screen.getByText("No conditions have been published yet.")).toBeInTheDocument();
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
  });
});
