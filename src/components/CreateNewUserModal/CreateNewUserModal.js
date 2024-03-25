import React, { useState } from "react";
import UserFactoryABI from "../../contracts/UserFactory.json";
import "./CreateNewUserModal.css";

const NewClientModal = ({ onClose, web3, account, userFactoryAddress }) => {
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
        data: userFactory.methods.createUser().encodeABI(),
      }; // call to contract method

      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });

      console.log("Transaction Hash:", txHash);
      onClose();
    } catch (error) {
      console.error("Error during creation of a new user:", error);
    }
  };

  return (
    <div className="create-new-client-modal">
      <div className="modal-content">
        <input
          className="modal-input"
          readOnly
          name="account"
          value={account}
        />

        <button className="modal-button" onClick={handleSubmit}>
          Create User
        </button>
        <button className="modal-button cancel-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NewClientModal;
