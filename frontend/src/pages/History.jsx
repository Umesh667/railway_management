import { useEffect, useState } from "react";

function History() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/bookings/user/${user.id}`)
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1>My Booking History</h1>

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        bookings.map((b, i) => (
          <div key={i} style={{ border: "1px solid #ccc", padding: "10px", marginTop: "10px" }}>
            <p><b>Train:</b> {b.train_name}</p>
            <p><b>From:</b> {b.from_station}</p>
            <p><b>To:</b> {b.to_station}</p>
            <p><b>Date:</b> {b.travel_date}</p>
            <p><b>Status:</b> {b.status}</p>
            <p><b>PNR:</b> {b.pnr}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default History;