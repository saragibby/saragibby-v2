import React from "react";
import styled from "styled-components"
import colors from "../utils/colors.js"

const RightSide = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 50rem 0 0 50rem;
  border-color: transparent transparent transparent ${colors.pink};
  z-index: -10;
`

const BackgroundAlt = () => {
  return(
    <>
      <RightSide />
    </>
  )
}

export default BackgroundAlt