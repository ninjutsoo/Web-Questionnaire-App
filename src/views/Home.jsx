// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/signin");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  function handleLogout() {
    signOut(auth)
      .then(() => {
        navigate("/signin");
      })
      .catch((err) => console.error("Logout error:", err));
  }

  return (
    <div >
      <div >
        <h1 >
          Welcome, {user?.displayName || user?.email}
        </h1>
        <button
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
