import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext.jsx'
import { createPost } from '../api/recipes.js'

export function CreateRecipe() {
  const [title, setTitle] = useState('')
  const [contents, setContents] = useState('')
  const [token] = useAuth()

  const queryClient = useQueryClient()
  const createRecipeMutation = useMutation({
       mutationFn: () =>
      createRecipe(token, {
        title,
        ingredients: ingredients.split(',').map((i) => i.trim()),
      }),
    onSuccess: () => queryClient.invalidateQueries(['recipes']),
  })
  
  const handleSubmit = (e) => {
    e.preventDefault()
    createRecipeMutation.mutate()
  }
  if (!token) return <div>Please log in to create new recipes.</div>
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='create-title'>Title: </label>
        <input
          type='text'
          name='create-title'
          id='create-title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <br />
      <br />
      <br />
      <label htmlfFor="create-ingredients">Ingreients (comma seperated): </label>
      <input
        type='text'
        name="create-title"
        id="create-title"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        placeholder="e.g. chicken, rice"
      />

      
      {createPostMutation.isSuccess ? (
        <>
          <br />
          Post created successfully!
        </>
      ) : null}
    </form>
  )
}
