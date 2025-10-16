import mongoose, { Schema } from 'mongoose'
const recipeSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    contents: String,
    imageURL: String,
    tags: [String],
    likes: [{type: Schema.Types.ObjectId, ref: 'user'}]
  },
  { timestamps: true },
)
export const Recipe = mongoose.model('recipe', recipeSchema)
