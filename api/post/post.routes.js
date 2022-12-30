const express = require('express')
const { addPost, getPosts, deletePost, getPostById, updatePost } = require('./post.controller')
const router = express.Router()

router.get('/:id', getPostById)
router.get('/', getPosts)
router.put('/:id', updatePost)
router.post('/', addPost)
router.delete('/:id', deletePost)

module.exports = router