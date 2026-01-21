import type { IntentPressEvent, IntentPressOptions } from './core/types';
import { createIntentPress } from './core/index';

export class IntentPressController {
    private ctl: ReturnType<typeof createIntentPress>;
    private down: (e: Event) => void;
    private click: (e: Event) => void;

    constructor(
        private el: HTMLElement,
        onIntent: (ev: IntentPressEvent) => void,
        options: IntentPressOptions = {}
    ) {
        this.ctl = createIntentPress(onIntent, options);
        this.down = (e) => this.ctl.onPointerDown(e);
        this.click = (e) => this.ctl.onClickCapture(e);

        el.addEventListener('pointerdown', this.down, { passive: true });
        el.addEventListener('click', this.click, { capture: true });
    }

    destroy() {
        this.el.removeEventListener('pointerdown', this.down);
        this.el.removeEventListener('click', this.click, { capture: true } as any);
        this.ctl.destroy();
    }
}
