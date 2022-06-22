import React, { ReactElement } from "react";
import {useTranslation} from "react-i18next";

export const Translation: React.FC<{ data: string }> = ({data}) =>{
    const {t} = useTranslation();

    return(
        <>
            {t(data)}
        </>
    );
}