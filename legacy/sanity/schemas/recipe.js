export default {
  name: "recipe",
  title: "Recipe",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "slug",
      title: "Slug",
      type: "string",
    },
    {
      name: "description",
      title: "Description",
      type: "markdown",
      options: {
        minRows: 4,
      },
    },
    {
      name: "servings",
      title: "Servings",
      type: "string",
    },
    {
      name: "vegan",
      title: "Vegan",
      type: "boolean",
    },
    {
      name: "totalTime",
      title: "Total Time",
      type: "string",
    },
    {
      name: "prepTime",
      title: "Prep Time",
      type: "string",
    },
    {
      name: "cookTime",
      title: "Cook Time",
      type: "string",
    },
    {
      name: "mainImage",
      title: "Main image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
    {
      name: "ingredients",
      title: "Ingredients",
      type: "array",
      of: [{ type: "ingredient" }],
    },
    {
      name: "steps",
      title: "Steps",
      type: "array",
      of: [
        {
          type: "markdown",
          options: {
            minRows: 4,
          },
        },
      ],
    },
    {
      name: "notes",
      title: "Notes",
      type: "markdown",
      options: {
        minRows: 4,
      },
    },
  ],
}
