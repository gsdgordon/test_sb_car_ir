# StemBit IR (micro:bit MakeCode extension)

This extension adds blocks to receive button presses from the StemBit IR remote.

✅ **micro:bit v1 and v2 compatible** (TypeScript-only implementation).

## Blocks

- **connect ir receiver to pin**
- **on (button) button pressed**

## Quick start

1. Add the extension in MakeCode.
2. Wire your IR receiver module signal pin to (for example) **P1** (plus 3V and GND).
3. Use blocks like:

```typescript
StemBit_IR.init(DigitalPin.P1)
StemBit_IR.onPressEvent(StemBit_IR.RemoteButton.Power, () => {
    basic.showIcon(IconNames.Happy)
})
```

## Supported targets

* for PXT/microbit

(The metadata above is needed for package search.)
