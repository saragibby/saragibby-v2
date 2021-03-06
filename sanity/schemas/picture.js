export default {
  name: "picture",
  title: "Picture",
  type: "document",
  fields: [
    {
      name: "altText",
      title: "altText",
      type: "string",
    },
    {
      name: "active",
      title: "Active",
      type: "boolean",
    },
    {
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
  ],
}
