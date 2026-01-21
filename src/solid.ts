import type { Accessor } from 'solid-js';
import { createEffect, onCleanup } from 'solid-js';
import type { IntentPressEvent, IntentPressOptions } from './core/types';
import { createIntentPress } from './core/index';

export const createIntentPressPrimitive = (
    onIntent: Accessor<(ev: IntentPressEvent) => void>,
    options: Accessor<IntentPressOptions | undefined> = () => undefined
) => {
    let ctl = createIntentPress((ev) => onIntent()(ev), options() ?? {});
    onCleanup(() => ctl.destroy());

    createEffect(() => {
        ctl.destroy();
        ctl = createIntentPress((ev) => onIntent()(ev), options() ?? {});
    });

    return {
        onPointerDown: (e: Event) => ctl.onPointerDown(e),
        onClickCapture: (e: Event) => ctl.onClickCapture(e)
    };
};

export const intentPress = (
    el: HTMLElement,
    value: { onIntent: (ev: IntentPressEvent) => void; options?: IntentPressOptions }
) => {
    let ctl = createIntentPress(value.onIntent, value.options ?? {});
    const down = (e: Event) => ctl.onPointerDown(e);
    const click = (e: Event) => ctl.onClickCapture(e);

    el.addEventListener('pointerdown', down, { passive: true });
    el.addEventListener('click', click, { capture: true });

    return {
        update(next: typeof value) {
            ctl.destroy();
            ctl = createIntentPress(next.onIntent, next.options ?? {});
        },
        destroy() {
            el.removeEventListener('pointerdown', down);
            el.removeEventListener('click', click, { capture: true } as any);
            ctl.destroy();
        }
    };
};
