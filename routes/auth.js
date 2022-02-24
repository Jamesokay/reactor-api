const router = require('express').Router()
const User = require('../models/User')

//Register
router.get('/register', async (req, res) => {
    const user = await new User({
        username: 'Ron',
        email: 'weasleyboi@gmail.com',
        password: 'ronald22'
    })

    await user.save()
    res.send('OKAY')
})

module.exports = router