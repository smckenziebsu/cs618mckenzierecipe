import { GraphQLError } from 'graphql'
import { createUser, loginUser } from '../services/users.js'
import { createPost } from '../services/posts.js'
import { Recipe } from '../db/models/recipe.js'

export const mutationSchema = `#graphql
type Mutation {
signupUser(username: String!, password: String!): User
loginUser(username: String!, password: String!): String
createPost(title: String!, contents: String, tags:[String]): Post
createRecipe(title: String!, contents: String, imageURL: String): Recipe
likeRecipe(id: ID!): Recipe
}
`
export const mutationResolver = {
  Mutation: {
    signupUser: async (parent, { username, password }) => {
      return await createUser({ username, password })
    },
    loginUser: async (parent, { username, password }) => {
      return await loginUser({ username, password })
    },
    createPost: async (parent, { title, contents, tags }, { auth }) => {
      if (!auth) {
        throw new GraphQLError(
          'You need to be authenticated to perform this action.',
          {
            extensions: {
              code: 'UNAUTHORIZED',
            },
          },
        )
      }
      return await createPost(auth.sub, { title, contents, tags })
    },
createRecipe: async (parent, { title, contents, imageURL }, { auth }) => {
      if (!auth) {
        throw new GraphQLError(
          'You need to be authenticated to create a recipe.',
          {
            extensions: { code: 'UNAUTHORIZED' },
          },
        )
      }
      const recipe = new Recipe({
        title,
        contents,
        imageURL,
        author: auth.sub,
      })
      await recipe.save()
      return recipe
    },

     likeRecipe: async (parent, { id }, { auth }) => {
      if (!auth) {
        throw new GraphQLError('You need to be authenticated to like a recipe.', {
          extensions: { code: 'UNAUTHORIZED' },
        })
      }

      const recipe = await Recipe.findById(id)
      if (!recipe) {
        throw new GraphQLError('Recipe not found.', {
          extensions: { code: 'NOT_FOUND' },
        })
      }

      if (!recipe.likes.includes(auth.sub)) {
        recipe.likes.push(auth.sub)
        await recipe.save()
      }

      return recipe

  },
}
}