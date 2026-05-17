import Loan from "../models/loan.js";

const getAllLoans = async (req, res) => {
    try {
        const loans = await Loan.find().populate("borrower");
        res.status(200).json(loans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLoanById = async (req, res) => {
    try {
        const loanId = req.params.id;
        const loanData = await Loan.findById(loanId).populate("borrower");
        if (!loanData) {
            return res.status(404).json({ message: "Loan not found" });
        }
        res.status(200).json(loanData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteLoan = async (req, res) => {
    try {
        const loanId = req.params.id;
        const deletedLoan = await Loan.findByIdAndDelete(loanId);
        if (!deletedLoan) {
            return res.status(404).json({ message: "Loan not found" });
        }
        res.status(200).json({ message: "Loan deleted successfully" });
    } catch (error) {   
        res.status(500).json({ message: error.message });
    }
};

const createLoan = async (req, res) => {
    try {
        const { amount, interestRate, term } = req.body;

const newLoan = new Loan({
  borrower: req.user_.id,
  amount,
  interestRate,
  term,
});
        await newLoan.save();
        res.status(201).json(newLoan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateLoan = async (req, res) => {
    try {
        const loanId = req.params.id;
        const { borrower, amount, interestRate, term, status } = req.body;
        const updatedLoan = await Loan.findByIdAndUpdate(
            loanId,
            { borrower, amount, interestRate, term, status },
            { new: true }
        ).populate("borrower");
        if (!updatedLoan) {
            return res.status(404).json({ message: "Loan not found" });
        }
        res.status(200).json(updatedLoan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const approveLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    // 1. Update status
    loan.status = "approved";

    // 2. Calculate interest
    const interest = (loan.amount * loan.interestRate) / 100;

    // 3. Total repayment (principal + interest)
    loan.totalRepayment = loan.amount + interest;

    // 4. Monthly repayment
    loan.monthlyRepayment = loan.totalRepayment / loan.term;

    // 5. Generate repayment plan
    loan.repaymentPlan = Array.from({ length: loan.term }, (_, i) => ({
      month: i + 1,
      amount: loan.monthlyRepayment,
      paid: false,
    }));

    // 6. Save updated loan
    await loan.save();

    res.status(200).json({
      message: "Loan approved successfully",
      loan,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const rejectLoan = async (req, res) => {
  try {
    const loanId = req.params.id;

    const rejectedLoan = await Loan.findByIdAndUpdate(
      loanId,
      { status: "rejected" },
      { new: true }
    ).populate("borrower");

    if (!rejectedLoan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    res.status(200).json({
      message: "Loan rejected successfully",
      rejectedLoan,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const payInstallment = async (req, res) => {
  try {
    const { id, month } = req.params;

    const loan = await Loan.findById(id);

    if (!loan) return res.status(404).json({ message: "Loan not found" });

    const installment = loan.repaymentPlan.find(
      (p) => p.month === Number(month)
    );

    if (!installment) {
      return res.status(404).json({ message: "Invalid month" });
    }

    if (installment.paid) {
      return res.status(400).json({ message: "Already paid" });
    }

    installment.paid = true;

    const allPaid = loan.repaymentPlan.every((p) => p.paid);

    if (allPaid) {
      loan.status = "completed";
    }

    await loan.save();

    res.status(200).json({ message: "Payment successful", loan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllLoans, getLoanById, createLoan, updateLoan, deleteLoan, rejectLoan, approveLoan, payInstallment };