import { describe, it, expect } from "vitest";
import { questions, scoreResult } from "./data";
describe("quiz", () => {
  it("has 9 questions with 4 options", () => {
    expect(questions.length).toBe(9);
    questions.forEach((q) => expect(q.o.length).toBe(4));
  });
  it("picks most frequent personality", () => {
    expect(scoreResult(["guardian", "adventurer", "adventurer"])).toBe("adventurer");
  });
});
