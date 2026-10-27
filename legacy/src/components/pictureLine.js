import React from "react"
import styled from "styled-components"
import { below } from "../utils/breakpoint.js"

const Pictures = styled.div`
  display: flex;
  width: 100%;
  height: 18rem;

  ${below.small`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  `};

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    margin-bottom: 0;

    ${below.small`
      // max-height: 12rem;
      // max-width: 30%;
    `};
  }
`

const PictureLine = ({ pictures }) => {
  return (
    <Pictures>
      {pictures.map(picture => (
        <div key={picture.node.id}>
          <picture>
            <source
              srcSet={picture.node.image.asset.fixed.srcWebp}
              type="image/webp"
            />
            <source
              srcSet={picture.node.image.asset.fixed.src}
              type="image/jpeg"
            />
            <img
              src={picture.node.image.asset.fixed.src}
              alt={picture.node.altText}
            />
          </picture>
        </div>
      ))}
    </Pictures>
  )
}

export default PictureLine