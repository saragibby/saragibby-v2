import React from "react"
import styled from "styled-components"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { below } from "../utils/breakpoint.js"

const Signature = styled.img`
  position: absolute;
  bottom: 0;
  right: 2rem;
  transform: rotate(4deg);
  width: 30rem;

  ${below.med`
    width: 20rem;
    right: -10rem;
    transform: rotate(-90deg);
    bottom: 5rem;
  `};
`

const MainImage = styled.img`
  height: 60vh;

  ${below.med`
    height: auto;
    width: 60vw;
    align-self: center;
  `};
`

const Images = styled.div`
  ${below.med`
    position: relative;
  `};
`

class Index extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title

    console.log("data", data)

    return (
      <>
        <Layout
          location={this.props.location}
          title={siteTitle}
          subheader="Engineer / Leader / Advocate"
          text="Live boldly. Laugh loudly. Dare greatly.<br/>Be original. Kindness always."
          // text="With over 20 years of development experience, I have deep knowledge of all phases of the software development lifecycle. Accomplished in process optimization, tools and services to save time and money, as well as the simultaneous management of projects and teams. Spending the later phase of my career in the startup and consulting worlds  I know what it takes to cost-effectively get product to market while architecting solutions that keep the product prepared as the business needs evolve"
        >
          <SEO title="Sara Gibbons" />
          <Images>
            <MainImage src={"/sara-lg.png"} />
            <Signature src={"/sara-sig.png"} />
          </Images>
        </Layout>
      </>
    )
  }
}

export default Index

export const pageQuery = graphql`
  query {
    sanityRecipe {
      title
      ingredients {
        name
        measurement
      }
    }
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`
