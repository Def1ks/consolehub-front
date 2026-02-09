// product.js — логика только для product.html
// Предполагается, что mockProducts уже загружены в localStorage из script.js

// Получение параметра из URL
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Генерация фейковых отзывов (временно, до бэкенда)
function generateFakeReviews(count = 12) {
    const names = [
        "Анна К.", "Дмитрий С.", "Мария Л.", "Иван П.", "Екатерина В.",
        "Артём М.", "София Н.", "Никита З.", "Полина Р.", "Максим Ю.",
        "Алина Т.", "Роман Д."
    ];
    const texts = [
        "Отличная консоль! Быстрая загрузка, крутая графика. Очень доволен покупкой.",
        "Доставили быстро, упаковано аккуратно. Работает без нареканий.",
        "Пользуюсь уже месяц — всё идеально. Советую всем геймерам!",
        "Цена немного кусается, но качество того стоит. SSD просто огонь!",
        "Заказал в подарок брату — он в восторге! Спасибо за быструю доставку.",
        "Первый раз покупаю в этом магазине — остался очень доволен.",
        "Графика на высоте, игры летают. Не пожалел ни секунды!",
        "Хорошее соотношение цена/качество. Рекомендую!",
        "Был небольшой вопрос по гарантии — поддержка ответила моментально.",
        "Купил вместе с контроллером — всё работает как часы.",
        "Лучшая покупка этого года! Игры загружаются мгновенно.",
        "Очень доволен! Уже посоветовал друзьям."
    ];
    const ratings = [5, 4, 5, 5, 4, 5, 5, 4, 5, 5, 5, 4];

    return Array.from({ length: count }, (_, i) => {
        const month = Math.floor(Math.random() * 12);
        const day = Math.floor(Math.random() * 28) + 1;
        const date = new Date(2025, month, day).toISOString().split('T')[0];
        return {
            author: names[i % names.length],
            date: date,
            rating: ratings[i % ratings.length],
            text: texts[i % texts.length]
        };
    });
}

// Преобразование отзыва в HTML
function renderReview(review) {
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
    const formattedDate = new Date(review.date).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return `
        <div class="review-item" style="border-bottom:1px solid #eee;padding:12px 0;">
            <div class="review-header" style="display:flex;justify-content:space-between;font-weight:bold;margin-bottom:4px;">
                <span>${review.author}</span>
                <span class="review-date" style="color:#777;font-size:0.9em;">${formattedDate}</span>
            </div>
            <div class="review-rating" style="color:#ff9900;font-size:16px;">${stars}</div>
            <p>${review.text}</p>
        </div>
    `;
}

// Поиск товара по ID
function findProductById(id) {
    const products = JSON.parse(localStorage.getItem('mockProducts')) || [];
    return products.find(p => p.id === parseInt(id));
}

// Отображение товара и отзывов
function displayProductDetails(product) {
    if (!product) {
        document.body.innerHTML = '<p>Товар не найден.</p><a href="catalog.html">Вернуться к каталогу</a>';
        return;
    }

    // Обновляем данные товара
    document.getElementById('pageTitle').textContent = product.name;
    document.getElementById('productImage').src = product.image;
    document.getElementById('productImage').alt = product.name;
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productRating').textContent = product.rating.toFixed(1);
    document.getElementById('productReviews').textContent = product.reviews || 0;
    document.getElementById('productPrice').textContent = formatPriceForCatalog(product.price);
    document.getElementById('productDescription').textContent = product.description;

    // Характеристики
    const featuresList = document.getElementById('productFeatures');
    featuresList.innerHTML = '';
    product.features.forEach(f => {
        const li = document.createElement('li');
        li.textContent = f;
        featuresList.appendChild(li);
    });

    // --- Отзывы ---
    const productId = product.id;
    let reviews = JSON.parse(localStorage.getItem(`reviews_${productId}`)) || generateFakeReviews(12);
    localStorage.setItem(`reviews_${productId}`, JSON.stringify(reviews));

    const countEl = document.getElementById('reviewsCount');
    const listEl = document.getElementById('reviewsList');
    const btn = document.getElementById('toggleReviewsBtn');

    countEl.textContent = reviews.length;

    btn.addEventListener('click', () => {
        const section = document.getElementById('reviewsSection');
        if (section.style.display === 'none') {
            listEl.innerHTML = reviews.map(renderReview).join('');
            section.style.display = 'block';
            btn.textContent = `Скрыть отзывы (${reviews.length})`;
        } else {
            section.style.display = 'none';
            btn.textContent = `Отзывы (${reviews.length})`;
        }
    });
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем, что мы именно на странице товара (а не catalog/profile)
    if (!document.querySelector('.page-product')) return;

    const productId = getUrlParameter('id');
    if (!productId) {
        document.body.innerHTML = '<p>ID товара не указан.</p><a href="catalog.html">Назад в каталог</a>';
        return;
    }

    const product = findProductById(productId);
    displayProductDetails(product);
});