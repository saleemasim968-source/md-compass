import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";
import { SafetyNotice } from "@/components/SafetyNotice";
import { SkipLink } from "@/components/SkipLink";

describe("HomePage", () => {
  it("has exactly one level-1 heading with the project name", () => {
    render(<HomePage />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent("MD Compass");
  });
});

describe("SafetyNotice", () => {
  it("renders as a labelled landmark", () => {
    render(<SafetyNotice />);
    expect(screen.getByRole("complementary", { name: /safety notice/i })).toBeInTheDocument();
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
