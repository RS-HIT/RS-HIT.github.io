// 全局配置文件
const CONFIG = {
    // 应用设置
    app: {
        title: 'R 的技术主页',
        description: '在这里分享技术心得、项目经验和学习历程',
        author: '开发者姓名',
        authorTitle: '全栈开发工程师',
        email: 'your.email@example.com'
    },

    // 存储设置
    storage: {
        viewCountKey: 'pageViewCount',
        projectsKey: 'projects',
        journalsKey: '_journals' // 会被添加项目ID前缀
    },

    // UI设置
    ui: {
        defaultAvatar: 'pic/avatar.jpg',
        defaultProjectImage: 'pic/default-project.jpg',
        scrollThreshold: 100
    },

    // 日志类型配置
    journalTypes: {
        development: { label: '开发进展', color: '#3b82f6' },
        learning: { label: '学习心得', color: '#10b981' },
        bug: { label: '问题解决', color: '#ef4444' },
        idea: { label: '想法记录', color: '#f59e0b' },
        milestone: { label: '里程碑', color: '#8b5cf6' }
    },

    // 项目状态配置
    projectStatus: {
        completed: { label: '已完成', class: 'completed', color: '#10b981' },
        'in-progress': { label: '开发中', class: 'in-progress', color: '#f59e0b' },
        planning: { label: '规划中', class: 'planning', color: '#6b7280' },
        paused: { label: '暂停', class: 'paused', color: '#ef4444' }
    },

    // 项目分类配置
    projectCategories: {
        all: { label: '全部', filter: 'all' },
        web: { label: 'Web应用', filter: 'web' },
        mobile: { label: '移动端', filter: 'mobile' },
        ai: { label: 'AI/ML', filter: 'ai' },
        other: { label: '其他', filter: 'other' }
    },

    // API设置（预留）
    api: {
        baseUrl: '',
        endpoints: {
            projects: '/api/projects',
            journals: '/api/journals',
            contact: '/api/contact'
        }
    }
};

// 导出配置（如果支持模块化）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

// 全局访问（浏览器环境）
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}
