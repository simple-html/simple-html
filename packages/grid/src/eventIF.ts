import { directive, EventPart } from 'lit-html';
const weakmap = new WeakMap();

// soemthing
export const eventIF = directive(
    (arg: any | null | undefined, event: string, call: Function) => (part: any) => {
        const EventHandler = class {
            private part: any;
            private event: string;
            private caller: Function;
            private handlerBinded: EventListenerOrEventListenerObject;
            private arg: boolean;

            constructor(part: any, arg: any, event: any, call: any) {
                if (!(part instanceof EventPart) || part.eventName.substr(0, 6) !== 'custom') {
                    throw new Error('myListDirective can only be used on "@custom" eventName');
                } else {
                    this.part = part;
                    this.arg = arg;
                    this.event = event;
                    this.caller = call;
                    this.handlerBinded = this.handler.bind(this);
                    if (arg) {
                        part.element.addEventListener(event, this.handlerBinded);
                    }
                }
            }

            public handler(e: any) {
                this.caller(e);
            }

            public update(arg: any, event: any, call: any) {
                this.part = part;
                this.caller = call;
                if (this.arg && arg) {
                    if (this.event !== event) {
                        this.part.element.removeEventLister(this.event, this.handlerBinded);
                        this.event = event;
                        this.part.element.addEventListener(event, this.handlerBinded);
                    }
                } else {
                    if (this.arg && !arg) {
                        this.part.element.removeEventLister(this.event, this.handlerBinded);
                        this.event = event;
                    }
                    if (!this.arg && arg) {
                        this.event = event;
                        this.part.element.addEventListener(event, this.handlerBinded);
                    }
                }
            }
        };

        const handler = weakmap.get(part);
        if (handler === undefined) {
            const eventHandler = new EventHandler(part, arg, event, call);
            weakmap.set(part, eventHandler);
        } else {
            handler.update(arg, event, call);
        }
    }
);
