 // 5. Menu mobile
 const toggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const closeSidebar = document.getElementById('close-sidebar');

// Abrir menu
toggle.addEventListener('click', () => {
    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    toggle.classList.add('hidden'); // Esconde o ícone
});

// Fechar menu (clique no overlay)
overlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    toggle.classList.remove('hidden'); // Mostra o ícone novamente
});