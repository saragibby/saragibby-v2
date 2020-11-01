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
      name: "description",
      title: "Description",
      type: "markdown",
      options: {
        minRows: 4,
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
  ],
}
