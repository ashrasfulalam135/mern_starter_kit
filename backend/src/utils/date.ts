export const fifteenMinutesFromNow = () => new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
export const oneWeekFromNow = () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days or 1 week
export const fourWeeksFromNow = () => new Date(Date.now() + 28 * 24 * 60 * 60 * 1000); // 28 days or 4 week
export const fiveMinutesAgo = () => new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago
export const oneHourFromNow = () => new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
export const oneDayInMS = () => 24 * 60 * 60 * 1000; // 1 day or 24 hours
