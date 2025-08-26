// 主应用程序入口
class App {
    constructor() {
        this.currentPage = 'home';
        this.searchDropdownVisible = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateViewCount();
        this.showPage('home');
    }

    bindEvents() {
        // 导航按钮事件
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.showPage(btn.getAttribute('data-page'));
            });
        });

        // 页脚导航链接事件
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPage(link.getAttribute('data-page'));
            });
        });

        // 项目筛选按钮事件
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterProjects(btn.getAttribute('data-filter'));
                this.updateActiveFilter(btn);
            });
        });

        // 联系表单事件
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactSubmit.bind(this));
        }

        // 滚动事件
        window.addEventListener('scroll', this.handleScroll.bind(this));

        // 键盘快捷键
        document.addEventListener('keydown', this.handleKeyboard.bind(this));

        // 搜索框事件
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch();
                }
            });
        }
    }

    showPage(pageName) {
        // 隐藏所有页面
        document.querySelectorAll('.page-content').forEach(page => {
            page.style.display = 'none';
        });
        
        // 显示目标页面
        const targetPage = document.getElementById(pageName);
        if (targetPage) {
            targetPage.style.display = 'block';
            this.currentPage = pageName;
            
            // 更新导航状态
            this.updateNavigation(pageName);
            
            // 页面特殊处理
            this.handlePageSpecialLogic(pageName);
        }
    }

    updateNavigation(pageName) {
        // 更新导航按钮状态
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-page') === pageName) {
                btn.classList.add('active');
            }
        });
    }

    handlePageSpecialLogic(pageName) {
        switch(pageName) {
            case 'projects':
                this.initializeProjectsPage();
                break;
            case 'projectDetail':
                this.initializeProjectDetail();
                break;
            case 'contact':
                this.initializeContactPage();
                break;
        }
    }

    initializeProjectsPage() {
        // 项目页面特殊逻辑
        if (typeof this.filterProjects === 'function') {
            this.filterProjects('all');
        }
    }

    initializeProjectDetail() {
        // 项目详情页特殊逻辑
        if (typeof initializeJournal === 'function') {
            const urlParams = new URLSearchParams(window.location.search);
            const projectId = urlParams.get('project') || 'default';
            initializeJournal(projectId);
        }
    }

    initializeContactPage() {
        // 联系页面特殊逻辑
    }

    filterProjects(category) {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    updateActiveFilter(activeBtn) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    handleContactSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // 这里可以添加实际的表单处理逻辑
        console.log('联系表单提交:', { name, email, message });
        
        // 显示成功消息
        alert('消息已发送！我会尽快回复您。');
        event.target.reset();
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 处理导航栏滚动效果
        const header = document.querySelector('.header');
        if (header) {
            if (scrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }

    handleKeyboard(e) {
        // 搜索快捷键 (Ctrl+K 或 Cmd+K)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.toggleSearch();
        }
        
        // ESC 键处理
        if (e.key === 'Escape') {
            if (this.searchDropdownVisible) {
                this.toggleSearch();
            }
            this.hideQRCode();
        }
    }

    toggleSearch() {
        const searchDropdown = document.getElementById('searchDropdown');
        const searchInput = document.getElementById('searchInput');
        
        if (!searchDropdown) return;
        
        if (this.searchDropdownVisible) {
            searchDropdown.style.display = 'none';
            this.searchDropdownVisible = false;
        } else {
            searchDropdown.style.display = 'block';
            this.searchDropdownVisible = true;
            if (searchInput) {
                searchInput.focus();
            }
        }
    }

    handleSearch() {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) return;
        
        const query = searchInput.value.trim();
        if (query) {
            console.log('搜索查询:', query);
            // 这里可以添加实际的搜索逻辑
            this.toggleSearch();
        }
    }

    hideQRCode() {
        const qrCode = document.getElementById('qrCode');
        if (qrCode) {
            qrCode.style.display = 'none';
        }
    }

    updateViewCount() {
        const viewCountElement = document.getElementById('viewCount');
        if (viewCountElement) {
            const storageKey = window.CONFIG ? window.CONFIG.storage.viewCountKey : 'pageViewCount';
            let viewCount = localStorage.getItem(storageKey) || 0;
            viewCount = parseInt(viewCount) + 1;
            localStorage.setItem(storageKey, viewCount);
            viewCountElement.textContent = viewCount.toLocaleString();
        }
    }
}

// 全局变量和函数（保持向后兼容）
let app;

function showPage(pageName) {
    if (app) {
        app.showPage(pageName);
    }
}

function showProjectDetail(projectId) {
    // 使用项目管理器
    if (typeof projectDetailManager !== 'undefined') {
        projectDetailManager.showProjectDetail(projectId);
    } else {
        // 备用方案
        const urlParams = new URLSearchParams();
        urlParams.set('project', projectId);
        window.location.search = urlParams.toString();
    }
}

function filterProjects(category) {
    if (app) {
        app.filterProjects(category);
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    app = new App();
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { App };
}
