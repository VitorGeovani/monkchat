import './cabecalho.css';
import { useNavigate } from 'react-router-dom';

export default function Cabecalho() {
    const navigate = useNavigate();

    const logoff = () => {
        localStorage.removeItem('usuario-logado');
        navigate('/');
    }

    const irParaMinhaConta = () => {
        navigate('/alterar');
    }

    return (
        <div className="container-cabecalho">
            <div className="logo-area">
                <img src="/assets/images/logo-monkchat.png" alt="" />
                <div className="barra" />
                <div className="titulo"> MonkChat </div>
            </div>
            <div className="menu-area">
                <div className="menu-item" onClick={irParaMinhaConta}>Minha Conta</div>
                <div className="menu-item" onClick={logoff}>Sair</div>
            </div>
        </div>
    )
}