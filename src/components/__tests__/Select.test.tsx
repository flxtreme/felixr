import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Select } from "@/src/components/Select";

describe("Select", () => {
  afterEach(cleanup);
  it("shows the selected label and opens a listbox with its selected option", () => {
    render(
      <Select aria-label="Status" value="published">
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </Select>
    );

    const trigger = screen.getByRole("combobox", { name: "Status" });
    expect(trigger.textContent).toContain("Published");
    fireEvent.click(trigger);

    expect(document.body.contains(screen.getByRole("listbox", { name: "Status" }))).toBe(true);
    expect(screen.getByRole("option", { name: "Published" }).getAttribute("aria-selected")).toBe(
      "true"
    );
  });

  it("forwards the selected value and closes the popup", () => {
    const onChange = vi.fn();
    render(
      <Select aria-label="Status" value="draft" onChange={onChange}>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </Select>
    );

    fireEvent.click(screen.getByRole("combobox", { name: "Status" }));
    fireEvent.click(screen.getByRole("option", { name: "Published" }));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ target: expect.objectContaining({ value: "published" }) })
    );
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("keeps disabled options unselectable and serializes named values with a hidden field", () => {
    const onChange = vi.fn();
    render(
      <Select aria-label="Status" name="status" value="draft" onChange={onChange}>
        <option value="draft">Draft</option>
        <option value="published" disabled>
          Published
        </option>
      </Select>
    );

    expect(screen.getByDisplayValue("draft").getAttribute("name")).toBe("status");
    fireEvent.click(screen.getByRole("combobox", { name: "Status" }));
    fireEvent.click(screen.getByRole("option", { name: "Published" }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("closes on Escape and restores focus to the trigger", () => {
    render(
      <Select aria-label="Status">
        <option value="draft">Draft</option>
      </Select>
    );
    const trigger = screen.getByRole("combobox", { name: "Status" });

    fireEvent.click(trigger);
    fireEvent.keyDown(screen.getByRole("option", { name: "Draft" }), { key: "Escape" });

    expect(screen.queryByRole("listbox")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});
