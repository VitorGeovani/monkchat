import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoadingBar from "react-top-loading-bar";

import "./login.css";
import { ChatInput, ChatButtonLogin } from "../../components/outros/inputs";
import { useState, useRef } from "react";

import Api from "../../service/api";
import { useNavigate, Link } from "react-router-dom";
const api = new Api();

export default function Login() {
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();
  const loading = useRef(null);

  const logar = async () => {
    loading.current.continuousStart();

    let resp = await api.login(login, senha);
    if (resp.erro) {
      toast.error(`${resp.erro}`);
      loading.current.complete();
    } else {
      localStorage.setItem("usuario-logado", JSON.stringify(resp));
      navigate("/chat");
    }
  };

  return (
    <div className="container-login">
      <LoadingBar color="red" ref={loading} />
      <ToastContainer />
      <div className="box">
        <div className="titulo">
          <img src="/assets/images/logo-monkchat.png" alt="" />
          <br />
          MonkChat
        </div>
      </div>

      <div className="login">
        <div className="container-form">
          <div className="form-row">
            <div className="title">Faça seu Login</div>
          </div>

          <div className="form-row">
            <div>
              <div className="label">E-mail </div>
              <ChatInput
                style={{ border: "1px solid gray", fontSize: "1.5em" }}
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
            </div>
            <div>
              <div className="label">Senha </div>
              <ChatInput
                type="password"
                style={{ border: "1px solid gray", fontSize: "1.5em" }}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
            <div>
              <ChatButtonLogin onClick={logar} style={{ fontSize: "1.2em" }}>
                {" "}
                Login{" "}
              </ChatButtonLogin>
            </div>
          </div>

          <div className="registro-link">
            <div>Não possui uma conta?</div>
            <div>
              Crie uma agora clicando <Link to="/cadastro">aqui</Link>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
