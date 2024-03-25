import React, { useState } from "react";
import UserFactoryABI from "../../contracts/UserFactory.json";
import "./CreateNewExpenseModal.css";

const CreateNewExpenseModal = ({
  onClose,
  web3,
  account,
  userFactoryAddress,
}) => {
  const [expenseData, setExpenseData] = useState({
    category: "",
    amount: 0,
    description: "",
  });

  const handleChange = (e) => {
    setExpenseData({ ...expenseData, [e.target.name]: e.target.value });
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
          .createExpense(
            expenseData.category,
            expenseData.amount,
            expenseData.description
          )
          .encodeABI({ from: account }),
      }; // call to contract method

      // txHash is a hex string
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });

      console.log("Transaction Hash:", txHash);
      onClose();
    } catch (error) {
      console.error("Error during add of saving a new expense:", error);
    }
  };

  return (
    <div className="create-new-client-modal">
      <div className="modal-content">
        <select name="category" onChange={handleChange} className="modal-input">
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
          onChange={handleChange}
        />
        <textarea
          className="modal-input"
          name="description"
          placeholder="description"
          onChange={handleChange}
        />

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

export default CreateNewExpenseModal;
