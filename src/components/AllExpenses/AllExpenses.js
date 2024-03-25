import React, { useState, useEffect } from "react";
import UserABI from "../../contracts/User.json";
import "./AllExpenses.css";
import UserFactoryABI from "../../contracts/UserFactory.json";
import ExpenseDetailsModal from "../ExpenseDetailsModal/ExpenseDetailsModal";

const AllExpenses = ({ web3, account, userFactoryAddress, user }) => {
  const [expenses, setExpenses] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [sortCriteria, setSortCriteria] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const loadExpenses = async () => {
    try {
      const userFactory = new web3.eth.Contract(UserABI.abi, user);

      const expensesFromContract = await userFactory.methods
        .getExpenses()
        .call();
      console.log(expensesFromContract);
      setExpenses(expensesFromContract);

      // Calculate total amount
      const sum = expensesFromContract.reduce((acc, expense) => {
        return acc + Number(expense.amount);
      }, 0);
      setTotalAmount(sum);
    } catch (error) {
      console.error("Error while loading expenses for user:", error);
    }
  };

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

  const sortBy = (key) => {
    if (sortCriteria === key) {
      // If already sorting by the same criteria, reverse direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // If sorting by a new criteria, set the criteria and direction
      setSortCriteria(key);
      setSortDirection("asc");
    }
  };

  const sortedExpenses = [...expenses].sort((a, b) => {
    if (sortCriteria === "category") {
      return sortDirection === "asc"
        ? a.category.localeCompare(b.category)
        : b.category.localeCompare(a.category);
    } else if (sortCriteria === "amount") {
      return sortDirection === "asc"
        ? Number(a.amount) - Number(b.amount)
        : Number(b.amount) - Number(a.amount);
    } else if (sortCriteria === "date") {
      return sortDirection === "asc"
        ? new Date(Number(a.date)) - new Date(Number(b.date))
        : new Date(Number(b.date)) - new Date(Number(a.date));
    }
    // If no sorting criteria is selected, return original order
    return 0;
  });

  const openDetailsModal = (expense) => {
    setSelectedExpense(expense);
  };

  useEffect(() => {
    if (web3) {
      loadExpenses();
    }
  }, [web3]);

  return (
    <div className="client-list">
      <h1 className="client-list-title">ALL expenses</h1>
      <h3>Total amount: {totalAmount}</h3>
      <table>
        <thead>
          <tr>
            <th onClick={() => sortBy("category")}>
              Category{" "}
              {sortCriteria === "category" && sortDirection === "asc" && "↑"}
              {sortCriteria === "category" && sortDirection === "desc" && "↓"}
            </th>
            <th onClick={() => sortBy("amount")}>
              Amount{" "}
              {sortCriteria === "amount" && sortDirection === "asc" && "↑"}
              {sortCriteria === "amount" && sortDirection === "desc" && "↓"}
            </th>
            <th onClick={() => sortBy("date")}>
              Date {sortCriteria === "date" && sortDirection === "asc" && "↑"}
              {sortCriteria === "date" && sortDirection === "desc" && "↓"}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedExpenses.map((expense, index) => (
            <tr
              key={index}
              className={Number(expense.canceled) === 1 ? "canceled-row" : ""}
            >
              <td>{expense.category}</td>
              <td>{Number(expense.amount)}</td>
              <td>{formatDate(Number(expense.date))}</td>
              <td>
                <button onClick={() => openDetailsModal(expense)}>
                  change
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedExpense && (
        <ExpenseDetailsModal
          web3={web3}
          account={account}
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
          userFactoryAddress={userFactoryAddress}
        />
      )}
    </div>
  );
};

export default AllExpenses;
