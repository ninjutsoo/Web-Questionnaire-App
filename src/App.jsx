import './App.css'

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./views/Landing.jsx";
import Signup from "./views/Signup/Signup.jsx";
import Signin from "./views/login/Signin.jsx";
import Home from "./views/Home.jsx";
import Questionnaire from "./views/Questionnaire/Questionnaire.jsx";
import Migration from "./views/Migration.jsx";
import AIChatbot from "./components/AIChatbot.jsx";
import AppLayout from "./components/AppLayout.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );

}

export default App
