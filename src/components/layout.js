import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { rhythm, scale } from "../utils/typography"
import svgs from '../utils/svgs.js';

const TopLines = styled.div`
  width: 30rem;
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;  
`;

const DottedLine = styled.hr`
  border: 4px dotted #EDA8A8;
  border-style: none none dotted; 
  color: #fff; 
  background-color: #fff;
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
      color: #00BFB2;
    }
  }
`;

const Subheader = styled.h2`
  text-transform: uppercase;
  font-size: 1.7rem;
`;

const Footer = styled.footer`
  background-color: #5C415D;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 7rem;
`;

const Socials = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2.2rem;

  &::before {
    content: '';
    width: 0;
    height: 0;
    border-top: 100px solid #FFF;
    border-left: 100px solid transparent;
    position: relative;
    left: -3rem;
  }
`;

const Svg = styled.svg`
  width: 2.6rem;
  height: 100%;
  fill: #fff;
  margin: 0.5rem 2rem;

  &:hover {
    fill: #00BFB2;
  }
`;

const Main = styled.main`
  height: 100vh;
  width: 100vw;
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
  margin-right: 2rem;
`;

const TopBox = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 50vw 50vw 0;
  border-color: transparent #F4484B transparent transparent;
  z-index: -10;
`;

const MiddleBox = styled.div`
  position: absolute;
  top: 40vh;
  right: 5vw;
  width: 35vh;
  height: 35vh;
  background-color: #eda8a8;
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
  border-width: 0 0 80vw 80vw;
  border-color: transparent transparent #00BFB2 transparent;
  z-index: -20;
`;

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
        <header>
          
        </header>
        <Main>
          <TopLines>
            <DottedLine />
            <DottedLine />
            <DottedLine />
            <DottedLine />
            <DottedLine />
            <DottedLine />
            <DottedLine />
          </TopLines>
          <NavList>
            <a href="./" style={{ height: "7rem" }}>About</a>
            <a href="./" style={{ height: "8rem" }}>Blog</a>
            <a href="./" style={{ height: "10rem" }}>Bookshelf</a>
            <a href="./">Tutorials</a>
          </NavList>
          <Section>
            <Text>
              {header}
              <Subheader>{this.props.subheader}</Subheader>
              <p style={{...scale(0.6)}}>{this.props.text}</p>
            </Text>
            <div>
              {children}
            </div>
          </Section>
          <TopBox />
          <MiddleBox />
          <BottomBox />
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
                  return <path d={item} />;
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
                  return <path d={item} />;
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
                  return <path d={item} />;
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
                  return <path d={item} />;
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
                  return <path d={item} />;
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
