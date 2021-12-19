/*
  Some patterns seen in terminal key escape codes, derived from combos seen
  at http://www.midnight-commander.org/browser/lib/tty/key.c

  ESC letter
  ESC [ letter
  ESC [ modifier letter
  ESC [ 1 ; modifier letter
  ESC [ num char
  ESC [ num ; modifier char
  ESC O letter
  ESC O modifier letter
  ESC O 1 ; modifier letter
  ESC N letter
  ESC [ [ num ; modifier char
  ESC [ [ 1 ; modifier letter
  ESC ESC [ num char
  ESC ESC O letter

  - char is usually ~ but $ and ^ also happen with rxvt
  - modifier is 1 +
                (shift     * 1) +
                (left_alt  * 2) +
                (ctrl      * 4) +
                (right_alt * 8)
  - two leading ESCs apparently mean the same as one leading ESC
*/

// Regexes used for ansi escape code splitting
export const ANY_META_KEYCODE = /([a-zA-Z0-9])/ // metaKeyCodeReAnywhere
export const PRE_META_KEYCODE = new RegExp('^' + ANY_META_KEYCODE.source + '$') // metaKeyCodeRe

export const ANY_FUNC_KEYCODE = new RegExp('+(O|N|\\[|\\[\\[)(?:' + [
  '(\\d+)(?:;(\\d+))?([~^$])',
  '(?:M([@ #!a`])(.)(.))', // mouse
  '(?:1;)?(\\d+)?([a-zA-Z])'
].join('|') + ')') // functionKeyCodeReAnywhere
export const PRE_FUNC_KEYCODE = new RegExp('^' + ANY_FUNC_KEYCODE.source) // functionKeyCodeRe

export const ANY_ESCAPE_KEYCODE = new RegExp([ ANY_FUNC_KEYCODE.source, ANY_META_KEYCODE.source, /./.source ].join('|')) // escapeCodeReAnywhere
