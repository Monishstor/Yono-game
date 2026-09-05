// @ts-ignore
import { describe, expect, it, spyOn } from "bun:test";
import { updateApp } from "./queries.ts";
import { db } from "./index.ts";

describe("updateApp", () => {
  it("should throw an error and propagate it when db.update fails", async () => {
    const consoleErrorSpy = spyOn(console, "error").mockImplementation(() => {});

    // Mock db.update to throw an error
    spyOn(db, "update").mockImplementation(() => {
      return {
        set: () => ({
          where: () => ({
            returning: () => Promise.reject(new Error("Database update failed"))
          })
        })
      } as any;
    });

    await expect(updateApp(1, { name: "New Name" })).rejects.toThrow("Database update failed");

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(consoleErrorSpy.mock.calls[0][0]).toContain("Error updating app 1:");

    consoleErrorSpy.mockRestore();
    // restore mock on db.update
    (db.update as any).mockRestore();
  });
});
