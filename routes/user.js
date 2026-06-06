import express from 'express';
import User from '../models/User.js';
import { createUser, deleteUser, getAllUsers, getUserById, login, updateUser } from '../controllers/userController.js';
import  authorize  from '../middlewares/authorize.js';
const router = express.Router();
router.post('/createUser', createUser);
router.post('/login', login);
router.get('/getAllUsers', authorize(["admin"]), getAllUsers);

router.get('/me', authorize(), async (req, res) => {
  const user = await User.findById(req.user.id).select("-Password");

  res.json(user);
});

router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);



export default router;