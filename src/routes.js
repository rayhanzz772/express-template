const express = require('express')
const router = express.Router()

router.get('/status', (req, res) => {
  res.send('Running ⚡')
})

router.use('/auth', require('./modules/auth/index'))
router.use('/users', require('./modules/user/index'))
router.use('/permissions', require('./modules/permission/index'))
router.use('/roles', require('./modules/role/index'))

module.exports = router
