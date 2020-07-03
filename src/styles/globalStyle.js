import { createGlobalStyle } from "styled-components"
import { above, below } from "../utils/breakpoint.js"

const GlobalStyle = createGlobalStyle`
  body {
    padding: 0;
    margin: 0;
    ${above.med`
      position: fixed;
    `};
    
    ${below.med`
      max-width: 100vw;
    `};
  }

  p {
    font-size: 1.4rem;
    margin-bottom: 0;
  }

  h1 {
    font-size: 4rem;
  }

  h2 {
    font-size: 3rem;
  }

  h3 {
    font-size: 2.2rem;
  }

  h4 {
    font-size: 1.7rem;
  }
`

export default GlobalStyle
