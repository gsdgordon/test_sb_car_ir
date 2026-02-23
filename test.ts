StemBit_IR.init(DigitalPin.P0)

StemBit_IR.onPressEvent(RemoteButton.Power, function () {
    basic.showIcon(IconNames.Heart)
})

StemBit_IR.onPressEvent(RemoteButton.Up, function () {
    basic.showArrow(ArrowNames.North)
})
