import { message } from "antd";
import { createUserWithEmailAndPassword, getRedirectResult, GoogleAuthProvider, RecaptchaVerifier, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPhoneNumber, signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";
import { collection, query, where, getDocs, addDoc, doc, getDoc, updateDoc, setDoc, documentId } from "firebase/firestore";
import { auth, checkUserExists, firestore } from "./firebaseUtil";


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
        alert(err.message);
    }
};

export const registerWithEmailAndPassword = async (name: string, email: string, password: string) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await addDoc(adminRef, {
            uid: user.uid,
            name,
            authProvider: "local",
            email,
        });
    } catch (err: any) {
        console.error(err);
        alert(err.message);
    }
};

export const logInWithEmailAndPassword = async (email: string, password: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
        console.error(err);
        alert(err.message);
    }
};

export const sendPasswordReset = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset link sent!");
    } catch (err: any) {
        console.error(err);
        alert(err.message);
    }
};

export const logout = () => {
    localStorage.clear()
    signOut(auth);
};
