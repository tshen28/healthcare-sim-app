import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { auth, db } from "../services/firebase";

type UserRole = "admin" | "student" | null;

export interface AuthContextType {
  user: User | null;
  role: UserRole;
  loading: boolean;
  signup: (email: string, password: string, role: UserRole) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  signup: async () => {},
  login: async () => {},
  logout: async () => {},
  user: null,
  role: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser?.email);
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch user role from Firestore
        const userDocRef = doc(db, "users", firebaseUser.uid);
        console.log("Fetching user document for UID:", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          console.log(
            "User document doesn't exist - this user was not created through signup",
          );
          // Don't auto-create - role should be set during signup
          setRole(null);
        } else {
          const userData = userDoc.data();
          console.log("User data from Firestore:", userData);
          console.log("Setting role to:", userData?.role);
          setRole(userData?.role || null);
        }
      } else {
        console.log("No user logged in");
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signup = async (
    email: string,
    password: string,
    userRole: UserRole,
  ) => {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    // Create user document in Firestore with role
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: email,
      role: userRole,
      createdAt: new Date().toISOString(),
    });
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ user, role, loading, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
