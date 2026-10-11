import { render, screen } from "@testing-library/react";
import TogglePurple from "../../src/components/TogglePurple";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

function TogglePurpleMock() {
  const [isPurple, setIsPurple] = useState<boolean>(false);
  return <TogglePurple isPurple={isPurple} setIsPurple={setIsPurple} />;
}

describe("TogglePurple render test", () => {
  beforeEach(() => {
    render(<TogglePurpleMock />);
  });

  describe("render test", () => {
    it("should render the  checkbox and the checkbox should not be checked", () => {
      // expect(element).matcher

      const checkbox = screen.getByRole("checkbox");

      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
    });
    it("should render the label with the text purple", () => {
      const label = screen.getByText(/purple/i);
      // screen.debug();
      expect(label).toBeInTheDocument();
    });
  });

  describe("uer interaction", async () => {
    it("should toggle the checkbox when clicked", async () => {
      const checkbox = screen.getByRole("checkbox");

      const user = userEvent.setup();
      await user.click(checkbox);

      expect(checkbox).toBeChecked();
    });
  });
});
