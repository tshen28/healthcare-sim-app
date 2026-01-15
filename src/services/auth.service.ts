import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from './firebase';

const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidPassword = (password: string): boolean => {
    return password.length >= 6;
};

export const login = async (email: string, password: string): Promise<User> => {
    try {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        if (!isValidEmail(email)) {
            throw new Error('Please enter a valid email address');
        }

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            throw new Error('No account found with this email');
        } else if (error.code === 'auth/wrong-password') {
            throw new Error('Incorrect password');
        } else if (error.code === 'auth/invalid-email') {
            throw new Error('Invalid email address');
        } else if (error.code === 'auth/user-disabled') {
            throw new Error('This account has been disabled');
        } else if (error.code === 'auth/too-many-requests') {
            throw new Error('Too many failed attempts. Please try again later');
        } else if (error.code === 'auth/invalid-credential') {
            throw new Error('Invalid email or password');
        }
        throw error;
    }
};

export const signup = async (
    role: 'admin' | 'student',
    email: string,
    password: string,
    displayName?: string
): Promise<User> => {
    try {
        if (!role) {
            throw new Error('Role is required');
        }

        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        if (!isValidEmail(email)) {
            throw new Error('Please enter a valid email address');
        }

        if (!isValidPassword(password)) {
            throw new Error('Password must be at least 6 characters long');
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (displayName) {
            await updateProfile(user, { displayName });
        }

        await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            role,
            displayName: displayName || null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        return user;
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            throw new Error('An account with this email already exists');
        } else if (error.code === 'auth/invalid-email') {
            throw new Error('Invalid email address');
        } else if (error.code === 'auth/operation-not-allowed') {
            throw new Error('Email/password accounts are not enabled');
        } else if (error.code === 'auth/weak-password') {
            throw new Error('Password is too weak. Please use a stronger password');
        }
        throw error;
    }
};

export const logout = async (): Promise<void> => {
    try {
        await signOut(auth);
    } catch (error: any) {
        throw new Error('Failed to log out. Please try again', error.message);
    }
};

export const resetPassword = async (email: string): Promise<void> => {
    try {
        if (!email) {
            throw new Error('Email is required');
        }

        if (!isValidEmail(email)) {
            throw new Error('Please enter a valid email address');
        }

        await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            throw new Error('No account found with this email');
        } else if (error.code === 'auth/invalid-email') {
            throw new Error('Invalid email address');
        }
        throw error;
    }
};

export const getCurrentUser = (): User | null => {
    return auth.currentUser;
};