// Simulator implementations for StemBit_IR.
// The micro:bit simulator cannot receive real IR pulses, so these are safe no-ops.

namespace pxsim {
    export namespace StemBit_IR {
        export function init(_pin: number): void {
            // no-op in simulator
        }

        export function onPressEvent(_btn: number, _handler: RefAction): void {
            // no-op in simulator
        }
    }
}
