import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./views/Signup/Signup.jsx";
import Signin from "./views/login/Signin.jsx";
import Home from "./views/Home.jsx";
import Questionnaire from "./views/Questionnaire/Questionnaire.jsx";
import Migration from "./views/Migration.jsx";
import AIChatbot from "./components/AIChatbot.jsx";
import AppLayout from "./components/AppLayout.jsx";

function App() {
  const [count, setCount] = useState(0)
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={
          <AppLayout>
            <Home />
          </AppLayout>
        } />
        <Route path="/questionnaire" element={
          <AppLayout>
            <Questionnaire />
          </AppLayout>
        } />
        <Route path="/migration" element={
          <AppLayout>
            <Migration />
          </AppLayout>
        } />
        <Route path="/ai-chatbot" element={
          <AppLayout>
            <AIChatbot />
          </AppLayout>
        } />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );

}

export default App
