document.addEventListener('DOMContentLoaded', function () {
  const burgerIcon = document.querySelector('.burger-icon');
  const nav = document.querySelector('nav');

  if (burgerIcon && nav) {
    burgerIcon.addEventListener('click', function () {
      this.classList.toggle('active-burger');
      nav.classList.toggle('mobile-menu');
    });
  }
});