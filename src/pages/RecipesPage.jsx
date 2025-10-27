import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRecipes, getTopRecipes } from '../api/recipes.js'

import { Header } from '../components/Header.jsx'
import { CreateRecipe } from '../components/CreateRecipe.jsx'
import { RecipeList } from '../components/RecipeList.jsx'
import { RecipeFilter } from '../components/RecipeFilter.jsx'
import { RecipeSorting } from '../components/RecipeSorting.jsx'

export function RecipesPage() {
  const [sortBy, setSortBy] = useState('latest')

  const { data: recipes = [], isLoading } = useQuery({
    queryKey: [sortBy],
    queryFn: sortBy === 'latest' ? getRecipes : getTopRecipes,
  })

  const [filterValue, setFilterValue] = useState('')
  const [sortOrder, setSortOrder] = useState('ascending')
  const [sortField, setSortField] = useState('title')

  if (isLoading) return <p>Loading recipes...</p>

  let filtered = recipes.filter((r) =>
    r.title.toLowerCase().includes(filterValue.toLowerCase()),
  )

  let sorted = [...filtered].sort((a, b) => {
    if (sortField === 'likes') {
      return sortOrder === 'ascending'
        ? (a.likes?.length || 0) - (b.likes?.length || 0)
        : (b.likes?.length || 0) - (a.likes?.length || 0)
    } else {
      return sortOrder === 'ascending'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    }
  })

  return (
    <div style={{ padding: 8 }}>
      <Header />
      <button
        onClick={() => setSortBy(sortBy === 'latest' ? 'popular' : 'latest')}
      >
        {sortBy === 'latest' ? 'Show Most Liked' : 'Show All'}
      </button>

      <CreateRecipe />
      <hr />
      <h2>{sortBy === 'latest' ? 'All Recipes' : 'Top Recipes'}</h2>

      <RecipeFilter
        field='title'
        value={filterValue}
        onChange={setFilterValue}
      />
      <RecipeSorting
        fields={['title', 'likes']}
        value={sortField}
        onChange={setSortField}
        orderValue={sortOrder}
        onOrderChange={setSortOrder}
      />

      <RecipeList recipes={sorted} />
    </div>
  )
}
