import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoadingBar from "react-top-loading-bar";

import "./alterar.css";
import { ChatButtonAlterar, ChatInput } from "../../components/outros/inputs";
import { useState, useRef, useEffect } from "react";

import Api from "../../service/api";
import { useNavigate } from "react-router-dom";

const api = new Api();

export default function AlterarConta() {
  const [nick, setNick] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [usuario, setUsuario] = useState({});
  const [showResetModal, setShowResetModal] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const navigate = useNavigate();
  const loading = useRef(null);

  // Função para voltar ao chat
  const voltarAoChat = () => {
    navigate("/chat");
  };

  useEffect(() => {
    // Carregar informações do usuário logado
    const usuarioLogadoStr = localStorage.getItem("usuario-logado");

    if (!usuarioLogadoStr) {
      toast.error("Você precisa estar logado para acessar esta página");
      navigate("/");
      return;
    }

    const usuarioLogado = JSON.parse(usuarioLogadoStr);
    setUsuario(usuarioLogado);
    setEmail(usuarioLogado.ds_email || usuarioLogado.DS_EMAIL || "");
    setNick(usuarioLogado.nm_usuario || usuarioLogado.NM_USUARIO || "");
    setSenha("resetar"); // Valor placeholder para a senha
  }, [navigate]);

  const alterarConta = async () => {
    if (loading.current) {
      loading.current.continuousStart();
    }

    if (!nick) {
      toast.error("O campo Nick é obrigatório");
      if (loading.current) {
        loading.current.complete();
      }
      return;
    }

    try {
      const resp = await api.atualizarUsuario({
        id: usuario.id_usuario || usuario.ID_USUARIO,
        nome: nick,
      });

      if (resp.erro) {
        toast.error(resp.erro);
      } else {
        // Atualiza as informações do usuário no localStorage
        const usuarioAtualizado = {
          ...usuario,
          nm_usuario: nick,
          NM_USUARIO: nick,
        };

        localStorage.setItem(
          "usuario-logado",
          JSON.stringify(usuarioAtualizado)
        );
        toast.success("Conta atualizada com sucesso!");

        // Navega para o chat após atualização
        setTimeout(() => {
          navigate("/chat");
        }, 2000);
      }
    } catch (e) {
      console.error("Erro ao atualizar conta:", e);
      toast.error("Ocorreu um erro ao atualizar a conta");
    }

    if (loading.current) {
      loading.current.complete();
    }
  };

  // função para abrir o modal de redefinição de senha
  const abrirModalResetSenha = () => {
    setShowResetModal(true);
  };

  // função para fechar o modal de redefinição de senha
  const fecharModalResetSenha = () => {
    setShowResetModal(false);
    // Limpar campos
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
  };

  // função para processar a redefinição de senha
  const processarResetSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      toast.error("Todos os campos são obrigatórios");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (novaSenha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (loading.current) {
      loading.current.continuousStart();
    }

    try {
      console.log("Enviando solicitação de redefinição de senha:", {
        id: usuario.id_usuario || usuario.ID_USUARIO,
        senhaAtual,
        novaSenha,
      });

      const resp = await api.redefinirSenha({
        id: usuario.id_usuario || usuario.ID_USUARIO,
        senhaAtual: senhaAtual,
        novaSenha: novaSenha,
      });

      if (resp.erro) {
        toast.error(resp.erro);
      } else {
        // Atualiza as informações do usuário no localStorage
        // Não salva a senha no localStorage por segurança
        toast.success("Senha atualizada com sucesso!");
        fecharModalResetSenha();

        // Aviso que o usuário precisará usar a nova senha no próximo login
        setTimeout(() => {
          toast.info(
            "Você precisará usar sua nova senha ao fazer login novamente"
          );
        }, 1000);

        // Opcionalmente, fazer logout e redirecionar para a página de login
        setTimeout(() => {
          localStorage.removeItem("usuario-logado");
          navigate("/");
        }, 3000);
      }
    } catch (e) {
      console.error("Erro ao redefinir senha:", e);
      toast.error("Ocorreu um erro ao redefinir a senha");
    }

    if (loading.current) {
      loading.current.complete();
    }
  };

  return (
    <div className="container-alterar">
      <LoadingBar color="red" ref={loading} />
      <ToastContainer />
      <div className="box">
        <div className="titulo">
          <img src="/assets/images/logo-monkchat.png" alt="" />
          <br />
          MonkChat
        </div>
      </div>

      <div className="alterar">
        <div className="container-form">
          <div className="form-row">
            <div className="title">Alterar conta</div>
          </div>

          <div className="form-row">
            <div>
              <div className="label">E-mail</div>
              <div className="value">{email}</div>
            </div>
            <div>
              <div className="label">Senha</div>
              <div className="value">
                <span className="reset-password" onClick={abrirModalResetSenha}>
                  {senha}
                </span>
              </div>
            </div>
            <div>
              <div className="label">Nick</div>
              <ChatInput
                style={{ border: "1px solid gray", fontSize: "1.2em" }}
                value={nick}
                onChange={(e) => setNick(e.target.value)}
              />
            </div>
            <div
              className="button-container"
              style={{ display: "flex", gap: "10px" }}
            >
              <ChatButtonAlterar
                onClick={alterarConta}
                style={{ fontSize: "1.2em" }}
              >
                {" "}
                Alterar{" "}
              </ChatButtonAlterar>
              <ChatButtonAlterar
                onClick={voltarAoChat}
                style={{ fontSize: "1.2em", backgroundColor: "#666" }}
              >
                {" "}
                Voltar{" "}
              </ChatButtonAlterar>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de redefinição de senha */}
      {showResetModal && (
        <div className="reset-password-modal">
          <div className="reset-password-content">
            <div className="reset-password-header">
              <h2>Redefinir Senha</h2>
              <button
                className="reset-password-close"
                onClick={fecharModalResetSenha}
              >
                ×
              </button>
            </div>
            <div className="reset-password-body">
              <div className="password-input-group">
                <label>Senha Atual:</label>
                <ChatInput
                  type="password"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  style={{ width: "100%", border: "1px solid #ddd" }}
                />
              </div>
              <div className="password-input-group">
                <label>Nova Senha:</label>
                <ChatInput
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  style={{ width: "100%", border: "1px solid #ddd" }}
                />
              </div>
              <div className="password-input-group">
                <label>Confirmar Nova Senha:</label>
                <ChatInput
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  style={{ width: "100%", border: "1px solid #ddd" }}
                />
              </div>
            </div>
            <div className="reset-password-footer">
              <ChatButtonAlterar
                onClick={fecharModalResetSenha}
                style={{ fontSize: "1em", backgroundColor: "#666" }}
              >
                Cancelar
              </ChatButtonAlterar>
              <ChatButtonAlterar
                onClick={processarResetSenha}
                style={{ fontSize: "1em" }}
              >
                Redefinir
              </ChatButtonAlterar>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
