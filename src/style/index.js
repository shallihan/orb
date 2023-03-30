import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: Open-Sans, Helvetica, Sans-Serif;
    background: linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(4,14,27,1) 25%, rgba(4,14,27,1) 50%, rgba(4,14,27,1) 75%, rgba(0,0,0,1) 100%);
  }
  canvas {
    height: 100vh;
    width: 100vw;
  }
`;

export default GlobalStyle;
