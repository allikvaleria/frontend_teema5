import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import LogoutButton from "../components/Logout";

export default function ClientPage() {
  const { token } = useContext(AuthContext);

  const [workers, setWorkers] = useState([]);
  const [services, setServices] = useState([]);
  const [booking, setBooking] = useState({
    Klient_nimi: "",
    Telefoninumber: "",
    TootajaId: "",
    ServiceId: "",
    StartTime: "",
    Staatus: false
  });

  useEffect(() => {
    fetchWorkers();
    fetchServices();
  }, [token]);

  const fetchWorkers = async () => {
    try {
      const res = await fetch("https://localhost:7284/api/klient/tootajad", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const formatted = data.map(w => ({
        ...w,
        services: w.tootajaServices?.map(ts => ts.service?.teenuse_nimetus) || []
      }));

      setWorkers(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch("https://localhost:7284/api/klient/services", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://localhost:7284/api/klient/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(booking)
      });

      if (!res.ok) {
        const errMsg = await res.text();
        return alert("Broneering ei õnnestunud: " + errMsg);
      }

      alert("Broneering on edukalt loodud!");
      setBooking({ Klient_nimi: "", Telefoninumber: "", TootajaId: "", ServiceId: "", StartTime: "", Staatus: false });
    } catch (err) {
      console.error(err);
    }
  };

  const container = { padding: "30px", fontFamily: "Inter, sans-serif", background: "#f0f2ff", minHeight: "100vh" };
  const section = { background: "white", padding: "25px", borderRadius: "14px", boxShadow: "0 6px 20px rgba(80, 70, 180, 0.15)", marginBottom: "35px", border: "1px solid #ececff" };
  const heading = { marginBottom: "20px", fontSize: "22px", fontWeight: "600", color: "#4134A1" };
  const input = { padding: "12px", margin: "8px 0", borderRadius: "8px", border: "1px solid #c8c4ff", width: "100%", background: "#f5f4ff" };
  const btn = { padding: "12px 18px", background: "#5A4CF3", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", marginTop: "12px", fontWeight: "600", transition: "0.2s" };
  const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop: "10px" };
  const thStyle = { padding: "12px", background: "#5A4CF3", color: "white", textAlign: "left", borderRadius: "6px" };
  const thTd = { padding: "10px", borderBottom: "1px solid #ddd", background: "white" };
  const imgStyle = { width: "55px", height: "55px", borderRadius: "50%", objectFit: "cover", border: "2px solid #ddd" };

  return (
    <div style={container}>
      <LogoutButton />

      <div style={section}>
        <h2 style={heading}>Teenused</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Foto</th>
              <th style={thStyle}>Nimi</th>
              <th style={thStyle}>Kirjeldus</th>
              <th style={thStyle}>Kestus (min)</th>
              <th style={thStyle}>Hind (€)</th>
            </tr>
          </thead>
          <tbody>
            {services.map(s => (
              <tr key={s.id}>
                <td>{s.imageUrl ? <img src={s.imageUrl} alt={s.teenuse_nimetus} style={imgStyle} /> : "—"}</td>
                <td style={thTd}>{s.teenuse_nimetus}</td>
                <td style={thTd}>{s.kirjeldus}</td>
                <td style={thTd}>{s.kestus}</td>
                <td style={thTd}>{s.hind}€</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={section}>
        <h2 style={heading}>Töötajad</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Foto</th>
              <th style={thStyle}>Nimi</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Telefon</th>
              <th style={thStyle}>Teenused</th>
            </tr>
          </thead>
          <tbody>
            {workers.map(w => (
              <tr key={w.id}>
                <td>{w.profileImageUrl ? <img src={w.profileImageUrl} alt={w.nimi} style={imgStyle} /> : "—"}</td>
                <td style={thTd}>{w.nimi}</td>
                <td style={thTd}>{w.email}</td>
                <td style={thTd}>{w.telefoninumber}</td>
                <td style={thTd}>{w.services.length ? w.services.join(", ") : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      <div style={section}>
        <h2 style={heading}>Loo broneering</h2>
        <form onSubmit={handleBookingSubmit}>
          <input placeholder="Sinu nimi" value={booking.Klient_nimi} onChange={e => setBooking({ ...booking, Klient_nimi: e.target.value })} style={input} />
          <input placeholder="Telefoninumber" value={booking.Telefoninumber} onChange={e => setBooking({ ...booking, Telefoninumber: e.target.value })} style={input} />

          <select value={booking.TootajaId} onChange={e => setBooking({ ...booking, TootajaId: e.target.value })} style={input}>
            <option value="">Vali töötaja</option>
            {workers.map(w => <option key={w.id} value={w.id}>{w.nimi}</option>)}
          </select>

          <select value={booking.ServiceId} onChange={e => setBooking({ ...booking, ServiceId: e.target.value })} style={input}>
            <option value="">Vali teenus</option>
            {/* Здесь выводим все услуги, можно потом фильтровать по выбранному работнику */}
            {services.map(s => <option key={s.id} value={s.id}>{s.teenuse_nimetus}</option>)}
          </select>

          <input type="datetime-local" value={booking.StartTime} onChange={e => setBooking({ ...booking, StartTime: e.target.value })} style={input} />

          <button type="submit" style={btn}>Broneeri</button>
        </form>
      </div>
    </div>
  );
}
