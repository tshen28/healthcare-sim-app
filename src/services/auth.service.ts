import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export const login = async (email: string, password: string): Promise<User> => {
    // Firebase handles the authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

export const signup = async (
    email: string,
    password: string,
    role: 'admin' | 'student'
): Promise<User> => {
    // Step 1: Create the Firebase auth account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Step 2: Save user data to Firestore (including role)
    await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: role,
        createdAt: new Date(),
    });

    return user;
};

export const logout = async (): Promise<void> => {
    // Sign out from Firebase - AuthContext will automatically detect this
    await signOut(auth);
};

export const resetPassword = async (email: string): Promise<void> => {
    // Firebase sends password reset email to the user
    await sendPasswordResetEmail(auth, email);
};