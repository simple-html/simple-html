export interface NumberFormaterType {
    fromString(value: string | null | undefined): number | null | undefined;
    fromNumber(value: number | null | undefined): string | null | undefined;
}

export class NumberFormater {
    /**
     * Takes value and return string
     * @param value
     */
    static fromString(value: string | null | undefined): number | null | undefined {
        let returnValue: any = value;

        if (returnValue === null || returnValue === 'undefined') {
            returnValue;
        }

        if (returnValue.includes(',') && !returnValue.includes('.')) {
            returnValue = returnValue.replace(',', '.');
        }

        if (isNaN(parseFloat(returnValue))) {
            return 0;
        }

        if (returnValue === '0') {
            return 0;
        }

        return parseFloat(returnValue);
    }

    /**
     *
     * @param value Takes string and returns date
     */
    static fromNumber(value: any): string | null | undefined {
        let returnValue = value;

        if (isNaN(parseFloat(returnValue))) {
            returnValue = '';
        }

        if (returnValue === null || returnValue === undefined) {
            return returnValue;
        }

        if (returnValue.toString().includes('.')) {
            returnValue = returnValue.toString().replace('.', ',');
        }

        return returnValue;
    }
}
