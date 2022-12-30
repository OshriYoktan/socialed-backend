var dbService = require('../../services/db.service.js')

module.exports = {
    removePost,
    getPostById,
    query,
    addPost,
    updatePost,
}

async function query(filterBy) {
    try {
        var sql = `SELECT * FROM post`
        const posts = await dbService.runSQL(sql)
        if (filterBy.q) {
            return posts.filter((post) => {
                post = _readyForSend(post)
                return post.title.toLowerCase().includes(filterBy.q.toLowerCase())
            })
        } else {
            posts.forEach(post => _readyForSend(post)  )
            return posts
        }
    } catch (err) {
        console.log('err:', err)
    }
}

async function getPostById(postId) {
    var sql = `SELECT * FROM post WHERE _id = '${postId}'`;
    var post = await dbService.runSQL(sql);
    if (post.length === 1) {
        const postToReturn = _readyForSend(post[0])
        return postToReturn;
    }
    else if (post.length > 1) throw new Error(`multiple id found! ${postId}`);
    throw new Error(`post id ${postId} not found`);
}

async function addPost(post) {
    try {
        post._id = makeId(20)
        post._id = Math.floor(Math.random() * 100)
        var sql = `INSERT INTO post 
        (_id, title,image,user,likes,liked,comments) VALUES 
        ('${post._id}', '${post.title}', '${post.image}', '${JSON.stringify(post.user)}', '${post.likes}', '${JSON.stringify(post.liked)}', '${JSON.stringify(post.comments)}')`;
        await dbService.runSQL(sql);
        return post
    } catch (err) {
        console.log('err:', err)
    }
}

async function updatePost(post) {
    try {
        var sql = `UPDATE post SET
        _id = '${post._id}',
        title = '${post.title}',
        likes = '${post.likes}',
        liked = '${JSON.stringify(post.liked)}',
        comments = '${JSON.stringify(post.comments)}'
        WHERE post._id = '${post._id}'`;
        var okPacket = await dbService.runSQL(sql);
        if (okPacket.affectedRows !== 0) return post;
        throw new Error(`No post updated - post id ${post.id}`);
    } catch (err) {
        console.log('err:', err)
    }
}

async function removePost(postId) {
    try {
        var sql = `DELETE FROM post WHERE _id = '${postId}'`;
        const res = await dbService.runSQL(sql)
            .then(okPacket => okPacket.affectedRows === 1
                ? okPacket
                : Promise.reject(new Error(`No post deleted - post id ${postId}`)));
    } catch (err) {
        console.log('err:', err)
    }
}

function _readyForSend(post) {
    post.liked = JSON.parse(post.liked)
    post.user = JSON.parse(post.user)
    post.comments = JSON.parse(post.comments)
    return post;
}

function makeId(length = 11) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}