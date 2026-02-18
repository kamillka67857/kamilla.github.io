// ======= Поиск товаров =======
const searchInput = document.getElementById('searchInput');
const productCards = document.querySelectorAll('.product-card');

searchInput.addEventListener('input', function () {
    const query = searchInput.value.toLowerCase();

    productCards.forEach(card => {
        const title = card.querySelector('h2').textContent.toLowerCase();
        card.style.display = title.includes(query) ? 'flex' : 'none';
    });
});

// ======= Корзина =======
let cart = []; // массив товаров в корзине

const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItemsList = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const closeCartBtn = document.getElementById('close-cart');

// Добавление товаров в корзину
productCards.forEach(card => {
    const button = card.querySelector('button');
    button.addEventListener('click', () => {
        const title = card.querySelector('h2').textContent;
        const priceText = card.querySelector('.price').textContent.replace(/\s/g, '');
        const price = parseInt(priceText); // преобразуем в число

        cart.push({ title, price });
        updateCartUI();
    });
});

// Обновление кнопки и модального окна
function updateCartUI() {
    // Обновляем счётчик
    cartBtn.textContent = `🧺 Корзина (${cart.length})`;

    // Очищаем список
    cartItemsList.innerHTML = '';

    // Добавляем товары в список
    let total = 0;
    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.title} — ${item.price.toLocaleString()} ₽`;

        // Создаем кнопку удаления
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Удалить';
        removeBtn.classList.add('remove-item');
        removeBtn.addEventListener('click', () => {
            cart.splice(index, 1); // удаляем товар из массива
            updateCartUI(); // обновляем интерфейс
        });

        li.appendChild(removeBtn);
        cartItemsList.appendChild(li);

        total += item.price;
    });

    cartTotal.textContent = `Итого: ${total.toLocaleString()} ₽`;
}


// Показ модального окна
cartBtn.addEventListener('click', () => {
    cartModal.style.display = 'flex';
});

// Закрытие модального окна
closeCartBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Закрытие при клике вне окна
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});
const sendCartBtn = document.getElementById('send-cart');

sendCartBtn.addEventListener('click', async () => {
    if (window.Telegram.WebApp) {
        const itemsText = cart.map(item => `${item.title} — ${item.price.toLocaleString()} ₽`).join('\n');
        const totalText = `Итого: ${cart.reduce((sum, item) => sum + item.price, 0).toLocaleString()} ₽`;

        const chat_id = Telegram.WebApp.initDataUnsafe.user.id;

        // Отправка на сервер
        await fetch('https://8559426685:AAHeEPRPlxVeOPXCihar7EOConvGxd3Nr7w/webapp', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ chat_id, items: itemsText, total: totalText })
        });

        alert('Корзина отправлена боту!');
    } else {
        alert('Telegram Web App не найден. Откройте Mini App через Telegram.');
    }
});

