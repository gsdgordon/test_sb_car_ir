// Simulator implementation for StemBit_IR shims.
// The micro:bit simulator can't receive real IR pulses, so these are no-ops.

namespace pxsim.StemBit_IR {
    // pin is a number (DigitalPin enum)
    export function init(pin: number): void {
        // no-op in simulator
    }

    // btn is a number (RemoteButton enum), handler is a RefAction in sim runtime
    export function onPressEvent(btn: number, handler: any): void {
        // no-op in simulator
        // You could extend this to trigger handlers via a custom sim UI.
    }
}
