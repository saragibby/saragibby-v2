import { createGlobalStyle } from "styled-components"
import { above, below } from "../utils/breakpoint.js"
import colors from "../utils/colors.js"

const GlobalStyle = createGlobalStyle`
  html {
    font-size: 62.5%;
  }

  body {
    padding: 0;
    margin: 0;
    font-size: 1.6rem;
    font-family: "Raleway", sans-serif;
  }

  p {
    font-size: 1.4rem;
    margin-bottom: 0;
  }

  h1, h2, h3 {
    font-family: "Playfair Display", Serif;
    color: ${colors.purple}
  }

  h1 {
    font-size: 4rem;
    margin-bottom: 0;
  }

  h2 {
    font-size: 2.5rem;
    font-weight: 400;
    margin-top: 1rem;
  }

  h3 {
    font-size: 2.2rem;
  }

  h4 {
    font-size: 1.7rem;
  }
`

export default GlobalStyle
