import express from 'express';
import { approveLoan, createLoan, deleteLoan, getAllLoans, getLoanById, rejectLoan, updateLoan } from '../controllers/loanController.js';
import { authorize } from '../controllers/userController.js';


const router = express.Router();

router.get('/getAllLoans', authorize(["admin"]), getAllLoans);
router.post('/createLoan', createLoan);
router.get('/:id', getLoanById);
router.put('/:id', updateLoan);
router.delete('/:id', deleteLoan);
router.patch("/:id/approve", authorize(["admin"]), approveLoan);
router.patch("/:id/reject", authorize(["admin"]), rejectLoan);



export default router;