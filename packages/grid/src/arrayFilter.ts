import { IFilterObj, IEntity } from './interfaces';

export class ArrayFilter {
    private lastFilter: IFilterObj[];
    public operators: any = {
        EQUAL: 1,
        LESS_THAN_OR_EQUAL_TO: 2,
        GREATER_THAN_OR_EQUAL_TO: 3,
        LESS_THAN: 4,
        GREATER_THAN: 5,
        CONTAINS: 6,
        NOT_EQUAL_TO: 7,
        DOES_NOT_CONTAIN: 8,
        BEGIN_WITH: 9,
        END_WITH: 10
    };

    constructor() {
        this.lastFilter = [];
    }

    public getLastFilter(): IFilterObj[] {
        return this.lastFilter;
    }

    public getFilterFromType(type: string) {
        switch (type) {
            case 'date':
            case 'number':
                return 'GREATER_THAN';
            case 'bool':
                return 'EQUAL_TO';
            default:
                return 'BEGIN_WITH';
        }
    }

    public runQueryOn(objArray: IEntity[], ObjFilter: IFilterObj[]) {
        this.lastFilter = ObjFilter;

        const resultArray = objArray.filter(data => {
            // lets have true as default, so all that should not be there we set false..
            let result = true;
            ObjFilter.forEach((x: IFilterObj) => {
                // vars
                let rowValue: any;
                let filterValue: any;
                let filterOperator = x.operator;
                let newFilterOperator: number;
                let type: string = x.type;

                if (x.value === 'null') {
                    type = 'null';
                }

                rowValue = data[x.attribute];

                // helper for boolean
                const typeBool: { true: boolean; false: boolean } = {
                    true: true,
                    false: false
                };

                // lets set some defaults/corrections if its all wrong
                switch (type) {
                    case 'null':
                        filterOperator = 1;

                        break;
                    case 'number':
                        filterValue = Number(x.value);
                        if (!filterValue) {
                            // needs to be 0
                            filterValue = 0;
                        }
                        filterOperator = filterOperator || 1;
                        if (filterOperator === 6) {
                            filterOperator = 1;
                        }
                        break;
                    case 'text':
                        if (rowValue === null || rowValue === undefined) {
                            rowValue = '';
                        } else {
                            rowValue = rowValue.toLowerCase();
                        }
                        filterValue = x.value.toLowerCase();
                        filterOperator = filterOperator || 9;
                        newFilterOperator = filterOperator;

                        // if filter operator is BEGIN WITH
                        if (x.value.charAt(0) === '*' && filterOperator === 9) {
                            newFilterOperator = 6;
                            filterValue = filterValue.substr(1, filterValue.length);
                        }

                        // if filter operator is EQUAL TO
                        // wildcard first = end with
                        if (x.value.charAt(0) === '*' && filterOperator === 1) {
                            newFilterOperator = 10;
                            filterValue = filterValue.substr(1, filterValue.length);
                        }

                        // wildcard end and first = contains
                        if (
                            x.value.charAt(x.value.length - 1) === '*' &&
                            filterOperator === 1 &&
                            newFilterOperator === 10
                        ) {
                            newFilterOperator = 6;
                            filterValue = filterValue.substr(0, filterValue.length - 1);
                        }

                        // begin with since wildcard is in the end
                        if (
                            x.value.charAt(x.value.length - 1) === '*' &&
                            filterOperator === 1 &&
                            newFilterOperator !== 10 &&
                            newFilterOperator !== 6
                        ) {
                            newFilterOperator = 9;
                            filterValue = filterValue.substr(0, filterValue.length - 1);
                        }

                        // set the filteroperator from new if changed
                        if (filterOperator !== newFilterOperator) {
                            filterOperator = newFilterOperator;
                        }
                        break;
                    case 'boolean':
                        filterValue = typeBool[x.value];
                        filterOperator = 1;
                        break;

                    default:
                        // todo: take the stuff under equal to and put in a function
                        // and also call i from here.. or just make it fail?
                        try {
                            rowValue = rowValue.toLowerCase();
                        } catch (err) {
                            rowValue = rowValue;
                        }
                        try {
                            filterValue = x.value.toLowerCase();
                        } catch (err) {
                            filterValue = x.value;
                        }
                        filterOperator = filterOperator || 1;
                        break;
                }

                // filter from what operator used
                switch (filterOperator) {
                    case 1: // equal
                        if (rowValue !== filterValue) {
                            result = false;
                        }
                        break;
                    case 2: // less or equal
                        if (!(rowValue <= filterValue)) {
                            result = false;
                        }
                        break;
                    case 3: // greater or equal
                        if (!(rowValue >= filterValue)) {
                            result = false;
                        }
                        break;
                    case 4: // greate
                        if (!(rowValue < filterValue)) {
                            result = false;
                        }
                        break;
                    case 5: // greater
                        if (!(rowValue > filterValue)) {
                            result = false;
                        }
                        break;
                    case 6: // contains
                        if (rowValue.indexOf(filterValue) === -1) {
                            result = false;
                        }
                        break;
                    case 7: // not equal to
                        if (rowValue === filterValue) {
                            result = false;
                        }
                        break;
                    case 8: // does not contain
                        if (rowValue.indexOf(filterValue) !== -1) {
                            result = false;
                        }
                        break;
                    case 9: // begin with
                        if (rowValue.substring(0, filterValue.length) !== filterValue) {
                            result = false;
                        }
                        break;
                    case 10: // end with
                        if (
                            rowValue.substring(
                                rowValue.length - filterValue.length,
                                rowValue.length
                            ) !== filterValue
                        ) {
                            result = false;
                        }
                        break;
                    default:
                        if (rowValue !== filterValue) {
                            result = false;
                        }
                }
                if (type === 'text') {
                    if (x.value.charAt(0) === '*' && x.value.length === 1) {
                        result = true;
                    }
                }
            });

            return result;
        });

        return resultArray;
    }
}
