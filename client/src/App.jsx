import Login from "./components/Login.jsx" 
import SignUp from "./components/SignUp.jsx"  
import { Route, Routes } from "react-router-dom"

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/login" element={<Login/>}/>
      {/* Set a default route for the root path */}
      <Route path="/" element={<SignUp/>}/> 
    </Routes>
  )
}

export default App