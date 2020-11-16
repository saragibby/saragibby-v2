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
  width: 100%;
  overflow: hidden;

  div {
    flex-grow: 2;
  }

  ${below.small`
    flex-direction: column;
    padding-top: 15rem;
    width: 80%;
  `}
`

const MicrosoftLogo = styled.img`
  width: 18rem;

  ${below.small`
    width: 16rem;
  `}
`

const MicrosoftProjectList = styled.ul`
  list-style: none;
  background-color: rgb(255, 255, 255, 0.5);

  li {
    padding: 1rem 0;
    max-width: 70%; 
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
    }
  }
`

const DevRelMascot = styled.img`
  position: absolute;
  right: 2rem;
  bottom: 0;
  height: 10rem;
`

const Work = () => {
  return (
    <>
      <Title>Current Projects</Title>
      <WorkDetail>
        <div style={{ textAlign: "right" }}>
          <MicrosoftLogo src="/microsoft.png" alt="Microsoft" />
        </div>
        <div>
          <MicrosoftProjectList>
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
          </MicrosoftProjectList>
          <DevRelMascot src="/microsoft-developer-advocate.png" alt="Microsoft Developer Advocate" />
        </div>
      </WorkDetail>
    </>
  )
}

export default styled(Work)`
  background-color: red;
`;
