export function omfRandomStr(max: number) {
  let str = '';
  for (let i = 0; i < max; i++) {
    str += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
  }
  return str;
}
