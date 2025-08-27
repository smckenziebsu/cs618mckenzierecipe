import mongoose from 'mongoose'
import { describe, expect, test, beforeEach } from '@jest/globals'
import {
  createPost,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  getPostById,
  updatePost,
  deletePost,
} from '../services/posts.js'
import { Post } from '../db/models/post.js'
const samplePosts = [
  { title: 'Learning Redux', author: 'Daniel Bugl', tags: ['redux'] },
  { title: 'Learn React Hooks', author: 'Daniel Bugl', tags: ['react'] },
  {
    title: 'Full-Stack React Projects',
    author: 'Daniel Bugl',
    tags: ['react', 'nodejs'],
  },
  { title: 'Guide to TypeScript' },
]
let createdSamplePosts = []
beforeEach(async () => {
  await Post.deleteMany({})
  createdSamplePosts = []
  for (const post of samplePosts) {
    const createdPost = new Post(post)
    createdSamplePosts.push(await createdPost.save())
  }
})
describe('getting a post', () => {
  test('should return the full post', async () => {
    const post = await getPostById(createdSamplePosts[0]._id)
    expect(post.toObject()).toEqual(createdSamplePosts[0].toObject())
  })
  test('should fail if the id does not exist', async () => {
    const post = await getPostById('000000000000000000000000')
    expect(post).toEqual(null)
  })
})
describe('updating posts', () => {
  test('should update the specified property', async () => {
    await updatePost(createdSamplePosts[0]._id, {
      author: 'Test Author',
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.author).toEqual('Test Author')
  })
  test('should not update other properties', async () => {
    await updatePost(createdSamplePosts[0]._id, {
      author: 'Test Author',
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.title).toEqual('Learning Redux')
  })
  test('should update the updatedAt timestamp', async () => {
    await updatePost(createdSamplePosts[0]._id, {
      author: 'Test Author',
    })
    const updatedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(
      createdSamplePosts[0].updatedAt.getTime(),
    )
  })
  test('should fail if the id does not exist', async () => {
    const post = await updatePost('000000000000000000000000', {
      author: 'Test Author',
    })
    expect(post).toEqual(null)
  })
})
describe('deleting posts', () => {
  test('should remove the post from the database', async () => {
    const result = await deletePost(createdSamplePosts[0]._id)
    expect(result.deletedCount).toEqual(1)
    const deletedPost = await Post.findById(createdSamplePosts[0]._id)
    expect(deletedPost).toEqual(null)
  })
  test('should fail if the id does not exist', async () => {
    const result = await deletePost('000000000000000000000000')
    expect(result.deletedCount).toEqual(0)
  })
})
describe('listing posts', () => {
 
})
describe('creating posts', () => {
  
})
 
