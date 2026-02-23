/**
 * StemBit IR (NEC) receiver.
 *
 * Note: The micro:bit simulator cannot receive real IR signals, so these APIs
 * are implemented as no-ops in the simulator (they won't crash the sim).
 */
//% color=50 weight=19 icon="\uf1eb" block="StemBit IR"
namespace StemBit_IR {
    /**
     * Connect an IR receiver module output to the given pin.
     * Call once at startup.
     */
    //% blockId=ir_init
    //% block="connect IR receiver to pin %pin"
    //% pin.defl=DigitalPin.P0
    //% shim=StemBit_IR::init
    export function init(pin: DigitalPin): void {
        // Simulator fallback: no hardware IR input available.
    }

    /**
     * Register a handler for a remote button press.
     */
    //% blockId=ir_received_left_event
    //% block="on IR button %btn pressed"
    //% draggableParameters
    //% shim=StemBit_IR::onPressEvent
    export function onPressEvent(btn: RemoteButton, handler: () => void): void {
        // Simulator fallback: no hardware IR input available.
    }
}
