import { getUserInfoById } from '../services/users.js'
export const recipeSchema = `#graphql
type Recipe {
id: ID!
title: String!
author: User
contents: String
imageURL: String
likes: [ID!]
likesCount: Int!
}
`
export const recipeResolver = {
  Recipe: {
    author: async (recipe) => {
      return await getUserInfoById(recipe.author)
    },
    likesCount: (recipe) => recipe.likes?.length || 0,
  },
}
