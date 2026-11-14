import { describe, it, expect } from "vitest";
import { questions, appearances, pOrder, rank, scoreResult } from "./data";

describe("quiz", () => {
  it("has 13 questions with 5 options, one per personality", () => {
    expect(questions.length).toBe(13);
    questions.forEach((q) => {
      expect(q.o.length).toBe(5);
      expect(new Set(q.o.map((o) => o.p)).size).toBe(5);
    });
  });
  it("spreads personalities as evenly as 13 questions allow (five ×7, five ×6)", () => {
    const counts = pOrder.map((k) => appearances[k]).sort();
    expect(counts).toEqual([6, 6, 6, 6, 6, 7, 7, 7, 7, 7]);
  });
  it("picks the personality with the most points", () => {
    expect(scoreResult(["careful", "allah", "allah"])).toBe("allah");
  });
  it("breaks ties in favour of the personality chosen in the later question", () => {
    expect(scoreResult(["saver", "fazaa", "fazaa", "saver"])).toBe("saver");
    expect(scoreResult(["saver", "saver", "fazaa", "fazaa"])).toBe("fazaa");
  });
  it("reports points as a share of the questions the personality appears in", () => {
    const careful = rank(["careful", "careful", "careful"]).find((r) => r.key === "careful")!;
    expect(careful.pct).toBe(50);
  });
});
