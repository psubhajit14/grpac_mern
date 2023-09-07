import React, { createContext } from "react";

interface paymentContextTypes {
    open: boolean;
    uid: any;
    setUid?: React.Dispatch<React.SetStateAction<any>>;
    setOpenModal?: React.Dispatch<React.SetStateAction<boolean>>;
}
export const paymentContext = createContext<paymentContextTypes>({ open: false, uid: null });