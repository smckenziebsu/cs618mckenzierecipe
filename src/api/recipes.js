
export const getRecipes = async (queryParams) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/v1/recipes?` +
      new URLSearchParams(queryParams),
  )
  return await res.json()
}

export const createRecipe = async (token, recipe) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(recipe),
  })
  return await res.json()
}

export const likeRecipe = async (token, recipeId) => {
  const res = await fetch(
  `${import.meta.env.VITE_BACKEND_URL}/api/v1/recipes/${recipeId}/like`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  },
  )
  
  if (!res.ok) {
    throw new Error('Failed to like recipe')
  }
  return await res.json()
}

export const getTopRecipes = async () => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/recipes/top`)

  if (!res.ok) {
    throw new Error ('Failed to fetch top recipes')
  }

  return await res.json()
}