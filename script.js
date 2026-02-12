// === ГЛОБАЛЬНЫЕ ФУНКЦИИ ===
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

function logout() {
    localStorage.removeItem('currentUser');
}

function formatDate(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function formatPriceForCatalog(amount) {
    return amount.toLocaleString('ru-RU') + ' Р';
}

function formatPrice(amount) {
    return amount.toLocaleString('ru-RU') + ' ₽';
}

function getStatusInfo(status) {
    switch (status) {
        case 'completed': return { text: 'Доставлен', class: 'order-status--completed' };
        case 'pending': return { text: 'В процессе', class: 'order-status--pending' };
        case 'cancelled': return { text: 'Отменен', class: 'order-status--cancelled' };
        default: return { text: 'Неизвестно', class: '' };
    }
}

// === ПЕРЕМЕННЫЕ ДЛЯ ХРАНЕНИЯ ДАННЫХ ===
let mockUsers;
let mockOrders;
const mockProducts = [
    {
        id: 1,
        name: "PlayStation 5",
        price: 39990,
        image: "img/products-img/playstation5.webp",
        brand: "PlayStation",
        category: "Консоли",
        description: "Мощнейшая игровая консоль нового поколения с потрясающей графикой и ультра-быстрым SSD.",
        features: ["Процессор: AMD Zen 2", "GPU: AMD RDNA 2", "RAM: 16 GB GDDR6", "SSD: 825 GB"],
        reviewsList: [
            { userName: "Александр Перков", rating: 5, date: "2026-01-15", text: "Отличная консоль! Быстрая загрузка, шикарная графика. Очень доволен покупкой." },
            { userName: "Иван Сидоров", rating: 4, date: "2026-01-10", text: "Хорошая приставка, но немного шумит под нагрузкой. В остальном — топ!" },
            { userName: "Екатерина Морозова", rating: 5, date: "2026-01-22", text: "DualSense — это отдельный кайф. Тактильная отдача реально меняет впечатление от игр." },
            { userName: "Дмитрий Лебедев", rating: 5, date: "2026-01-30", text: "Покупал в подарок сыну — теперь он не вылезает из Spider-Man. SSD работает молниеносно." },
            { userName: "Анна Волкова", rating: 4, date: "2026-02-01", text: "Красивая, мощная, но занимает много места. И да, найти в продаже — всё ещё проблема." },
            { userName: "Сергей Никитин", rating: 5, date: "2026-02-03", text: "Лучшее вложение в развлечения за последние годы. Horizon Forbidden West — просто восторг." }
        ]
    },
    {
        id: 2,
        name: "Xbox Series X",
        price: 37990,
        image: "img/products-img/xboxseriesx.webp",
        brand: "Xbox",
        category: "Консоли",
        description: "Самая мощная консоль Xbox с поддержкой 4K и потрясающим 3D-аудио.",
        features: ["Процессор: AMD Zen 2", "GPU: AMD RDNA 2", "RAM: 16 GB GDDR6", "SSD: 1 TB"],
        reviewsList: [
            { userName: "Мария Кузнецова", rating: 5, date: "2026-01-18", text: "Игры запускаются мгновенно, интерфейс удобный. Советую всем геймерам!" },
            { userName: "Артём Громов", rating: 5, date: "2026-01-25", text: "Тихая, холодная, мощная. Идеальная консоль для тех, кто ценит стабильность." },
            { userName: "Ольга Федорова", rating: 4, date: "2026-01-28", text: "Хорошо, но эксклюзивов мало. Зато Game Pass — просто находка." },
            { userName: "Роман Павлов", rating: 5, date: "2026-02-02", text: "Форм-фактор как у ПК — ставится вертикально или горизонтально. Очень практично." },
            { userName: "Наталья Соколова", rating: 4, date: "2026-02-04", text: "Покупала ради обратной совместимости — старые игры работают идеально." },
            { userName: "Владимир Егоров", rating: 5, date: "2026-02-06", text: "Запускаю Forza Horizon 5 в 4K/60fps без лагов. Просто космос!" },
            { userName: "Юлия Максимова", rating: 4, date: "2026-02-07", text: "Нравится, но хотелось бы больше русской локализации в некоторых играх." }
        ]
    },
    {
        id: 3,
        name: "Nintendo Switch OLED",
        price: 25990,
        image: "img/products-img/nintendoswitcholed.webp",
        brand: "Nintendo",
        category: "Консоли",
        description: "Улучшенная портативная консоль с большим OLED-дисплеем и продленным временем работы.",
        features: ["Дисплей: 7\" OLED", "RAM: 4 GB LPDDR4", "Память: 64 GB", "Время работы: до 9 часов"],
        reviewsList: [
            { userName: "Анна Петрова", rating: 5, date: "2026-01-20", text: "Идеально для поездок! Экран яркий, батарея держится долго." },
            { userName: "Дмитрий Орлов", rating: 4, date: "2026-01-05", text: "Хорошо, но хотелось бы больше памяти из коробки." },
            { userName: "Полина Смирнова", rating: 5, date: "2026-01-12", text: "Animal Crossing на OLED — это отдельное удовольствие. Цвета сочные!" },
            { userName: "Максим Воронцов", rating: 5, date: "2026-01-29", text: "Брал для семьи — все играют: жена, дети, даже родители. Универсальная штука." },
            { userName: "Евгений Крылов", rating: 4, date: "2026-02-01", text: "Отличная портативка, но Joy-Con всё ещё могут терять связь при активной игре." },
            { userName: "Алёна Зайцева", rating: 5, date: "2026-02-03", text: "Подключил к телевизору — и дома, и в дороге. Очень удобно!" },
            { userName: "Игорь Швец", rating: 5, date: "2026-02-05", text: "OLED-экран того стоит. Особенно в темных сценах Zelda." },
            { userName: "Ксения Романова", rating: 4, date: "2026-02-08", text: "Красивая, но чехол лучше брать сразу — легко царапается." }
        ]
    },
    {
        id: 4,
        name: "DualSense Wireless Controller",
        price: 5990,
        image: "img/products-img/dualsensecontroller.webp",
        brand: "PlayStation",
        category: "Аксессуары",
        description: "Официальный беспроводной контроллер для PlayStation 5 с тактильной отдачей и адаптивными триггерами.",
        features: ["Тактильная отдача", "Адаптивные триггеры", "Встроенный микрофон", "Аккумулятор: 15 часов"],
        reviewsList: [
            { userName: "Александр Перков", rating: 5, date: "2026-01-18", text: "Лучший геймпад, который у меня был. Тактильная отдача — как будто ты внутри игры." },
            { userName: "Виктория Лукина", rating: 4, date: "2026-01-24", text: "Отличный контроллер, но заряжается только через USB-C, без Bluetooth-зарядки." },
            { userName: "Станислав Медведев", rating: 5, date: "2026-01-30", text: "Адаптивные триггеры в Returnal — это что-то нереальное. Чувствуешь каждое натяжение." },
            { userName: "Анастасия Горбунова", rating: 4, date: "2026-02-02", text: "Красивый, удобный, но батарея садится быстрее, чем у DualShock 4." },
            { userName: "Глеб Фомин", rating: 5, date: "2026-02-04", text: "Использую даже на ПК — поддержка в Steam отличная." },
            { userName: "Татьяна Ершова", rating: 4, date: "2026-02-06", text: "Хорош, но белый цвет быстро пачкается. Берите чёрный, если не любите ухаживать." }
        ]
    },
    {
        id: 5,
        name: "PULSE 3D Wireless Headset",
        price: 8990,
        image: "img/products-img/pulse3dheadset.webp",
        brand: "PlayStation",
        category: "Аксессуары",
        description: "Беспроводные наушники для PS5 с объемным 3D-звуком Tempest.",
        features: ["3D-аудио Tempest", "Беспроводное подключение", "Микрофон с шумоподавлением", "Аккумулятор: 12 часов"],
        reviewsList: [
            { userName: "Александр Перков", rating: 5, date: "2026-02-01", text: "Звук просто космос! Особенно в играх с 3D-аудио." },
            { userName: "Илья Козлов", rating: 4, date: "2026-01-20", text: "Хороший звук, но давят на уши при долгой игре." },
            { userName: "Дарья Селиванова", rating: 5, date: "2026-01-25", text: "Микрофон действительно с шумоподавлением — друзья говорят, что слышат меня чётко." },
            { userName: "Никита Жуков", rating: 4, date: "2026-01-28", text: "Беспроводные — это удобно, но заряжать каждый день надоело." },
            { userName: "Елена Беляева", rating: 5, date: "2026-02-03", text: "Отлично передаёт направление звука. В Ratchet & Clank слышно, откуда летит враг!" },
            { userName: "Арсений Морозов", rating: 4, date: "2026-02-05", text: "Цена высокая, но за качество можно заплатить." },
            { userName: "Вера Комарова", rating: 5, date: "2026-02-07", text: "Подключил — и всё работает. Без драйверов, без настроек. Просто включи и играй." }
        ]
    },
    {
        id: 6,
        name: "Xbox Wireless Controller",
        price: 5490,
        image: "img/products-img/xboxwirelesscontroller.webp",
        brand: "Xbox",
        category: "Аксессуары",
        description: "Классический беспроводной контроллер для Xbox с поддержкой Bluetooth.",
        features: ["Bluetooth", "Аккумулятор: до 40 часов", "Настройка с помощью Xbox Accessories", "Компактный дизайн"],
        reviewsList: [
            { userName: "Михаил Соколов", rating: 5, date: "2026-01-15", text: "Эргономика — эталон. Удобно лежит в руках даже при долгих сессиях." },
            { userName: "Алина Воробьёва", rating: 4, date: "2026-01-22", text: "Отличный геймпад, но кнопки D-pad могли бы быть точнее." },
            { userName: "Даниил Фролов", rating: 5, date: "2026-01-27", text: "Работает и на ПК, и на Android. Очень универсальный." },
            { userName: "Софья Ковалёва", rating: 4, date: "2026-02-01", text: "Батарея держится долго, но AA-элементы — не самый современный выбор." },
            { userName: "Антон Мельников", rating: 5, date: "2026-02-04", text: "Лучший контроллер для шутеров. Триггеры — мечта." },
            { userName: "Валерия Денисова", rating: 4, date: "2026-02-06", text: "Красивый, но скользкий. Советую силиконовый чехол." }
        ]
    },
    {
        id: 7,
        name: "Pro Controller",
        price: 7990,
        image: "img/products-img/procontroller.webp",
        brand: "Nintendo",
        category: "Аксессуары",
        description: "Полноразмерный контроллер Pro для Nintendo Switch с точными джойстиками и вибрацией HD Rumble.",
        features: ["HD Rumble", "Долгий срок службы батареи", "Джой-кон не нужен", "Поддержка Amiibo"],
        reviewsList: [
            { userName: "Артём Сазонов", rating: 5, date: "2026-01-10", text: "Идеален для Zelda и Metroid. Джойстики не люфтят, в отличие от Joy-Con." },
            { userName: "Елизавета Новикова", rating: 5, date: "2026-01-18", text: "Батарея держится почти неделю! Очень доволен покупкой." },
            { userName: "Павел Королёв", rating: 4, date: "2026-01-25", text: "Отличный контроллер, но цена завышена. Хотя качество того стоит." },
            { userName: "Маргарита Соловьёва", rating: 5, date: "2026-01-30", text: "HD Rumble в Mario Kart — это отдельное удовольствие. Чувствуешь каждую кочку!" },
            { userName: "Руслан Гусев", rating: 5, date: "2026-02-02", text: "Подключается мгновенно. Использую только его, Joy-Con убрал в коробку." },
            { userName: "Оксана Белова", rating: 4, date: "2026-02-05", text: "Хорош, но не хватает подсветки кнопок в темноте." },
            { userName: "Игорь Панов", rating: 5, date: "2026-02-08", text: "Лучший контроллер для Switch. Точка." }
        ]
    },
    {
        id: 8,
        name: "The Legend of Zelda: Tears of the Kingdom",
        price: 5490,
        image: "img/products-img/zeldatearsofthekingdom.webp",
        brand: "Nintendo",
        category: "Игры",
        description: "Продолжение культовой игры The Legend of Zelda: Breath of the Wild. Исследуйте обновленный Хайруль!",
        features: ["Новый геймплей", "Создание предметов", "Полеты на самодельных транспортах", "Огромный открытый мир"],
        reviewsList: [
            { userName: "Александр Перков", rating: 5, date: "2026-02-05", text: "Одна из лучших игр всех времён! Свобода творчества и исследования — на высшем уровне." },
            { userName: "Вера Степанова", rating: 5, date: "2026-01-20", text: "Провёл 100+ часов и всё ещё нахожу новые механики. Гениально!" },
            { userName: "Лев Титов", rating: 5, date: "2026-01-25", text: "Система создания — это прорыв. Сделал себе летающий танк из щита и вентилятора!" },
            { userName: "Ангелина Кузнецова", rating: 5, date: "2026-01-28", text: "Сюжет трогательный, музыка великолепна, мир — живой. Обязательно к прохождению." },
            { userName: "Тимур Абрамов", rating: 4, date: "2026-02-01", text: "Игра — шедевр, но иногда физика ломается, и конструкции ведут себя странно." },
            { userName: "Нина Романова", rating: 5, date: "2026-02-03", text: "Даже мои дети (10 и 12 лет) часами строят свои летательные аппараты. Воспитательный эффект!" },
            { userName: "Семён Захаров", rating: 5, date: "2026-02-06", text: "Лучше Breath of the Wild? Да. И это почти невозможно было улучшить." },
            { userName: "Дарья Морозова", rating: 5, date: "2026-02-08", text: "Каждый раз удивляюсь, как Nintendo умудряется делать такие игры на Switch." }
        ]
    }
];

// === ФУНКЦИИ РЕНДЕРА ===
function renderLoginForm() {
    const html = `
      <div class="auth-form">
        <h2>Вход</h2>
        <form id="loginForm">
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="loginEmail" required>
          </div>
          <div class="form-group">
            <label>Пароль</label>
            <input type="password" id="loginPassword" required>
          </div>
          <button type="submit" class="btn-primary">Войти</button>
          <p class="auth-switch">
            Нет аккаунта? <a href="#" id="showRegisterLink">Зарегистрироваться</a>
          </p>
          <p id="loginError" style="color:#ff4444; margin-top:10px; display:none;"></p>
        </form>
      </div>
    `;
    const authContainer = document.getElementById('authOrProfile');
    if (authContainer) {
        authContainer.innerHTML = html;
        const ordersContainer = document.getElementById('orders-container');
        if (ordersContainer) ordersContainer.style.display = 'none';
    }
}

function renderRegisterForm() {
    const html = `
      <div class="auth-form">
        <h2>Регистрация</h2>
        <form id="registerForm">
          <div class="form-group">
            <label>Имя</label>
            <input type="text" id="regFirstName" required>
          </div>
          <div class="form-group">
            <label>Фамилия</label>
            <input type="text" id="regLastName" required>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="regEmail" required>
          </div>
          <div class="form-group">
            <label>Пароль (мин. 6 символов)</label>
            <input type="password" id="regPassword" required minlength="6">
          </div>
          <button type="submit" class="btn-primary">Зарегистрироваться</button>
          <p class="auth-switch">
            Уже есть аккаунт? <a href="#" id="showLoginLink">Войти</a>
          </p>
          <p id="registerError" style="color:#ff4444; margin-top:10px; display:none;"></p>
        </form>
      </div>
    `;
    const authContainer = document.getElementById('authOrProfile');
    if (authContainer) {
        authContainer.innerHTML = html;
        const ordersContainer = document.getElementById('orders-container');
        if (ordersContainer) ordersContainer.style.display = 'none';
    }
}

function renderProfile(user) {
    const html = `
      <div class="profile-info">
        <h2>Профиль</h2>
        <img src="${user.avatar || 'img/default.webp'}" alt="Аватар" class="profile-avatar">
        <div class="profile-details">
          <h3>${user.firstName} ${user.lastName}</h3>
          <p>${user.email}</p>
        </div>
        <hr>
        <div class="profile-actions">
          <button id="editProfileBtn">Редактировать профиль</button>
          <button id="logoutBtn">Выход</button>
        </div>
      </div>
    `;
    const authContainer = document.getElementById('authOrProfile');
    if (authContainer) {
        authContainer.innerHTML = html;
        const ordersContainer = document.getElementById('orders-container');
        if (ordersContainer) ordersContainer.style.display = 'block';
    }
}

function renderOrderHistory(orders) {
    const container = document.getElementById('orders-container');
    if (!container) return;

    container.innerHTML = '<h2>История заказов</h2>';

    if (orders.length === 0) {
        container.innerHTML += '<p>У вас пока нет заказов.</p>';
        return;
    }

    orders.forEach(order => {
        const { text: statusText, class: statusClass } = getStatusInfo(order.status);
        const orderEl = document.createElement('div');
        orderEl.className = 'order-item';
        orderEl.dataset.orderId = order.id;

        orderEl.innerHTML = `
          <div class="order-header">
            <span class="order-id">#${order.id}</span>
            <span class="order-date">${formatDate(order.date)}</span>
          </div>
          <div class="order-details">
            <div class="order-row">
              <span class="order-label">Сумма:</span>
              <span class="order-value">${formatPrice(order.total)}</span>
            </div>
            <div class="order-row">
              <span class="order-label">Статус:</span>
              <span class="order-status ${statusClass}">${statusText}</span>
            </div>
            <div class="order-row">
              <span class="order-label">Адрес:</span>
              <span class="order-value">${order.address}</span>
            </div>
          </div>
          <button class="order-details-btn">Подробнее</button>
        `;
        container.appendChild(orderEl);
    });
}

function updateProfile(userId, newData) {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...newData };
        localStorage.setItem('mockUsers', JSON.stringify(mockUsers));

        const currentUser = getCurrentUser();
        if (currentUser && currentUser.id === userId) {
            localStorage.setItem('currentUser', JSON.stringify(mockUsers[userIndex]));
        }
        return mockUsers[userIndex];
    }
    return null;
}

