import mongoose from 'mongoose'
import { describe, expect, test, beforeEach, beforeAll } from '@jest/globals'
import {
  createRecipe,
  listAllRecipes,
  listRecipesByAuthor,
  listRecipesByTag,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} from '../services/recipes.js'
import { Recipe } from '../db/models/recipe.js'
import { createUser } from '../services/users.js'

let testUser = null
let sampleRecipes = []
beforeAll(async () => {
  testUser = await createUser({ username: 'sample', password: 'user' })
  sampleRecipes = [
    { title: 'Chicken and Rice', author: testUser._id, ingredients: ['chicken', 'rice'], tags: ['dinner'] },
    { title: 'Veggie Pasta', author: testUser._id, ingredients: ['pasta', 'tomato'], tags: ['vegetarian'] },
    { title: 'Beef Stew', author: testUser._id, ingredients: ['beef', 'potato'], tags: ['comfort'] },
  ]
})

let createdSampleRecipes = []
beforeEach(async () => {
  await Recipe.deleteMany({})
  createdSampleRecipes = []
  for (const recipe of sampleRecipes) {
    const createdRecipe = new Recipe(recipe)
    createdSampleRecipes.push(await createdRecipe.save())
  }
})
describe('getting a recipe', () => {
  test('should return the full recipe', async () => {
    const recipe = await getRecipeById(createdSampleRecipes[0]._id)
    expect(recipe.toObject()).toEqual(createdSampleRecipes[0].toObject())
  })
  test('should fail if the id does not exist', async () => {
    const recipe = await getRecipeById('000000000000000000000000')
    expect(recipe).toEqual(null)
  })
})
describe('updating recipes', () => {
  test('should update the specified property', async () => {
    await updateRecipe(testUser._id, createdSampleRecipes[0]._id, {
      ingredients: ['chicken', 'rice', 'peas'],
    })
    const updatedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(updatedRecipe.ingredients).toContain('peas')
  })
  test('should not update other properties', async () => {
    await updateRecipe(testUser._id, createdSampleRecipes[0]._id, {
      ingredients: ['chicken', 'rice', 'peas'],
    })
    const updatedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(updatedRecipe.title).toEqual('Chicken and Rice')
  })

  test('should update the updatedAt timestamp', async () => {
    await updateRecipe(testUser._id, createdSampleRecipes[0]._id, {
      ingredients: ['chicken', 'rice', 'peas'],
    })
    const updatedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(updatedRecipe.updatedAt.getTime()).toBeGreaterThan(
      createdSampleRecipes[0].updatedAt.getTime(),
    )
  })

  test('should fail if the id does not exist', async () => {
    const recipe = await updateRecipe(testUser._id, '000000000000000000000000', {
      ingredients: ['chicken', 'rice', 'peas'],
    })
    expect(recipe).toEqual(null)
  })
})

describe('deleting recipes', () => {
  test('should remove the recipe from the database', async () => {
    const result = await deleteRecipe(testUser._id, createdSampleRecipes[0]._id)
    expect(result.deletedCount).toEqual(1)
    const deletedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)
    expect(deletedRecipe).toEqual(null)
  })
  test('should fail if the id does not exist', async () => {
    const result = await deleteRecipe('000000000000000000000000')
    expect(result.deletedCount).toEqual(0)
  })
})
describe('listing recipes', () => {
  test('should be able to filter recipes by author', async () => {
    const recipes = await listRecipesByAuthor(testUser.username)
    expect(recipes.length).toBe(3)
  })
  test('should be able to filter recipes by tag', async () => {
    const recipes = await listRecipesByTag('vegetarian')  
    expect(recipes.length).toBe(1)
  })
  test('should be able to list all recipes', async () => {
    const recipes = await listAllRecipes()
    expect(recipes.length).toBe(createdSampleRecipes.length)
  })
})
describe('creating recipes', () => {
  test('with all parameters should succeed', async () => {
    const recipe = {
      title: 'Grilled Salmon',
      ingredients: ['salmon', 'lemon'],
      imageURL: 'http://example.com/salmon.jpg',
      tags: ['seafood'],
    }
    const createdRecipe = await createRecipe(testUser._id, recipe)
    expect(createdRecipe._id).toBeInstanceOf(mongoose.Types.ObjectId)
    const foundRecipe = await Recipe.findById(createdRecipe._id)
    expect(foundRecipe).toEqual(expect.objectContaining(recipe))
    expect(foundRecipe.createdAt).toBeInstanceOf(Date)
    expect(foundRecipe.updatedAt).toBeInstanceOf(Date)
  })
  test('without title should fail', async () => {
    const recipe = {
      ingredients:  ['flour', 'water'],
    }
    try {
      await createRecipe(testUser._id, recipe)
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(err.message).toContain('`title` is required')
    }
  })
  test('with minimal parameters should succeed', async () => {
    const recipe = {
      title: 'Only a title',
    }
    const createdRecipe = await createRecipe(testUser._id, recipe)
    expect(createdRecipe._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
})
