const itemForm = document.getElementById('item-form');
const itemList = document.getElementById('item-list');
const passwordSection = document.getElementById('password-section');
const adminPassword = "zaed123";
const qr_image_url = "https://i.imgur.com/example-qr.png"; // replace this with your real QR

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

        const imageHTML = item.image ? `<img src="${item.image}" alt="Item Image" class="item-image">` : '';
        const linkHTML = item.link ? `<a href="${item.link}" target="_blank">🔗 View Item</a>` : '';

        itemEl.innerHTML = `
            ${imageHTML}
            <strong>${item.name}</strong> - RM${item.price.toFixed(2)} ${linkHTML}
            <button onclick="removeItem(${index})" style="float:right;">❌</button>
            <div class="qr-section">
                <p><strong>Scan to chip in!</strong></p>
                <img src="${qr_image_url}" alt="Bank QR" class="qr-image">
            </div>
            <div class="contributors" id="contributors-${index}"></div>
            <form onsubmit="addContribution(event, ${index})">
                <input class="contributor-name" placeholder="Your name" required>
                <input class="contributor-amount" type="number" placeholder="Amount (RM)" required>
                <input class="contributor-note" placeholder="Note (e.g., for cake)">
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

    container.innerHTML = contributions.map(c =>
        `<p>${c.name}: RM${parseFloat(c.amount).toFixed(2)} — "${c.note || ""}"</p>`
    ).join('') +
    `<p><strong>Total: RM${total.toFixed(2)} | Remaining: RM${balance.toFixed(2)}</strong></p>`;
}

itemForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('item-name').value;
    const price = parseFloat(document.getElementById('item-price').value);
    const link = document.getElementById('item-link').value;
    const image = document.getElementById('item-image').value;
    items.push({ name, price, link, image, contributions: [] });
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
    const note = form.querySelector('.contributor-note').value;
    items[index].contributions.push({ name, amount, note });
    saveItems();
    renderItems();
}

renderItems();

