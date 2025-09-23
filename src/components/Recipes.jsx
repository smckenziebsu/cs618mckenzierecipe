import PropTypes from 'prop-types'
import { User } from './User.jsx'
export function Recipe ({ title, ingredients, imageURL, author: userId }) {
  return (
    <article>
      <h3>{title}</h3>

      {/* Show image if provided*/}
      {imageURL && <img src={imageURL} alt={title} style={{ maxWidth: '300px' }} />}
      
       {/* Show ingredients if provided */}
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
