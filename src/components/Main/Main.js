import React, { useState, useEffect } from "react";
import Web3 from "web3";
import "./Main.css";
import CreateNewUserModal from "../CreateNewUserModal/CreateNewUserModal.js";
import ExpensesList from "../ExpensesList/ExpensesList.js";

const userFactoryAddress = "0x59E529dd76869f7491604bf9339e3Ccb5358C309";
const sepoliaRPCUrl =
  "https://sepolia.infura.io/v3/c2de4811b5b24494b1cbee2275a333d4";

const Main = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExpenseList, setCallExpenseList] = useState(false);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        console.log("Connected to Ethereum account: ", accounts[0]);
        console.log("Account ", account);
        console.log(typeof accounts[0]);
        window.ethereum.on("accountsChanged", (newAccounts) => {
          setAccount(newAccounts[0]);
          console.log("Switched to account: ", newAccounts[0]);
        });
      } else {
        console.log("MetaMask is not installed.");
      }
    } catch (error) {
      console.error("Error connecting to MetaMask: ", error);
    }
  };

  useEffect(() => {
    const web3Instance = new Web3(sepoliaRPCUrl);
    console.log(web3Instance);
    setWeb3(web3Instance);
    connectWallet();
    console.log("Web3 instance set up: ", web3);
  }, []);

  return (
    <div className="main-container">
      {!account ? (
        <button className="connect-wallet-button" onClick={connectWallet}>
          Connect with metamask
        </button>
      ) : (
        <p>Logged as: {account}</p>
      )}

      <button
        className="create-new-client-button"
        onClick={() => setShowCreateModal(true)}
      >
        Create New User
      </button>

      <button
        className="create-new-client-button"
        onClick={() => setCallExpenseList(true)}
      >
        Expenses
      </button>

      {showExpenseList && (
        <ExpensesList
          web3={web3}
          account={account}
          userFactoryAddress={userFactoryAddress}
        />
      )}

      {showCreateModal && account && (
        <CreateNewUserModal
          className="create-new-client-modal"
          web3={web3}
          account={account}
          onClose={() => setShowCreateModal(false)}
          userFactoryAddress={userFactoryAddress}
        />
      )}
    </div>
  );
};

export default Main;
