import React from "react"
import styled from "styled-components"
import Background from "./background"
import BackgroundAlt from "./backgroundAlt"
import colors from "../utils/colors.js"

const Container = styled.div`
  position: relative;
  height: ${({ fullSize }) => (fullSize ? "100vh" : "auto")};
  width: ${({ fullSize }) => (fullSize ? "100vw" : "auto")};
  overflow: ${({ fullSize, backgroundAlt }) =>
    (fullSize || backgroundAlt) ? "hidden" : "scroll"};

  background-color: ${({ backgroundColor, backgroundShapes }) =>
    backgroundShapes ? "transparent" : backgroundColor};
`

const Section = ({
  backgroundColor = colors.white,
  backgroundShapes = false,
  backgroundAlt = false,
  children,
  fullSize = false,
}) => {
  return (
    <Container
      fullSize={fullSize}
      backgroundShapes={backgroundShapes || backgroundAlt}
      backgroundColor={backgroundColor}
      backgroundAlt={backgroundAlt}
    >
      {backgroundShapes && <Background />}
      {backgroundAlt && <BackgroundAlt />}
      {children}
    </Container>
  )
}

export default Section
