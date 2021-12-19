import {
  BACKSPACE, CLEAR, DELETE, DOWN, END, ENTER, ESCAPE, HOME, INSERT, LEFT, PAGEDOWN, PAGEUP, RETURN, RIGHT, SPACE, TAB, UNDEFINED, UP
}                                                                 from '@pres/enum-key-names'
import { acquire }                                                from '@vect/vector-merge'
import { ANY_ESCAPE_KEYCODE, PRE_FUNC_KEYCODE, PRE_META_KEYCODE } from '../../resources/regex.js'
import { isMouseCode }                                            from './parseMouse.js'


const processBuffer = text => {
  if (text[0] > 127 && text[1] === undefined) {
    text[0] -= 128
    return '' + text.toString()
  }
  else {
    return text.toString()
  }
}

/**
 * accepts a readable Stream instance and makes it emit "keypress" events
 */
export const parseKeycodes = text => {
  if (Buffer.isBuffer(text)) text = processBuffer(text)
  const keycodes = []
  if (isMouseCode(text)) return keycodes
  let ms, ph
  while (( ms = ANY_ESCAPE_KEYCODE.exec(text) ) && ( [ ph ] = ms )) {
    acquire(keycodes, text.slice(0, ms.index).split(''))
    keycodes.push(ph)
    text = text.slice(ms.index + ph.length)
  }
  acquire(keycodes, text.split(''))


  return keycodes.map(parseKeycode)
}

