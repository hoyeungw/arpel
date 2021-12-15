import { csi } from '../util/csi.js'

export class Clear {
  static AFTER_CURSOR = csi('0J')     // 'Clear everything after the cursor.'
  static BEFORE_CURSOR = csi('1J')    // 'Clear everything before the cursor.'
  static ENTIRE_SCREEN = csi('2J')    // 'Clear the entire screen. Move cursor to top-left.'
  static ENTIRE_TERMINAL = csi('3J')  // 'Clear the entire screen + entire scroll-back buffer.'
  static RIGHT_TO_CURSOR = csi('0K')  // 'Clear from cursor to the end of the line. Cursor unchanged.'
  static LEFT_TO_CURSOR = csi('1K')   // 'Clear from cursor to the beginning of the line. Cursor unchanged.'
  static ENTIRE_LINE = csi('2K')      // 'Clear the current line. Cursor unchanged.'
}
