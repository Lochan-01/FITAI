import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BMI from "./pages/BMI";
import Diet from "./pages/Diet";
import Workout from "./pages/Workout";
import Chatbot from "./pages/Chatbot";
import PoseDetection from "./pages/PoseDetection";
import Analytics from "./pages/Analytics";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Habit from "./pages/Habit";

export default function App() {

  return (

    <Routes>

      <Route path="/" element={<Home/>}/>

      <Route path="/login" element={<Login/>}/>

      <Route path="/register" element={<Register/>}/>

      <Route path="/dashboard" element={<Dashboard/>}/>

      <Route path="/analytics" element={<Analytics/>}/>

      <Route path="/bmi" element={<BMI/>}/>

      <Route path="/diet" element={<Diet/>}/>

      <Route path="/habit" element={<Habit/>}/>

      <Route path="/workout" element={<Workout/>}/>

      <Route path="/chatbot" element={<Chatbot/>}/>

      <Route path="/history" element={<History/>}/>

      <Route path="/settings" element={<Settings/>}/>

      <Route path="/pose" element={<PoseDetection/>}/>

    </Routes>

  )

}