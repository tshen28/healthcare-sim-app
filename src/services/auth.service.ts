import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from './firebase';

export const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const signup = async (
    role: 'admin' | 'student',
    email: string,
    password: string
) => {
    if (!role) throw new Error('Role is required');

    const cred = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, 'users', cred.user.uid), {
        email: cred.user.email,
        role,
        createdAt: serverTimestamp(),
    });

    return cred.user;
}

export const logout = () => {
    return signOut(auth);
};