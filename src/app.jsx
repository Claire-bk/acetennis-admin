import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from './components/header';
import { Dashboard } from './components/dashboard';
import { LoginForm } from './components/loginForm';
import { Members } from './components/members';
import { Results } from './components/results';
import { Manage } from './components/manage';
import { ManageView } from './components/manageView';
import { Create } from './components/create';
import { MemberDelete } from './components/memberDelete';
import { MemberEdit } from './components/memberEdit';
import { ResultView } from './components/resultView';
import { ResultDelete } from './components/resultDelete';
import { ResultEdit } from './components/resultEdit';
import { ManageGame } from './components/manageGame';
import { Matchtable } from './components/matchtable';
import { MyUserForm } from './components/myUserForm';
const baseURL = 'https://acetennis.herokuapp.com';

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
            <Route path="/manage_view" element={<ManageView />} />
            <Route path="/create" element={<Create />} />
            <Route path="/member_delete" element={<MemberDelete/>} />
            <Route path="/member_edit" element={<MemberEdit/>} />
            <Route path="/result_view" element={<ResultView />} />
            <Route path="/result_delete" element={<ResultDelete />} />
            <Route path="/result_edit" element={<ResultEdit />} />
            <Route path="/manage_game" element={<ManageGame />} />
            <Route path="/matchtable" element={<Matchtable />} />
            <Route path="/signup" element={<MyUserForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
