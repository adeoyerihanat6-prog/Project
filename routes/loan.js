import express from 'express';
import { approveLoan, createLoan, deleteLoan, getAllLoans, getLoanById, rejectLoan, updateLoan, payInstallment} from '../controllers/loanController.js';

import authorize from '../middlewares/authorize.js';

const router = express.Router();

router.get('/getAllLoans', authorize(), getAllLoans);
router.post('/createLoan', authorize(), createLoan);
router.get('/:id', authorize(), getLoanById);
router.put('/:id', authorize(), updateLoan);
router.delete('/:id', authorize(), deleteLoan);

router.patch("/:id/approve", authorize(["admin"]), approveLoan);
router.patch("/:id/reject", authorize(["admin"]), rejectLoan);


router.patch("/:id/pay/:month", authorize(), payInstallment);

export default router;