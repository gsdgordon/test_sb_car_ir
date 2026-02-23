// Simulator implementations for StemBit_IR.
// The micro:bit simulator cannot receive real IR pulses, so these are safe no-ops.

namespace pxsim {
    export namespace StemBit_IR {
        export function init(pin: number): void {
            // no-op in simulator
        }

        export function onPressEvent(button: number, body: RefAction): void {
            // no-op in simulator (or queue callback if you want)
        }
    }
}
