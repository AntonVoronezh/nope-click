import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import type { IntentPressEvent, IntentPressOptions } from './core/types';
import { createIntentPress } from './core/index';

export type UseIntentPressResult = {
    onPointerDown: (e: any) => void;
    onClickCapture: (e: any) => void;
};

export const useIntentPress = (
    onIntent: (ev: IntentPressEvent) => void,
    options: IntentPressOptions = {}
): UseIntentPressResult => {
    const onIntentRef = useRef(onIntent);
    onIntentRef.current = onIntent;

    const controller = useMemo(() => {
        return createIntentPress((ev) => onIntentRef.current(ev), options);
        // Expect options to be memoized by user if needed.
    }, []);

    useLayoutEffect(() => () => controller.destroy(), [controller]);

    const onPointerDown = useCallback((e: any) => controller.onPointerDown(e), [controller]);
    const onClickCapture = useCallback((e: any) => controller.onClickCapture(e), [controller]);

    return { onPointerDown, onClickCapture };
};
