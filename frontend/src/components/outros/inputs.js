import styled from "styled-components";

const ChatButton = styled.button`
  font-family: Montserrat, sans-serif;
  font-weight: 700;
  color: #fff;
  background: rgba(97, 83, 2, 0.23);
  border: none;
  border-radius: 20px;
  padding: 0.5em 1.65em;
  margin: 0.3em;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(97, 83, 2, 0.43);
  }
`;

const ChatInput = styled.input`
  font-family: Montserrat, sans-serif;
  border: none;
  background: #ffffff;
  border-radius: 5px;
  outline: none;
  padding: 0.4em 0.5em;
  cursor: text;
  flex: 1;
`;

const ChatTextArea = styled.textarea`
  font-family: Montserrat, sans-serif;
  border: none;
  background: #ffffff;
  border-radius: 5px;
  outline: none;
  padding: 0.4em 0.5em;
  cursor: text;
  width: 100%;
  resize: none;
  font-family: inherit;
`;

const ChatButtonLogin = styled.button`
  font-weight: 700;
  font-family: Montserrat, sans-serif;

  color: #fff;
  background: #50b4bf;

  border: none;
  border-radius: 20px;

  padding: 0.5em 1.65em;
  margin: 0.3em;

  cursor: pointer;

  &:hover {
    background-color: #299ca8;
  }
`;
const ChatButtonCadastro = styled.button`
  font-weight: 700;
  font-family: Montserrat, sans-serif;
  color: #fff;
  background: #50b4bf;

  border: none;
  border-radius: 20px;

  padding: 0.5em 1.65em;
  margin: 0.3em;

  cursor: pointer;

  &:hover {
    background-color: #299ca8;
  }
`;

const ChatButtonAlterar = styled.button`
  font-weight: 700;
  font-family: Montserrat, sans-serif;
  color: #fff;
  background: #50b4bf;

  border: none;
  border-radius: 20px;

  padding: 0.5em 1.65em;
  margin: 0.3em;

  cursor: pointer;

  &:hover {
    background-color: #299ca8;
  }
`;

export {
  ChatButton,
  ChatInput,
  ChatTextArea,
  ChatButtonLogin,
  ChatButtonCadastro,
  ChatButtonAlterar,
};
