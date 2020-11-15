import React from "react"
import styled from "styled-components"
import Layout from "../components/layout"
import PictureLine from "../components/pictureLine"
import SEO from "../components/seo"
import Section from "../components/section"
import colors from "../utils/colors.js"
import { below } from "../utils/breakpoint.js"

const Signature = styled.img`
  position: absolute;
  bottom: 0;
  right: 2rem;
  transform: rotate(4deg);
  width: 30rem;

  ${below.med`
    width: 20rem;
    right: -3rem;
    transform: rotate(-90deg);
    bottom: 10rem;
  `};
`
const ImageContainer = styled.div`
  flex-grow: 2;
`

const MainImage = styled.img`
  height: 60vh;

  ${below.med`
    height: auto;
    width: 40vw;
    max-height: 70vh;
    align-self: center;
    object-fit: cover;
  `};

  ${below.small`
    width: 52vw;
    margin-top: -2rem;
  `};
`

const SectionContent = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 80%;
  margin: auto;
  justify-content: center;
  align-items: center;

  ${below.small`
    flex-direction: column;
  `};
`

const Motto = styled.p`
  font-size: 4rem;
  text-align: left;
  flex-grow: 2;
  color: ${colors.purple};
  font-weight: 400;
  line-height: 1.4;
  border-bottom: 4px dotted ${colors.coral};

  ${below.med`
    font-size: 3.5rem;
  `} ${below.small`
    font-size: 2.5rem;
    margin-top: 10rem;
  `};

  .highlight {
    font-family: "Playfair Display", serif;
    font-size: 5rem;

    ${below.med`
      font-size: 4.5rem;
    `}

    ${below.small`
      font-size: 3.5rem;
      line-height: 1;
    `};

    &.upper {
      text-transform: uppercase;
    }
    &.coral {
      color: ${colors.coral};
    }
    &.teal {
      color: ${colors.teal};
    }
    &.pink {
      color: ${colors.pink};
    }
    &.bold {
      font-weight: 700;
    }
    &.fancy {
      font-family: "Rouge Script", cursive;
      font-size: 6rem;
      line-height: 1;
      ${below.small`
        font-size: 4.55rem;
      `};
    }
  }
`
const AboutDetail = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  margin: 6rem;

  h1,
  h2 {
    color: ${colors.white};
    font-family: "Raleway", sans-serif;
  }

  h1 {
    font-size: 7rem;
  }
`

const WorkDetail = styled.div`
  display: flex;
  margin: 6rem;
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
  width: 16rem;
`

const MicrosoftProjectList = styled.ul`
  list-style: none;
  background-color: rgb(255,255,255,0.5);

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
    }
  }
`

const DevRelMascot = styled.img`
  position: absolute;
  right: 2rem;
  bottom: 0;
  height: 10rem;
`

class Index extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title

    return (
      <>
        <Layout location={this.props.location} title={siteTitle}>
          <SEO title="Sara Gibbons" />
          <Section fullSize backgroundShapes key="motto">
            <SectionContent>
              <Motto>
                Live <span className="highlight teal bold">boldly</span>.
                <br />
                Laugh <span className="highlight upper coral">loudly</span>.
                <br />
                <span className="highlight upper pink">Dare</span> greatly.
                <br />
                Be <span className="highlight fancy teal">original</span>.
                <br />
                Kindness always.
              </Motto>
              <ImageContainer>
                <MainImage src={"/sara-lg.png"} />
              </ImageContainer>
              <Signature src={"/sara-sig.png"} />
            </SectionContent>
          </Section>
          <Section key="about" backgroundColor={colors.coral}>
            <AboutDetail>
              <h1>Sara Gibbons</h1>
              <h2>Engineer / Leader / Advocate</h2>
            </AboutDetail>
          </Section>
          <PictureLine pictures={data.allSanityPicture.edges} />
          <Section backgroundAlt>
            <WorkDetail>
              <div style={{ textAlign: "right" }}>
                <MicrosoftLogo src="/microsoft.png" />
              </div>
              <div>
                <MicrosoftProjectList>
                  <li>
                    <a
                      href="https://rd.microsoft.com/en-us/"
                      target="_blank"
                      rel="noreffer"
                    >
                      Regional Directors
                    </a>
                    <p>
                      Trusted advisors to the developer and IT professional
                      audiences and Microsoft.
                    </p>
                  </li>
                  <li>
                    <a
                      href="https://mvp.microsoft.com/"
                      target="_blank"
                      rel="noreffer"
                    >
                      Most Valuable Professional
                    </a>
                    <p>
                      Technology experts who passionately share their knowledge
                      with the community.
                    </p>
                  </li>
                  <li>
                    <a
                      href="https://studentambassadors.microsoft.com/"
                      target="_blank"
                      rel="noreffer"
                    >
                      Student Partners
                    </a>
                    <p>
                      Student leaders with a passion for making a difference,
                      building vibrant communities, and sharing the latest tech
                      with their peers.
                    </p>
                  </li>
                </MicrosoftProjectList>
                <DevRelMascot src="/microsoft-developer-advocate.png" />
              </div>
            </WorkDetail>
          </Section>
        </Layout>
      </>
    )
  }
}

export default Index

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allSanityPicture(filter: { active: { eq: true } }) {
      edges {
        node {
          altText
          image {
            asset {
              fixed {
                srcWebp
                src
              }
            }
          }
        }
      }
    }
  }
`
