import { GridInterface } from '.';
import { ICell } from './interfaces';

let dragCell: ICell = null;
let dragColumnBlock: HTMLElement = null;
let delayDragEventTimer: any = null;

/* function offset(el: HTMLElement, width: number) {
    const rect = el.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    return {
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft,
        center: rect.left + width / 2 + scrollLeft
    };
} */

export const columnDragDropPanel = (event: string, _connector: GridInterface) => {
    const drop = (e: any) => {
        if (dragCell.allowGrouping) {
            _connector.groupingCallback(
                e,
                dragCell
            );
        }
        e.target.removeEventListener('mouseup', drop);
        (e.target as any).classList.remove('free-grid-candrop');
    };

    return (_e: MouseEvent) => {
        console.log('enter');
        if (event === 'enter' && dragCell) {
            _e.target.addEventListener('mouseup', drop);
        }

        if (event === 'leave' && dragCell) {
            _e.target.removeEventListener('mouseup', drop);
            (_e.target as any).classList.remove('free-grid-candrop');
        }
    };
};

export const columnDragDrop = (event: string, _col: ICell, _connector: GridInterface) => {
    // here we will clean up eevnt listeners
    const mouseUp = function() {
        document.removeEventListener('mouseup', mouseUp);
        document.removeEventListener('mousemove', mouseMove);
        clearTimeout(delayDragEventTimer);
        dragCell = null;
        if (dragColumnBlock) {
            document.body.removeChild(dragColumnBlock);
        }
        dragColumnBlock = null;
    };

    // this will just move our label
    const mouseMove = function(e: MouseEvent) {
        dragColumnBlock.style.top = e.clientY + document.documentElement.scrollTop + 'px'; // hide it
        dragColumnBlock.style.left = e.clientX + document.documentElement.scrollLeft + 'px';
    };

    // main event binded to column
    return (_e: any) => {
        // mouse down event
        if (event === 'dragstart' && _e.button === 0 && _e.target.tagName === 'SPAN') {
            //save cell ref
            dragCell = _e.target.cell;

            // register mouseup so we can clean up
            document.addEventListener('mouseup', mouseUp);

            delayDragEventTimer = setTimeout(() => {
                dragColumnBlock = document.createElement('div');
                dragColumnBlock.style.top = -1200 + 'px'; // hide it
                dragColumnBlock.style.left = -1200 + 'px';
                dragColumnBlock.classList.add('free-grid');
                dragColumnBlock.classList.add('free-grid-drag');
                dragColumnBlock.textContent = _col.header;
                document.body.appendChild(dragColumnBlock);
                document.addEventListener('mousemove', mouseMove);
            }, 500);
        }

        if (event === 'enter' && dragCell !== null) {
            //console.log('enter', dragColumn.header, _e.target.cell && _e.target.cell.header)
        }
    };
};
