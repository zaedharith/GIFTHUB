
const itemForm = document.getElementById('item-form');
const itemList = document.getElementById('item-list');
const passwordSection = document.getElementById('password-section');
const adminPassword = "zaed123";

let items = JSON.parse(localStorage.getItem('items')) || [];

function saveItems() {
    localStorage.setItem('items', JSON.stringify(items));
}

function checkPassword() {
    const input = document.getElementById('admin-password').value;
    if (input === adminPassword) {
        itemForm.style.display = 'flex';
        passwordSection.style.display = 'none';
    } else {
        alert("Incorrect password.");
    }
}

function renderItems() {
    itemList.innerHTML = '';
    items.forEach((item, index) => {
        const itemEl = document.createElement('li');
        itemEl.className = 'item';
        let linkHTML = item.link ? `<br><a href="\${item.link}" target="_blank">🔗 View Item</a>` : '';
        itemEl.innerHTML = `
            <strong>\${item.name}</strong> - RM\${item.price.toFixed(2)} \${linkHTML}
            <button onclick="removeItem(\${index})" style="float:right;">❌</button>
            <div class="contributors" id="contributors-\${index}"></div>
            <form onsubmit="addContribution(event, \${index})">
                <input class="contributor-name" placeholder="Your name" required>
                <input class="contributor-amount" type="number" placeholder="Amount (RM)" required>
                <button type="submit">Chip in</button>
            </form>
        `;
        itemList.appendChild(itemEl);
        updateContributors(index);
    });
}

function updateContributors(index) {
    const container = document.getElementById('contributors-' + index);
    const contributions = items[index].contributions || [];
    let total = contributions.reduce((sum, c) => sum + parseFloat(c.amount), 0);
    let balance = items[index].price - total;

    container.innerHTML = contributions.map(c => `<p>\${c.name}: RM\${parseFloat(c.amount).toFixed(2)}</p>`).join('') +
                          `<p><strong>Total: RM\${total.toFixed(2)} | Remaining: RM\${balance.toFixed(2)}</strong></p>`;
}

itemForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('item-name').value;
    const price = parseFloat(document.getElementById('item-price').value);
    const link = document.getElementById('item-link').value;
    items.push({ name, price, link, contributions: [] });
    saveItems();
    renderItems();
    itemForm.reset();
});

function removeItem(index) {
    items.splice(index, 1);
    saveItems();
    renderItems();
}

function addContribution(e, index) {
    e.preventDefault();
    const form = e.target;
    const name = form.querySelector('.contributor-name').value;
    const amount = parseFloat(form.querySelector('.contributor-amount').value);
    items[index].contributions.push({ name, amount });
    saveItems();
    renderItems();
}

renderItems();
