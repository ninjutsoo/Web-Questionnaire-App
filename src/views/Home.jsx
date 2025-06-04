// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Button } from "antd";

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
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "32px", marginBottom: "20px", color: "#1890ff" }}>
          Welcome, {user?.displayName || user?.email}
        </h1>
        
        <div style={{ marginBottom: "30px" }}>
          <Button 
            type="primary" 
            size="large"
            onClick={() => navigate("/questionnaire")}
            style={{ 
              fontSize: "18px", 
              height: "50px", 
              padding: "0 30px",
              marginRight: "20px"
            }}
          >
            Start Health Assessment
          </Button>
          
          <Button
            size="large"
            onClick={handleLogout}
            style={{ 
              fontSize: "18px", 
              height: "50px", 
              padding: "0 30px"
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
