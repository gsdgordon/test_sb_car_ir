// This file exists for MakeCode/PXT tooling compatibility.
// Native implementations live in ir.cpp, and the public API is defined in main.ts.
//% color=#c7a031 icon="\uf1eb" block="StemBit IR"
declare namespace StemBit_IR {
    //% blockId=ir_init block="IR init on pin $pin"
    //% shim=StemBit_IR::init
    function init(pin: DigitalPin): void

    //% blockId=ir_received_left_event block="on IR button $button pressed"
    //% shim=StemBit_IR::onPressEvent
    function onPressEvent(button: number, body: () => void): void
}
