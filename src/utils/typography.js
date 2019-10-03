import Typography from "typography"

const typography = new Typography({
  baseFontSize: "10px",
  baseLineHeight: 1.666,
  headerFontFamily: [
    "Roboto Condensed",
    "Helvetica",
    "Arial",
    "sans-serif",
  ],
  bodyFontFamily: [
    "Roboto Condensed",
    "Helvetica",
    "Arial",
    "sans-serif",
  ],
})

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
