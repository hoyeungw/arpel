// str begins with \x1b[M
// reuse the key array albeit its name
// otherwise recompute as the mouse event is structured differently

export const parseMouse = (str) => {
  const modifier = str.charCodeAt(3)
  const isScroll = ( modifier & 96 ) === 96
  return {
    name: isScroll ? 'scroll' : modifier & 64 ? 'move' : 'click',
    shift: !!( modifier & 4 ),
    meta: !!( modifier & 8 ),
    ctrl: !!( modifier & 16 ),
    x: str.charCodeAt(4) - 32,
    y: str.charCodeAt(5) - 32,
    button: isScroll ? modifier & 1 ? 'down' : 'up' : mouseButtonName(modifier & 3),
    seq: str,
    buf: Buffer.from(str),
    modifier
  }
}

const mouseButtonName = bv => {
  if (bv === 0) return 'left'
  if (bv === 1) return 'middle'
  if (bv === 2) return 'right'
  if (bv === 3) return 'none'
  return null
}

export const isMouseCode = text =>
  /\[M/.test(text) ||
  /\[M([\x00\u0020-\uffff]{3})/.test(text) ||
  /\[(\d+;\d+;\d+)M/.test(text) ||
  /\[<(\d+;\d+;\d+)([mM])/.test(text) ||
  /\[<(\d+;\d+;\d+;\d+)&w/.test(text) ||
  /\[24([0135])~\[(\d+),(\d+)\]\r/.test(text) ||
  /\[(O|I)/.test(text)


// if (( modifier & 96 ) === 96) {
//   key.name = 'scroll'
//   key.button = modifier & 1 ? 'down' : 'up'
// }
// else {
//   key.name = modifier & 64 ? 'move' : 'click'
//   key.button = mouseButtonName(modifier & 3)
// }