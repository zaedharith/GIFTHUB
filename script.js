const itemList = document.getElementById('item-list');
const qr_image_url = "qr.png";

// You can add more items here manually
const items = [
    // Example format:
    // {
    //   name: "Kek Kahwin",
    //   price: 150,
    //   link: "https://example.com",
    //   image: "https://example.com/image.jpg",
    //   contributions: []
    // }
];

function saveItems() {
    localStorage.setItem('items', JSON.stringify(items));
}

function renderItems() {
    itemList.innerHTML = '';
    items.forEach((item, index) => {
        const contributions = item.contributions || [];
        const total = contributions.reduce((sum, c) => sum + parseFloat(c.amount), 0);
        const balance = item.price - total;
        const fullyFunded = total >= item.price;

        const itemEl = document.createElement('li');
        itemEl.className = 'item';

        const imageHTML = item.image ? `<img src="${item.image}" alt="Image" style="max-width: 100%; margin-bottom:10px;">` : '';
        const linkHTML = item.link ? `<a href="${item.link}" target="_blank">🔗 Lihat Item</a>` : '';
        const statusHTML = `<p><strong>Jumlah Terkumpul: RM${total.toFixed(2)} | Baki: RM${balance.toFixed(2)}</strong></p>`;
        const qrHTML = `
            <div class="qr-section">
                <p><strong>Imbas untuk menyumbang</strong></p>
                <img src="${qr_image_url}" class="qr-image" alt="QR Code">
            </div>`;

        let content = `
            ${imageHTML}
            <strong>${item.name}</strong> - RM${item.price.toFixed(2)} ${linkHTML}
            ${statusHTML}
            ${qrHTML}
        `;

        if (!fullyFunded) {
            content += `
            <form onsubmit="addContribution(event, ${index})">
                <input class="contributor-amount" type="number" placeholder="Jumlah (RM)" required>
                <input class="contributor-note" placeholder="Catatan (cth: untuk kek)">
                <button type="submit">Sumbang</button>
            </form>
            `;
        } else {
            content += `<p style="color:green;"><strong>✅ Item ini telah lengkap dibiayai.</strong></p>`;
        }

        itemEl.innerHTML = content;
        itemList.appendChild(itemEl);
    });
}

function addContribution(e, index) {
    e.preventDefault();
    const form = e.target;
    const amount = parseFloat(form.querySelector('.contributor-amount').value);
    const note = form.querySelector('.contributor-note').value;

    if (!items[index].contributions) items[index].contributions = [];
    items[index].contributions.push({ amount, note });

    saveItems();
    renderItems();
}

renderItems();