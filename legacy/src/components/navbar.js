import React, { useState } from "react"
import styled from "styled-components"
import colors from "../utils/colors.js"
import { below } from "../utils/breakpoint.js"
import { Link } from "gatsby"

const Navigation = styled.nav`
  position: fixed;
  right: 0;
  text-align: right;
  z-index: 100;
  height: 5rem;
  display: flex;
`

const Toggle = styled.div`
  display: none;
  height: 100%;
  cursor: pointer;
  padding: 0 5vw;
  background-color: ${colors.purple};

  ${below.small`
    display: flex;
  `}
`

const Navbox = styled.div`
  background-color: ${colors.purple};
  padding-right: 1rem;
  display: flex;
  height: 100%;
  justify-content: flex-end;
  align-items: center;

  a {
    text-transform: uppercase;
    text-decoration: none;
    color: ${colors.white};
    font-size: 1.6rem;
    text-align: center;
    font-weight: 400;
    margin: 1rem;

    &:hover {
      color: ${colors.teal};
      font-weight: 700;
    }

    ${below.small`
      color: ${colors.purple};
    `}
  }

  ${below.small`
    flex-direction: column;
    position: fixed;
    width: 100%;
    justify-content: flex-start;
    padding-top: 10vh;
    background-color: #fff;
    transition: all 0.3s ease-in;
    top: 8vh;
    left: ${props => (props.open ? "-100%" : "0")};
  `};
`
const Hamburger = styled.div`
  background-color: ${colors.white};
  width: 3rem;
  height: 0.3rem;
  transition: all 0.3s linear;
  align-self: center;
  position: relative;
  transform: ${props => (props.open ? "rotate(-45deg)" : "inherit")};

  ::before,
  ::after {
    width: 3rem;
    height: 0.3rem;
    background-color: ${colors.white};
    content: "";
    position: absolute;
    transition: all 0.3s linear;
    left: 0;
  }

  ::before {
    transform: ${props =>
      props.open ? "rotate(-90deg) translate(-10px, 0px)" : "rotate(0deg)"};
    top: -1rem;
  }

  ::after {
    opacity: ${props => (props.open ? "0" : "1")};
    transform: ${props => (props.open ? "rotate(90deg) " : "rotate(0deg)")};
    top: 1rem;
s  }
`

const Triangle = styled.div`
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 5rem 0 0 5rem;
  border-color: ${colors.purple} transparent transparent transparent;
`

const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false)

  return (
    <Navigation>
      <Triangle />
      <Toggle
        navbarOpen={navbarOpen}
        onClick={() => setNavbarOpen(!navbarOpen)}
      >
        {navbarOpen ? <Hamburger open /> : <Hamburger />}
      </Toggle>
      {navbarOpen ? (
        <Navbox>
          <>
            <Link to="/">About</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/eats">Eats</Link>
            <Link to="./">Bookshelf</Link>
          </>
        </Navbox>
      ) : (
        <Navbox open>
          <>
            <Link to="/">About</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/eats">Eats</Link>
            <Link to="./">Bookshelf</Link>
          </>
        </Navbox>
      )}
    </Navigation>
  )
}

export default Navbar
