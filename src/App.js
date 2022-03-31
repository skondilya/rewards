import React, { useState, useEffect, Fragment } from 'react';
import './App.css';
import data from './data';

function App() {
  const [displayData, setDisplayData] = useState({});
  const [customerRewards, setCustomerRewards] = useState({});
  const [customerTransactions, setCustomerTransactions] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [currentCustomer, setCurrentCustomer] = useState("");
  const [newTransaction, setNewTransaction] = useState({ date: new Date(), amount: 0 });

  useEffect(() => {
    setDisplayData({ ...data });
    setCustomer([...Object.keys(data)]);

  }, []);


  const customerSelect = (value) => {
    setCurrentCustomer(value);
    let customerData = displayData[value];

    let monthTransaction = {
      1: {
        amounts: [],
        rewards: 0,
      },
      2: {
        amounts: [],
        rewards: 0,
      },
      3: {
        amounts: [],
        rewards: 0,
      },
    };
    for (let i = 0; i < customerData.length; i++) {
      let month = new Date(customerData[i]['date']);
      if (month.getMonth() + 1 == 1 || month.getMonth() + 1 == 2 || month.getMonth() + 1 == 3) {
        monthTransaction[month.getMonth() + 1]['amounts'].push(customerData[i]['amount']);
      }
    }
    for (let key in monthTransaction) {
      let total_month_rewards = 0;
      for (let i = 0; i < monthTransaction[key]['amounts'].length; i++) {
        let price = monthTransaction[key]['amounts'][i];

        total_month_rewards = total_month_rewards + calculateRewards(price);
      }
      monthTransaction[key]['rewards'] = total_month_rewards;
    }
    setCustomerRewards({ ...monthTransaction });
    setCustomerTransactions([...customerData]);
  };

  const updateInput = (e) => {
    if (e.target.name === "date") {
      setNewTransaction({ ...newTransaction, ...{ date: e.target.value } });
    }
    if (e.target.name === "amount") {
      setNewTransaction({ ...newTransaction, ...{ amount: e.target.value } });
    }
  }

  const btnAddtransaction = () => {
    let data = { ...displayData };
    let month = new Date(newTransaction['date']);
    if (month.getMonth() + 1 == 1 || month.getMonth() + 1 == 2 || month.getMonth() + 1 == 3) {
      data[currentCustomer].push(newTransaction);
      setDisplayData({ ...data });

      customerSelect(currentCustomer);
    }
    setNewTransaction({ date: new Date(), amount: 0 });
  }
  return (
    <div style={{
      marginTop: "20px",
      marginBottom: "50px",
      fontSize: "20px",
    }}>
      <h2 style={{ textAlign: "center" }}>Customer Rewards</h2>
      <div className="select-style">
        <select onChange={e => customerSelect(e.target.value)} value={currentCustomer} >
          <option value="" disabled>Select User</option>
          {customer.map((item, index) => {
            return (
              <option key={index} value={item}> {item.toUpperCase()} </option>
            );
          })}
        </select>
      </div>
      {Object.keys(customerRewards).length > 0 &&
        <Fragment>
          <table className="customers">
            <thead>
              <tr>
                <th>Month</th>
                <th>Rewards</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>First Month</td>
                <td>{customerRewards[1]["rewards"]}</td>
              </tr>
              <tr>
                <td>Second Month</td>
                <td>{customerRewards[2]["rewards"]}</td>
              </tr>
              <tr>
                <td>Third Month</td>
                <td>{customerRewards[3]["rewards"]}</td>
              </tr>
              <tr>
                <td>Total Reward</td>
                <td>{customerRewards[1]["rewards"] + customerRewards[2]["rewards"] + customerRewards[3]["rewards"]}</td>
              </tr>
            </tbody>
          </table>
          <h4>User Transactions</h4>
          {customerTransactions.length > 0 ?
            <table className="customers">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Rewards</th>
                </tr>

              </thead>
              <tbody>
                {customerTransactions.map((item, index) => {
                  return <tr key={index}>
                    <td>{item["date"]}</td>
                    <td>{item["amount"]}</td>
                    <td>{calculateRewards(item["amount"])}</td>
                  </tr>
                })}
              </tbody>
            </table>
            : <div>Transactions Not Found</div>}
          <div>
            <h4>Add Transactions</h4>
            <label>Date : </label><input type="date" name="date" value={newTransaction.date} onChange={(e) => updateInput(e)}></input>
            <label>Amount :</label><input type="number" name="amount" value={newTransaction.amount} onChange={(e) => updateInput(e)}></input>
            <button onClick={() => btnAddtransaction()}>Add Transaction</button>
          </div>
        </Fragment>
      }


    </ div >
  );
}

export default App;

function calculateRewards(price) {
  let rewards = 0;
  if (price > 100) {
    rewards = (price - 100) * 2;
  }
  if (price > 50) {
    rewards = rewards + (price - 50);
  }
  return rewards;

}
