const router = require('express').Router()
const User = require('../models/User')

//Register
router.post('/register', async (req, res) => {
    const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })

    await user.save()
    res.send('OKAY')
})

module.exports = router