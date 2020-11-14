import React from "react"
import styled from "styled-components"
import colors from "../utils/colors.js"

const RecipeCard = styled.div`
  border: 1px solid ${colors.lightGray};
  margin: 1rem;
  border-radius: 0.5rem;
  background: ${colors.white};
`

const RecipeFigure = styled.figure`
  height: 20rem;
  overflow: hidden;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  position: relative;
  margin-bottom: 0;

  img {
    width: 100%;
    height: 100%;
    margin-bottom: 0;
    object-fit: cover;
  }
`

const Title = styled.figcaption`
  position: absolute;
  bottom: 0;
  background-color: rgba(92, 65, 93, 0.7);
  width: 100%;

  color: white;
  padding: 0.75rem;
`

const RecipeInfo = styled.div`
  padding: 0.5rem 0.75rem;
`;

const Recipe = ({
  recipe: {
    node: { description, title, mainImage },
  },
}) => {
  return (
    <RecipeCard>
      <RecipeFigure>
        <img src={mainImage?.asset.fluid.src || "kitchen.svg"} alt={title} />
        <Title>
          <h3>{title}</h3>
        </Title>
      </RecipeFigure>
      <RecipeInfo>
        <p>{description}</p>
        <a href="#">Visit Website</a>
      </RecipeInfo>
    </RecipeCard>
  )
}

export default Recipe
