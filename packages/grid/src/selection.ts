import { GridInterface } from './gridInterface';

export class Selection {
    // private mode: 'none' | 'single' | 'multiple';
    private selectedRows: number;
    private selection: Set<number>;
    private lastRowSelected: number;
    private lastKeyKodeUsed: string;
    private gridInterface: GridInterface;

    constructor(gridInterface: GridInterface) {
        this.gridInterface = gridInterface;
        this.selectedRows = 0;
        this.selection = new Set([]);
    }

    public isSelected(row: number): boolean {
        let result = false;
        if (this.selectedRows > 0) {
            result = this.selection.has(this.getRowKey(row));
        }

        return result;
    }

    public deSelectAll(): void {
        this.selection.clear();
        this.selectedRows = this.selection.size;
    }

    public highlightRow(e: MouseEvent, currentRow: number): void {
        let isSel: boolean;
        let currentselectedRows = this.getSelectedRows();
        let currentKeyKode = '';

        this.gridInterface.__selectInternal(currentRow);

        if (currentRow !== this.lastRowSelected || currentselectedRows[0] !== currentRow) {
            if (currentRow <= this.gridInterface.displayedDataset.length - 1) {
                // do I need to check this?

                if (this.gridInterface.config.selectionMode === 'multiple') {
                    // if multiselect duh!

                    if (e.shiftKey) {
                        currentKeyKode = 'shift';
                        currentselectedRows = this.getSelectedRows();
                        if (currentselectedRows.length > 0 && this.lastKeyKodeUsed === 'none') {
                            this.lastRowSelected = currentselectedRows[0];
                            this.lastKeyKodeUsed = 'shift';
                        }
                    }

                    if (e.ctrlKey) {
                        currentKeyKode = 'ctrl';
                    }

                    if (!e.ctrlKey && !e.shiftKey) {
                        currentKeyKode = 'none';
                    }

                    switch (true) {
                        case currentKeyKode === 'none':
                            this.select(currentRow, false);
                            break;
                        case this.lastKeyKodeUsed === 'shift' && currentKeyKode === 'ctrl':
                            isSel = this.isSelected(currentRow);
                            if (isSel === true) {
                                this.deSelect(currentRow);
                            } else {
                                this.select(currentRow, true);
                            }
                            this.lastRowSelected = currentRow;
                            break;

                        case this.lastKeyKodeUsed === 'ctrl' && currentKeyKode === 'shift':
                            const oldSel = this.getSelectedRows();
                            this.selectRange(this.lastRowSelected, currentRow);
                            const newSel = this.getSelectedRows();
                            this.setSelectedRows(oldSel.concat(newSel));

                            break;

                        case this.lastKeyKodeUsed === 'ctrl' && currentKeyKode === 'ctrl':
                            isSel = this.isSelected(currentRow);
                            if (isSel === true) {
                                this.deSelect(currentRow);
                            } else {
                                this.select(currentRow, true);
                            }
                            this.lastRowSelected = currentRow;
                            break;

                        case this.lastKeyKodeUsed === 'none' && currentKeyKode === 'ctrl':
                            isSel = this.isSelected(currentRow);
                            if (isSel === true) {
                                this.deSelect(currentRow);
                            } else {
                                this.select(currentRow, true);
                            }
                            this.lastRowSelected = currentRow;
                            break;

                        case this.lastKeyKodeUsed === 'shift' && currentKeyKode === 'shift':
                            if (this.lastRowSelected > currentRow) {
                                this.selectRange(currentRow, this.lastRowSelected);
                            } else {
                                this.selectRange(this.lastRowSelected, currentRow);
                            }

                            break;

                        case this.lastKeyKodeUsed === 'none' && currentKeyKode === 'shift':
                            if (this.lastRowSelected !== -1) {
                                if (this.lastRowSelected > currentRow) {
                                    this.selectRange(currentRow, this.lastRowSelected);
                                } else {
                                    this.selectRange(this.lastRowSelected, currentRow);
                                }
                            } else {
                                this.lastRowSelected = currentRow;
                                this.select(currentRow, false);
                            }
                            break;
                        default:
                            console.error('error, this should not happen, debug selection');
                    }
                } else {
                    this.select(currentRow, false);
                }
                this.lastKeyKodeUsed = currentKeyKode;

                // update selection on rows
                this.gridInterface.publishEvent('selectionChange');
            }
        } else {
            // same row clicked again
            if (e.ctrlKey) {
                currentKeyKode = 'ctrl';
            }

            // if ctrl button we want to remove selection
            if (currentKeyKode === 'ctrl') {
                this.lastKeyKodeUsed = currentKeyKode;
                isSel = this.isSelected(currentRow);
                if (isSel === true) {
                    this.deSelect(currentRow);
                }
                this.lastRowSelected = currentRow;
            } else {
                // else we just want to make it current..
                this.select(currentRow, false);
            }
            // update selection on rows
            this.gridInterface.publishEvent('selectionChange');
        }
    }

    /**
     * todo, optional key
     */
    private getRowKey(row: number): number {
        return (
            (this.gridInterface.displayedDataset[row] as any) &&
            (this.gridInterface.displayedDataset[row] as any).__KEY
        );
    }

    private getRowKeys(): any[] {
        const keys: any[] = [];
        (this.gridInterface.displayedDataset as any).forEach((data: any) => {
            keys.push(data.__KEY);
        });

        return keys;
    }

    private deSelect(row: number): void {
        this.selection.delete(this.getRowKey(row));
        this.selectedRows = this.selection.size;
    }

    private select(row: number, add?: boolean): void {
        switch (this.gridInterface.config.selectionMode) {
            case 'none':
            case null:
            case undefined:
                break;
            case 'single':
                this.selection.clear();
                this.selection.add(this.getRowKey(row));
                this.selectedRows = this.selection.size;
                break;
            case 'multiple':
                if (!add) {
                    this.selection.clear();
                    this.selection.add(this.getRowKey(row));
                    this.selectedRows = this.selection.size;
                } else {
                    this.selection.add(this.getRowKey(row));
                    this.selectedRows = this.selection.size;
                }
                break;
            default:
            // nothing-> warn ?
        }
    }

    private selectRange(start: number, end: number): void {
        if (this.gridInterface.config.selectionMode === 'multiple') {
            this.selection.clear();
            for (let i = start; i < end + 1; i++) {
                this.selection.add(this.getRowKey(i));
            }
            this.selectedRows = this.selection.size;
        }
    }

    private getSelectedRows(): number[] {
        const array: number[] = [];
        const keys = this.getRowKeys();
        if (this.selectedRows > 0) {
            keys.forEach((key, index) => {
                if (this.selection.has(key) === true) {
                    array.push(index);
                }
            });
        }

        return array;
    }

    private setSelectedRows(newRows: number[]): void {
        if (this.selectedRows > 0) {
            this.selection.clear();
        }
        for (let i = 0; i < newRows.length; i++) {
            this.selection.add(this.getRowKey(newRows[i]));
        }
        this.selectedRows = this.selection.size;
    }
}
