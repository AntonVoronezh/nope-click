# nope-click 🧊

[![npm version](https://img.shields.io/npm/v/nope-click.svg?style=flat-square)](https://www.npmjs.com/package/nope-click)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/nope-click?style=flat-square)](https://bundlephobia.com/package/nope-click)
[![license](https://img.shields.io/npm/l/nope-click?style=flat-square)](https://github.com/your-org/nope-click/blob/main/LICENSE)
[![Boosty](https://img.shields.io/badge/Support-Boosty-orange?style=flat-square&logo=boosty)](https://boosty.to/antonvoronezh/donate)
> **Zero-config, lightweight drop-in “intent press” utility.**
> Automatically fire “click-like” handlers only when the user *actually meant it* (not on scroll releases, drags, text selection, or ghost clicks).

## Why? 🤔

You want tappable cards and list items to feel solid, but you don't want to:
- ❌ Trigger navigation after a scroll release (“oops click”).
- ❌ Open things while selecting text.
- ❌ Maintain a spaghetti mess of `isDragging` flags and timeouts.
- ❌ Fight ghost clicks / `pointercancel` edge cases across browsers.

**nope-click** is the solution. It wraps pointer interactions into a small “intent transaction” and only commits when the interaction stays intentional.

- **Universal:** Works with React, Vue, Svelte, Solid, Angular, and Vanilla JS.
- **Tiny:** Tree-shakeable, no runtime deps.
- **Performant:** Passive listeners, scoped listeners via `AbortController`, minimal work per event.

---

## Installation 📦

```bash
npm install nope-click
# or
yarn add nope-click
# or
pnpm add nope-click
```

## Usage 🚀

### React

Use the `useIntentPress` hook.

```jsx
import { useState } from 'react'
import { useIntentPress } from 'nope-click/react'

const MyCard = () => {
    const [count, setCount] = useState(0)
    const press = useIntentPress(() => setCount((c) => c + 1))

    return (
        <>
            <div
                onPointerDown={press.onPointerDown}
                onClickCapture={press.onClickCapture}
                style={{ padding: 12, border: '1px solid #ddd' }}
            >
                Intent presses: {count}
            </div>
            <small>Try scrolling on touch, dragging, or selecting text.</small>
        </>
    )
}
}
```

### Vue 3

Use the `v-intent-press` directive.

```html
<script setup>
    import { ref } from 'vue'
    import { vIntentPress } from 'nope-click/vue'

    const count = ref(0)
</script>

<template>
    <div v-intent-press="() => count++">
        Intent presses: {{ count }}
    </div>
</template>

```

### Svelte

Use the `intentPress` action.

```svelte
<script>
  import { intentPress } from 'nope-click/svelte'
  let count = 0
</script>

<!-- Pass options directly to the action -->
<div use:intentPress={{ onIntent: () => (count += 1), options: { clickGuard: true } }}>
  Intent presses: {count}
</div>

```

### SolidJS

Use the `intentPress` directive.

**Note for TypeScript users:** You need to extend the JSX namespace to avoid type errors with `use:`.

```tsx
import { createSignal } from 'solid-js'
import { intentPress } from 'nope-click/solid'

// ⚠️ TypeScript only: Add this declaration to fix "Property 'use:intentPress' does not exist"
declare module "solid-js" {
    namespace JSX {
        interface Directives {
            intentPress: boolean | { onIntent: (ev: any) => void; options?: object }
        }
    }
}

function App() {
    const [count, setCount] = createSignal(0)

    return (
        <div use:intentPress={{ onIntent: () => setCount((c) => c + 1) }}>
            Intent presses: {count()}
        </div>
    )
}
}
```

### Angular (17+)

Use the standalone `IntentPressDirective`.

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntentPressDirective } from 'nope-click/angular';

@Component({
    selector: 'app-card',
    standalone: true,
    imports: [CommonModule, IntentPressDirective],
    template: `
    <div
      [intentPress]="onIntent"
      [intentPressOptions]="{ clickGuard: true }"
      style="padding: 12px; border: 1px solid #ddd;"
    >
      Intent presses: {{ count }}
    </div>
  `
})
export class CardComponent {
    count = 0;
    onIntent = () => { this.count++; };
}

```

### Vanilla JS

```js
import { createIntentPress } from 'nope-click/core'

const el = document.getElementById('card')

// Enable intent presses
const press = createIntentPress(() => {
    console.log('intent!')
})

el.addEventListener('pointerdown', press.onPointerDown, { passive: true })
el.addEventListener('click', press.onClickCapture, { capture: true })

// Later, if you want to stop:
// press.destroy()
```

---

## Configuration ⚙️

You can customize the duration and easing function.

```js
/// React
useIntentPress(onIntent, { slop: 10, clickGuard: true })

// Vue
<div v-intent-press="{ handler: onIntent, options: { slop: 10 } }">

// Svelte
<div use:intentPress={{ onIntent, options: { slop: 10 } }}>
```

| Option | Type | Default | Description |
|---|---|---|---|
| `slop` | `number` | `auto` | Movement allowed (px) before canceling as a drag. |
| `maxPressMs` | `number` | `0` | Max press duration; `0` disables timeout. |
| `allowModified` | `boolean` | `false` | Allow ctrl/alt/meta/shift modified presses. |
| `allowTextSelection` | `boolean` | `false` | If `false`, cancels when selection becomes a range. |
| `allowNonPrimary` | `boolean` | `false` | Allow non-primary mouse buttons. |
| `preventDefault` | `boolean` | `false` | Call `preventDefault()` on pointerdown when safe. |
| `clickGuard` | `boolean` | `true` | Suppress the trailing “ghost click” (capture phase). |
| `enabled` | `boolean` | `true` | Enable/disable without rewiring. |

## How it works 🛠️
- `pointerdown` starts a “press transaction” (remember start point, selection snapshot, scroll parents).
- cancel when the user scrolls, drags past `slop`, selects text, or the browser cancels the pointer.
- `pointerup` commits: hit-test the release point (`elementFromPoint`), then call your handler.
- click capture guard (optional) suppresses the follow-up ghost click.

## Support the project ❤️

> "We eliminated the `isDragging` spaghetti mess, saved your users from accidental scroll-clicks, and absorbed the cross-browser `pointercancel` nightmare. You saved dozens of hours not reinventing a wheel. **Your donation** is a fair trade for a rock-solid UI and weekends free from debugging."

If this library saved you time, you can **[buy me a coffee ☕](https://boosty.to/antonvoronezh/donate)** (one-time) or **[become a sponsor 🚀](https://boosty.to/antonvoronezh)** (monthly).

[![Boosty](https://img.shields.io/badge/Support_on-Boosty-orange?style=for-the-badge&logo=boosty)](https://boosty.to/antonvoronezh/donate)

## License

MIT

## Keywords
`nope-click`, `intent-press`, `intent-click`, `press`, `tap`, `touch`, `mobile`, `pointer-events`, `pointerdown`, `pointerup`, `pointercancel`, `click`, `click-capture`, `click-guard`, `ghost-click`, `accidental-click`, `scroll-release`, `drag`, `text-selection`, `hit-test`, `elementFromPoint`, `AbortController`, `passive-listeners`, `event-handling`, `interaction`, `ui`, `ux`, `zero-config`, `lightweight`, `tree-shakeable`, `react`, `vue`, `svelte`, `solid`, `angular`, `vanilla-js`, `typescript`

