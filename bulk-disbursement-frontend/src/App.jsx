import { useState } from "react";
import { Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Payees from "./components/Payees";
import CreatePayee from "./components/CreatePayee";
import PayeeList from "./components/PayeeList";
import Scheme from "./components/Scheme";
import CreateScheme from "./components/CreateScheme";
import SchemeList from "./components/SchemeList";
import Disbursement from "./components/Disbursement";
import CreateDisbursement from "./components/CreateDisbursement";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  return (

    <div className="app">

      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />

      <main className="main-content">

        <Routes>

          <Route
            path="/"
            element={
              <Login setIsLoggedIn={setIsLoggedIn} />
            }
          />

          <Route
            path="/login"
            element={
              <Login setIsLoggedIn={setIsLoggedIn} />
            }
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Payee Management */}
          <Route
            path="/payees"
            element={<Payees />}
          />

        <Route
          path="/payees/create"
          element={<CreatePayee />}
        />

        <Route
          path="/payees/list"
          element={<PayeeList />}
        />
        <Route
          path="/schemes"
          element={<Scheme />}
        />

        <Route
          path="/create-scheme"
          element={<CreateScheme />}
        />

        <Route
          path="/scheme-list"
          element={<SchemeList />}
        />

        <Route
          path="/disbursements"
          element={<Disbursement />}
      />

      <Route
          path="/create-disbursement"
          element={<CreateDisbursement />}
      />
        </Routes>

      </main>

    </div>
  );
}

export default App;