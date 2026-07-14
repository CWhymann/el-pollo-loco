/**
 * Central hub for managing all game intervals.
 * Supports categorized intervals so persistent objects
 * (character, start-screen chicken) survive a level reset.
 */
// #region class IntervalHub
export class IntervalHub {
    // #region Properties
    /** @type {{id: number, category: string}[]} */
    static allIntervals = [];
    // #endregion

    // #region Interval Management
    /**
     * Starts a new interval, registers it under a category and returns its ID.
     * @param {Function} func - The function to execute repeatedly.
     * @param {number} timer - The interval duration in milliseconds.
     * @param {string} category - 'level' (default) or 'persistent'.
     * @returns {number} The ID of the created interval.
     */
    static startInterval(func, timer, category = "level") {
        const id = setInterval(func, timer);
        IntervalHub.allIntervals.push({ id, category });
        return id;
    }

    /**
     * Stops a single interval by ID and removes it from the registry.
     * @param {number} id - The interval ID to stop.
     */
    static stopInterval(id) {
        clearInterval(id);
        IntervalHub.allIntervals = IntervalHub.allIntervals.filter(
            (entry) => entry.id !== id,
        );
    }

    /**
     * Stops all intervals matching the given category.
     * Defaults to 'level' so persistent objects are never affected.
     * @param {string} category - 'level' (default), 'persistent', or 'all'.
     */
    static stopAllIntervals(category = "level") {
        IntervalHub.allIntervals = IntervalHub.allIntervals.filter((entry) => {
            const shouldStop =
                category === "all" || entry.category === category;
            if (shouldStop) clearInterval(entry.id);
            return !shouldStop;
        });
    }
    // #endregion
}
// #endregion class IntervalHub
