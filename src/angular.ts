import { Directive, ElementRef, Input, NgZone, computed, effect, signal } from '@angular/core';
import type { OnDestroy } from '@angular/core'
import type { IntentPressEvent, IntentPressOptions } from './core/types';
import { createIntentPress } from './core/index';

@Directive({
    selector: '[intentPress]',
    standalone: true
})
export class IntentPressDirective implements OnDestroy {
    private handlerSig = signal<((ev: IntentPressEvent) => void) | null>(null);
    private optionsSig = signal<IntentPressOptions>({});

    private ctl: ReturnType<typeof createIntentPress> | null = null;
    private removeDown: (() => void) | null = null;
    private removeClick: (() => void) | null = null;

    @Input('intentPress')
    set intentPressHandler(fn: (ev: IntentPressEvent) => void) {
        this.handlerSig.set(fn);
    }

    @Input()
    set intentPressOptions(v: IntentPressOptions | undefined) {
        this.optionsSig.set(v ?? {});
    }

    constructor(private el: ElementRef<HTMLElement>, private zone: NgZone) {
        const ready = computed(() => !!this.handlerSig());

        effect(() => {
            if (!ready()) return;

            const handler = this.handlerSig()!;
            const options = this.optionsSig();

            this.ctl?.destroy();
            this.ctl = createIntentPress(handler, options);

            this.zone.runOutsideAngular(() => {
                const node = this.el.nativeElement;

                const down = (e: Event) => this.ctl?.onPointerDown(e);
                const click = (e: Event) => this.ctl?.onClickCapture(e);

                node.addEventListener('pointerdown', down, { passive: true });
                node.addEventListener('click', click, { capture: true });

                this.removeDown = () => node.removeEventListener('pointerdown', down);
                this.removeClick = () => node.removeEventListener('click', click, { capture: true } as any);
            });
        });
    }

    ngOnDestroy(): void {
        this.removeDown?.();
        this.removeClick?.();
        this.ctl?.destroy();
        this.ctl = null;
    }
}
