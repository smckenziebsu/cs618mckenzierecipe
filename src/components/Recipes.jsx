import PropTypes from 'prop-types'
import { User } from './User.jsx'
import {useQuery} from '@tanstack/react-query'
import { getRecipes } from '../api/recipes.js'

export function Recipe ({ title, ingredients, imageURL, author: userId }) {
  return (
    <article>
      <h3>{title}</h3>

      
      {imageURL && <img src={imageURL} alt={title} style={{ maxWidth: '300px' }} />}
      
       
      {ingredients && ingredients.length > 0 && (
        <ul>
          {ingredients.map((ingredient, idx) => (
            <li key={idx}>{ingredient}</li>
          ))}
        </ul>
      )}

         {userId && (
        <em>
          <br />
          Written by <User id={userId} />
        </em>
      )}
    </article>
  )
}
Recipe.propTypes = {
  title: PropTypes.string.isRequired,
  ingredients: PropTypes.arrayOf(PropTypes.string),
  imageURL: PropTypes.string,
  author: PropTypes.string
}

export function RecipeList(){
  const {data: recipes = [], isLoading, isError} = useQuery({
    queryKey: ['recipes'],
    queryFn: getRecipes,
  })

  if (isLoading) return <p>Loading recipes..</p>

  return(
    <div>
      {recipes.length === 0 ? (
        <p>No recipes</p>
      ):(
        recipes.map((r) => (
          <Recipe key={r._id} {...r} />
        ))
      )}
    </div>
  )
}
