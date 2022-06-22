import React, { ReactElement } from "react";
import {useTranslation} from "react-i18next";

// export const Translation: React.FC = (data) =>{
//     const {t} = useTranslation();

//     const clickHandler = (lang:string) =>{
//         i18next.changeLanguage(lang);
//     }
//     return(
//         <div>
//             <button onClick={()=>clickHandler("ko")}>KO</button>
//             <button onClick={()=>clickHandler("en")}>EN</button>
//             <p>{t("hello")}</p>
//             <p>{t("name")}</p>
//         </div>
//     );
// }
export const Translation: React.FC<ReactElement> = (data) =>{
    const {t} = useTranslation();

    return(
        <>
            {t(data['data'])}
        </>
    );
}

// export default Translation;