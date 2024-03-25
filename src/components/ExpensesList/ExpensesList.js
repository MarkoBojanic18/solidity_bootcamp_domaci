import React, { useState, useEffect } from "react";
import UserFactoryABI from "../../contracts/UserFactory.json";
import "./ExpensesList.css";
import CreateNewExpenseModal from "../CreateNewExpenseModal/CreateNewExpenseModal.js";
import AllExpenses from "../AllExpenses/AllExpenses.js";
import ExpensesByCategory from "../ExpensesByCategory/ExpensesByCategory.js";

const ExpensesList = ({ web3, account, userFactoryAddress }) => {
  const [user, setUser] = useState("");
  const [userFound, setUserFound] = useState(false);
  const [showCreateExpenseModal, setShowCreateExpenseModal] = useState(false);
  const [showAllExpenses, setShowAllExpenses] = useState(false);
  const [showExpensesByCategory, setShowExpensesByCategory] = useState(false);

  // const loadUserExpenses = async () => {
  //   try {
  //     const clientFactory = new web3.eth.Contract(
  //       ClientFactoryABI.abi,
  //       clientFactoryAddress
  //     );

  //     const clientsFromContract = await clientFactory.methods
  //       .getAllClients()
  //       .call();
  //     setClients(clientsFromContract);
  //   } catch (error) {
  //     console.error("Error while loading client list:", error);
  //   }
  // };

  function openComponent(id) {
    if (id == 1) {
      setShowAllExpenses(true);
      setShowExpensesByCategory(false);
    } else if (id == 2) {
      setShowAllExpenses(false);
      setShowExpensesByCategory(true);
    }
  }

  const loadUser = async () => {
    try {
      const userFactory = new web3.eth.Contract(
        UserFactoryABI.abi,
        userFactoryAddress
      );

      console.log("SVE JE UREDU");
      console.log({ account });

      const userFromContract = await userFactory.methods
        .getUserData()
        .call({ from: account });

      console.log("User from contract is: ", userFromContract);

      if (userFromContract != "0x0000000000000000000000000000000000000000") {
        setUserFound(true);
        setUser(userFromContract);
      }
    } catch (error) {
      console.error(
        "Error while checking client in order to show expenses view:",
        error
      );
    }
  };

  useEffect(() => {
    if (web3) {
      loadUser();
    }
  }, [web3]);

  // const openDetailsModal = (client) => {
  //   setSelectedClient(client);
  // };

  return (
    <div className="client-list">
      <h1 className="client-list-title">EXPENSES</h1>
      {!userFound ? (
        <p style={{ color: "red" }}>
          You are not in the list of users, please make account!
        </p>
      ) : (
        <div>
          <button
            className="create-new-client-button"
            onClick={() => setShowCreateExpenseModal(true)}
          >
            Create New Expense
          </button>

          <button
            className="create-new-client-button"
            onClick={() => openComponent(1)}
          >
            Show All Expenses
          </button>

          <button
            className="create-new-client-button"
            onClick={() => openComponent(2)}
          >
            Search Expenses By Category
          </button>

          {showCreateExpenseModal && account && (
            <CreateNewExpenseModal
              className="create-new-client-modal"
              web3={web3}
              account={account}
              onClose={() => setShowCreateExpenseModal(false)}
              userFactoryAddress={userFactoryAddress}
            />
          )}

          {showAllExpenses && (
            <AllExpenses
              web3={web3}
              account={account}
              userFactoryAddress={userFactoryAddress}
              user={user}
            />
          )}

          {showExpensesByCategory && (
            <ExpensesByCategory
              web3={web3}
              account={account}
              userFactoryAddress={userFactoryAddress}
              user={user}
            />
          )}
        </div>
      )}
      {/* {clients.map((client, index) => (
        <div
          key={index}
          className="client-item"
          onClick={() => openDetailsModal(client)}
        >
          {index + 1}
        </div>
      ))}
      {selectedClient && (
        <ClientDetailsModal
          web3={web3}
          account={account}
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )} */}
    </div>
  );
};

export default ExpensesList;
