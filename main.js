// =========================
// 页面管理系统
// =========================

class PageManager {
    constructor() {
        this.currentPage = 'home';
        this.components = {};
        this.pages = {};
        this.init();
    }

    async init() {
        await this.loadComponents();
        await this.loadPages();
        this.bindEvents();
        this.showPage(this.currentPage);
        this.updateActiveNav();
    }

    // 加载所有组件
    async loadComponents() {
        try {
            // 加载页眉
            const headerResponse = await fetch('components/header.html');
            if (headerResponse.ok) {
                this.components.header = await headerResponse.text();
                document.getElementById('header-placeholder').innerHTML = this.components.header;
            }

            // 加载侧边栏
            const sidebarResponse = await fetch('components/sidebar.html');
            if (sidebarResponse.ok) {
                this.components.sidebar = await sidebarResponse.text();
                document.getElementById('sidebar-placeholder').innerHTML = this.components.sidebar;
            }

            // 加载页脚
            const footerResponse = await fetch('components/footer.html');
            if (footerResponse.ok) {
                this.components.footer = await footerResponse.text();
                document.getElementById('footer-placeholder').innerHTML = this.components.footer;
            }
        } catch (error) {
            console.error('加载组件失败:', error);
        }
    }

    // 加载所有页面内容
    async loadPages() {
        const pageNames = ['home', 'about', 'projects', 'contact'];
        
        for (const pageName of pageNames) {
            try {
                const response = await fetch(`pages/${pageName}.html`);
                if (response.ok) {
                    this.pages[pageName] = await response.text();
                }
            } catch (error) {
                console.error(`加载页面 ${pageName} 失败:`, error);
            }
        }
    }

    // 绑定事件监听器
    bindEvents() {
        // 页眉导航按钮点击事件
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-btn')) {
                const page = e.target.getAttribute('data-page');
                if (page) {
                    this.showPage(page);
                }
            }

            // 页脚导航链接点击事件
            if (e.target.hasAttribute('data-page')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.showPage(page);
            }

            // 项目筛选按钮
            if (e.target.classList.contains('filter-btn')) {
                this.filterProjects(e.target.getAttribute('data-filter'));
                this.updateActiveFilter(e.target);
            }
        });

        // 滚动事件 - 显示/隐藏回到顶部按钮
        window.addEventListener('scroll', this.handleScroll);
    }

    // 显示指定页面
    showPage(pageName) {
        if (!this.pages[pageName]) {
            console.error(`页面 ${pageName} 不存在`);
            return;
        }

        // 隐藏所有页面内容
        const contentPlaceholder = document.getElementById('content-placeholder');
        contentPlaceholder.innerHTML = this.pages[pageName];

        // 更新当前页面
        this.currentPage = pageName;
        this.updateActiveNav();

        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // 页面特定初始化
        this.initPageSpecific(pageName);
    }

    // 更新活跃导航状态
    updateActiveNav() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-page') === this.currentPage) {
                btn.classList.add('active');
            }
        });
    }

    // 页面特定初始化
    initPageSpecific(pageName) {
        switch (pageName) {
            case 'projects':
                this.initProjectsPage();
                break;
            case 'contact':
                this.initContactPage();
                break;
            case 'about':
                this.initAboutPage();
                break;
        }
    }

    // 初始化项目页面
    initProjectsPage() {
        // 设置默认筛选
        const allFilter = document.querySelector('.filter-btn[data-filter="all"]');
        if (allFilter) {
            allFilter.classList.add('active');
        }
    }

    // 初始化联系页面
    initContactPage() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactSubmit);
        }
    }

    // 初始化关于页面
    initAboutPage() {
        // 技能条动画
        setTimeout(() => {
            document.querySelectorAll('.skill-progress').forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
        }, 500);
    }

    // 项目筛选功能
    filterProjects(category) {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    // 更新活跃筛选按钮
    updateActiveFilter(activeBtn) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    // 联系表单提交处理
    handleContactSubmit(e) {
        e.preventDefault();
        
        // 获取表单数据
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // 这里可以添加实际的表单提交逻辑
        console.log('表单数据:', data);
        
        // 显示成功消息
        alert('消息已发送！感谢您的联系，我会尽快回复。');
        
        // 重置表单
        e.target.reset();
    }

    // 滚动处理
    handleScroll() {
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    }
}

