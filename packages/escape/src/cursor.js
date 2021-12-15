import { csi } from '../util/csi.js'

export class Cursor {
  static goto = (x, y) => csi(`${++x};${++y}H`)
  static up = (d) => csi(d + 'A')
  static down = (d) => csi(d + 'B')
  static right = (d) => csi(d + 'C')
  static left = (d) => csi(d + 'D')
  static QUERY_POS = csi("6n")             // Where is the cursor? Use `ESC [ 6 n`. And answers: `ESC [ Cy ; Cx R`.
  static HIDE = csi("?25l")                // "Hide the cursor."                              //
  static SHOW = csi("?25h")                // "Show the cursor."                              //
  static RESTORE = csi("u")                // "Restore the cursor."                           //
  static SAVE = csi("s")                   // "Save the cursor."                              //
  static BLINK_BLOCK = csi("\x31 q")       // "Change the cursor style to blinking block"     //
  static STEADY_BLOCK = csi("\x32 q")      // "Change the cursor style to steady block"       //
  static BLINK_UNDERLINE = csi("\x33 q")   // "Change the cursor style to blinking underline" //
  static STEADY_UNDERLINE = csi("\x34 q")  // "Change the cursor style to steady underline"   //
  static BLINK_BAR = csi("\x35 q")         // "Change the cursor style to blinking bar"       //
  static STEADY_BAR = csi("\x36 q")        // "Change the cursor style to steady bar"         //
}












