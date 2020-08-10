import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { rhythm, scale } from "../utils/typography"
import GlobalStyle from "../styles/globalStyle"
import colors from "../utils/colors.js"
import svgs from "../utils/svgs.js"
import { above, below } from "../utils/breakpoint.js"
import Background from "./background"

const TopLines = styled.div`
  width: 30rem;
  position: fixed;
  top: 0.5rem;
  left: 0.5rem;

  ${below.med`
    display: flex;
    flex-direction: row;  
    width: 10rem;
    height: 40vh;
    position: fixed;
    left: -8rem;
  `};
`

const DottedLine = styled.hr`
  border: 4px dotted ${colors.pink};
  border-style: none none dotted;
  color: transparent;
  background-color: transparent;
  margin-bottom: 0.7rem;

  ${below.med`
    border:         none;
    border-left:    1px solid hsla(200, 10%, 50%,100);
    height:         40vh;
    width:          1px; 
    border: 4px dotted ${colors.pink};
    padding-right: 0.5rem;
    margin-right: 0.5rem;
  `};
`

const NavList = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
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

  ${below.med`
    position: fixed;
    left: 1.4rem;
    bottom: 4rem;
    top: auto;
  `};
`

const Subheader = styled.h2`
  text-transform: uppercase;
  font-size: 1.7rem;
`

const Footer = styled.footer`
  background-color: ${colors.purple};
  width: 7rem;

  ${below.med`
    position: fixed;
    bottom: 0;
    right: 0;
    width: calc(100vw - 6rem);
    height: 6rem;
  `};
`

const Socials = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2.2rem;

  ${below.med`
    flex-direction: row;
    bottom: 0;
    left: 0;
    justify-content: space-evenly;
  `};
`

const Svg = styled.svg`
  width: 2.6rem;
  height: 100%;
  fill: ${colors.white};
  margin: 0.5rem 2rem;

  &:hover {
    fill: ${colors.teal};
  }

  ${below.med`
    margin: 1.5rem 0;
    height: auto;
  `};
`

const FooterLine = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;

  ${above.med`
    left: 0;
  bottom: 0;
  `};

  ${below.med`
    flex-direction: row;
    bottom: 0;
  `};
`

const FooterTriangle = styled.div`
  width: 0;
  height: 0;
  border-style: solid;

  ${above.med`
    border-width: 7rem 0 0 7rem;
    border-color: transparent transparent transparent ${colors.purple};
  `};

  ${below.med`
    border-width: 0 0 6rem 6rem;
    border-color: transparent transparent ${colors.purple} transparent;
  `};
`

const Main = styled.main`
  height: 100vh;
  width: 100vw;
  overflow: scroll;

  ${below.med`
    height: auto;
    width: 100%;
    overflow: auto;
  `};
`

const Section = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${({ fixedHeight }) => (fixedHeight ? "100vh" : "")};
  width: 100vw;
  flex-direction: ${({ flexDirection }) => flexDirection || "row"};
  position: ${({ fixedHeight }) => (fixedHeight ? "initial" : "relative")};
  top: ${({ fixedHeight }) => (fixedHeight ? "" : "10rem")};

  ${below.large`
    flex-direction: column;
    margin: auto
    max-width: 90vw;
    width: auto;
    height: auto;
    margin-left: 6.3rem;
    margin-top: ${({ fixedHeight }) => (fixedHeight ? "15vh" : "0")};
    text-align: center;
    margin-right: 2.5rem;
    margin-bottom: 10rem;
  `};
`

const Text = styled.div`
  max-width: 48rem;
  margin-right: calc(1vw * 9);

  ${below.large`
    text-align: justify;
    margin-right: 0;
  `};
`

const Logos = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  align-items: center;

  svg {
    width: 8rem;
  }

  img {
    height: 5rem;
    margin-bottom: 0;
  }
`

const Layout = props => {
  const { location, title, children } = props
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
          fontSize: "3rem",
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
      <header>
        <GlobalStyle />
      </header>
      <Main>
        <TopLines>
          {Array.from({ length: 7 }, index => {
            return <DottedLine key={index} />
          })}
        </TopLines>
        <NavList>
          <a href="/" style={{ height: "7rem" }}>
            About
          </a>
          <a href="/blog" style={{ height: "8rem" }}>
            Blog
          </a>
          <a href="./" style={{ height: "10rem" }}>
            Bookshelf
          </a>
          <a href="/heyClark">Hey Clark</a>
        </NavList>
        <Section
          flexDirection={props.flexDirection}
          fixedHeight={location.pathname === rootPath}
        >
          <Text>
            {header}
            <Subheader>{props.subheader}</Subheader>
            <p style={{ ...scale(0.6) }}>{props.text}</p>
          </Text>
          <div>{children}</div>
        </Section>
      </Main>
      <Logos>
        <a href="http://thatconference.com" target="_blank">
          <svg
            id="Layer_1"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 115 50"
            style={{ fill: "white " }}
          >
            <g
              id="Page-1"
              stroke="none"
              strokeWidth="1"
              fill="none"
              fillRule="evenodd"
            >
              <g id="THAT-Conference---Logo---Trees" fill="white">
                <path
                  d="M86.5399543,28.9863014 L77.7089041,14.9166667 L80.9703196,14.9166667 L71.609589,0.0639269406 L62.2488584,14.9166667 L65.5091324,14.9166667 L57.0776256,28.3641553 L48.6369863,14.9166667 L51.8972603,14.9166667 L42.5365297,0.0639269406 L33.1757991,14.9166667 L36.4372146,14.9166667 L27.6152968,28.9863014 L30.8710046,28.9863014 L21.6769406,43.7123288 L38.7488584,43.7123288 L38.7488584,49.9417808 L46.3333333,49.9417808 L46.3333333,43.706621 L67.8219178,43.706621 L67.8219178,49.9360731 L75.4063927,49.9360731 L75.4063927,43.706621 L92.4783105,43.706621 L83.2842466,28.9805936 L86.5399543,28.9863014 Z M54.2111872,28.9863014 L59.9440639,28.9863014 L57.0776256,33.5753425 L54.2111872,28.9863014 Z"
                  id="Shape"
                  fillRule="nonzero"
                ></path>
                <polygon
                  id="Path"
                  points="14.6940639 5.33789954 4.08105023 15.9497717 0 20.0319635 4.08219178 24.1130137 14.6940639 34.7260274 18.7751142 30.6438356 8.16324201 20.0319635 18.7751142 9.41894977"
                ></polygon>
                <polygon
                  id="Path"
                  points="110.073059 15.9497717 99.4611872 5.33789954 95.380137 9.41894977 105.992009 20.0319635 95.380137 30.6438356 99.4611872 34.7260274 110.073059 24.1130137 114.155251 20.0319635"
                ></polygon>
              </g>
            </g>
          </svg>
        </a>
        <a href="http://comprend.us" target="_blank">
          <img src="/comprend-us-logo-white.png" />
        </a>
      </Logos>
      <Background />
      <FooterLine>
        <FooterTriangle />
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
      </FooterLine>
    </div>
  )
}

// class Layout extends React.Component {

//   render() {

//   }
// }

export default Layout
