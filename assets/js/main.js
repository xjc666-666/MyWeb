document.addEventListener('DOMContentLoaded', () => {

    /* ============ 1. 移动端菜单切换 ============ */
    const navMenu = document.getElementById('nav-menu'),
          navToggle = document.getElementById('nav-toggle');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show-menu');
        });
    }

    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(n => n.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    }));

    /* ============ 2. 明暗主题切换 ============ */
    const themeButton = document.getElementById('theme-button');
    const htmlElement = document.documentElement;
    
    const savedTheme = localStorage.getItem('selected-theme');
    if (savedTheme === 'dark') {
        htmlElement.setAttribute('data-theme', 'dark');
        themeButton.classList.replace('fa-moon', 'fa-sun');
    }

    themeButton.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            htmlElement.setAttribute('data-theme', 'dark');
            themeButton.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('selected-theme', 'dark');
        } else {
            htmlElement.setAttribute('data-theme', 'light');
            themeButton.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('selected-theme', 'light');
        }
    });

    /* ============ 3. 项目分类过滤 ============ */
    const filterButtons = document.querySelectorAll('.filter-button');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category').includes(filterValue)) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    /* ============ 4. 模态框 (QQ弹窗) ============ */
    const qqBtn = document.getElementById('qq-btn');
    const qqModal = document.getElementById('qq-modal');
    const closeBtns = document.querySelectorAll('.modal__close');

    if (qqBtn) {
        qqBtn.addEventListener('click', () => {
            qqModal.classList.add('active-modal');
        });
    }

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.remove('active-modal');
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === qqModal) {
            qqModal.classList.remove('active-modal');
        }
    });

});