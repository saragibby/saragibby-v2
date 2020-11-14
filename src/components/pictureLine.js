import React from "react"
import styled from "styled-components"

const PictureLine = () => {
  return(
    <p>pictures</p>
  )
}

export default PictureLine;

// export const pageQuery = graphql`
//   query {
//     allSanityHighlightPic {
//       edges {
//         node {
//           altText
//           mainImage {
//             asset {
//               fluid(maxHeight: 200) {
//                 src
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `