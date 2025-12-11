import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import LogoutButton from "../components/Logout";

export default function AdminPage() {
  const { token } = useContext(AuthContext);

  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [workers, setWorkers] = useState([]);

  const [newService, setNewService] = useState({
    teenuse_nimetus: "",
    kirjeldus: "",
    kestus: 0,
    hind: 0,
    imageUrl: ""
  });

  useEffect(() => {
    fetchData("broneeringud", setBookings);
    fetchData("services", setServices);
    fetchData("tootajad", setWorkers);
  }, [token]);

  const fetchData = async (endpoint, setter) => {
    try {
      const res = await fetch(`https://localhost:7284/api/admin/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (endpoint === "tootajad") {
        // Фильтруем только работников, убираем админов
        setter(data.filter(u => u.role === "Worker"));
      } else {
        setter(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://localhost:7284/api/admin/service", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newService)
      });
      if (!res.ok) return alert("Teenuse lisamine ebaõnnestus");

      alert("Teenuse lisamine õnnestus!");
      setNewService({ teenuse_nimetus: "", kirjeldus: "", kestus: 0, hind: 0, imageUrl: "" });
      fetchData("services", setServices);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Kas oled kindel?")) return;
    try {
      const res = await fetch(`https://localhost:7284/api/admin/broneeringud/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return alert("Kustutamine ebaõnnestus");

      setBookings(bookings.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // 🎨 Стиль
  const container = {
    padding: "30px",
    fontFamily: "Inter, sans-serif",
    background: "#f0f2ff",
    minHeight: "100vh"
  };

  const section = {
    background: "white",
    padding: "25px",
    borderRadius: "14px",
    boxShadow: "0 6px 20px rgba(80, 70, 180, 0.15)",
    marginBottom: "35px",
    border: "1px solid #ececff"
  };

  const heading = {
    marginBottom: "20px",
    fontSize: "22px",
    fontWeight: "600",
    color: "#4134A1"
  };

  const input = {
    padding: "12px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "1px solid #c8c4ff",
    width: "100%",
    background: "#f5f4ff"
  };

  const btn = {
    padding: "12px 18px",
    background: "#5A4CF3",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "12px",
    fontWeight: "600",
    transition: "0.2s"
  };

  const deleteBtn = {
    ...btn,
    background: "#E63946"
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px"
  };

  const thStyle = {
    padding: "12px",
    background: "#5A4CF3",
    color: "white",
    textAlign: "left",
    borderRadius: "6px"
  };

  const thTd = {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    background: "white"
  };

  const imgStyle = {
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #ddd"
  };

  return (
    <div style={container}>
      <LogoutButton />

      {/* Töötajad */}
      <div style={section}>
        <h2 style={heading}>Töötajad</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Foto</th>
              <th style={thStyle}>Nimi</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Telefon</th>
            </tr>
          </thead>
          <tbody>
            {workers.map(w => (
              <tr key={w.id}>
                <td>{w.profileImageUrl ? <img src={w.profileImageUrl} alt={w.nimi} style={imgStyle} /> : "—"}</td>
                <td style={thTd}>{w.nimi}</td>
                <td style={thTd}>{w.email}</td>
                <td style={thTd}>{w.telefoninumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Teenuse lisamine */}
      <div style={section}>
        <h2 style={heading}>Lisa teenus</h2>
        <form onSubmit={handleAddService}>
          <input placeholder="Teenuse nimi" value={newService.teenuse_nimetus} onChange={e => setNewService({ ...newService, teenuse_nimetus: e.target.value })} style={input} />
          <input placeholder="Kirjeldus" value={newService.kirjeldus} onChange={e => setNewService({ ...newService, kirjeldus: e.target.value })} style={input} />
          <input placeholder="Kestus (min)" type="number" value={newService.kestus} onChange={e => setNewService({ ...newService, kestus: e.target.value })} style={input} />
          <input placeholder="Hind (€)" type="number" value={newService.hind} onChange={e => setNewService({ ...newService, hind: e.target.value })} style={input} />
          <input placeholder="Image URL" value={newService.imageUrl} onChange={e => setNewService({ ...newService, imageUrl: e.target.value })} style={input} />
          <button type="submit" style={btn}>Lisa teenus</button>
        </form>
      </div>

      {/* Teenused */}
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

      {/* Broneeringud */}
      <div style={section}>
        <h2 style={heading}>Broneeringud</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Klient</th>
              <th style={thStyle}>Telefon</th>
              <th style={thStyle}>Töötaja</th>
              <th style={thStyle}>Teenuse nimetus</th>
              <th style={thStyle}>Aeg</th>
              <th style={thStyle}>Makstud</th>
              <th style={thStyle}>Tegevus</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td style={thTd}>{b.klient_nimi}</td>
                <td style={thTd}>{b.telefoninumber}</td>
                <td style={thTd}>{b.tootaja_nimi}</td>
                <td style={thTd}>{b.teenuse_nimetus}</td>
                <td style={thTd}>{new Date(b.startTime).toLocaleString()}</td>
                <td style={thTd}>{b.staatus ? "Jah" : "Ei"}</td> {/* Корректное отображение */}
                <td style={thTd}>
                  <button style={deleteBtn} onClick={() => handleDeleteBooking(b.id)}>Kustuta</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
