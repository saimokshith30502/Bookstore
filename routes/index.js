const express = require('express')

const router = express.Router();

router.get('/', (req,res) => res.render('welcome'))

router.get('/welcome', (req,res) => res.render('welcome'))
router.get('/adventure-books', (req,res) => res.render('adventure-books'))
router.get('/comedy-books', (req,res) => res.render('comedy-books'))
router.get('/fiction-books', (req,res) => res.render('fiction-books'))
router.get('/horror-books', (req,res) => res.render('horror-books'))
router.get('/technology-books', (req,res) => res.render('technology-books'))
router.get('/romance-books', (req,res) => res.render('romance-books'))
 
// router.post('/welcome', (req,res) => {
//     const user = req.body
//     res.render('welcome',{
//         user
//     })
// })

module.exports = router