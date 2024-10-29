if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('../service-worker.js').then(registration => {
            console.log('Service Worker registrado com sucesso:', registration);
        }).catch(error => {
            console.log('Falha ao registrar o Service Worker:', error);
        });
    });
}

let editingIndex = -1;

document.getElementById('add-expense').addEventListener('click', async () => {
    const description = document.getElementById('expense-description').value;
    const quantity = document.getElementById('expense-quantity').value;
    const amount = document.getElementById('expense-amount').value;
    const currencyFrom = document.getElementById('currency-from').value;
    const currencyTo = document.getElementById('currency-to').value;

    if (description === '' || quantity === '' || amount === '') {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${currencyFrom}`);
    const data = await response.json();
    const rate = data.rates[currencyTo];
    const convertedAmount = ((quantity*amount) * rate).toFixed(2);

    const expense = {
        description,
        quantity: parseFloat(quantity),
        amount: parseFloat(amount),
        currencyFrom,
        currencyTo,
        convertedAmount: parseFloat(convertedAmount)
    };

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    
    if (editingIndex === -1) {
        expenses.push(expense);
    } else {
        expenses[editingIndex] = expense;
        editingIndex = -1;
    }

    localStorage.setItem('expenses', JSON.stringify(expenses));

    clearForm();
    displayExpenses();
});

function clearForm() {
    document.getElementById('expense-description').value = '';
    document.getElementById('expense-quantity').value = '';
    document.getElementById('expense-amount').value = '';
    document.getElementById('currency-from').value = 'BRL';
    document.getElementById('currency-to').value = 'BRL';
}

function displayExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';
    let totalOrigin = 0;
    let totalDestination = 0;

    expenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');

        const textSpan = document.createElement('span');
        textSpan.textContent = `${expense.description} (Qtd. ${expense.quantity}): ${expense.amount} ${expense.currencyFrom} => ${expense.convertedAmount} ${expense.currencyTo}`;

        const editButton = document.createElement('button');
        editButton.classList.add('edit-button');
        editButton.onclick = () => {
            editExpense(index);
        };

        // Cria o ícone de lápis (editar) e adiciona ao botão
        const editIcon = document.createElement('i');
        editIcon.classList.add('fas', 'fa-pencil-alt');

        editButton.appendChild(editIcon); // Adiciona o ícone ao botão

        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-button');
        removeButton.onclick = () => {
            removeExpense(index);
        };

        // Cria o ícone da lixeira e adiciona ao botão
        const trashIcon = document.createElement('i');
        trashIcon.classList.add('fas', 'fa-trash');

        removeButton.appendChild(trashIcon); // Adiciona o ícone ao botão


        li.appendChild(textSpan);
        li.appendChild(editButton);
        li.appendChild(removeButton);
        expenseList.appendChild(li);

        totalOrigin += (expense.amount*expense.quantity);
        totalDestination += expense.convertedAmount;
    });

    document.getElementById('total-origin').textContent = totalOrigin.toFixed(2);
    document.getElementById('total-destination').textContent = totalDestination.toFixed(2);
}

function editExpense(index) {
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const expense = expenses[index];
    document.getElementById('expense-description').value = expense.description;
    document.getElementById('expense-quantity').value = expense.quantity;
    document.getElementById('expense-amount').value = expense.amount;
    document.getElementById('currency-from').value = expense.currencyFrom;
    document.getElementById('currency-to').value = expense.currencyTo;

    editingIndex = index;
}

function removeExpense(index) {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.splice(index, 1);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
}

// Exibe as despesas ao carregar a página
window.onload = displayExpenses;
document.addEventListener('DOMContentLoaded', displayExpenses);