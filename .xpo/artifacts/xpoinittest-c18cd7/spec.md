# Spec: Center "Press Enter to Play" prompt

## What
Horizontally center the `.press-enter` prompt on the attract screen and keep it on a single line.

## Why
The prompt is absolutely positioned with only `top: 45%`. Being out of grid flow, the parent's `justify-items: center` doesn't affect it, so it pins to the board's left edge and wraps.

## How
In `src/App.css`, extend the `.press-enter` rule:
- `left: 50%;`
- `transform: translateX(-50%);`
- `white-space: nowrap;`
- `text-align: center;`

Leave `top: 45%` and all typographic/animation properties unchanged.

## Acceptance Criteria
- [ ] Prompt horizontally centered over the board on the idle/attract screen
- [ ] Renders on one line
- [ ] Vertical position unchanged
