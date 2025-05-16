const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/verifyToken');

router.post('/', userController.createUser);
router.get('/getUser', verifyToken, userController.getUser);
router.get('/all', userController.getAllUsers);
router.patch('/changeProfileImg/:id', userController.changeProfileImg);
router.delete('/deleteUser/:id', userController.deleteUser);

module.exports = router;
