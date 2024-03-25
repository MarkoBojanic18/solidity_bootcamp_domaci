import React, { useState } from "react";
import UserFactoryABI from "../../contracts/UserFactory.json";
import "./ExpenseDetailsModal.css";

const ExpenseDetailsModal = ({
  onClose,
  web3,
  account,
  userFactoryAddress,
  expense,
}) => {
  const [expenseData, setExpenseData] = useState({
    id: Number(expense.id),
    category: expense.category,
    amount: Number(expense.amount),
    description: expense.description,
    canceled: Number(expense.canceled),
  });

  function formatDate(_date) {
    // Convert Unix timestamp to milliseconds
    const milliseconds = _date * 1000;

    // Create a new Date object with the converted milliseconds
    const dateObject = new Date(milliseconds);

    // Extract individual date and time components
    const date = dateObject.toLocaleDateString();
    const time = dateObject.toLocaleTimeString();

    const date_time = date + " " + time;

    return date_time;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkbox differently
    if (type === "checkbox") {
      setExpenseData({ ...expenseData, [name]: checked ? 1 : 0 });
    } else {
      setExpenseData({ ...expenseData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    if (typeof window.ethereum === "undefined" || !window.ethereum.isMetaMask) {
      console.log("MetaMask is not installed or not connected!");
      return;
    }
    if (!web3 || !account) {
      alert("Web3 instance or account is not available.");
      return;
    }
    try {
      const userFactory = new web3.eth.Contract(
        UserFactoryABI.abi,
        userFactoryAddress
      );

      const transactionParameters = {
        to: userFactoryAddress,
        from: account, // must match user's active address
        data: userFactory.methods
          .changeExpenseForUser(
            expenseData.id,
            expenseData.category,
            expenseData.amount,
            expenseData.description,
            expenseData.canceled
          )
          .encodeABI({ from: account }),
      }; // call to contract method

      // txHash is a hex string
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });

      console.log("Transaction Hash:", txHash);

      console.log(expenseData);

      onClose();
    } catch (error) {
      console.error("Error during add of saving a new expense:", error);
    }
  };

  return (
    <div className="create-new-client-modal">
      <div className="modal-content">
        <select
          name="category"
          defaultValue={expenseData.category}
          onChange={handleChange}
          className="modal-input"
        >
          <option value="">Select a category</option>
          <option value="Kupovina u prodavnici">Kupovina u prodavnici</option>
          <option value="Racun u kaficu">Racun u kaficu</option>
          <option value="Racun na benzinskoj pumpi">
            Racun na benzinskoj pumpi
          </option>
          <option value="Racun za parking">Racun za parking</option>
        </select>
        <input
          className="modal-input"
          name="amount"
          placeholder="amount"
          value={expenseData.amount}
          onChange={handleChange}
        />

        <input
          className="modal-input"
          value={formatDate(Number(expense.date))}
          disabled
        />
        <textarea
          className="modal-input"
          name="description"
          placeholder="description"
          value={expenseData.description}
          onChange={handleChange}
        />

        {/* Check if the expense is canceled, if so, apply the round-box class */}
        <label>
          Canceled:
          <input
            type="checkbox"
            name="canceled"
            checked={expenseData.canceled === 1}
            onChange={handleChange}
          />
        </label>

        <button className="modal-button" onClick={handleSubmit}>
          Create Expense
        </button>
        <button className="modal-button cancel-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ExpenseDetailsModal;
