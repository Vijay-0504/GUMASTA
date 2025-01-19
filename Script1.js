/*!
 * Expense Tracker App
 * Copyright (c) 2025 Vijay
 * All Rights Reserved
 * This code is licensed under the MIT License.
 * Author: Vijay
 */

// Array of 6 quotes
const quotes = [
    "Today's penny might be tomorrow's Dollar. – Vijay",
    "Life is what happens when you're busy making other plans. – John Lennon",
    "If you don't, you can't. – Vijay",
    "Remember who you wanted to be. – Vijay",
    "Vruksho Rakshitha Rakshithaha.",
    "You miss 100% of the shots you don’t take. – Wayne Gretzky"
];

// Load balance and transactions from localStorage
let balance = parseFloat(localStorage.getItem('balance')) || 0;
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Select the balance element
const balanceElement = document.getElementById('balance');
const transactionList = document.getElementById('transaction-list');

// Chart.js setup
const ctx = document.getElementById('incomeExpenseChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Labels for transactions (dates)
        datasets: [{
            label: 'Balance',
            data: [],
            borderColor: '#2e7d32',
            borderWidth: 2,
            fill: false
        }]
    }
});

// Function to show a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    document.getElementById('quote-container').innerText = randomQuote;
}

// Update the chart after every transaction
function updateChart() {
    // Add new data point to chart
    chart.data.labels.push(new Date().toLocaleTimeString()); // Add time as the label
    chart.data.datasets[0].data.push(balance);
    chart.update();
}

// Add Income
function addIncome() {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    
    if (!description || isNaN(amount)) {
        alert("Please enter a valid description and amount.");
        return;
    }
    
    balance += amount; // Update balance
    transactions.push({ description, amount, type: 'income' });
    displayTransactions();
    updateChart(); // Update the graph with new balance

    balanceElement.textContent = `₹${balance.toFixed(2)}`; // Update balance display

    // Store data in localStorage
    localStorage.setItem('balance', balance);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Clear input fields after transaction
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
}

// Deduct Expense
function deductExpense() {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (!description || isNaN(amount)) {
        alert("Please enter a valid description and amount.");
        return;
    }

    balance -= amount; // Update balance
    transactions.push({ description, amount, type: 'expense' });
    displayTransactions();
    updateChart(); // Update the graph with new balance

    balanceElement.textContent = `₹${balance.toFixed(2)}`; // Update balance display

    // Store data in localStorage
    localStorage.setItem('balance', balance);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Clear input fields after transaction
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
}

// Clear Data (Clear localStorage and reset app)
function clearData() {
    // Confirm with the user before clearing data
    if (confirm("Are you sure you want to clear all data? Once cleared, data cannot be retrieved.")) {
        // Clear localStorage
        localStorage.removeItem('balance');
        localStorage.removeItem('transactions');
        
        // Reset balance and transactions
        balance = 0;
        transactions = [];
        
        // Update the UI
        balanceElement.textContent = `₹${balance.toFixed(2)}`;
        transactionList.innerHTML = '';
        chart.data.labels = [];
        chart.data.datasets[0].data = [];
        chart.update();

        alert("Data cleared successfully!");
    }
}

// Display Transactions
function displayTransactions() {
    transactionList.innerHTML = '';
    transactions.forEach((transaction) => {
        const li = document.createElement('li');
        li.innerHTML = `${transaction.description}: ₹${transaction.amount.toFixed(2)}`;
        li.classList.add(transaction.type === 'income' ? 'income' : 'expense');
        transactionList.appendChild(li);
    });
}

// Print Statement
function printStatement() {
    let printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write('<html><head><title>Expense Tracker Statement</title></head><body>');
    printWindow.document.write('<h1>Expense Tracker Statement</h1>');
    printWindow.document.write(`<p><strong>Balance:</strong> ₹${balance.toFixed(2)}</p>`);
    
    if (transactions.length === 0) {
        printWindow.document.write('<p>No transactions available.</p>');
    } else {
        printWindow.document.write('<h2>Transactions:</h2><ul>');
        transactions.forEach((transaction) => {
            printWindow.document.write(`<li>${transaction.description}: ₹${transaction.amount.toFixed(2)} (${transaction.type})</li>`);
        });
        printWindow.document.write('</ul>');
    }

    printWindow.document.write('<br><button onclick="window.print()">Print Statement</button>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
}

// Call the function to display a random quote when the page loads
window.onload = function() {
    showRandomQuote();

    // Update the quote every 5 seconds
    setInterval(showRandomQuote, 5000);

    // Display transactions and balance from localStorage on page load
    balanceElement.textContent = `₹${balance.toFixed(2)}`;
    displayTransactions();
    balance=0;

    // Update the chart with stored data
    transactions.forEach((transaction) => {
        
        
        if (transaction.type === 'income') {
            balance += transaction.amount;  // Add income to balance
        } else {
            balance -= transaction.amount;  // Deduct expense from balance
        }
        
        chart.data.labels.push(new Date().toLocaleTimeString());
        chart.data.datasets[0].data.push(balance);
    });
    chart.update();
};
