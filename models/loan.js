import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    interestRate: {
      type: Number,
      required: true,
      min: 0,
    },

    term: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },

    monthlyRepayment: {
      type: Number,
      default: 0,
    },

    totalRepayment: {
      type: Number,
      default: 0,
    },

    repaymentPlan: {
      type: [
        {
          month: {
            type: Number,
            required: true,
          },
          amount: {
            type: Number,
            required: true,
          },
          paid: {
            type: Boolean,
            default: false,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const Loan =
  mongoose.models.Loan ||
  mongoose.model("Loan", loanSchema);

export default Loan;