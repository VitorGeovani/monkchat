import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingBar from "react-top-loading-bar";
import './conteudo.css';
import { ChatButton, ChatInput, ChatTextArea } from "../../components/outros/inputs";

import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import Api from "../../service/api";
const api = new Api();

function lerUsuarioLogado(navigate) {
  let logado = localStorage.getItem("usuario-logado");
  if (logado == null) {
    navigate("/");
    return null;
  }

  let usuarioLogado = JSON.parse(logado);
  return usuarioLogado;
}

export default function Conteudo() {
  const navigate = useNavigate();
  let usuarioLogado = lerUsuarioLogado(navigate) || {};

  const [chat, setChat] = useState([]);
  const [sala, setSala] = useState("");
  const [salaAtiva, setSalaAtiva] = useState("");
  const [usu, setUsu] = useState(usuarioLogado.nm_usuario);
  const [msg, setMsg] = useState("");
  const [para, setPara] = useState("Todos");
  const [mensagemAtual, setMensagemAtual] = useState("");
  const [usuariosSala, setUsuariosSala] = useState([]);
  
  // Novos estados para edição de mensagens
  const [editandoMensagem, setEditandoMensagem] = useState(null);

  const loading = useRef(null);
  const chatRef = useRef(null);
  const intervalRef = useRef(null);
  const inputRef = useRef(null);

  // Funções para carregar mensagens e usuários
  const carregarMensagens = useCallback(async (mostrarErro = false) => {
    if (!salaAtiva) return;

    if (loading.current) {
      loading.current.continuousStart();
    }

    try {
      const mensagens = await api.listarMensagens(salaAtiva);
      if (!mensagens.erro) {
        setChat(mensagens);
      } else if (mostrarErro) {
        // Só exibe o erro se mostrarErro for true
        toast.error(mensagens.erro);
      }
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
      if (mostrarErro) {
        toast.error("Erro ao carregar mensagens");
      }
    }

    if (loading.current) {
      loading.current.complete();
    }
  }, [salaAtiva]);

  const carregarUsuariosSala = useCallback(async (mostrarErro = false) => {
    if (!salaAtiva) return;

    try {
      const usuarios = await api.listarUsuariosSala(salaAtiva);
      if (usuarios && !usuarios.erro) {
        setUsuariosSala(usuarios);
      } else if (mostrarErro) {
        toast.error(usuarios.erro);
      }
    } catch (error) {
      console.error("Erro ao carregar usuários da sala:", error);
      if (mostrarErro) {
        toast.error("Erro ao carregar usuários da sala");
      }
    }
  }, [salaAtiva]);

  // Carregar mensagens quando a sala ativa mudar
  useEffect(() => {
    if (salaAtiva) {
      carregarMensagens(true);
      carregarUsuariosSala(true);
      
      // Configurar atualização automática
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(() => {
        carregarMensagens(false); // Não exibe erro nas atualizações automáticas
        carregarUsuariosSala(false);
      }, 5000); // Atualizar a cada 5 segundos
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [salaAtiva, carregarMensagens, carregarUsuariosSala]);

  // Scroll melhorado que vai para a última mensagem apenas quando não estiver no meio da conversa
  useEffect(() => {
    if (chatRef.current) {
      // Verifica se o usuário está próximo ao fim do scroll antes de rolar para baixo
      const scrollPosition = chatRef.current.scrollTop + chatRef.current.clientHeight;
      const isNearBottom = scrollPosition >= chatRef.current.scrollHeight - 100;
      
      if (isNearBottom) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }
  }, [chat]);

  // Foco no input quando iniciar edição
  useEffect(() => {
    if (editandoMensagem && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editandoMensagem]);

  const validarResposta = (resp) => {
    if (!resp.erro) return true;
    toast.error(`${resp.erro}`);
    return false;
  };

  // Função para formatar a data/hora
  const formatarDataHora = (dataString) => {
    try {
      const data = new Date(dataString.replace("Z", ""));
      const hora = data.getHours().toString().padStart(2, "0");
      const minuto = data.getMinutes().toString().padStart(2, "0");
      const segundo = data.getSeconds().toString().padStart(2, "0");
      return `(${hora}:${minuto}:${segundo})`;
    } catch (error) {
      return "(00:00:00)";
    }
  };

  // Função para determinar se a mensagem deve ser exibida
  const mensagemVisivel = (mensagem) => {
    if (!mensagem) return false;
    
    const userId = usuarioLogado.id_usuario || usuarioLogado.ID_USUARIO;
    
    // Se é mensagem de entrada na sala, sempre mostrar
    if (mensagem.tp_mensagem === 'entrada') return true;
    
    // Se é para todos, mostrar
    if (!mensagem.id_usuario_para) return true;
    
    // Se é para o usuário logado, mostrar
    if (String(mensagem.id_usuario_para) === String(userId)) return true;
    
    // Se foi enviada pelo usuário logado, mostrar
    if (String(mensagem.id_usuario_envio) === String(userId)) return true;
    
    // Nos outros casos, não mostrar
    return false;
  };

  // Nova função para iniciar a edição de uma mensagem
  const iniciarEdicao = (mensagem) => {
    // Verifica se o usuário pode editar esta mensagem (apenas mensagens enviadas pelo próprio usuário)
    const userId = usuarioLogado.id_usuario || usuarioLogado.ID_USUARIO;
    if (mensagem.id_usuario_envio !== userId) {
      toast.warning("Você só pode editar suas próprias mensagens");
      return;
    }
    
    // Verificar se não é mensagem de entrada
    if (mensagem.tp_mensagem === 'entrada') {
      toast.warning("Não é possível editar mensagens de entrada");
      return;
    }
    
    // Configurar estados para edição
    setEditandoMensagem(mensagem);
    setMensagemAtual(mensagem.ds_mensagem);
    
    // Rolar para o final da tela para mostrar o input de edição
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 100);
  };

  // Nova função para cancelar a edição
  const cancelarEdicao = () => {
    setEditandoMensagem(null);
    setMensagemAtual("");
  };

  // Nova função para salvar a mensagem editada
  const salvarEdicao = async () => {
    if (!mensagemAtual.trim()) {
      toast.error("A mensagem não pode ser vazia");
      return;
    }
    
    try {
      // Chamar API para atualizar a mensagem
      const resp = await api.atualizarMensagem(
        editandoMensagem.id_chat, 
        mensagemAtual
      );
      
      if (!validarResposta(resp)) return;
      
      // Atualizar o chat localmente para refletir a alteração
      const novoChat = chat.map(msg => 
        msg.id_chat === editandoMensagem.id_chat
          ? { ...msg, ds_mensagem: mensagemAtual }
          : msg
      );
      
      setChat(novoChat);
      toast.success("Mensagem atualizada com sucesso!");
      cancelarEdicao();
    } catch (error) {
      console.error("Erro ao atualizar mensagem:", error);
      toast.error("Erro ao atualizar mensagem");
    }
  };

  const enviarMensagem = async () => {
    if (!salaAtiva) {
      toast.error("Selecione uma sala para enviar a mensagem");
      return;
    }

    if (!msg) {
      toast.error("Digite uma mensagem para enviar");
      return;
    }

    let destinatarioId = null;
    let destinatarioNome = null;

    if (para === "Somente eu") {
      destinatarioId = usuarioLogado.id_usuario || usuarioLogado.ID_USUARIO;
      destinatarioNome = "Somente eu";
    } else if (para !== "Todos") {
      // Se não é "Todos" nem "Somente eu", então é um usuário específico
      const usuario = usuariosSala.find((u) => u.NM_USUARIO === para);
      if (usuario) {
        destinatarioId = usuario.ID_USUARIO;
        destinatarioNome = usuario.NM_USUARIO;
      }
    }

    try {
      const resp = await api.inserirMensagem(salaAtiva, usu, msg, destinatarioId, destinatarioNome);
      if (!validarResposta(resp)) return;
      
      setMsg("");
      await carregarMensagens(true);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Erro ao enviar mensagem");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (editandoMensagem) {
        salvarEdicao();
      } else {
        enviarMensagem();
      }
    }
  };

  const inserirUsuario = async () => {
    if (!usu) {
      toast.error("Digite um nome de usuário");
      return;
    }

    if (!sala) {
      toast.error("Digite o nome da sala para entrar");
      return;
    }

    // Atualizar a sala ativa quando o usuário clicar em "Entrar"
    setSalaAtiva(sala);

    // Verificar se o usuário já está logado
    const usuarioLogadoStr = localStorage.getItem("usuario-logado");

    if (usuarioLogadoStr) {
      // Se o usuário já está logado, apenas atualizar o nick e entrar na sala
      const usuarioLogado = JSON.parse(usuarioLogadoStr);

      // Atualizar o nick no backend se o ID do usuário estiver disponível
      if (usuarioLogado.id_usuario || usuarioLogado.ID_USUARIO) {
        const resp = await api.atualizarUsuario({
          id: usuarioLogado.id_usuario || usuarioLogado.ID_USUARIO,
          nome: usu,
        });

        if (resp.erro) {
          toast.error(resp.erro);
          return;
        }
      }

      // Atualizar no localStorage
      usuarioLogado.nm_usuario = usu;
      localStorage.setItem("usuario-logado", JSON.stringify(usuarioLogado));

      // Adicionar usuário à sala e enviar mensagem de entrada
      try {
        await api.adicionarParticipante(sala, usuarioLogado.id_usuario || usuarioLogado.ID_USUARIO);
        
        // Enviar mensagem de entrada
        await api.registrarEntradaSala(sala, usu);
        
        await carregarMensagens(true);
        await carregarUsuariosSala(true);
        
        toast.success("Usuário entrou na sala!");
      } catch (error) {
        console.error("Erro ao entrar na sala:", error);
        toast.error("Erro ao entrar na sala");
      }

      return;
    }

    // Caso contrário, criar um novo usuário com email único
    const timestamp = new Date().getTime();
    const uniqueEmail = `${usu}_${timestamp}@email.com`;

    try {
      const resp = await api.inserirUsuario({
        nome: usu,
        login: uniqueEmail,
        senha: "123456",
      });

      if (!validarResposta(resp)) return;

      // Se o registro foi bem-sucedido, fazer login com o novo usuário
      const loginResp = await api.login(uniqueEmail, "123456");
      if (loginResp.erro) {
        toast.error(loginResp.erro);
        return;
      }

      // Adicionar o novo usuário à sala e enviar mensagem de entrada
      await api.adicionarParticipante(
        sala, 
        loginResp.id_usuario || loginResp.ID_USUARIO
      );
      
      // Enviar mensagem de entrada
      await api.registrarEntradaSala(sala, usu);
      
      await carregarMensagens(true);
      await carregarUsuariosSala(true);

      toast.success("Usuário cadastrado e entrou na sala!");
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      toast.error("Erro ao criar usuário");
    }
  };

  const inserirSala = async () => {
    if (!sala) {
      toast.error("Digite o nome da sala para criar");
      return;
    }

    if (loading.current) {
      loading.current.continuousStart();
    }

    try {
      const resp = await api.inserirSala(sala);

      if (!validarResposta(resp)) {
        if (loading.current) {
          loading.current.complete();
        }
        return;
      }

      // Atualizar a sala ativa quando a sala for criada com sucesso
      setSalaAtiva(sala);
      
      toast.success("Sala cadastrada com sucesso!");
      await carregarMensagens(true);
      await carregarUsuariosSala(true);
    } catch (error) {
      console.error("Erro ao criar sala:", error);
      toast.error("Erro ao criar sala");
    }

    if (loading.current) {
      loading.current.complete();
    }
  };

  const handleInputChange = (e) => {
    setMensagemAtual(e.target.value);
  };

  const renderizarMensagem = (x) => {
    if (!x) return null;
    
    const userId = usuarioLogado.id_usuario || usuarioLogado.ID_USUARIO;
    const isUsuarioAtual = x.id_usuario_envio === userId;
    
    if (x.tp_mensagem === 'entrada') {
      return (
        <div className="chat-message" key={x.id_chat}>
          <div className="message-header" style={{display: 'flex', justifyContent: 'start'}}>
            <span>{formatarDataHora(x.dt_mensagem)} </span>
            <span style={{marginLeft: '0.5em'}}>
              <strong style={{color: "#fff"}}> {x.tb_usuario?.nm_usuario || "Usuário"}</strong>
              <span style={{color: "#999"}}> entrou na sala...</span>
            </span>
          </div>
        </div>
      );
    } else {
      let destinatario;
      
      if (!x.id_usuario_para) {
        destinatario = "Todos";
      } else if (x.nm_usuario_para === "Somente eu") {
        destinatario = "Somente eu";
      } else {
        destinatario = x.nm_usuario_para || "Usuário";
      }
      
      return (
        <div 
          className={`chat-message ${isUsuarioAtual ? 'minha-mensagem' : ''} ${editandoMensagem && editandoMensagem.id_chat === x.id_chat ? 'editando' : ''}`} 
          key={x.id_chat}
          onClick={() => isUsuarioAtual && iniciarEdicao(x)}
        >
          <div className="message-header">
            <span>
              {formatarDataHora(x.dt_mensagem)} <strong style={{color: "#fff"}}>{x.tb_usuario?.nm_usuario || "Usuário"}</strong> fala para <strong style={{color: "#fff"}}>{destinatario}</strong>:
            </span>
            
            {isUsuarioAtual && (
              <span className="message-actions">
                <i className="edit-icon">✏️</i>
              </span>
            )}
          </div>
          <div className="message-content">{x.ds_mensagem}</div>
          
          {/* Input de edição inline */}
          {editandoMensagem && editandoMensagem.id_chat === x.id_chat && (
            <div className="edit-inline">
              <input
                type="text"
                ref={inputRef}
                value={mensagemAtual}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="edit-input"
                placeholder="Edite sua mensagem..."
              />
              <div className="edit-actions">
                <button onClick={salvarEdicao} className="save-btn" title="Salvar">✓</button>
                <button onClick={cancelarEdicao} className="cancel-btn" title="Cancelar">×</button>
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="container-conteudo">
      <ToastContainer />
      <LoadingBar color="#E9A227" ref={loading} />

      <div className="container-form">
        <div className="box-sala">
          <div>
            <div className="label">Sala:</div>
            <ChatInput value={sala} onChange={(e) => setSala(e.target.value)} />
          </div>
          <div>
            <div className="label">Nick:</div>
            <ChatInput value={usu} onChange={(e) => setUsu(e.target.value)} />
          </div>
          <div>
            <div className="label">Para:</div>
            <select
              value={para}
              onChange={(e) => setPara(e.target.value)}
              style={{
                flex: 1,
                padding: "0.4em",
                borderRadius: "5px",
                border: "none",
              }}
            >
              <option value="Todos">Todos</option>
              <option value="Somente eu">Somente eu</option>
              {usuariosSala
                .filter(u => u && u.NM_USUARIO && u.NM_USUARIO !== usu && u.NM_USUARIO !== usuarioLogado.nm_usuario)
                .map((u) => (
                  <option key={u.ID_USUARIO} value={u.NM_USUARIO}>
                    {u.NM_USUARIO}
                  </option>
                ))}
            </select>
          </div>
          <div className="buttons-area">
            <ChatButton onClick={inserirSala}>Criar</ChatButton>
            <ChatButton onClick={inserirUsuario}>Entrar</ChatButton>
          </div>
        </div>

        <div className="box-mensagem">
          <div className="label">Mensagem:</div>
          <ChatTextArea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <ChatButton onClick={enviarMensagem} className="btn-enviar">
            Enviar
          </ChatButton>
        </div>
      </div>

      <div className="container-chat">
        <div className="chat-header">
          <img
            onClick={() => carregarMensagens(true)}
            className="chat-atualizar"
            src="/assets/images/atualizar.png" 
            alt="Atualizar"
          />
        </div>

        <div className="chat" ref={chatRef}>
          {Array.isArray(chat) && chat.filter(mensagemVisivel).map(renderizarMensagem)}
        </div>

        {/* A área de input-chat foi removida daqui e adicionada diretamente nas mensagens */}
      </div>
    </div>
  );
}