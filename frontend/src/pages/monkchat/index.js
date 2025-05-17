import "./monkchat.css";
import Cabecalho from "../../components/cabecalho";
import Conteudo from "./conteudo";

export default function Monkchat() {
  return (
    <div className="container-monkchat">
      <Cabecalho />
      <Conteudo />
    </div>
  );
}
