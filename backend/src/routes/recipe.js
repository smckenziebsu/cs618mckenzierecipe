import {
  listAllRecipes,
  listRecipesByAuthor,
  listRecipesByTag,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeById,
} from '../services/recipe.js'
import { requireAuth } from '../middleware/jwt.js'
import { Recipe } from '../db/models/recipe.js'

export function recipeRoutes(app) {
  app.get('/api/v1/recipes', async (req, res) => {
    const { sortBy, sortOrder, author, tag } = req.query
    const options = { sortBy, sortOrder }
    try {
      if (author && tag) {
        return res
          .status(400)
          .json({ error: 'query by either author or tag, not both' })
      } else if (author) {
        return res.json(await listRecipesByAuthor(author, options))
      } else if (tag) {
        return res.json(await listRecipesByTag(tag, options))
      } else {
        return res.json(await listAllRecipes(options))
      }
    } catch (err) {
      console.error('error listing recipes', err)
      return res.status(500).end()
    }
  })
  app.get('/api/v1/recipes/:id', async (req, res) => {
    const { id } = req.params
    try {
      const recipe = await getRecipeById(id)
      if (recipe === null) return res.status(404).end()
      return res.json(recipe)
    } catch (err) {
      console.error('error getting recipe', err)
      return res.status(500).end()
    }
  })
  app.post('/api/v1/recipes', requireAuth, async (req, res) => {
    try {
      const recipe = await createRecipe(req.auth.sub, req.body)
      return res.json(recipe)
    } catch (err) {
      console.error('error creating recipe', err)
      return res.status(500).end()
    }
  })
  app.patch('/api/v1/recipes/:id', requireAuth, async (req, res) => {
    try {
      const recipe = await updateRecipe(req.auth.sub, req.params.id, req.body)
      return res.json(recipe);
    } catch (err) {
      console.error('error updating recipe', err)
      return res.status(500).end()
    }
  })
  app.delete('/api/v1/recipes/:id', requireAuth, async (req, res) => {
    try {
      const { deletedCount } = await deleteRecipe(req.auth.sub, req.params.id)
      if (deletedCount === 0) return res.sendStatus(404)
      return res.status(204).end()
    } catch (err) {
      console.error('error deleting recipe', err)
      return res.status(500).end()
    }
  })

   app.get('/api/v1/recipes/top', async (req, res) => {
    try {
      const topRecipes = await Recipe.aggregate([
        { $addFields: { likesCount: { $size: '$likes' } } },
        { $sort: { likesCount: -1 } },
        { $limit: 10 },
      ])
      res.json(topRecipes)
    } catch (err) {
      console.error('error fetching top recipes', err)
      res.status(500).json({ error: 'Failed to fetch top recipes' })
       }
  })
  app.post('/api/v1/recipes/:id/like', requireAuth, async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id)
      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' })
      }

      
      if (!recipe.likes.includes(req.auth.sub)) {
        recipe.likes.push(req.auth.sub)
        await recipe.save()
      }

      res.json({
        id: recipe._id,
        likesCount: recipe.likes.length,
      })
    } catch (err) {
      console.error('error liking recipe', err)
      res.status(500).json({ error: 'Failed to like recipe' })
    }
  })
}
