export class DateUtils {
  static toEndOfDay(target: Date) {
    const toEndOfDay = new Date(target);
    toEndOfDay.setUTCHours(23, 59, 59, 999);

    return toEndOfDay;
  }

  static formatDate(target: Date | string) {
    return new Date(target).toISOString().split("T")[0];
  }
}
