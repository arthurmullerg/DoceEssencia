
  document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('.menu-link');
    const seções = document.querySelectorAll('.cardapio');

    function mostrarSecao(id) {
      seções.forEach(secao => {
        secao.classList.remove('ativo');
        if (secao.id === id) {
          secao.classList.add('ativo');
        }
      });

      links.forEach(link => link.classList.remove('active'));
      document.querySelector(`.menu-link[href="#${id}"]`).classList.add('active');
    }

    links.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const id = this.getAttribute('href').substring(1);
        mostrarSecao(id);
      });
    });

    // Mostra a seção padrão ao carregar (ex: cones)
    mostrarSecao('cones');
  });

//carrosel


   document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.slider-container');

    carousels.forEach(carousel => {
      const wrapper = carousel.querySelector('.produtos-wrapper');
      const grid = wrapper.querySelector('.produtos-grid-c');
      const items = grid.querySelectorAll('.produto');
      const prev = carousel.querySelector('.prev');
      const next = carousel.querySelector('.next');

      let currentIndex = 0;
      const itemsToShow = 3;
      const totalItems = items.length;

      const updateCarousel = () => {
        const itemWidth = items[0].offsetWidth + 20;
        grid.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
      };

      prev.addEventListener('click', () => {
        currentIndex = Math.max(currentIndex - 1, 0);
        updateCarousel();
      });

      next.addEventListener('click', () => {
        const maxIndex = totalItems - itemsToShow;
        currentIndex = Math.min(currentIndex + 1, maxIndex);
        updateCarousel();
      });

      window.addEventListener('resize', updateCarousel);
      updateCarousel();
    });
  });
