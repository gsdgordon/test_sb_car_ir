// tests go here; this will not be compiled when this package is used as a library
StemBit_IR.init(DigitalPin.P1)

StemBit_IR.onPressEvent(StemBit_IR.RemoteButton.Power, () => {
    basic.showIcon(IconNames.Yes)
})

StemBit_IR.onPressEvent(StemBit_IR.RemoteButton.NUM1, () => {
    basic.showNumber(1)
})
