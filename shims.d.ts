//% color=50 weight=19 icon="\uf1eb"
declare namespace StemBit_IR {
    /**
     * Register a handler for a remote button press.
     */
    //% blockId=ir_received_left_event
    //% block="on |%btn| button pressed"
    //% shim=StemBit_IR::onPressEvent
    function onPressEvent(btn: RemoteButton, body: () => void): void;

    /**
     * Connect an IR receiver module output to the given pin.
     */
    //% blockId=ir_init
    //% block="connect ir receiver to %pin"
    //% shim=StemBit_IR::init
    function init(pin: DigitalPin): void;
}
