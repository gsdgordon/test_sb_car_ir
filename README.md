# StemBit IR

MakeCode extension for reading a StemBit-style NEC IR remote on the micro:bit.

This package uses a TypeScript implementation (no native C++ shims), so it works on both micro:bit v1 and v2 and won't crash the simulator.

## Usage

- Call `StemBit_IR.init(DigitalPin.P0)` once at startup
- Register handlers with `StemBit_IR.onPressEvent(...)`

## Notes

- The simulator cannot receive real IR pulses, so button presses only work on hardware.
- `test.ts` is only a self-test and is not compiled when this package is used as an extension.

## License

MIT

for PXT/microbit
