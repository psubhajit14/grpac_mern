import { message } from "antd";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, GoogleAuthProvider, RecaptchaVerifier, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPhoneNumber, signInWithPopup, signOut } from "firebase/auth";
import { collection, addDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { auth, firestore } from "./firebaseUtil";


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

const adminRef = collection(firestore, "admins")

const googleProvider = new GoogleAuthProvider();

export const isAdmin = async (uid: string) => {
    console.log("uid isAdmin", uid)
    const docRef = doc(firestore, `admins/${uid}`);
    const document = await getDoc(docRef);
    if (!document.exists()) {
        message.error("You do not have permisson, Please Request Admin for access this page !", 2);
        return false;
    } else {
        return document.data().isAdmin;
    }
}

export const signInWithGoogle = async (
    onSuccess: () => void
) => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res?.user;
        const docRef = doc(firestore, `admins/${user.uid}`);
        const document = await getDoc(docRef);
        if (!document.exists()) {
            await setDoc(docRef, {
                name: user.displayName,
                authProvider: "google",
                email: user.email,
            })
        }
        onSuccess();
    } catch (err: any) {
        console.error(err);
        message.error((err as FirebaseError).code.split("/")[1])
    }
};

export const registerWithEmailAndPassword = async (name: string, email: string, password: string, onSuccess: () => void) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await addDoc(adminRef, {
            uid: user.uid,
            name,
            authProvider: "local",
            email,
        });

        message.success("New user registered successfully!", 5);
        onSuccess();
    } catch (err: any) {
        console.error(err);
        message.error((err as FirebaseError).code.split("/")[1])
    }
};

export const logInWithEmailAndPassword = async (email: string, password: string, onSuccess: () => void) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        message.success("Logged in with email-id successfully!", 5);
        onSuccess();
    } catch (err: any) {
        console.error(err);
        message.error((err as FirebaseError).code.split("/")[1])
    }
};

export const sendPasswordReset = async (email: string, onSuccess: () => void) => {
    try {
        await sendPasswordResetEmail(auth, email);
        message.success("Email has been sent successfully!", 5);
        onSuccess();
    } catch (err: any) {
        console.error(err);
        message.error((err as FirebaseError).code.split("/")[1])
    }
};

export const logout = () => {
    localStorage.clear()
    signOut(auth);
    message.success("Logged out successfully!", 5)
};
