const {Router} = require('express')
const router = Router()
const {registerUser , loginUser , changeAvatar , editUser , getAuthors , getUser} = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')




router.post('/register' , registerUser)
router.post('/login' , loginUser)
router.get('/:id' , getUser)
router.get('/' , getAuthors)
router.post('/change-avatar' , authMiddleware , changeAvatar)
router.patch('/edit-user' , authMiddleware , editUser)


router.get('/' , (req , res) => {
    res.json("This is the user route")
})

module.exports = router