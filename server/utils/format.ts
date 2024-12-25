import { Poll } from "~/utils/types";
import { language_columns } from "../const";

export function useFormatAnsCnt(ansCnt: string): number[] {
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


export function removeLanguageCols(data: any[]) {
  return data.forEach((poll: Poll) => {
    const keyMap = {
      content: 'content',
      choice1: 'choice1',
      choice2: 'choice2'
    } as const;

    Object.keys(poll).forEach((key) => {
      const prefix = Object.keys(keyMap).find(p => key.startsWith(p));
      if (prefix) {
      (poll as any)[keyMap[prefix as keyof typeof keyMap]] = (poll as any)[key];
      delete (poll as any)[key];
      }
    });
  })
}

export function removeSingleLanguageCols(data: any) {
  const keyMap = {
    content: 'content',
    choice1: 'choice1',
    choice2: 'choice2'
  } as const;

  Object.keys(data).forEach((key) => {
    const prefix = Object.keys(keyMap).find(p => key.startsWith(p));
    if (prefix) {
      (data as any)[keyMap[prefix as keyof typeof keyMap]] = (data as any)[key];
      delete (data as any)[key];
    }
  });
}
