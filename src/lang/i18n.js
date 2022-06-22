import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import LangEn from "./lang.en.json";
import LangKo from "./lang.ko.json";

const resource = {
    en: {
        translations: LangEn
    },
    ko: {
        translations: LangKo
    }
}

i18n
    .use(initReactI18next)
    .init({
        resources:resource,
        // 초기 설정 언어
        lng: "en",
        fallbackLng: "en",
        debug: true,
        defaultNS: "translations",
        ns: "translations",
        keySeparator: false,
        interpolation: {
            escapeValue: false
        }
    })

export default i18n;