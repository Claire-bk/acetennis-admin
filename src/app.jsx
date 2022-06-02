import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from './components/header';
import { Dashboard } from './components/dashboard';
import { LoginForm } from './components/loginForm';
import { Members } from './components/members';
import { Results } from './components/results';
import { Manage } from './components/manage';
import { Create } from './components/create';
import { ViewMember } from './components/viewMember';
import { ViewResult } from './components/viewResult';
import { ManageGame } from './components/manageGame';
import { Matchtable } from './components/matchtable';

export function App() {
  return (
    <div className="App">
      {/* <Header /> */}
      <BrowserRouter>
        <Header />
        <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/members" element={<Members />} />
            <Route path="/results" element={<Results />} />
            <Route path="/manage" element={<Manage />} />
            <Route path="/create" element={<Create />} />
            <Route path="/view_member" element={<ViewMember />} />
            <Route path="/viewResult" element={<ViewResult />} />
            <Route path="/manage_game" element={<ManageGame />} />
            <Route path="/matchtable" element={<Matchtable />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}