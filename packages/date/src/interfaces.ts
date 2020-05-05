export interface IDateConfig {
    /**default 1 */
    months?: number;

    /* default 1st of current month*/
    startDate?: number;

    // alternative to start date
    startMonth?: number; // 1-12
    startYear?: number;

    weekHeader: string[];
    weekStart: number;

    /* default true*/
    showWeek?: boolean;
}
