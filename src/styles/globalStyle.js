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
`

export default GlobalStyle
