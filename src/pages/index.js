import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"

const Signature = styled.img`
  position: absolute;
  bottom: 0;
  right: 2rem;
  z-index: 10;
  transform: rotate(4deg);
  width: 30rem;
`;

class Index extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title

    return (
      <>
        <Layout location={this.props.location} title={siteTitle} subheader="Engineer / Leader / Advocate" text="With over 20 years of development experience, I have deep knowledge of all phases of the software development lifecycle. Accomplished in process optimization, tools and services to save time and money, as well as the simultaneous management of projects and teams. Spending the later phase of my career in the startup and consulting worlds  I know what it takes to cost-effectively get product to market while architecting solutions that keep the product prepared as the business needs evolve">
          <SEO title="Sara Gibbons" />
          <img src={'/sara-lg.png'} style={{height: "60vh"}}/>
        </Layout>
        <Signature src={'/sara-sig.png'} />
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