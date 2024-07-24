export function formatAnsCnt(ansCnt: string): number[] {
  if (ansCnt.length > 4) {
    ansCnt = ansCnt.substring(0, 4);
  }

  let uintArray: number[] = new Array(4).fill(0);
  let temp: number[] = new Array(ansCnt.length);

  for (let i = 0; i < ansCnt.length; i++) {
    temp[i] = parseInt(ansCnt.charAt(i), 10);
  }

  uintArray.splice(4 - ansCnt.length, ansCnt.length, ...temp);
  return uintArray;
}