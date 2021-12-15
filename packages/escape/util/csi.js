export const csi = (some) => '\x1b[' + some

export const csiSet = (...vec) => {
  let tx = ''
  for (let x of vec) tx += csi(x)
  return tx
}