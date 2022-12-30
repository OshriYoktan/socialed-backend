const express = require('express')
const { addUser, getUsers, deleteUser, getUserById, updateUser } = require('./user.controller')
const router = express.Router()

router.get('/:id', getUserById)
router.get('/', getUsers)
router.put('/:id', updateUser)
router.post('/', addUser)
router.delete('/:id', deleteUser)

module.exports = router