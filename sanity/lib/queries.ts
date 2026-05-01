export const cityQuery = `
  *[_type == "city" && slug.current == $slug][0]{
    name_en,
    name_pt,
    headline_en,
    headline_pt,
    intro_en,
    intro_pt,
    cta_en,
    cta_pt
  }
`