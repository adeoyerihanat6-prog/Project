import express from 'express';

import { authorize, createUser, deleteUser, getAllUsers, getUserById, login, updateUser } from '../controllers/userController.js';

const router = express.Router();
router.post('/createUser', createUser);
router.post('/login', login);
router.get('/getAllUsers', authorize(["admin"]), getAllUsers);

router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
export default router;