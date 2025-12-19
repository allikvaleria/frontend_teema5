import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import LoginPage from "./components/Login";
import KlientPage from "./pages/KlientPage";
import AdminPage from "./pages/AdminPage";

const PrivateRoute = ({ children, role }) => {
  const { token, role: userRole } = React.useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (role && role.toLowerCase() !== userRole?.toLowerCase()) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/klient"
            element={
              <PrivateRoute role="User">
                <KlientPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute role="Admin">
                <AdminPage />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
