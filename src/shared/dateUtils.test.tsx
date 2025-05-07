import { describe, it, expect } from "vitest";
import { DateUtils } from "./dateUtils.ts";

describe("DateUtils", () => {
  describe("toEndOfDay", () => {
    it("should set the time to the end of the day (23:59:59.999)", () => {
      const inputDate = new Date("2023-05-15T10:30:15.000Z");
      const expected = new Date("2023-05-15T23:59:59.999Z");

      const result = DateUtils.toEndOfDay(inputDate);

      expect(result.getUTCHours()).toBe(23);
      expect(result.getUTCMinutes()).toBe(59);
      expect(result.getUTCSeconds()).toBe(59);
      expect(result.getUTCMilliseconds()).toBe(999);
      expect(result.toISOString()).toBe(expected.toISOString());
    });

    it("should not modify the original date object", () => {
      const inputDate = new Date("2023-05-15T10:30:15.000Z");
      const originalISO = inputDate.toISOString();

      DateUtils.toEndOfDay(inputDate);

      expect(inputDate.toISOString()).toBe(originalISO);
    });

    it("should handle dates at the start of the day", () => {
      const inputDate = new Date("2023-05-15T00:00:00.000Z");
      const expected = new Date("2023-05-15T23:59:59.999Z");

      const result = DateUtils.toEndOfDay(inputDate);

      expect(result.toISOString()).toBe(expected.toISOString());
    });

    it("should handle dates at the end of the day", () => {
      const inputDate = new Date("2023-05-15T23:59:59.999Z");
      const expected = new Date("2023-05-15T23:59:59.999Z");

      const result = DateUtils.toEndOfDay(inputDate);

      expect(result.toISOString()).toBe(expected.toISOString());
    });
  });

  describe("formatDate", () => {
    it("should format a Date object to YYYY-MM-DD format", () => {
      const inputDate = new Date("2023-05-15T10:30:15.000Z");
      const expected = "2023-05-15";

      const result = DateUtils.formatDate(inputDate);

      expect(result).toBe(expected);
    });

    it("should format a date string to YYYY-MM-DD format", () => {
      const inputDateString = "2023-05-15T10:30:15.000Z";
      const expected = "2023-05-15";

      const result = DateUtils.formatDate(inputDateString);

      // Assert
      expect(result).toBe(expected);
    });

    it("should handle different date formats correctly", () => {
      // Arrange
      const inputDate = new Date("May 15, 2023 10:30:15");
      const expected = "2023-05-15";

      // Act
      const result = DateUtils.formatDate(inputDate);

      // Assert
      expect(result).toBe(expected);
    });

    it("should handle dates at day boundaries", () => {
      // Arrange
      const startOfDay = new Date("2023-05-15T00:00:00.000Z");
      const endOfDay = new Date("2023-05-15T23:59:59.999Z");
      const expected = "2023-05-15";

      // Act & Assert
      expect(DateUtils.formatDate(startOfDay)).toBe(expected);
      expect(DateUtils.formatDate(endOfDay)).toBe(expected);
    });

    it("should handle ISO string date formats", () => {
      // Arrange
      const isoString = "2023-05-15";
      const expected = "2023-05-15";

      // Act
      const result = DateUtils.formatDate(isoString);

      // Assert
      expect(result).toBe(expected);
    });
  });
});
