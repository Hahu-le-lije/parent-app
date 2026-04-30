import { settings_en } from "./en/settings";
import { subscriptions_en } from "./en/subscriptions";
import { settings_am } from "./am/settings";
import { subscriptions_am } from "./am/subscriptions";

import type { AppLanguage } from "./types";

const TRANSLATIONS:Record<AppLanguage,Record<string,string>>={
    en:{
        ...settings_en,
        ...subscriptions_en
    },
    am:{
        ...settings_am,
        ...subscriptions_am
    }

}
export function t(lang:AppLanguage,key:string,params?:Record<string,string | number>){
    const str=TRANSLATIONS[lang]?.[key]?? TRANSLATIONS.en?.[key]?? key;
    if(!params) return str;
     return str.replace(/\{(\w+)\}/g, (_m, p1) => {
    const v = params[p1];
    return v === undefined ? `{${p1}}` : String(v);
  });
}
