import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, format: string = 'MM/DD/YYYY'): string {
    const d = new Date(date);

    if (isNaN(d.getTime())) {
        return 'Invalid Date';
    }

    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();

    switch (format) {
        case 'DD/MM/YYYY':
            return `${day}/${month}/${year}`;
        case 'YYYY-MM-DD':
            return `${year}-${month}-${day}`;
        case 'MM/DD/YYYY':
        default:
            return `${month}/${day}/${year}`;
    }
}

export function getMonthsBetween(startMonth: string, startYear: number, endDate: Date = new Date()): string[] {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const startMonthIndex = months.indexOf(startMonth);
    if (startMonthIndex === -1) return [];

    const result: string[] = [];
    // const currentDate = new Date();
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();

    let year = startYear;
    let monthIndex = startMonthIndex;

    while (year < endYear || (year === endYear && monthIndex <= endMonth)) {
        result.push(months[monthIndex]);
        monthIndex++;
        if (monthIndex >= 12) {
            monthIndex = 0;
            year++;
        }
    }

    return result;
}