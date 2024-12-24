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

export function removeLanguageCols(data: any): Poll[] {
  //rename content[lang], choice1[lang], choice2[lang] to content, choice1, choice2
  //for example, contentEnglish -> content
  return data.map((d: any) => {
    let obj = { ...d };
    Object.keys(language_columns).forEach((lang) => {
      Object.keys(language_columns[lang]).forEach((field) => {
        obj[field] = obj[`${field}${lang.charAt(0).toUpperCase()}${lang.slice(1)}`];
        delete obj[`${field}${lang.charAt(0).toUpperCase()}${lang.slice(1)}`];
      });
    });
    return obj;
  });
}
