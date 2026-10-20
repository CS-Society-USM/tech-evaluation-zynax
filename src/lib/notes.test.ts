import { describe, expect, it } from "vitest";
import {
  CONTENT_LIMIT,
  emptyNote,
  selectNotes,
  validateNote,
  wordCount,
  type Note,
} from "./notes";

const good = { ...emptyNote, title: "A thought", content: "Keep this idea." };
describe("note validation", () => {
  it("requires a non-whitespace title and content", () => {
    expect(validateNote({ ...good, title: " \n " })).toBeTruthy();
    expect(validateNote({ ...good, content: "\t\n " })).toBeTruthy();
  });
  it("accepts boundary lengths and rejects oversized input", () => {
    expect(
      validateNote({
        ...good,
        title: "a".repeat(120),
        content: "b".repeat(CONTENT_LIMIT),
      }),
    ).toBeNull();
    expect(validateNote({ ...good, title: "a".repeat(121) })).toBeTruthy();
    expect(
      validateNote({ ...good, content: "b".repeat(CONTENT_LIMIT + 1) }),
    ).toBeTruthy();
  });
  it("accepts multilingual content and treats markup as plain text", () => {
    expect(
      validateNote({
        ...good,
        title: "今天的想法 🌱",
        content: "<script>alert(1)</script>",
      }),
    ).toBeNull();
  });
  it("rejects an unrecognized color", () => {
    expect(validateNote({ ...good, color: "red" as never })).toBeTruthy();
  });
});
const note = (id: string, changes: Partial<Note> = {}): Note => ({
  id,
  user_id: "test",
  title: id,
  content: "",
  color: "paper",
  pinned: false,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
  ...changes,
});
describe("finding thoughts", () => {
  const input = [
    note("A", { content: "Rainy DAY", color: "sage" }),
    note("Z", { title: "A pinned idea", pinned: true }),
    note("B", { updated_at: "2026-02-01T00:00:00Z" }),
  ];
  it("searches title and content without case sensitivity", () => {
    expect(
      selectNotes(input, " rainy ", "all", "recent").map((n) => n.id),
    ).toEqual(["A"]);
    expect(
      selectNotes(input, "IDEA", "all", "recent").map((n) => n.id),
    ).toEqual(["Z"]);
  });
  it("keeps pinned notes above recent notes", () => {
    expect(selectNotes(input, "", "all", "recent").map((n) => n.id)).toEqual([
      "Z",
      "B",
      "A",
    ]);
  });
  it("combines search with color and pinned filters", () => {
    expect(
      selectNotes(input, "day", "sage", "recent").map((n) => n.id),
    ).toEqual(["A"]);
    expect(selectNotes(input, "day", "pinned", "recent")).toEqual([]);
  });
  it("sorts titles and never mutates the source array", () => {
    expect(selectNotes(input, "", "all", "title").map((n) => n.id)).toEqual([
      "Z",
      "A",
      "B",
    ]);
    expect(input.map((n) => n.id)).toEqual(["A", "Z", "B"]);
  });
  it("orders oldest notes by creation date", () => {
    expect(
      selectNotes(
        [note("new", { created_at: "2026-03-01" }), note("old")],
        "",
        "all",
        "oldest",
      ).map((n) => n.id),
    ).toEqual(["old", "new"]);
  });
  it("counts whitespace-separated words", () => {
    expect(wordCount("   ")).toBe(0);
    expect(wordCount("  one\n two\tthree ")).toBe(3);
  });
});
