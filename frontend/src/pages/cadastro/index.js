import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoadingBar from "react-top-loading-bar";

import "./cadastro.css";
import { ChatButtonCadastro, ChatInput } from "../../components/outros/inputs";
import { useState, useRef } from "react";

import Api from "../../service/api";
import { useNavigate, Link } from "react-router-dom";
const api = new Api();

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();
  const loading = useRef(null);

  const cadastrar = async () => {
    if (loading.current) {
      loading.current.continuousStart();
    }

    if (!nome || !email || !senha) {
      toast.error("Todos os campos são obrigatórios");
      if (loading.current) {
        loading.current.complete();
      }
      return;
    }

    try {
      const resp = await api.inserirUsuario({
        nome: nome,
        login: email,
        senha: senha,
      });

      if (resp.erro) {
        toast.error(resp.erro);
      } else {
        toast.success("Cadastro realizado com sucesso!");
        navigate("/");
      }
    } catch (e) {
      toast.error("Ocorreu um erro ao cadastrar");
    }

    if (loading.current) {
      loading.current.complete();
    }
  };

  return (
    <div className="container-cadastro">
      <LoadingBar color="red" ref={loading} />
      <ToastContainer />
      <div className="box">
        <div className="titulo">
          <img src="/assets/images/logo-monkchat.png" alt="" />
          <br />
          MonkChat
        </div>
      </div>

      <div className="cadastro">
        <div className="container-form">
          <div className="form-row">
            <div className="title">Crie sua conta</div>
          </div>

          <div className="form-row">
            <div>
              <div className="label">Nick </div>
              <ChatInput
                style={{ border: "1px solid gray", fontSize: "1.5em" }}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div>
              <div className="label">E-mail </div>
              <ChatInput
                style={{ border: "1px solid gray", fontSize: "1.5em" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              <ChatButtonCadastro
                onClick={cadastrar}
                style={{ fontSize: "1.2em" }}
              >
                {" "}
                Criar{" "}
              </ChatButtonCadastro>
            </div>
          </div>

          <div className="login-link">
            <div>Já possui uma conta?</div>
            <div>
              Faça seu login clicando <Link to="/">aqui</Link>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
