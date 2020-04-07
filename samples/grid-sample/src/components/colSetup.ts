import { IGridConfig } from '@simple-html/grid';

let setup: IGridConfig = {
    cellHeight: 20,
    panelHeight: 25,
    footerHeight: 20,
    selectionMode: 'multiple',

    groups: [
        {
            width: 120,
            rows: [
                {
                    header: 'index',
                    attribute: 'index',
                    type: 'number',
                    sortable: {},
                    filterable: {}
                },
                {
                    header: 'date',
                    attribute: 'date',
                    type: 'date',
                    sortable: {},
                    filterable: {},
                    allowGrouping: true
                },
                {
                    header: '',
                    attribute: '',
                    type: 'empty',
                    filterable: {},
                    sortable: {},
                    allowGrouping: true
                },
                {
                    header: 'Number',
                    attribute: 'number',
                    type: 'number',
                    filterable: {},
                    sortable: {}
                }
            ]
        },
        {
            width: 120,
            rows: [
                {
                    header: 'mod',
                    attribute: 'mod',
                    type: 'number',
                    sortable: {},
                    filterable: {},
                    allowGrouping: true
                }
            ]
        }
    ]
};

let word = 0;
for (let i = 1; i < 17; i++) {
    let x: any = [];
    for (let y = 0; y < 4; y++) {
        word++;
        x.push({
            header: 'word' + word,
            attribute: 'word' + word,
            filterable: {},
            sortable: {},
            allowGrouping: true
        });
    }

    setup.groups.push({ width: 120, rows: x });
}

export const COL_SETUP = setup;
