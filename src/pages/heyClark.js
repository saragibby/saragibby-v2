import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

class HeyClark extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges

    return (
      <Layout location={this.props.location} title="Hey Clark...">
        <SEO title="Hey Clark" />
        <div style={{height: '60vh',  width: '60vw', postion: 'relative'}}>
          <iframe allow="autoplay; gyroscope;" allowfullscreen height="100%" referrerpolicy="strict-origin" src="https://www.kapwing.com/e/5da3c8678b3288001409921b"  title="Embedded content made with Kapwing" width="100%" /></div>
      </Layout>
    )
  }
}

export default HeyClark

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
