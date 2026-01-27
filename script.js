document.addEventListener('DOMContentLoaded', function () {

  // === ЗАГРУЗКА ДАННЫХ ===
  let mockUsers = JSON.parse(localStorage.getItem('mockUsers')) || [
    {
      id: 1,
      firstName: "Александр",
      lastName: "Перков",
      email: "alexperk@mail.ru",
      password: "123456",
      avatar: "img/default.webp"
    }
  ];

  let mockOrders = JSON.parse(localStorage.getItem('mockOrders')) || [
    {
      id: 10428,
      userId: 1,
      date: "2026-01-12",
      total: 5890,
      status: "completed",
      address: "г. Уфа, ул. Ленина, д. 25, кв. 12",
      items: [
        { name: "Игровая мышь Logitech G502", price: 3290, qty: 1 },
        { name: "Коврик для мыши SteelSeries QcK", price: 1200, qty: 1 },
        { name: "Наушники HyperX Cloud II", price: 1400, qty: 1 }
      ]
    },
    {
      id: 11228,
      userId: 1,
      date: "2026-01-13",
      total: 58890,
      status: "pending",
      address: "г. Уфа, ул. Ленина, д. 25, кв. 12",
      items: [
        { name: "Игровой ноутбук ASUS ROG Zephyrus G14", price: 58890, qty: 1 }
      ]
    }
  ];

  // === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===
  function formatDate(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  function formatPrice(amount) {
    return amount.toLocaleString('ru-RU') + ' ₽';
  }

  function getStatusInfo(status) {
    switch (status) {
      case 'completed': return { text: 'Доставлен', class: 'order-status--completed' };
      case 'pending':   return { text: 'В процессе', class: 'order-status--pending' };
      case 'cancelled': return { text: 'Отменен', class: 'order-status--cancelled' };
      default:          return { text: 'Неизвестно', class: '' };
    }
  }

  function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  function logout() {
    localStorage.removeItem('currentUser');
  }

  function getOrdersByUserId(userId) {
    return mockOrders.filter(order => order.userId === userId);
  }

  function getNextOrderId() {
    const ids = mockOrders.map(o => o.id);
    return ids.length ? Math.max(...ids) + 1 : 10000;
  }

  function createDemoOrderForUser(userId, firstName) {
    return {
      id: getNextOrderId(),
      userId: userId,
      date: new Date().toISOString().split('T')[0],
      total: 2990,
      status: "completed",
      address: "г. Уфа, ул. Ленина, д. 25, кв. 12",
      items: [
        { name: `Добро пожаловать, ${firstName}!`, price: 2990, qty: 1 }
      ]
    };
  }

  // === РЕНДЕР: ФОРМА ВХОДА ===
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
    document.getElementById('authOrProfile').innerHTML = html;
    document.getElementById('orders-container').style.display = 'none';
  }

  // === РЕНДЕР: ФОРМА РЕГИСТРАЦИИ ===
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
    document.getElementById('authOrProfile').innerHTML = html;
    document.getElementById('orders-container').style.display = 'none';
  }

  // === РЕНДЕР: ПРОФИЛЬ ===
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
    document.getElementById('authOrProfile').innerHTML = html;
    document.getElementById('orders-container').style.display = 'block';
  }

  // === РЕНДЕР: ИСТОРИЯ ЗАКАЗОВ ===
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

  // === ФУНКЦИЯ: ОБНОВЛЕНИЕ ПРОФИЛЯ ===
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

  // === ИНИЦИАЛИЗАЦИЯ ===
  const currentUser = getCurrentUser();
  if (currentUser) {
    renderProfile(currentUser);
    renderOrderHistory(getOrdersByUserId(currentUser.id));
  } else {
    renderLoginForm();
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

    // Подробнее о заказе
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
            const itemEl = document.createElement('div');
            itemEl.className = 'modal-order-item';
            itemEl.innerHTML = `
              <div class="modal-order-item-image">🖼️</div>
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

    // Открытие модального окна редактирования
    if (e.target.id === 'editProfileBtn') {
      const currentUser = getCurrentUser();
      if (!currentUser) return;

      const editModal = document.getElementById('editProfileModal');
      if (!editModal) return;

      // Заполняем форму
      document.getElementById('firstName').value = currentUser.firstName || '';
      document.getElementById('lastName').value = currentUser.lastName || '';
      document.getElementById('email').value = currentUser.email || '';

      // Аватар
      const avatarSrc = currentUser.avatar || 'img/default.webp';
      document.getElementById('avatarPreview').src = avatarSrc;

      // Обработчик выбора файла
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
    // Вход
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

    // Регистрация
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
      mockOrders.push(createDemoOrderForUser(newUser.id, newUser.firstName));

      localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
      localStorage.setItem('mockOrders', JSON.stringify(mockOrders));
      localStorage.setItem('currentUser', JSON.stringify(newUser));

      renderProfile(newUser);
      renderOrderHistory(getOrdersByUserId(newUser.id));
    }

    // Редактирование профиля
    if (e.target.id === 'profileForm') {
      e.preventDefault();

      const currentUser = getCurrentUser();
      if (!currentUser) return;

      const firstName = document.getElementById('firstName').value.trim();
      const lastName = document.getElementById('lastName').value.trim();
      const email = document.getElementById('email').value.trim();

      // Проверка уникальности email
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