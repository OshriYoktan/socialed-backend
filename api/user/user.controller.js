const logger = require('../../services/logger.service')
const userService = require('./user.service')

async function getUsers(req, res) {
    try {
        const filterBy = req.query
        const users = await userService.query(filterBy)
        res.send(users)
    } catch (err) {
        logger.error('Cannot get users', err)
        res.status(500).send({ err: 'Failed to get users' })
    }
}

async function getUserById(req, res) {
    try {
        const user = await userService.getUserById(req.params.id)
        res.send(user)
    } catch (err) {
        logger.error('Cannot get users', err)
        res.status(500).send({ err: 'Failed to get users' })
    }
}

async function deleteUser(req, res) {
    try {
        await userService.removeUser(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete user', err)
        res.status(500).send({ err: 'Failed to delete user' })
    }
}

async function addUser(req, res) {
    try {
        var user = req.body
        user = await userService.addUser(user)
        res.send(user)
    } catch (err) {
        logger.error('Failed to add user', err)
        res.status(500).send({ err: 'Failed to add user' })
    }
}

async function updateUser(req, res) {
    try {
        var user = req.body
        user = await userService.updateUser(user)
        res.send(user)
    } catch (err) {
        logger.error('Failed to update user', err)
        res.status(500).send({ err: 'Failed to update user' })
    }
}

module.exports = {
    getUsers,
    deleteUser,
    getUserById,
    addUser,
    updateUser,
}