function getOrdersByUserId(userId) {
    return mockOrders.filter(order => order.userId === userId);
}

function getNextOrderId() {
    const ids = mockOrders.map(o => o.id);
    return ids.length ? Math.max(...ids) + 1 : 10000;
}

// === ФУНКЦИИ КАТАЛОГА ===
function renderProducts(productsToRender) {
    const container = document.querySelector('.catalog-products');
    if (!container) {
        console.error("Контейнер для товаров '.catalog-products' не найден.");
        return;
    }

    container.innerHTML = '';

    if (!productsToRender || productsToRender.length === 0) {
        container.innerHTML = '<p>Товары по заданным параметрам не найдены.</p>';
        return;
    }

    productsToRender.forEach(product => {
        const cardElement = document.createElement('div');
        cardElement.className = 'product-card';

        cardElement.innerHTML = `
          <div class="product-info">
            <img src="${product.image}" alt="${product.name}">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">${formatPriceForCatalog(product.price)}</p>
          </div>
          <button class="btn-add-to-cart" data-product-id="${product.id}">В корзину</button>
        `;

        cardElement.addEventListener('click', function (e) {
            if (!e.target.classList.contains('btn-add-to-cart')) {
                window.location.href = `product.html?id=${product.id}`;
            }
        });

        container.appendChild(cardElement);
    });
}

