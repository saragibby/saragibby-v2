import React from "react"
import styled from "styled-components"

import Layout from "../components/layout"
import Recipe from "../components/recipe"
import SEO from "../components/seo"

const RecipeList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(32rem, 1fr));
  grid-gap: 1rem;
  list-style: none;
`;

const RecipeItem = styled.li`
  border: 1px solid #e2e2e2;
  border-radius: 0.5rem;
`

const eats = ({ data, location }) => {
  console.log("data", data)
  return (
    <Layout location={location} title="Eats" flexDirection="column">
      <SEO title="All posts" />
      <RecipeList>
        {data.allSanityRecipe.edges.map(recipe => (
          <li>
            <Recipe recipe={recipe} />
          </li>
        ))}
      </RecipeList>
    </Layout>
  )
}

export default eats

export const pageQuery = graphql`
  query {
    allSanityRecipe {
      edges {
        node {
          title
          description
          id
          ingredients {
            measurement
            name
            category
          }
          mainImage {
            asset {
              fluid(maxHeight: 400) {
                src
              }
            }
          }
        }
      }
    }
  }
`
