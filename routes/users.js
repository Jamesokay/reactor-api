const router = require('express').Router()

// All user logic handled here

router.get('/', (req, res) => {
    res.send('User route accessed')
})

module.exports = router