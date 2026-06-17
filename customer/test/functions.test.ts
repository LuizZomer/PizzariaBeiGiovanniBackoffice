import { describe, it, expect, vi } from "vitest";

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

import { toast } from "react-toastify";
import {
  intlNumberFormatter,
  listConfig,
  thenHandler,
  dateFormatter,
} from "../src/utils/functions";

describe("intlNumberFormatter", () => {
  it("formats a number as EUR with German locale", () => {
    const result = intlNumberFormatter(1000);
    expect(result).toContain("1.000,00");
    expect(result).toContain("€");
  });

  it("formats zero correctly", () => {
    expect(intlNumberFormatter(0)).toContain("0,00");
  });
});

describe("listConfig", () => {
  it("returns German label for pizza type", () => {
    expect(listConfig({ field: "type", value: "pizza" })).toBe("Pizza");
  });

  it("returns German label for drink type", () => {
    expect(listConfig({ field: "type", value: "drink" })).toBe("Getränk");
  });

  it("returns German label for noodle type", () => {
    expect(listConfig({ field: "type", value: "noodle" })).toBe("Nudeln");
  });

  it("returns German label for small size", () => {
    expect(listConfig({ field: "size", value: "small" })).toBe("Klein");
  });

  it("returns German label for large size", () => {
    expect(listConfig({ field: "size", value: "large" })).toBe("Groß");
  });

  it("returns undefined for unknown value", () => {
    expect(listConfig({ field: "type", value: "burger" })).toBeUndefined();
  });
});

describe("thenHandler", () => {
  it("calls toast.success with the response message", () => {
    thenHandler({ data: { message: "Erfolgreich erstellt!" } });
    expect(toast.success).toHaveBeenCalledWith("Erfolgreich erstellt!");
  });
});

describe("dateFormatter", () => {
  it("returns undefined when date is null", () => {
    expect(dateFormatter(null)).toBeUndefined();
  });

  it("returns undefined when date is undefined", () => {
    expect(dateFormatter(undefined)).toBeUndefined();
  });
});