function applyFilters() {
    const minPrice = parseInt(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseInt(document.getElementById('maxPrice').value) || Infinity;

    const selectedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked'))
        .map(cb => cb.value);

    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
        .map(cb => cb.value);

    const filteredProducts = mockProducts.filter(product => {
        const priceMatch = product.price >= minPrice && product.price <= maxPrice;
        const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        return priceMatch && brandMatch && categoryMatch;
    });

    renderProducts(filteredProducts);
}

// === ФУНКЦИЯ ДОБАВЛЕНИЯ В КОРЗИНУ ===
function addToCart(productId) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('Пожалуйста, войдите в аккаунт, чтобы добавить товар в корзину.');
        window.location.href = 'profile.html';
        return;
    }

    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItem = cartItems.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({ productId: productId, quantity: 1 });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    alert('Товар добавлен в корзину!');
}

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', function () {
    // Загрузка данных
    mockUsers = JSON.parse(localStorage.getItem('mockUsers')) || [
        {
            id: 1,
            firstName: "Александр",
            lastName: "Перков",
            email: "alexperk@mail.ru",
            password: "123456",
            avatar: "img/default.webp",
            role: "admin"
        }
    ];

    // ПУСТОЙ МАССИВ ЗАКАЗОВ — ТОЛЬКО РЕАЛЬНЫЕ!
    mockOrders = JSON.parse(localStorage.getItem('mockOrders')) || [];

    localStorage.setItem('mockProducts', JSON.stringify(mockProducts));

    // Бургер меню
    const burgerIcon = document.querySelector('.burger-icon');
    const nav = document.querySelector('nav');
    if (burgerIcon && nav) {
        burgerIcon.addEventListener('click', function () {
            this.classList.toggle('active-burger');
            nav.classList.toggle('mobile-menu');
        });
    }

    // Определение страницы
    const catalogContainer = document.querySelector('.catalog-products');
    const isProfilePage = document.getElementById('authOrProfile');

    if (catalogContainer) {
        // Страница каталога
        renderProducts(mockProducts);

        // Автофильтрация
        const filterInputs = document.querySelectorAll('#minPrice, #maxPrice, input[name="brand"], input[name="category"]');
        filterInputs.forEach(input => {
            if (input.type === 'number') {
                input.addEventListener('input', applyFilters);
            } else {
                input.addEventListener('change', applyFilters);
            }
        });
    } else if (isProfilePage) {
        // Страница профиля
        const currentUser = getCurrentUser();
        if (currentUser) {
            renderProfile(currentUser);
            renderOrderHistory(getOrdersByUserId(currentUser.id));
        } else {
            renderLoginForm();
        }
    }

    // === ДЕЛЕГИРОВАНИЕ СОБЫТИЙ ===
    document.addEventListener('click', function (e) {
        if (e.target.id === 'showRegisterLink') {
            e.preventDefault();
            renderRegisterForm();
        }
        if (e.target.id === 'showLoginLink') {
            e.preventDefault();
            renderLoginForm();
        }
        if (e.target.id === 'logoutBtn') {
            logout();
            location.reload();
        }
        if (e.target.classList.contains('btn-add-to-cart')) {
            const productId = Number(e.target.dataset.productId);
            addToCart(productId);
        }
        if (e.target.classList.contains('order-details-btn')) {
            const item = e.target.closest('.order-item');
            if (!item) return;
            const orderId = Number(item.dataset.orderId);
            const order = mockOrders.find(o => o.id === orderId);
            const orderModal = document.getElementById('orderModal');
            if (order && orderModal) {
                document.getElementById('modal-order-id').textContent = '#' + order.id;
                const itemsContainer = document.getElementById('modal-order-items');
                if (itemsContainer) {
                    itemsContainer.innerHTML = '';
                    order.items.forEach(product => {
                        // Ищем товар по имени или ID (лучше по ID, но у вас в items нет id → используем name)
                        const productData = mockProducts.find(p =>
                            p.name === product.name ||
                            p.id === (product.productId || 0)
                        );

                        const imgSrc = productData?.image || 'img/default.webp';

                        const itemEl = document.createElement('div');
                        itemEl.className = 'modal-order-item';
                        itemEl.innerHTML = `
                  <div class="modal-order-item-image" style="
                      width: 48px;
                      height: 48px;
                      border-radius: 6px;
                      overflow: hidden;
                      flex-shrink: 0;
                  ">
                      <img src="${imgSrc}" alt="${product.name}" 
                           style="width:100%;height:100%;object-fit:cover;">
                  </div>
                  <div class="modal-order-item-info">
                    <div class="modal-order-item-name">${product.name}</div>
                    <div class="modal-order-item-qty">Кол-во: ${product.qty}</div>
                    <div class="modal-order-item-price">${formatPrice(product.price)}</div>
                  </div>
                `;
                        itemsContainer.appendChild(itemEl);
                    });
                }
                orderModal.style.display = 'block';
            }
        }
        if (e.target.id === 'editProfileBtn') {
            const currentUser = getCurrentUser();
            if (!currentUser) return;
            const editModal = document.getElementById('editProfileModal');
            if (!editModal) return;
            document.getElementById('firstName').value = currentUser.firstName || '';
            document.getElementById('lastName').value = currentUser.lastName || '';
            document.getElementById('email').value = currentUser.email || '';
            document.getElementById('avatarPreview').src = currentUser.avatar || 'img/default.webp';
            const avatarInput = document.getElementById('avatarInput');
            avatarInput.onchange = function () {
                if (this.files && this.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        document.getElementById('avatarPreview').src = e.target.result;
                    };
                    reader.readAsDataURL(this.files[0]);
                }
            };
            editModal.style.display = 'block';
        }
    });

    // === ОБРАБОТКА ФОРМ ===
    document.addEventListener('submit', function (e) {
        if (e.target.id === 'loginForm') {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            const user = mockUsers.find(u => u.email === email && u.password === password);
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                renderProfile(user);
                renderOrderHistory(getOrdersByUserId(user.id));
            } else {
                document.getElementById('loginError').textContent = 'Неверный email или пароль';
                document.getElementById('loginError').style.display = 'block';
            }
        }
        if (e.target.id === 'registerForm') {
            e.preventDefault();
            const firstName = document.getElementById('regFirstName').value.trim();
            const lastName = document.getElementById('regLastName').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value;
            if (mockUsers.some(u => u.email === email)) {
                document.getElementById('registerError').textContent = 'Пользователь с таким email уже существует';
                document.getElementById('registerError').style.display = 'block';
                return;
            }
            const newUser = {
                id: mockUsers.length ? Math.max(...mockUsers.map(u => u.id)) + 1 : 1,
                firstName,
                lastName,
                email,
                password,
                avatar: 'img/default.webp'
            };
            mockUsers.push(newUser);
            localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
            localStorage.setItem('mockOrders', JSON.stringify(mockOrders));
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            renderProfile(newUser);
            renderOrderHistory(getOrdersByUserId(newUser.id));
        }
        if (e.target.id === 'profileForm') {
            e.preventDefault();
            const currentUser = getCurrentUser();
            if (!currentUser) return;
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('email').value.trim();
            const existingUser = mockUsers.find(u => u.email === email && u.id !== currentUser.id);
            if (existingUser) {
                alert('Пользователь с таким email уже существует');
                return;
            }
            const avatarInput = document.getElementById('avatarInput');
            if (avatarInput.files && avatarInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const updatedUser = updateProfile(currentUser.id, {
                        firstName,
                        lastName,
                        email,
                        avatar: e.target.result
                    });
                    if (updatedUser) {
                        renderProfile(updatedUser);
                        renderOrderHistory(getOrdersByUserId(updatedUser.id));
                        document.getElementById('editProfileModal').style.display = 'none';
                    }
                };
                reader.readAsDataURL(avatarInput.files[0]);
            } else {
                const updatedUser = updateProfile(currentUser.id, {
                    firstName,
                    lastName,
                    email
                });
                if (updatedUser) {
                    renderProfile(updatedUser);
                    renderOrderHistory(getOrdersByUserId(updatedUser.id));
                    document.getElementById('editProfileModal').style.display = 'none';
                }
            }
        }
    });

    // === ЗАКРЫТИЕ МОДАЛЬНЫХ ОКОН ===
    document.querySelectorAll('.modal-close').forEach(el => {
        el.addEventListener('click', () => {
            el.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
});