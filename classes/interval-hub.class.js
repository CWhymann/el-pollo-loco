/**
 * Central hub for managing all game intervals.
 * Allows stopping all intervals at once for clean restarts.
 */
export class IntervalHub {
    /** @type {number[]} */
    static allIntervals = [];

    /**
     * Starts a new interval and registers it.
     * @param {Function} func - The function to execute repeatedly.
     * @param {number} timer - The interval duration in milliseconds.
     * @returns {number} The ID of the created interval.
     */
    static startInterval(func, timer) {
        const newInterval = setInterval(func, timer);
        IntervalHub.allIntervals.push(newInterval);
        return newInterval;
    }

    /**
     * Stops all registered intervals and clears the registry.
     */
    static stopAllIntervals() {
        IntervalHub.allIntervals.forEach(clearInterval);
        IntervalHub.allIntervals = [];
    }
}
