import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext.jsx'
import { createRecipe } from '../api/recipes.js'

export function CreateRecipe() {
  const [title, setTitle] = useState('')
  const [contents, setContents] = useState('')
  const [imageURL, setImageURL] = useState('')
  const [token] = useAuth()

  const queryClient = useQueryClient()
  const createRecipeMutation = useMutation({
       mutationFn: () =>
      createRecipe(token, {
        title,
        contents,
        imageURL,
        
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
        <label htmlFor='create-title'>Recipe Title: </label>
        <input
          type='text'
          name='create-title'
          id='create-title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <br />
      <div>
      <label htmlFor="create-contents">Ingredients: </label>
      <textarea
        name="create-contents"
        id="create-contents"
        value={contents}
        onChange={(e) => setContents(e.target.value)}
        rows="6"
        
        
      />
      <br />
    
      </div>
      <br />
      
      <div>
        <label htmlFor="create-imageURL"> Image URL: </label>
        <input
        type="text"
          name="create-imageURL"
          id="create-imageURL"
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
          
        />
      </div>
      <br />

      <input
        type="submit"
        value={createRecipeMutation.isPending ? 'Creating...' : 'Create Recipe'}
        disabled={!title || !contents}
      />
      {createRecipeMutation.isSuccess ? (
        <>
          <br />
          Recipe created successfully!
        </>
      ) : null}
    </form>
  )
}
