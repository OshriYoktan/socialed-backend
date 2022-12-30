const logger = require('../../services/logger.service')
const postService = require('./post.service')

async function getPosts(req, res) {
    try {
        const filterBy = req.query
        const posts = await postService.query(filterBy)
        res.send(posts)
    } catch (err) {
        logger.error('Cannot get posts', err)
        res.status(500).send({ err: 'Failed to get posts' })
    }
}

async function getPostById(req, res) {
    try {
        const post = await postService.getPostById(req.params.id)
        res.send(post)
    } catch (err) {
        logger.error('Cannot get posts', err)
        res.status(500).send({ err: 'Failed to get posts' })
    }
}

async function deletePost(req, res) {
    try {
        await postService.removePost(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete post', err)
        res.status(500).send({ err: 'Failed to delete post' })
    }
}

async function addPost(req, res) {
    try {
        var post = req.body
        post = await postService.addPost(post)
        res.send(post)
    } catch (err) {
        logger.error('Failed to add post', err)
        res.status(500).send({ err: 'Failed to add post' })
    }
}

async function updatePost(req, res) {
    try {
        var post = req.body
        post = await postService.updatePost(post)
        res.send(post)
    } catch (err) {
        logger.error('Failed to update post', err)
        res.status(500).send({ err: 'Failed to update post' })
    }
}

module.exports = {
    getPosts,
    deletePost,
    getPostById,
    addPost,
    updatePost,
}