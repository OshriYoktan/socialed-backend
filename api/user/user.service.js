var dbService = require('../../services/db.service.js')

module.exports = {
    removeUser,
    getUserById,
    query,
    addUser,
    updateUser,
}

async function query(filterBy) {
    try {
        var sql = `SELECT * FROM user`
        const users = await dbService.runSQL(sql)
        if (filterBy.q) {
            return users.filter((user) => {
                user = _readyForSend(user)
                return user.firstName.toLowerCase().includes(filterBy.q.toLowerCase())
            })
        } else {
                users.forEach(user => _readyForSend(user))
                return users
            }
        
    } catch (err) {
        console.log('err:', err)
    }
}

async function getUserById(userId) {
    var sql = `SELECT * FROM user WHERE _id = '${userId}'`;
    var user = await dbService.runSQL(sql);
    if (user.length === 1) {
        const userToReturn = _readyForSend(user[0])
        return userToReturn;
    }
    else if (user.length > 1) throw new Error(`multiple id found! ${userId}`);
    throw new Error(`user id ${userId} not found`);
}

async function addUser(user) {
    try {
        // user._id = makeId(20)
        // user._id = Math.floor(Math.random() * 100)
        var sql = `INSERT INTO user 
        (_id, firstName,lastName,password,image,friends,email,likes,social,posts,location,occupation,messages) VALUES 
        ('${user._id}', '${user.firstName}', '${user.lastName}', '${user.password}', '${user.image}', '${JSON.stringify(user.friends)}', '${user.email}', '${user.likes}', '${user.social}', '${JSON.stringify(user.posts)}', '${user.location}', '${user.occupation}','${JSON.stringify(user.messages)}')`;
        await dbService.runSQL(sql);
        return user
    } catch (err) {
        console.log('err:', err)
    }
}

async function updateUser(user) {
    try {
        var sql = `UPDATE user SET
        _id = '${user._id}',
        firstName = '${user.firstName}',
        lastName = '${user.lastName}',
        password = '${user.password}',
        image = '${user.image}',
        friends = '${JSON.stringify(user.friends)}',
        email = '${user.email}',
        likes = '${user.likes}',
        social = '${user.social}',
        posts = '${JSON.stringify(user.posts)}',
        location = '${user.location}',
        occupation = '${user.occupation}',
        messages = '${JSON.stringify(user.messages)}'
        WHERE user._id = '${user._id}'`;
        var okPacket = await dbService.runSQL(sql);
        if (okPacket.affectedRows !== 0) return user;
        throw new Error(`No user updated - user id ${user.id}`);
    } catch (err) {
        console.log('err:', err)
    }
}

async function removeUser(userId) {
    try {
        var sql = `DELETE FROM user WHERE _id = '${userId}'`;
        const res = await dbService.runSQL(sql)
            .then(okPacket => okPacket.affectedRows === 1
                ? okPacket
                : Promise.reject(new Error(`No user deleted - user id ${userId}`)));
    } catch (err) {
        console.log('err:', err)
    }
}

function _readyForSend(user) {
    user.posts = JSON.parse(user.posts)
    user.friends = JSON.parse(user.friends)
    user.messages = JSON.parse(user.messages)
    return user;
}

function makeId(length = 11) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}


