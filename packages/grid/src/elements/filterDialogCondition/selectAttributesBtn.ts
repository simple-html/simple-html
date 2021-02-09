import { CellConfig, FilterArgument } from '../../types';
import { generateMenu } from '../generateMenu';

/**
 * returns list if attributes from config
 */
export function selectAttributesBtn(operatorObject: FilterArgument, ctx: any, isValue?: boolean) {
    const el = document.createElement('button');
    el.classList.add('dialog-item-y');
    el.onclick = (e: any) => {
        generateMenu(
            e,
            ctx.filterAttributes.map((e: CellConfig) => {
                return {
                    title: e.attribute,
                    callback: () => {
                        if (isValue) {
                            operatorObject.value = e.attribute;
                        } else {
                            operatorObject.attribute = e.attribute;
                        }
                        operatorObject.attributeType = e.type;
                        ctx.render();
                    }
                };
            })
        );
    };

    let text = operatorObject.value || ' select ';
    if (isValue !== true) {
        text = operatorObject.attribute;
    }

    el.appendChild(document.createTextNode(text as any));

    return el;
}
