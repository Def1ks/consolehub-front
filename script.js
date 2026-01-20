document.addEventListener('DOMContentLoaded', function () {
  // === Бургер-меню ===
  const burgerIcon = document.querySelector('.burger-icon');
  const nav = document.querySelector('nav');

  if (burgerIcon && nav) {
    burgerIcon.addEventListener('click', function () {
      this.classList.toggle('active-burger');
      nav.classList.toggle('mobile-menu');
    });
  }

  // === Модальное окно: Редактировать профиль ===
  const editProfileBtn = document.querySelector('.profile-actions button:first-child');
  const editModal = document.getElementById('editProfileModal');

  if (editProfileBtn && editModal) {
    editProfileBtn.addEventListener('click', () => {
      editModal.style.display = 'block';
    });
  }

  // === Общее закрытие модальных окон по крестику ===
  document.querySelectorAll('.modal-close').forEach(el => {
    el.addEventListener('click', () => {
      el.closest('.modal').style.display = 'none';
    });
  });

  // === Предпросмотр аватара (без дублирующего клика!) ===
  const avatarInput = document.getElementById('avatarInput');
  const avatarPreview = document.getElementById('avatarPreview');

  if (avatarInput && avatarPreview) {
    avatarInput.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
          avatarPreview.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // === Закрытие любого модального окна при клике на затемнение ===
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.style.display = 'none';
    }
  });

  // === Модальное окно заказа ===
  const orderButtons = document.querySelectorAll('.order-details-btn');
  const orderModal = document.getElementById('orderModal');

  if (orderModal && orderButtons.length > 0) {
    orderButtons.forEach(button => {
      button.addEventListener('click', () => {
        const item = button.closest('.order-item');
        if (!item) return;

        document.getElementById('modal-order-id').textContent = item.dataset.orderId || '';
        document.getElementById('modal-date').textContent = item.dataset.date || '';
        document.getElementById('modal-amount').textContent = item.dataset.amount || '';
        document.getElementById('modal-status').textContent = item.dataset.status || '';
        document.getElementById('modal-address').textContent = item.dataset.address || '';

        orderModal.style.display = 'block';
      });
    });
  }
});