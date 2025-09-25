import PropTypes from 'prop-types'
import { User } from './User.jsx'
import {useQuery} from '@tanstack/react-query'
import { getRecipes } from '../api/recipes.js'

export function Recipe ({ title, contents, imageURL, author: userId }) {
  return (
    <article>
      <h3>{title}</h3>

      
      {imageURL && <img src={imageURL} alt={title} style={{ maxWidth: '300px' }} />}
      
       
      {contents && <p>{contents}</p>}
       
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
  contents: PropTypes.string,
  imageURL: PropTypes.string,
  author: PropTypes.string
}

export function RecipeList(){
  const {data: recipes = [], isLoading,} = useQuery({
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
