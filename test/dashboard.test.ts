import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("dashboard UI contract", () => {
  it("uses Polaris web components for every runtime UI element", () => {
    const source = readFileSync(new URL("../dashboard/dashboard.js", import.meta.url), "utf8");
    const tags = [...source.matchAll(/<\/?([a-z][a-z0-9-]*)\b/g)].map((match) => match[1]!);
    expect(tags.length).toBeGreaterThan(0);
    expect([...new Set(tags.filter((tag) => !tag.startsWith("s-")))]).toEqual([]);
  });

  it("loads only the Polaris runtime and the dashboard controller", () => {
    const html = readFileSync(new URL("../dashboard/index.html", import.meta.url), "utf8");
    expect(html).toContain("https://cdn.shopify.com/shopifycloud/polaris.js");
    expect(html).not.toMatch(/stylesheet|<style/i);
  });
});
