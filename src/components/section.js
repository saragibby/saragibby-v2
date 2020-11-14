import React from "react"
import styled from "styled-components"
import Background from "./background"
import colors from "../utils/colors.js"

const Container = styled.div`
  position: relative;
  height: ${({ fullSize }) => (fullSize ? "100vh" : "auto")};
  width: ${({ fullSize }) => (fullSize ? "100vw" : "auto")};
  overflow: ${({ fullSize }) => (fullSize ? "hidden" : "scroll")};

  background-color: ${({ backgroundColor, backgroundShapes }) =>
    backgroundShapes ? "transparent" : backgroundColor};
`

const Section = ({ backgroundColor = colors.white, backgroundShapes = false, children, fullSize = false }) => {
  return (
    <Container
      fullSize={fullSize}
      backgroundShapes={backgroundShapes}
      backgroundColor={backgroundColor}
    >
      {backgroundShapes && <Background />}
      {children}
    </Container>
  )
}

export default Section