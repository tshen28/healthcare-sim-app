import { auth, db } from "@/src/services/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

// Define what data the context will provide
type UserRole = "admin" | "student" | null;

export interface AuthContextType {
  user: User | null;      // Firebase user object
  role: UserRole;         // User's role from Firestore
  loading: boolean;       // True while checking auth state
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
});

// The provider component that will wrap your app
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This listener fires whenever auth state changes (login/logout)
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      
      // If no user is logged in
      if (!firebaseUser) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      // User is logged in - set the user
      setUser(firebaseUser);

      // Fetch the user's role from Firestore
      try {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setRole(userData.role || "student"); // Default to student if no role
        } else {
          setRole("student"); // Default if document doesn't exist
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setRole("student"); // Default on error
      }

      setLoading(false);
    });

    // Cleanup: unsubscribe when component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array = run once on mount

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context in other components
export const useAuth = () => useContext(AuthContext);
