import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { rhythm, scale } from "../utils/typography"
import GlobalStyle from "../styles/globalStyle"
import colors from '../utils/colors.js';
import svgs from '../utils/svgs.js';
import { above, below } from "../utils/breakpoint.js"
import Background from './background'

const TopLines = styled.div`
  width: 30rem;
  position: absolute;
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
`;

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
`;

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
`;

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
  overflow: hidden;

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
  height: 100vh;
  width: 100vw;

  ${below.large`
    flex-direction: column;
    margin: auto
    max-width: 90vw;
    width: auto;
    height: auto;
    margin-left: 6.3rem;
    margin-top: 15vh;
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
`;

const Layout = props => {
  const { location, title, children } = props;
  const rootPath = `${__PATH_PREFIX__}/`;
  let header;

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
          fontSize: '3rem',
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
            <Subheader>{props.subheader}</Subheader>
            <p style={{ ...scale(0.6) }}>{props.text}</p>
          </Text>
          <div>{children}</div>
        </Section>
      </Main>
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
