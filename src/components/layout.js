import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { rhythm, scale } from "../utils/typography"
import svgs from '../utils/svgs.js';

const colors = {
  coral: "#F4484B",
  pink: "#EDA8A8",
  purple: "#5C415D",
  teal: "#00BFB2",
  white: "#FFFFFF",
}

const TopLines = styled.div`
  width: 30rem;
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;  
`;

const DottedLine = styled.hr`
  border: 4px dotted ${colors.pink};
  border-style: none none dotted; 
  color: transparent; 
  background-color: transparent;
  margin-bottom: 0.7rem;
`;

const NavList = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 2.3rem;
  top: 17rem;
  z-index: 1;

  a {
    transform: rotate(270deg);
    transform-origin: left top 0;
    text-transform: uppercase;
    text-decoration: none;
    color: #000;
    font-size: 1.6rem;
    text-align: center;
    font-weight: 600;

    &:hover {
      color: ${colors.teal};
    }
  }
`;

const Subheader = styled.h2`
  text-transform: uppercase;
  font-size: 1.7rem;
`;

const Footer = styled.footer`
  background-color: ${colors.purple};
  position: absolute;
  bottom: 0;
  left: 0;
  width: 7rem;
`

const Socials = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2.2rem;

  &::before {
    content: '';
    width: 0;
    height: 0;
    border-top: 100px solid ${colors.white};
    border-left: 100px solid transparent;
    position: relative;
    left: -3rem;
  }
`;

const Svg = styled.svg`
  width: 2.6rem;
  height: 100%;
  fill: ${colors.white};
  margin: 0.5rem 2rem;

  &:hover {
    fill: ${colors.teal};
  }
`;

const Main = styled.main`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const Section = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`;

const Text = styled.div`
  width: 40rem;
  margin-right: calc(1vw * 9);
`

const TopLeftBox = styled.div`
  position: absolute;
  top: -7rem;
  left: 45vw;
  width: 11rem;
  height: 15rem;
  background-color: ${colors.teal};
  z-index: -15;
  transform: rotate(-45deg);
`;

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
`;

const MiddleBox = styled.div`
  position: absolute;
  top: 40vh;
  right: 5vw;
  width: 35vh;
  height: 35vh;
  background-color: ${colors.pink};
  z-index: -10;
  transform: rotate(45deg);
`;

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
`;

const SmallBottomBox = styled.div`
  position: absolute;
  bottom: 0;
  right: 15vw;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 15vw 15vw 15vw;
  border-color: transparent transparent ${colors.purple} transparent;
  z-index: -15;
`;

const BottomLeftBox = styled.div`
  position: absolute;
  bottom: -7rem;
  left: 27vw;
  width: 9rem;
  height: 20rem;
  background-color: #f4484b;
  z-index: -25;
  transform: rotate(45deg);
`;

const Line = styled.hr`
  position: absolute;
  top: ${props => props.top || ''};
  bottom: ${props => props.bottom || ''};
  right: ${props => props.right || ''};
  width: ${props => props.width};
  border: 3px solid ${props => props.color};
  background-color: ${props => props.color};
  transform: rotate(${props => props.rotate});
`

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    let header

    if (location.pathname === rootPath) {
      header = (
        <h1
          style={{
            ...scale(2),
            marginBottom: rhythm(1),
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
            {title}
          </Link>
        </h1>
      )
    } else {
      header = (
        <h3
          style={{
            fontFamily: `Montserrat, sans-serif`,
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
            {title}
          </Link>
        </h3>
      )
    }
    return (
      <div>
        <header></header>
        <Main>
          <TopLines>
            {Array.from({ length: 7 }, () => {
              return <DottedLine />
            })}
          </TopLines>
          <NavList>
            <a href="./" style={{ height: "7rem" }}>
              About
            </a>
            <a href="./" style={{ height: "8rem" }}>
              Blog
            </a>
            <a href="./" style={{ height: "10rem" }}>
              Bookshelf
            </a>
            <a href="./">Tutorials</a>
          </NavList>
          <Section>
            <Text>
              {header}
              <Subheader>{this.props.subheader}</Subheader>
              <p style={{ ...scale(0.6) }}>{this.props.text}</p>
            </Text>
            <div>{children}</div>
          </Section>
          <TopLeftBox />
          <TopBox />
          <MiddleBox />
          <BottomBox />
          <SmallBottomBox />
          <BottomLeftBox />

          <Line
            top="7rem"
            right="50vw"
            color={colors.purple}
            rotate="-45deg"
            width="8rem"
          />
          <Line
            top="4rem"
            right="15rem"
            color={colors.purple}
            rotate="-45deg"
            width="13rem"
          />
          <Line
            top="30vh"
            right="-3rem"
            color={colors.teal}
            rotate="45deg"
            width="17rem"
          />
          <Line
            top="55vh"
            right="2rem"
            color={colors.purple}
            rotate="-45deg"
            width="15rem"
          />
          <Line
            bottom="10rem"
            right="32vw"
            color={colors.coral}
            rotate="45deg"
            width="28rem"
          />
          <Line
            bottom="2rem"
            right="59vw"
            color={colors.pink}
            rotate="45deg"
            width="10vw"
          />
        </Main>
        <Footer>
          <Socials>
            <a href="https://www.linkedin.com/in/saragibby/" target="_blank">
              <Svg
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox={`0 0 24 24`}
              >
                <title>Linked In</title>
                {svgs["linkedIn"].path.map(item => {
                  return <path d={item} />
                })}
              </Svg>
            </a>
            <a href="https://github.com/saragibby" target="_blank">
              <Svg
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox={`0 0 24 24`}
              >
                <title>Github</title>
                {svgs["github"].path.map(item => {
                  return <path d={item} />
                })}
              </Svg>
            </a>
            <a href="https://www.instagram.com/gibbette03" target="_blank">
              <Svg
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox={`0 0 24 24`}
              >
                <title>Instagram</title>
                {svgs["instagram"].path.map(item => {
                  return <path d={item} />
                })}
              </Svg>
            </a>
            <a href="https://www.facebook.com/saragibby" target="_blank">
              <Svg
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox={`0 0 24 24`}
              >
                <title>Facebook</title>
                {svgs["facebook"].path.map(item => {
                  return <path d={item} />
                })}
              </Svg>
            </a>
            <a href="https://twitter.com/saragibby" target="_blank">
              <Svg
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox={`0 0 24 24`}
              >
                <title>Twitter</title>
                {svgs["twitter"].path.map(item => {
                  return <path d={item} />
                })}
              </Svg>
            </a>
          </Socials>
        </Footer>
      </div>
    )
  }
}

export default Layout
