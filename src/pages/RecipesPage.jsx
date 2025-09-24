import { RecipeList } from '../components/Recipe.jsx'
import { CreateRecipe } from '../components/CreateRecipe.jsx'
import { Header } from '../components/Header.jsx'
import { getRecipes } from '../api/recipes.js'
import {useQuery} from '@tanstack/react-query'

export function RecipesPage() {
  const recipesQuery = useQuery({
    queryKey: ['recipes'],
    queryFn: getRecipes,
  })

  const recipes = recipesQuery.data ?? []

  return (
    <div style={{ padding: 8 }}>
      <Header />
       <br />
        <br />
      <CreateRecipe />
      <br />
      <hr />
      <h2>All Recipes</h2>
      <RecipeList recipes={recipes}/>
      </div>
  )
}
