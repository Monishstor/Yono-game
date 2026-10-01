import { expect, test, mock } from "bun:test";
import { db } from "./index.ts";
import { getAllApps } from "./queries.ts";

test("getAllApps error handling", async () => {
  const originalSelect = db.select;

  // Mock db.select().from().orderBy() to throw an error
  db.select = mock(() => {
    return {
      from: () => ({
        orderBy: () => {
          throw new Error("Simulated DB Error");
        }
      })
    };
  }) as any;

  try {
    const promise = getAllApps();
    await expect(promise).rejects.toThrow();
  } finally {
    db.select = originalSelect;
  }
});
