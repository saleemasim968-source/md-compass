import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";
import { SkipLink } from "@/components/SkipLink";

describe("HomePage", () => {
  it("has exactly one level-1 heading with the project name", () => {
    render(<HomePage />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent("MD Compass");
  });
});

describe("SkipLink", () => {
  it("points at the main content", () => {
    render(<SkipLink />);
    expect(screen.getByRole("link", { name: "Skip to main content" })).toHaveAttribute(
      "href",
      "#main-content",
    );
  });
});
