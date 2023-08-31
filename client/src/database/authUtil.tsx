import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "./firebaseUtil";


export const onCaptchVerify = (
    phoneNumber: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    onSuccess: () => void
) => {
    if (!(window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(
            auth,
            "recaptcha-container",
            {
                size: "invisible",
                callback: (response: any) => {
                    onSignup(phoneNumber, setLoading, onSuccess);
                },
                "expired-callback": () => { },
            },
        );
    }
}

export const onSignup = (
    phoneNumber: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    onSuccess: () => void,
) => {
    setLoading(true);
    onCaptchVerify(phoneNumber, setLoading, onSuccess);

    const appVerifier = (window as any).recaptchaVerifier;

    const formatPh = "+91" + phoneNumber;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
        .then((confirmationResult) => {
            (window as any).confirmationResult = confirmationResult;
            setLoading(false);
            onSuccess();
        })
        .catch((error) => {
            console.log(error);
            setLoading(false);
        });
}

export const onOTPVerify = (
    otp: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    onSuccess: (user: any) => void
) => {
    setLoading(true);
    (window as any).confirmationResult
        .confirm(otp)
        .then(async (response: any) => {
            console.log(response);
            onSuccess(response.user)
            setLoading(false);
        })
        .catch((err: any) => {
            console.log(err);
            setLoading(false);
        });
}