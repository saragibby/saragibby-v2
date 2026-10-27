import React from "react"
import styled from "styled-components"
import colors from "../../utils/colors.js"
import { below } from "../../utils/breakpoint.js"

const Title = styled.h3`
  text-align: center;
  margin-top: 6rem;
  margin-bottom: 3rem;
  font-size: 4rem;
`

const WorkDetail = styled.div`
  display: flex;
  margin: 0 6rem 6rem;
  justify-items: center;
  align-items: center;

  ${below.small`
    flex-direction: column;
    width: 80%;
  `}
`

const LogoBlock = styled.div`
  text-align: right;
  min-width: 22rem;
`

const Logo = styled.img`
  width: 18rem;
  max-width: 18rem;

  ${below.small`
    width: 16rem;
  `}
`

const ProjectList = styled.ul`
  list-style: none;
  background-color: rgb(255, 255, 255, 0.5);
  padding-left: 1rem;
  margin-left: 3rem;

  li {
    padding: 1rem 0;

    a {
      text-decoration: none;
      color: ${colors.purple};
      font-size: 2rem;
      text-align: center;
      font-weight: 600;
      margin: 1rem;

      &:hover {
        color: ${colors.teal};
        font-weight: 700;
      }
    }

    p {
      margin-left: 1rem;
      margin-top: 0;
      max-width: 80rem;
    }
  }
`

const DevRelMascot = styled.img`
  position: absolute;
  right: 2rem;
  bottom: 0;
  height: 10rem;
`

const Work = ({ className }) => {
  return (
    <div className={className}>
      <Title>Current Projects</Title>
      <WorkDetail>
        <LogoBlock>
          <Logo src="/microsoft.png" alt="Microsoft" />
        </LogoBlock>
        <div>
          <ProjectList>
            <li>
              <a
                href="https://rd.microsoft.com/en-us/"
                target="_blank"
                rel="noreferrer"
              >
                Regional Directors
              </a>
              <p>
                Trusted advisors to the developer and IT professional audiences
                and Microsoft.
              </p>
            </li>
            <li>
              <a
                href="https://mvp.microsoft.com/"
                target="_blank"
                rel="noreferrer"
              >
                Most Valuable Professional
              </a>
              <p>
                Technology experts who passionately share their knowledge with
                the community.
              </p>
            </li>
            <li>
              <a
                href="https://studentambassadors.microsoft.com/"
                target="_blank"
                rel="noreferrer"
              >
                Student Partners
              </a>
              <p>
                Student leaders with a passion for making a difference, building
                vibrant communities, and sharing the latest tech with their
                peers.
              </p>
            </li>
          </ProjectList>
          <DevRelMascot
            src="/microsoft-developer-advocate.png"
            alt="Microsoft Developer Advocate"
          />
        </div>
      </WorkDetail>
      <WorkDetail>
        <LogoBlock>
          <Logo src="/c-us-logo.png" alt="Comprend Us" />
        </LogoBlock>
        <div>
          <ProjectList>
            <li>
              <a href="https://comprend.us" target="_blank" rel="noreferrer">
                Comprend Us: changing the face of tech
              </a>
              <p>
                To be able to change where we are headed we have to know where
                we have been. The goal of Comprend Us is spread that
                understanding. To give us all a glimpse to the past and current
                state of diversity across the tech industry through conferences
                and communities.
              </p>
            </li>
          </ProjectList>
        </div>
      </WorkDetail>
    </div>
  )
}

export default styled(Work)`
  ${below.small`
    padding-top: 23rem;
  `}
`
