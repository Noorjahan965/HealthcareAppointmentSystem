import Login from "./components/Login.jsx"
import SignUp from "./components/SignUp.jsx"
import { Route, Routes } from "react-router-dom"
import Dashboard from "./pages/Dashboard.jsx"
import BookAppointment from "./pages/BookAppointment.jsx"
import MyAppointments from "./pages/MyAppointments.jsx"

function App() {
	return (
		<Routes>
			<Route path="/signup" element={<SignUp />} />
			<Route path="/login" element={<Login />} />

			<Route path="/dashboard" element={<Dashboard />} />
			<Route path="/book-appointment/:doctorId" element={<BookAppointment/>} />
			<Route path="/my-appointments" element={<MyAppointments/>} />


			{/* Set a default route for the root path */}
			<Route path="/" element={<SignUp />} />
		</Routes>
	)
}

export default App