# Stembit IR (micro:bit)

Infrared (IR) receiver extension for the **Stembit** remote, using the **NEC** IR protocol.

## Usage

1. Connect an IR receiver module output to the selected micro:bit pin (e.g. P0), with 3V and GND.
2. Use **connect ir receiver to pin** once at startup.
3. Use **on <button> button pressed** to handle remote presses.

## Notes

- This implementation is written in native C++ and is compatible with **micro:bit v1 and v2**.
- It decodes NEC frames and supports NEC repeat frames (button held down).

## Supported targets

* for PXT/microbit
