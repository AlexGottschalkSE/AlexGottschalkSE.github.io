import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Products from "./Products";
import Sales from "./Sales";
import Stock from "./Stock";

function App() {
  const [businessID, setBusinessID] = useState(
    localStorage.getItem("businessID")
  );

  useEffect(() => {
    const storedBusinessID = localStorage.getItem("businessID");
    if (storedBusinessID) {
      setBusinessID(storedBusinessID);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<Login setBusinessID={setBusinessID} />}
        />
        <Route
          path="/dashboard"
          element={
            businessID ? (
              <Dashboard businessID={businessID} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/"
          element={
            businessID ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/products"
          element={<Products businessID={businessID} />}
        />
        <Route path="/sales" element={<Sales businessID={businessID} />} />
        <Route path="/stock" element={<Stock businessID={businessID} />} />
      </Routes>
    </Router>
  );
}

export default App;
