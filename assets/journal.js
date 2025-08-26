// 学习日志管理模块
class JournalManager {
    constructor(projectId = 'default') {
        this.projectId = projectId;
        this.storageKey = `${projectId}${window.CONFIG ? window.CONFIG.storage.journalsKey : '_journals'}`;
        this.journalEntries = this.loadJournals();
    }

    // 加载日志数据
    loadJournals() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    // 保存日志数据
    saveJournals() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.journalEntries));
    }

    // 添加日志条目
    addEntry(entry) {
        entry.id = Date.now();
        entry.timestamp = new Date().toISOString();
        this.journalEntries.unshift(entry); // 新日志在前
        this.saveJournals();
        return entry;
    }

    // 删除日志条目
    deleteEntry(entryId) {
        this.journalEntries = this.journalEntries.filter(entry => entry.id !== entryId);
        this.saveJournals();
    }

    // 获取所有日志
    getAllEntries() {
        return this.journalEntries;
    }

    // 根据类型筛选日志
    getEntriesByType(type) {
        return this.journalEntries.filter(entry => entry.type === type);
    }

    // 获取统计数据
    getStats() {
        const totalJournals = this.journalEntries.length;
        const uniqueDates = new Set(this.journalEntries.map(entry => entry.date));
        const journalDays = uniqueDates.size;
        
        let lastJournalDays = 0;
        if (this.journalEntries.length > 0) {
            const lastDate = new Date(this.journalEntries[0].date);
            const today = new Date();
            const diffTime = Math.abs(today - lastDate);
            lastJournalDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1);
        }

        return {
            totalJournals,
            journalDays,
            lastJournalDays
        };
    }
}

// 模板加载器
class TemplateLoader {
    static async loadTemplate(templateName) {
        try {
            const response = await fetch(`../templates/${templateName}.html`);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            return doc.querySelector('.journal-entry');
        } catch (error) {
            console.error('模板加载失败:', error);
            return null;
        }
    }

    static getAvailableTemplates() {
        return [
            'journal-development',
            'journal-learning',
            'journal-bug-fix',
            'journal-idea',
            'journal-milestone'
        ];
    }
}

// 日志渲染器
class JournalRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    renderEntry(entry) {
        const entryElement = document.createElement('div');
        entryElement.className = 'journal-entry';
        entryElement.dataset.id = entry.id;

        const contentWithBreaks = entry.content.replace(/\n/g, '<br>');
        const tags = entry.tags || [];

        entryElement.innerHTML = `
            <div class="journal-meta">
                <span class="journal-date">${entry.date}</span>
                <span class="journal-type ${entry.type}">${this.getTypeLabel(entry.type)}</span>
                <button class="delete-journal-btn" onclick="deleteJournalEntry(${entry.id})" title="删除日志">🗑️</button>
            </div>
            <div class="journal-content">
                <h3>${entry.title}</h3>
                <div class="journal-text">${contentWithBreaks}</div>
                ${tags.length > 0 ? `
                    <div class="journal-tags">
                        ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        return entryElement;
    }

    renderAll(entries) {
        if (!this.container) return;
        
        this.container.innerHTML = '';
        
        if (entries.length === 0) {
            this.container.innerHTML = `
                <div class="empty-journal">
                    <p>还没有学习日志，开始记录你的学习历程吧！</p>
                </div>
            `;
            return;
        }

        entries.forEach(entry => {
            const entryElement = this.renderEntry(entry);
            this.container.appendChild(entryElement);
        });
    }

    getTypeLabel(type) {
        if (window.CONFIG && window.CONFIG.journalTypes[type]) {
            return window.CONFIG.journalTypes[type].label;
        }
        
        // 备用标签
        const labels = {
            development: '开发进展',
            learning: '学习心得',
            bug: '问题解决',
            idea: '想法记录',
            milestone: '里程碑'
        };
        return labels[type] || type;
    }
}

// 全局实例
let journalManager;
let journalRenderer;

// 初始化
function initializeJournal(projectId = 'default') {
    journalManager = new JournalManager(projectId);
    journalRenderer = new JournalRenderer('journalEntries');
    
    // 渲染现有日志
    journalRenderer.renderAll(journalManager.getAllEntries());
    
    // 更新统计信息
    updateJournalStats();
}

// 显示添加日志表单
function showAddJournalForm() {
    const form = document.getElementById('addJournalForm');
    if (form) {
        form.style.display = 'block';
        
        // 设置今天的日期为默认值
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('journalDate');
        if (dateInput) {
            dateInput.value = today;
        }
    }
}

// 隐藏添加日志表单
function hideAddJournalForm() {
    const form = document.getElementById('addJournalForm');
    if (form) {
        form.style.display = 'none';
        form.querySelector('form').reset();
    }
}

// 添加日志条目
function addJournalEntry(event) {
    event.preventDefault();
    
    const entry = {
        date: document.getElementById('journalDate').value,
        type: document.getElementById('journalType').value,
        title: document.getElementById('journalTitle').value,
        content: document.getElementById('journalContent').value,
        tags: document.getElementById('journalTags').value
            .split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    // 验证必填字段
    if (!entry.date || !entry.type || !entry.title || !entry.content) {
        alert('请填写所有必填字段！');
        return;
    }

    // 添加到管理器
    journalManager.addEntry(entry);
    
    // 重新渲染
    journalRenderer.renderAll(journalManager.getAllEntries());
    updateJournalStats();
    
    // 隐藏表单
    hideAddJournalForm();
    
    // 显示成功消息
    showMessage('日志已保存！', 'success');
}

// 删除日志条目
function deleteJournalEntry(entryId) {
    if (confirm('确定要删除这条日志吗？')) {
        journalManager.deleteEntry(entryId);
        journalRenderer.renderAll(journalManager.getAllEntries());
        updateJournalStats();
        showMessage('日志已删除！', 'info');
    }
}

// 更新统计信息
function updateJournalStats() {
    const stats = journalManager.getStats();
    
    const totalElement = document.getElementById('totalJournals');
    const daysElement = document.getElementById('journalDays');
    const lastElement = document.getElementById('lastJournalDays');
    
    if (totalElement) totalElement.textContent = stats.totalJournals;
    if (daysElement) daysElement.textContent = stats.journalDays;
    if (lastElement) lastElement.textContent = stats.lastJournalDays;
}

// 显示消息
function showMessage(text, type = 'info') {
    // 创建消息元素
    const message = document.createElement('div');
    message.className = `message message-${type}`;
    message.textContent = text;
    
    // 添加样式
    Object.assign(message.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '6px',
        color: 'white',
        fontWeight: '500',
        zIndex: '1000',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease'
    });
    
    // 设置颜色
    if (type === 'success') {
        message.style.backgroundColor = '#10b981';
    } else if (type === 'error') {
        message.style.backgroundColor = '#ef4444';
    } else {
        message.style.backgroundColor = '#3b82f6';
    }
    
    // 添加到页面
    document.body.appendChild(message);
    
    // 显示动画
    setTimeout(() => {
        message.style.opacity = '1';
        message.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动消失
    setTimeout(() => {
        message.style.opacity = '0';
        message.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(message);
        }, 300);
    }, 3000);
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 从URL参数获取项目ID
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project') || 'default';
    
    initializeJournal(projectId);
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        JournalManager,
        TemplateLoader,
        JournalRenderer
    };
}
