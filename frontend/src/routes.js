import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Cadastro from "./pages/cadastro";
import MonkChat from "./pages/monkchat";
import AlterarConta from "./pages/alterar";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/chat" element={<MonkChat />} />
        <Route path="/alterar" element={<AlterarConta />} />
      </Routes>
    </BrowserRouter>
  );
}
