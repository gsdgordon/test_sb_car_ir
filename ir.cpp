#include "pxt.h"
#include <map>
#include <vector>

using namespace pxt;

typedef std::vector<Action> ActionList;

enum class RemoteButton : uint8_t {
    Power = 0x0,
    Up = 0x1,
    Light = 0x2,
    Left = 0x4,
    BEEP = 0x5,
    Right = 0x6,
    TLeft = 0x8,
    Down = 0x9,
    TRight = 0xA,
    Plus = 0xC,
    NUM0 = 0xD,
    Minus = 0xE,
    NUM1 = 0x10,
    NUM2 = 0x11,
    NUM3 = 0x12,
    NUM4 = 0x14,
    NUM5 = 0x15,
    NUM6 = 0x16,
    NUM7 = 0x18,
    NUM8 = 0x19,
    NUM9 = 0x1A
};

static const int TUS_NEC = 562;

static inline bool inRange(int x, int y) {
    // 70% .. 130%
    return (x > (int)(y * 0.7f)) && (x < (int)(y * 1.3f));
}

namespace StemBit_IR {

static std::map<RemoteButton, ActionList> actions;
static std::map<RemoteButton, uint32_t> lastActMs;

static MicroBitPin *rxPin = nullptr;

static volatile uint8_t lastCmd = 0;
static volatile bool hasLastCmd = false;

static inline void runAll(const ActionList &lst) {
    for (size_t i = 0; i < lst.size(); i++) {
        runAction0(lst[i]);
    }
}

// Decode one NEC frame. Returns true if a command (cmd) is available.
// If a NEC repeat frame is detected, repeat=true and cmd is last command (if any).
static bool decodeNEC(uint8_t &cmd, bool &repeat) {
    repeat = false;

    if (!rxPin)
        return false;

    // NEC leader: 9ms LOW, 4.5ms HIGH (active low receiver output)
    int leaderLow = rxPin->getPulseUs(0, 15000);
    if (leaderLow <= 0 || !inRange(leaderLow, TUS_NEC * 16))
        return false;

    int leaderHigh = rxPin->getPulseUs(1, 10000);
    if (leaderHigh <= 0)
        return false;

    if (inRange(leaderHigh, TUS_NEC * 4)) {
        // NEC repeat: 9ms LOW, 2.25ms HIGH, 562us LOW, then gap
        (void)rxPin->getPulseUs(0, 3000); // consume the 562us low mark (best effort)
        if (hasLastCmd) {
            cmd = lastCmd;
            repeat = true;
            return true;
        }
        return false;
    }

    if (!inRange(leaderHigh, TUS_NEC * 8))
        return false;

    // Read 32 bits, LSB-first (same as common NEC decoding and this package's old behavior)
    uint32_t data = 0;
    for (int i = 0; i < 32; i++) {
        // Mark: ~562us LOW
        int markLow = rxPin->getPulseUs(0, 3000);
        if (markLow <= 0)
            return false;

        // Space: 562us HIGH for 0, 1687us HIGH for 1
        int spaceHigh = rxPin->getPulseUs(1, 4000);
        if (spaceHigh <= 0)
            return false;

        if (inRange(spaceHigh, TUS_NEC * 3)) {
            data |= (1u << i);
        } else if (inRange(spaceHigh, TUS_NEC * 1)) {
            // 0 bit, leave clear
        } else {
            return false;
        }
    }

    // Bytes: [0]=addr, [1]=~addr, [2]=cmd, [3]=~cmd
    uint8_t b2 = (data >> 16) & 0xFF;
    cmd = b2;
    lastCmd = b2;
    hasLastCmd = true;
    return true;
}

static void monitorIR() {
    while (1) {
        uint8_t cmd = 0;
        bool repeat = false;

        if (decodeNEC(cmd, repeat)) {
            RemoteButton btn = (RemoteButton)cmd;

            auto it = actions.find(btn);
            if (it != actions.end()) {
                uint32_t now = uBit.systemTime();
                uint32_t last = lastActMs[btn];
                // simple debounce/repeat gate
                if (now - last >= 100) {
                    lastActMs[btn] = now;
                    runAll(it->second);
                }
            }
        } else {
            // Yield so we don't busy-loop if no signal is present
            uBit.sleep(5);
        }
    }
}

/**
 * Register a handler for a remote button press.
 */
void onPressEvent(RemoteButton btn, Action body) {
    actions[btn].push_back(body);
}

/**
 * Connect an IR receiver module output to the given pin.
 */
void init(int pin) {
    rxPin = getPin(pin);
    if (!rxPin) return;

    // Most IR receiver modules idle HIGH, active LOW.
    rxPin->setPull(PullUp);

    // Start background fiber
    create_fiber(monitorIR);
}

} // namespace StemBit_IR
