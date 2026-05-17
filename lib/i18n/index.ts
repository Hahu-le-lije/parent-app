import { settings_en } from "./en/settings";
import { subscriptions_en } from "./en/subscriptions";
import { home_en } from "./en/home";
import { settings_am } from "./am/settings";
import { subscriptions_am } from "./am/subscriptions";
import { home_am } from "./am/home";

import { auth_en } from "./en/auth";
import { auth_am } from "./am/auth";
import { children_en } from "./en/children";
import { children_am } from "./am/children";
import { profile_en } from "./en/profile";
import { profile_am } from "./am/profile";

import type { AppLanguage } from "./types";

const TRANSLATIONS:Record<AppLanguage,Record<string,string>>={
    en:{
        ...settings_en,
        ...subscriptions_en,
        ...home_en,
        ...auth_en,
        ...children_en,
        ...profile_en,
    },
    am:{
        ...settings_am,
        ...subscriptions_am,
        ...home_am,
        ...auth_am,
        ...children_am,
        ...profile_am,
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
