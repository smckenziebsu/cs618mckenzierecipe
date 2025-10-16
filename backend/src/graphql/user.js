import { listPostsByAuthor } from '../services/posts.js'
import { Recipe} from '../db/models/recipe.js'

export const userSchema = `#graphql
type User {
username: String!
posts: [Post!]!
recipes: [Recipe!]!
}
`
export const userResolver = {
  User: {
    posts: async (user) => {
      return await listPostsByAuthor(user.username)
    },
    recipes: async (user) => {
      return await Recipe.find({ author: user._id })
  },
}
}