// =========================
// 搜索功能
// =========================

let searchDropdownVisible = false;

function toggleSearch() {
    const searchDropdown = document.getElementById('searchDropdown');
    const searchInput = document.getElementById('searchInput');
    
    if (searchDropdown) {
        searchDropdownVisible = !searchDropdownVisible;
        searchDropdown.style.display = searchDropdownVisible ? 'block' : 'none';
        
        if (searchDropdownVisible && searchInput) {
            setTimeout(() => searchInput.focus(), 100);
        }
    }
}

function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput?.value.trim();
    
    if (!searchTerm) {
        alert('请输入搜索关键词');
        return;
    }
    
    // TODO: 实现搜索逻辑
    console.log('搜索关键词:', searchTerm);
    
    // 这里可以添加实际的搜索功能
    // 例如：搜索页面内容、跳转到搜索结果页面等
    alert(`搜索功能正在开发中，搜索关键词：${searchTerm}`);
    
    // 关闭搜索下拉框
    toggleSearch();
}

// =========================
// 滚动功能
// =========================

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function scrollToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

// =========================
// FAQ 功能
// =========================

function toggleFAQ(element) {
    const faqAnswer = element.nextElementSibling;
    const toggle = element.querySelector('.faq-toggle');
    
    if (faqAnswer.style.display === 'block') {
        faqAnswer.style.display = 'none';
        element.classList.remove('active');
    } else {
        // 关闭其他FAQ
        document.querySelectorAll('.faq-answer').forEach(answer => {
            answer.style.display = 'none';
        });
        document.querySelectorAll('.faq-question').forEach(question => {
            question.classList.remove('active');
        });
        
        // 打开当前FAQ
        faqAnswer.style.display = 'block';
        element.classList.add('active');
    }
}

// =========================
// 微信二维码功能
// =========================

function showQRCode() {
    const modal = document.getElementById('qrModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function hideQRCode() {
    const modal = document.getElementById('qrModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// =========================
// 初始化
// =========================

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 创建页面管理器实例
    const pageManager = new PageManager();
    
    // 存储在全局变量中以供其他函数使用
    window.pageManager = pageManager;
    
    // 更新浏览量（模拟）
    updateViewCount();
    
    // 设置当前年份
    updateCopyrightYear();
    
    // 键盘快捷键
    setupKeyboardShortcuts();
});

// 更新浏览量
function updateViewCount() {
    const viewCountElement = document.getElementById('viewCount');
    if (viewCountElement) {
        // 从localStorage获取或创建浏览量
        let viewCount = localStorage.getItem('pageViewCount') || 0;
        viewCount = parseInt(viewCount) + 1;
        localStorage.setItem('pageViewCount', viewCount);
        viewCountElement.textContent = viewCount.toLocaleString();
    }
}

// 更新版权年份
function updateCopyrightYear() {
    const copyrightElements = document.querySelectorAll('.copyright-text');
    const currentYear = new Date().getFullYear();
    copyrightElements.forEach(element => {
        element.innerHTML = element.innerHTML.replace(/© \d{4}/, `© ${currentYear}`);
    });
}

// 设置键盘快捷键
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K 打开搜索
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            toggleSearch();
        }
        
        // ESC 关闭搜索或模态框
        if (e.key === 'Escape') {
            if (searchDropdownVisible) {
                toggleSearch();
            }
            hideQRCode();
        }
        
        // 数字键快速切换页面
        if (e.key >= '1' && e.key <= '4') {
            const pages = ['home', 'about', 'projects', 'contact'];
            const pageIndex = parseInt(e.key) - 1;
            if (window.pageManager && pages[pageIndex]) {
                window.pageManager.showPage(pages[pageIndex]);
            }
        }
    });
}

// =========================
// 工具函数
// =========================

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 节流函数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 格式化日期
function formatDate(date) {
    return new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

// 复制到剪贴板
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('已复制到剪贴板:', text);
        });
    } else {
        // 降级处理
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        console.log('已复制到剪贴板:', text);
    }
}

// =========================
// 导出给其他脚本使用
// =========================

window.siteUtils = {
    debounce,
    throttle,
    formatDate,
    copyToClipboard,
    toggleSearch,
    handleSearch,
    scrollToTop,
    scrollToBottom,
    toggleFAQ,
    showQRCode,
    hideQRCode
};