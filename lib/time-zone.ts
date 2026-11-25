import { tz } from '@date-fns/tz';

// The app runs on Baku time: lesson times, "today", and every date a person
// sees, whatever time zone the server or the browser is in.
export const TIME_ZONE = 'Asia/Baku';

// Pass as the last argument to a date-fns function so it counts days, hours
// and weekdays on the Baku clock. Without it date-fns uses the clock of the
// machine it runs on, which is UTC on Vercel.
export const inBaku = { in: tz(TIME_ZONE) };
