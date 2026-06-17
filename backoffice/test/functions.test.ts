import { describe, it, expect, vi } from "vitest";

// functions.ts imports `toast` from react-toastify at module load.
// We mock it so importing the module never touches the real UI library.
vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

import {
  intlNumberFormatter,
  valueMask,
  cpfMask,
  unmaskValue,
  listConfig,
} from "../src/utils/functions";

describe("backoffice utils/functions", () => {
  it("intlNumberFormatter formats a number as EUR (de-DE)", () => {
    const formatted = intlNumberFormatter(1234.5);
    expect(formatted).toContain("1.234,50");
    expect(formatted).toContain("€");
  });

  it("valueMask turns raw digits into a 2-decimal de-DE string", () => {
    expect(valueMask("12345")).toBe("123,45");
    expect(valueMask("R$ 9,99")).toBe("9,99");
  });

  it("cpfMask applies the 000.000.000-00 format progressively", () => {
    expect(cpfMask("12345678901")).toBe("123.456.789-01");
    expect(cpfMask("123.456")).toBe("123.456");
  });

  it("unmaskValue parses a masked currency string back to a number", () => {
    expect(unmaskValue("1.234,56")).toBe(1234.56);
    expect(unmaskValue("€ 9,99")).toBe(9.99);
    expect(unmaskValue("abc")).toBe(0);
  });

  it("listConfig maps menu type/size codes to German labels", () => {
    expect(listConfig({ field: "type", value: "pizza" })).toBe("Pizza");
    expect(listConfig({ field: "type", value: "drink" })).toBe("Getränk");
    expect(listConfig({ field: "size", value: "large" })).toBe("Groß");

    expect(listConfig({ field: "type", value: "unknown" })).toBeUndefined();
  });
});
