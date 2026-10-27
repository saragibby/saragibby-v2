import React from "react"
import styled from "styled-components"
import { below } from "../utils/breakpoint.js"
import colors from "../utils/colors.js"

const TopLeftBox = styled.div`
  position: absolute;
  top: -7rem;
  left: 45vw;
  width: 11rem;
  height: 15rem;
  background-color: ${colors.teal};
  z-index: -15;
  transform: rotate(-45deg);

  ${below.med`
    text-align: justify;
  `};
`

const TopBox = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 50vw 50vw 0;
  border-color: transparent ${colors.coral} transparent transparent;
  z-index: -10;
`

const MiddleBox = styled.div`
  position: absolute;
  bottom: 15vh;
  right: 24vw;
  width: 35vh;
  height: 35vh;
  background-color: ${colors.pink};
  z-index: -10;
  transform: rotate(45deg);
`

const BottomBox = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 0 70vw 70vw;
  border-color: transparent transparent ${colors.teal} transparent;
  z-index: -20;

  ${below.med`
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 40rem 40rem 40rem 0;
    border-color: transparent ${colors.teal} transparent transparent;
    top: 47vh;
    overflow: hidden;
  `};
`

// const SmallBottomBox = styled.div`
//   position: absolute;
//   bottom: 0;
//   right: 15vw;
//   width: 0;
//   height: 0;
//   border-style: solid;
//   border-width: 0 15vw 15vw 15vw;
//   border-color: transparent transparent ${colors.purple} transparent;
//   z-index: -15;
// `

// const BottomLeftBox = styled.div`
//   position: absolute;
//   bottom: -7rem;
//   left: 27vw;
//   width: 9rem;
//   height: 20rem;
//   background-color: #f4484b;
//   z-index: -25;
//   transform: rotate(45deg);
// `

// const Line = styled.hr`
//   position: absolute;
//   top: ${props => props.top || ""};
//   bottom: ${props => props.bottom || ""};
//   right: ${props => props.right || ""};
//   width: ${props => props.width};
//   border: 3px solid ${props => props.color};
//   background-color: ${props => props.color};
//   transform: rotate(${props => props.rotate});
//   z-index: -5;
// `

const Background = props => {
  return (
    <>
      <TopLeftBox />
      <TopBox />
      <MiddleBox />
      <BottomBox />
      {/* <SmallBottomBox />
//         <BottomLeftBox />
//         <Line
//           top="7rem"
//           right="50vw"
//           color={colors.purple}
//           rotate="-45deg"
//           width="8rem"
//         />
//         <Line
//           top="4rem"
//           right="15rem"
//           color={colors.purple}
//           rotate="-45deg"
//           width="13rem"
//         />
//         <Line
//           top="30vh"
//           right="-3rem"
//           color={colors.teal}
//           rotate="45deg"
//           width="17rem"
//         />
//         <Line
//           top="55vh"
//           right="2rem"
//           color={colors.purple}
//           rotate="-45deg"
//           width="15rem"
//         />
//         <Line
//           bottom="10rem"
//           right="32vw"
//           color={colors.coral}
//           rotate="45deg"
//           width="28rem"
//         />
//         <Line
//           bottom="2rem"
//           right="59vw"
//           color={colors.pink}
//           rotate="45deg"
//           width="10vw"
//         /> */}
    </>
  )
  };

export default Background