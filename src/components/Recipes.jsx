import PropTypes from 'prop-types'
import { User } from './User.jsx'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getRecipes, likeRecipe } from '../api/recipes.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export function Recipe({
  _id,
  title,
  contents,
  imageURL,
  author: userId,
  likes = [],
}) {
  const [token] = useAuth()
  const queryClient = useQueryClient()

  const likeMutation = useMutation({
    mutationFn: () => likeRecipe(token, _id),
    onSuccess: () => {
      queryClient.invalidateQueries(['recipes'])
      queryClient.invalidateQueries(['topRecipes'])
    },
  })

  const handleLike = () => {
    if (!token) {
      alert('Please log in to like recipes!')
      return
    }
    likeMutation.mutate()
  }
  return (
    <article>
      <h3>{title}</h3>

      {imageURL && (
        <img src={imageURL} alt={title} style={{ maxWidth: '300px' }} />
      )}

      {contents && <p style={{ whiteSpace: 'pre-line' }}>{contents}</p>}

      {userId && (
        <em>
          <br />
          Written by <User id={userId} />
        </em>
      )}
      <br />
      <button onClick={handleLike}>Like</button>
      <span style={{ marginLeft: '8px' }}>
        {likes.length} {likes.length === 1 ? 'Like' : 'Likes'}
      </span>
    </article>
  )
}
Recipe.propTypes = {
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  imageURL: PropTypes.string,
  author: PropTypes.string,
  likes: PropTypes.array,
}

export function RecipeList() {
  const { data: recipes = [], isLoading } = useQuery({
    queryKey: ['recipes'],
    queryFn: getRecipes,
  })

  if (isLoading) return <p>Loading recipes..</p>

  return (
    <div>
      {recipes.length === 0 ? (
        <p>No recipes</p>
      ) : (
        recipes.map((r) => <Recipe key={r._id} {...r} />)
      )}
    </div>
  )
}
