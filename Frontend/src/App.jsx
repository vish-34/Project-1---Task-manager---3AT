import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./Page/Dashboard";
import DateSelector from "./Page/DateSelector";
import Login from "./Page/Login";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/date-selector"
        element={
          <PrivateRoute>
            <DateSelector />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
