import { FirebaseError, initializeApp } from "firebase/app";
import { getFirestore, getDoc, doc, setDoc } from "@firebase/firestore"
import { getAuth } from 'firebase/auth'
import { collection } from "@firebase/firestore"
import { MD5 } from "crypto-js";


const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SERNDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);

export const auth = getAuth(app);

const userRef = collection(firestore, "users")
const paymentRef = collection(firestore, "payments")
const constantsRef = collection(firestore, "constants")


export const createRecord = async (
    data: any,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    onSuccess: undefined | ((id: string) => void), onError: undefined | ((error: any) => void)) => {
    try {
        setLoading(true);
        const idRef = await getDoc(doc(firestore, "/constants/Id_generator"));
        const id = idRef.data()?.latest.split('-')[0] + '-' + (parseInt(idRef.data()?.latest.split('-')[1]) + 1)
        const docId = MD5(data.mobileNo).toString();
        const exists = (await checkUserExists(docId)).exists();
        if (exists) {
            throw new FirebaseError("401", "Mobile No already exists. Please enter any new number")
        }
        await setDoc(doc(firestore, `/users/${docId}`), { ...data, registration_id: id });
        await setDoc(doc(firestore, "/constants/Id_generator"), {
            latest: id
        });
        setLoading(false)
        onSuccess && onSuccess(docId);

    } catch (err) {

        setLoading(false)
        onError && onError(err);
    }
}

export const checkUserExists = async (id: string) => {
    const docRef = doc(firestore, `users/${id}`);
    const document = await getDoc(docRef);
    console.log("exists: ", document.exists())
    return document;
}

// export const updateRecord = async (
//     data: any,
//     setLoading: React.Dispatch<React.SetStateAction<boolean>>,
//     onSuccess: ((data: any) => void) | null, onError: ((error: any) => void) | null) => {
//     // Define the document reference
//     const docRef = doc(firestore, "users", data.userRefId);
//     try {
//         setLoading(true);
//         const docSnapshot = await getDoc(docRef);
//         const pRef = await addDoc(paymentRef, data)
//         const paymentData = {
//             donated: Number(docSnapshot.data()?.donated) + Number(data.donated),
//             transactions: arrayUnion(pRef.id)
//         }
//         console.log("paymentData", paymentData, pRef)
//         await updateDoc(docRef, paymentData);
//         setLoading(false)
//         onSuccess && onSuccess(data);
//     } catch (err) {
//         console.log("error", err)
//         setLoading(false)
//         onError && onError(err);
//     }
// }