export const parseKeycode = str => {
  const key = {
    name: undefined,
    shift: false,
    meta: false,
    ctrl: false,
    ch: str.length === 1 ? str : undefined,
    seq: str,
    buf: Buffer.from(str)
  }
  let ms
  if (str === '\r') { key.name = RETURN }
  else if (str === '\n') { key.name = ENTER } // enter, should have been called linefeed // linefeed // key.name = 'linefeed';
  else if (str === '\t') { key.name = TAB }
  else if (str === '\b' || str === '' || str === '' || str === '\b') { key.name = BACKSPACE, key.meta = ( str.charAt(0) === '' ) } // backspace or ctrl+h
  else if (str === '' || str === '') { key.name = ESCAPE, key.meta = ( str.length === 2 ) } // escape key
  else if (str === ' ' || str === ' ') { key.name = SPACE, key.meta = ( str.length === 2 ) }
  else if (str.length === 1 && str <= '') { key.name = String.fromCharCode(str.charCodeAt(0) + 'a'.charCodeAt(0) - 1), key.ctrl = true } // ctrl+letter
  else if (str.length === 1 && str >= 'a' && str <= 'z') { key.name = str } // lowercase letter
  else if (str.length === 1 && str >= 'A' && str <= 'Z') { key.name = str.toLowerCase(), key.shift = true } // shift+letter
  else if (( ms = PRE_META_KEYCODE.exec(str) )) { key.name = ms[1].toLowerCase(), key.meta = true, key.shift = /^[A-Z]$/.test(ms[1]) } // meta+character key
  else if (( ms = PRE_FUNC_KEYCODE.exec(str) )) {
    // ansi escape sequence
    // reassemble the key code leaving out leading 's,
    // the modifier key bitflag and any meaningless "1;" sequence
    const code     = ( ms[1] || '' ) + ( ms[2] || '' ) + ( ms[4] || '' ) + ( ms[9] || '' ),
          modifier = ( ms[3] || ms[8] || 1 ) - 1
    // Parse the key modifier
    key.shift = !!( modifier & 1 )
    key.ctrl = !!( modifier & 4 )
    key.meta = !!( modifier & 10 )
    key.code = code
    // Parse the key itself
    switch (code) {
      /* xterm ESC [ letter */
      case '[A':
        key.name = UP
        break
      case '[B':
        key.name = DOWN
        break
      case '[C':
        key.name = RIGHT
        break
      case '[D':
        key.name = LEFT
        break
      case '[E':
        key.name = CLEAR
        break
      case '[F':
        key.name = END
        break
      case '[H':
        key.name = HOME
        break

      /* xterm/gnome ESC O letter */
      case 'OA':
        key.name = UP
        break
      case 'OB':
        key.name = DOWN
        break
      case 'OC':
        key.name = RIGHT
        break
      case 'OD':
        key.name = LEFT
        break
      case 'OE':
        key.name = CLEAR
        break
      case 'OF':
        key.name = END
        break
      case 'OH':
        key.name = HOME
        break

      /* xterm/rxvt ESC [ number ~ */
      case '[1~':
        key.name = HOME
        break
      case '[2~':
        key.name = INSERT
        break
      case '[3~':
        key.name = DELETE
        break
      case '[4~':
        key.name = END
        break
      case '[5~':
        key.name = PAGEUP
        break
      case '[6~':
        key.name = PAGEDOWN
        break

      /* putty */
      case '[[5~':
        key.name = PAGEUP
        break
      case '[[6~':
        key.name = PAGEDOWN
        break

      /* rxvt */
      case '[7~':
        key.name = HOME
        break
      case '[8~':
        key.name = END
        break

      /* rxvt keys with modifiers */
      case '[a':
        key.name = UP
        key.shift = true
        break
      case '[b':
        key.name = DOWN
        key.shift = true
        break
      case '[c':
        key.name = RIGHT
        key.shift = true
        break
      case '[d':
        key.name = LEFT
        key.shift = true
        break
      case '[e':
        key.name = CLEAR
        key.shift = true
        break

      case '[2$':
        key.name = INSERT
        key.shift = true
        break
      case '[3$':
        key.name = DELETE
        key.shift = true
        break
      case '[5$':
        key.name = PAGEUP
        key.shift = true
        break
      case '[6$':
        key.name = PAGEDOWN
        key.shift = true
        break
      case '[7$':
        key.name = HOME
        key.shift = true
        break
      case '[8$':
        key.name = END
        key.shift = true
        break

      case 'Oa':
        key.name = UP
        key.ctrl = true
        break
      case 'Ob':
        key.name = DOWN
        key.ctrl = true
        break
      case 'Oc':
        key.name = RIGHT
        key.ctrl = true
        break
      case 'Od':
        key.name = LEFT
        key.ctrl = true
        break
      case 'Oe':
        key.name = CLEAR
        key.ctrl = true
        break

      case '[2^':
        key.name = INSERT
        key.ctrl = true
        break
      case '[3^':
        key.name = DELETE
        key.ctrl = true
        break
      case '[5^':
        key.name = PAGEUP
        key.ctrl = true
        break
      case '[6^':
        key.name = PAGEDOWN
        key.ctrl = true
        break
      case '[7^':
        key.name = HOME
        key.ctrl = true
        break
      case '[8^':
        key.name = END
        key.ctrl = true
        break

      /* xterm/gnome ESC O letter */
      case 'OP':
        key.name = 'f1'
        break
      case 'OQ':
        key.name = 'f2'
        break
      case 'OR':
        key.name = 'f3'
        break
      case 'OS':
        key.name = 'f4'
        break

      /* xterm/rxvt ESC [ number ~ */
      case '[11~':
        key.name = 'f1'
        break
      case '[12~':
        key.name = 'f2'
        break
      case '[13~':
        key.name = 'f3'
        break
      case '[14~':
        key.name = 'f4'
        break

      /* from Cygwin and used in libuv */
      case '[[A':
        key.name = 'f1'
        break
      case '[[B':
        key.name = 'f2'
        break
      case '[[C':
        key.name = 'f3'
        break
      case '[[D':
        key.name = 'f4'
        break
      case '[[E':
        key.name = 'f5'
        break

      /* common */
      case '[15~':
        key.name = 'f5'
        break
      case '[17~':
        key.name = 'f6'
        break
      case '[18~':
        key.name = 'f7'
        break
      case '[19~':
        key.name = 'f8'
        break
      case '[20~':
        key.name = 'f9'
        break
      case '[21~':
        key.name = 'f10'
        break
      case '[23~':
        key.name = 'f11'
        break
      case '[24~':
        key.name = 'f12'
        break

      /* misc. */
      case '[Z':
        key.name = TAB
        key.shift = true
        break
      default:
        key.name = UNDEFINED
        break
    }
  }
  return key
}

