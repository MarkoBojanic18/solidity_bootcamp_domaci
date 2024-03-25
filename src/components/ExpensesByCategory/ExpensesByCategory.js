import React, { useState, useEffect } from "react";
import UserABI from "../../contracts/User.json";
import "./ExpensesByCategory.css";

const ExpensesByCategory = ({ web3, user }) => {
  const [expenses, setExpenses] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [category, setCategory] = useState("");

  const loadExpensesByCategory = async () => {
    try {
      const userFactory = new web3.eth.Contract(UserABI.abi, user);

      const expensesFromContract = await userFactory.methods
        .getExpensesByCategory(category)
        .call();
      console.log(expensesFromContract);
      setExpenses(expensesFromContract);

      // Calculate total amount
      const sum = expensesFromContract.reduce((acc, expense) => {
        if (Number(expense.canceled) == 0) {
          return acc + Number(expense.amount);
        }

        return acc;
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

  const handleChange = (e) => {
    setCategory(e.target.value);
  };

  useEffect(() => {
    if (web3) {
      loadExpensesByCategory();
    }
  }, [web3]);

  //   const openDetailsModal = (client) => {
  //     setSelectedClient(client);
  //   };

  return (
    <div className="client-list">
      <select name="category" onChange={handleChange} className="modal-input">
        <option value="">Select a category</option>
        <option value="Kupovina u prodavnici">Kupovina u prodavnici</option>
        <option value="Racun u kaficu">Racun u kaficu</option>
        <option value="Racun na benzinskoj pumpi">
          Racun na benzinskoj pumpi
        </option>
        <option value="Racun za parking">Racun za parking</option>
      </select>
      <button onClick={loadExpensesByCategory}>Search</button>
      <h1 className="client-list-title">Expenses by category: {category}</h1>
      <h3>Total amount: {totalAmount}</h3>
      <table>
        <tbody>
          <tr>
            <td>Category</td>
            <td>Amount</td>
            <td>Date</td>
          </tr>
          {expenses
            .filter((expense) => Number(expense.canceled) === 0)
            .map((expense, index) => (
              <tr key={index}>
                <td>{expense.category}</td>
                <td>{Number(expense.amount)}</td>
                <td>{formatDate(Number(expense.date))}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpensesByCategory;
