import React from "react"
import { graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm, scale } from "../utils/typography"
import styled from "styled-components"
import { below } from "../utils/breakpoint.js"

const StyledArticle = styled.article`
  max-width: 80rem;
  background-color: white;
  border: 1px solid #cccccc;
  padding: 2rem 4rem;
  min-width: 80%;
  font-size: 1.4rem;
  font-family: Roboto;

  ${below.small`
    padding: 2rem;
  `};

  #photos {
    display: flex;

    ${below.med`
      flex-direction: column;  
      align-items: center;
    `};

    .gatsby-resp-image-wrapper {
      width: 25rem;
      padding-right: 1rem;
      display: inline-block;
      height: auto;

      img {
        object-fit: cover;
      }
    }
  }

  .split {
    display: flex;

    ${below.med`
      flex-direction: column;  
      align-items: center;
    `};
  }

  .photo {
    width: 40rem;
    margin: auto;

    ${below.small`
      width: auto;
      max-width: 85%;
    `};
  }

  .strike {
    text-decoration: line-through;
  }
`

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    // const { previous, next } = this.props.pageContext

    const { featuredImage, featuredImageDisplay } = post.frontmatter
    const featuredImagePath =
      featuredImage && featuredImage.childImageSharp.fluid.src

    return (
      <Layout location={this.props.location} title="" flexDirection="column">
        <SEO
          title={post.frontmatter.title}
          description={post.frontmatter.description || post.excerpt}
          image={featuredImagePath}
        />
        <StyledArticle>
          <header>
            <h1
              style={{
                marginTop: rhythm(1),
                marginBottom: 0,
              }}
            >
              {post.frontmatter.title}
            </h1>
            {featuredImagePath && featuredImageDisplay && (
              <a href={featuredImagePath} target="_blank" rel="noopener">
                <img
                  src={featuredImagePath}
                  style={{
                    width: "100%",
                    height: "300px",
                    margin: "auto",
                    objectFit: "cover",
                  }}
                />
              </a>
            )}
            <p
              style={{
                ...scale(2 / 5),
                display: `block`,
                marginBottom: rhythm(1),
              }}
            >
              {post.frontmatter.date}
            </p>
          </header>
          <section
            dangerouslySetInnerHTML={{ __html: post.html }}
            style={{
              textAlign: "left",
            }}
          />
          <hr
            style={{
              marginBottom: rhythm(1),
            }}
          />
          <footer>
            <Bio />
          </footer>
        </StyledArticle>

        <nav>
          <ul
            style={{
              display: `flex`,
              flexWrap: `wrap`,
              justifyContent: `space-between`,
              listStyle: `none`,
              padding: 0,
              marginTop: "3rem",
            }}
          >
            {/* <li>
              {previous && (
                <Link to={previous.fields.slug} rel="prev">
                  ← {previous.frontmatter.title}
                </Link>
              )}
            </li>
            <li>
              {next && (
                <Link to={next.fields.slug} rel="next">
                  {next.frontmatter.title} →
                </Link>
              )}
            </li> */}
          </ul>
        </nav>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        featuredImageDisplay
        featuredImage {
          childImageSharp {
            fluid(maxHeight: 800) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`
