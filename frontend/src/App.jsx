import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Booking from "./pages/Booking";
import TrainList from "./pages/TrainList";  
import SeatSelection from "./pages/SeatSelection";
import Payment from "./pages/Payment";
import TicketSummary from "./pages/TicketSummary";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import PNRStatus from "./pages/PNRStatus";
import TrainSchedule from "./pages/TrainSchedule";
import History from "./pages/HistoryPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/trainlist" element={<TrainList />} /> 
        <Route path="/seatselection/:trainId" element={<SeatSelection />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/ticketsummary" element={<TicketSummary />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pnr" element={<PNRStatus />} />
        <Route path="/schedule" element={<TrainSchedule />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
