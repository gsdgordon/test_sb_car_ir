/**
 * StemBit IR (micro:bit MakeCode extension)
 *
 * This implementation is TypeScript-only to stay compatible with both micro:bit v1 and v2.
 * It decodes the common NEC IR protocol used by many small remotes.
 */

//% color=50 weight=19 icon="\uf1eb" block="StemBit IR"
namespace StemBit_IR {
    /**
     * Remote button codes (NEC command byte) for the StemBit remote.
     */
    export enum RemoteButton {
        //% block="power"
        Power = 0x0,
        //% block="up"
        Up = 0x1,
        //% block="light"
        Light = 0x2,
        //% block="left"
        Left = 0x4,
        //% block="beep"
        BEEP = 0x5,
        //% block="right"
        Right = 0x6,
        //% block="turn left"
        TLeft = 0x8,
        //% block="down"
        Down = 0x9,
        //% block="turn right"
        TRight = 0xA,
        //% block="plus"
        Plus = 0xC,
        //% block="0"
        NUM0 = 0xD,
        //% block="minus"
        Minus = 0xE,
        //% block="1"
        NUM1 = 0x10,
        //% block="2"
        NUM2 = 0x11,
        //% block="3"
        NUM3 = 0x12,
        //% block="4"
        NUM4 = 0x14,
        //% block="5"
        NUM5 = 0x15,
        //% block="6"
        NUM6 = 0x16,
        //% block="7"
        NUM7 = 0x18,
        //% block="8"
        NUM8 = 0x19,
        //% block="9"
        NUM9 = 0x1A
    }

    // --- internal state ---
    let _pin: DigitalPin = DigitalPin.P0
    let _started = false

    // key: command byte
    const _handlers: { [k: number]: (() => void)[] } = {}

    let _lastCmd = -1
    let _lastMs = 0

    // Timing thresholds (microseconds) for NEC
    const LEADER_LOW_MIN = 8000
    const LEADER_HIGH_MIN = 3500

    const REPEAT_HIGH_MIN = 1800
    const REPEAT_HIGH_MAX = 2800

    const BIT_HIGH_ONE_MIN = 1200

    const TIMEOUT_US = 100000 // 100ms per pulse max
    const DEBOUNCE_MS = 100

    /**
     * Connect IR receiver to a digital pin.
     *
     * Typical modules output an active-low signal and need a pull-up.
     */
    //% blockId=ir_init
    //% block="connect ir receiver to %pin"
    //% pin.shadow="digital_pin_shadow"
    export function init(pin: DigitalPin): void {
        _pin = pin
        pins.setPull(_pin, PinPullMode.PullUp)

        if (_started) return
        _started = true

        control.inBackground(() => {
            while (true) {
                const cmd = readNecCommand()
                if (cmd >= 0) {
                    fire(cmd)
                } else {
                    // Avoid tight spinning when there is no IR traffic
                    control.waitMicros(2000)
                }
            }
        })
    }

    /**
     * Run code when a remote button is pressed.
     */
    //% blockId=ir_received_left_event
    //% block="on |%btn| button pressed"
    //% draggableParameters
    export function onPressEvent(btn: RemoteButton, body: () => void): void {
        const k = btn as number
        if (!_handlers[k]) _handlers[k] = []
        _handlers[k].push(body)
    }

    // --- decoding ---

    function fire(cmd: number): void {
        const now = control.millis()
        if (_lastCmd === cmd && (now - _lastMs) < DEBOUNCE_MS) return
        _lastCmd = cmd
        _lastMs = now

        const list = _handlers[cmd]
        if (!list) return
        // run handlers
        for (let i = 0; i < list.length; i++) {
            list[i]()
        }
    }

    // Returns command byte (0..255), or -1 if nothing decoded
    function readNecCommand(): number {
        // Wait for leader low pulse
        const low = pins.pulseIn(_pin, PulseValue.Low, TIMEOUT_US)
        if (low < LEADER_LOW_MIN) return -1

        const high = pins.pulseIn(_pin, PulseValue.High, TIMEOUT_US)

        // Repeat frame
        if (high >= REPEAT_HIGH_MIN && high <= REPEAT_HIGH_MAX) {
            if (_lastCmd >= 0 && (control.millis() - _lastMs) < 250) {
                return _lastCmd
            }
            return -1
        }

        // Normal frame
        if (high < LEADER_HIGH_MIN) return -1

        // Read 32 bits, LSB first
        let data = 0
        for (let i = 0; i < 32; i++) {
            const bLow = pins.pulseIn(_pin, PulseValue.Low, TIMEOUT_US)
            if (bLow === 0) return -1
            const bHigh = pins.pulseIn(_pin, PulseValue.High, TIMEOUT_US)
            if (bHigh === 0) return -1
            if (bHigh >= BIT_HIGH_ONE_MIN) {
                data |= (1 << i)
            }
        }

        // Bytes: addr, ~addr, cmd, ~cmd (each byte is LSB-first in NEC)
        const addr = (data >> 0) & 0xFF
        const naddr = (data >> 8) & 0xFF
        const cmd = (data >> 16) & 0xFF
        const ncmd = (data >> 24) & 0xFF

        // Basic integrity check
        if (((addr ^ naddr) & 0xFF) !== 0xFF) return -1
        if (((cmd ^ ncmd) & 0xFF) !== 0xFF) return -1

        return cmd
    }
}
