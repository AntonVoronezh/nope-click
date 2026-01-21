import type { IntentPressEvent, IntentPressOptions } from './core/types';
import { createIntentPress } from './core/index';

export type IntentPressParams =
    | ((ev: IntentPressEvent) => void)
    | { onIntent: (ev: IntentPressEvent) => void; options?: IntentPressOptions };

export const intentPress = (node: HTMLElement, params: IntentPressParams) => {
    const normalize = (p: IntentPressParams) =>
        typeof p === 'function' ? { onIntent: p, options: {} } : { onIntent: p.onIntent, options: p.options ?? {} };

    let { onIntent, options } = normalize(params);
    let ctl = createIntentPress(onIntent, options);

    const down = (e: Event) => ctl.onPointerDown(e);
    const click = (e: Event) => ctl.onClickCapture(e);

    node.addEventListener('pointerdown', down, { passive: true });
    node.addEventListener('click', click, { capture: true });

    return {
        update(next: IntentPressParams) {
            params = next;
            ctl.destroy();
            ({ onIntent, options } = normalize(params));
            ctl = createIntentPress(onIntent, options);
        },
        destroy() {
            node.removeEventListener('pointerdown', down);
            node.removeEventListener('click', click, { capture: true } as any);
            ctl.destroy();
        }
    };
};
