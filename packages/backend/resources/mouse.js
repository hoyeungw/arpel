import { csiSet } from '@arpel/escape'

// ?1000h: Normal tracking -       Send mouse X & Y on button press and release
// ?1002h: Button-event tracking - Report button motion events (dragging)
// ?1003h: Any-event tracking -    Report all motion events
// ?1015h: RXVT mouse mode -       Allows mouse coordinates of >223
// ?1006h: SGR mouse mode -        Allows mouse coordinates of >223, preferred over RXVT mode

// A sequence of escape codes to enable terminal mouse support.
// "\x1b[?1000h\x1b[?1002h\x1b[?1015h\x1b[?1006h"
export const ENTER_MOUSE_SEQUENCE = csiSet('?1000h', '?1002h', '?1015h', '?1006h')

// A sequence of escape codes to disable terminal mouse support.
// "\x1b[?1006l\x1b[?1015l\x1b[?1002l\x1b[?1000l"
export const EXIT_MOUSE_SEQUENCE = csiSet('?1006l', '?1015l', '?1002l', '?1000l')