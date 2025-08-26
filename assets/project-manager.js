// 项目管理模块
class ProjectManager {
    constructor() {
        this.projects = this.loadProjects();
    }

    loadProjects() {
        const defaultProjects = {
            'project1': {
                id: 'project1',
                title: '全栈Web应用',
                description: '基于React + Node.js的全栈Web应用项目，实现了用户认证、数据管理和实时通信等功能。',
                tech: ['React', 'Node.js', 'MongoDB', 'Express', 'Socket.io'],
                category: 'web',
                status: '开发中',
                progress: 75,
                startDate: '2025-01-15',
                lastUpdate: '2025-01-26',
                demoUrl: '#',
                githubUrl: '#',
                image: 'project1-thumbnail.jpg'
            },
            'project2': {
                id: 'project2',
                title: '移动端应用',
                description: '基于React Native的跨平台移动应用，集成Firebase后端服务，提供完整的移动解决方案。',
                tech: ['React Native', 'Firebase', 'Redux', 'JavaScript'],
                category: 'mobile',
                status: '已完成',
                progress: 100,
                startDate: '2024-12-01',
                lastUpdate: '2025-01-20',
                demoUrl: '#',
                githubUrl: '#',
                image: 'project2-thumbnail.jpg'
            },
            'project3': {
                id: 'project3',
                title: 'AI智能分析',
                description: 'AI驱动的智能数据分析项目，利用机器学习算法处理大数据，提供智能决策支持。',
                tech: ['Python', 'TensorFlow', 'OpenAI', 'FastAPI', 'PostgreSQL'],
                category: 'ai',
                status: '规划中',
                progress: 25,
                startDate: '2025-02-01',
                lastUpdate: '2025-01-25',
                demoUrl: '#',
                githubUrl: '#',
                image: 'project3-thumbnail.jpg'
            }
        };

        const storageKey = window.CONFIG ? window.CONFIG.storage.projectsKey : 'projects';
        const stored = localStorage.getItem(storageKey);
        return stored ? {...defaultProjects, ...JSON.parse(stored)} : defaultProjects;
    }

    saveProjects() {
        const projectsToSave = {};
        Object.keys(this.projects).forEach(key => {
            if (!key.startsWith('project')) { // 只保存自定义项目
                projectsToSave[key] = this.projects[key];
            }
        });
        const storageKey = window.CONFIG ? window.CONFIG.storage.projectsKey : 'projects';
        localStorage.setItem(storageKey, JSON.stringify(projectsToSave));
    }

    getProject(projectId) {
        return this.projects[projectId];
    }

    getAllProjects() {
        return Object.values(this.projects);
    }

    getProjectsByCategory(category) {
        return Object.values(this.projects).filter(project => project.category === category);
    }

    updateProject(projectId, updates) {
        if (this.projects[projectId]) {
            this.projects[projectId] = { ...this.projects[projectId], ...updates };
            this.saveProjects();
            return true;
        }
        return false;
    }

    createProject(projectData) {
        const projectId = projectData.id || `project_${Date.now()}`;
        this.projects[projectId] = {
            id: projectId,
            title: projectData.title || '新项目',
            description: projectData.description || '',
            tech: projectData.tech || [],
            category: projectData.category || 'other',
            status: projectData.status || '规划中',
            progress: projectData.progress || 0,
            startDate: projectData.startDate || new Date().toISOString().split('T')[0],
            lastUpdate: new Date().toISOString().split('T')[0],
            demoUrl: projectData.demoUrl || '#',
            githubUrl: projectData.githubUrl || '#',
            image: projectData.image || 'default-project.jpg',
            ...projectData
        };
        this.saveProjects();
        return projectId;
    }

    deleteProject(projectId) {
        if (this.projects[projectId] && !projectId.startsWith('project')) {
            delete this.projects[projectId];
            this.saveProjects();
            return true;
        }
        return false;
    }
}

// 项目详情页面管理
class ProjectDetailManager {
    constructor() {
        this.projectManager = new ProjectManager();
        this.currentProjectId = null;
    }

    showProjectDetail(projectId) {
        this.currentProjectId = projectId;
        const project = this.projectManager.getProject(projectId);
        
        if (!project) {
            console.error('项目不存在:', projectId);
            return;
        }

        this.updateProjectDetailContent(project);
        
        // 如果是在主页面中，切换到项目详情页
        if (typeof showPage === 'function') {
            showPage('projectDetail');
        }
        
        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateProjectDetailContent(project) {
        // 更新项目标题
        const titleElement = document.getElementById('projectDetailTitle');
        if (titleElement) {
            titleElement.textContent = project.title;
        }
        
        // 更新项目描述
        const descElement = document.querySelector('.project-detail-description');
        if (descElement) {
            descElement.textContent = project.description;
        }
        
        // 更新技术标签
        const tagsContainer = document.querySelector('.project-detail-tags');
        if (tagsContainer) {
            tagsContainer.innerHTML = project.tech.map(tech => 
                `<span class="tag">${tech}</span>`
            ).join('');
        }
        
        // 更新项目状态
        const statusElements = document.querySelectorAll('.status-badge');
        statusElements.forEach(element => {
            element.textContent = project.status;
            element.className = `status-badge ${this.getStatusClass(project.status)}`;
        });
        
        // 更新进度条
        const progressBar = document.querySelector('.progress-bar');
        const progressText = document.querySelector('.progress-text');
        if (progressBar) {
            progressBar.style.width = project.progress + '%';
        }
        if (progressText) {
            progressText.textContent = project.progress + '%';
        }
        
        // 更新开始日期
        const dateElement = document.querySelector('.project-start-date');
        if (dateElement) {
            dateElement.textContent = `开始日期: ${project.startDate}`;
        }
        
        // 更新最后更新日期
        const lastUpdatedElement = document.getElementById('lastUpdated');
        if (lastUpdatedElement) {
            lastUpdatedElement.textContent = project.lastUpdate;
        }
        
        // 更新链接
        const demoLink = document.querySelector('.demo-link');
        const githubLink = document.querySelector('.github-link');
        if (demoLink) {
            demoLink.href = project.demoUrl;
        }
        if (githubLink) {
            githubLink.href = project.githubUrl;
        }
        
        // 更新项目图片
        const imageElement = document.getElementById('projectDetailImage');
        if (imageElement) {
            imageElement.src = `../pic/${project.image}`;
            imageElement.alt = `${project.title} 详情图`;
        }
    }

    getStatusClass(status) {
        if (window.CONFIG && window.CONFIG.projectStatus[status]) {
            return window.CONFIG.projectStatus[status].class;
        }
        
        // 备用映射
        const statusMap = {
            '已完成': 'completed',
            '开发中': 'in-progress', 
            '规划中': 'planning',
            '暂停': 'paused'
        };
        return statusMap[status] || 'planning';
    }

    getCurrentProject() {
        return this.currentProjectId ? this.projectManager.getProject(this.currentProjectId) : null;
    }
}

// 全局实例
let projectDetailManager;

// 初始化项目详情管理
function initializeProjectDetail() {
    projectDetailManager = new ProjectDetailManager();
}

// 显示项目详情（全局函数）
function showProjectDetail(projectId) {
    if (!projectDetailManager) {
        initializeProjectDetail();
    }
    projectDetailManager.showProjectDetail(projectId);
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeProjectDetail();
    
    // 从URL参数获取项目ID
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project');
    
    if (projectId) {
        showProjectDetail(projectId);
    }
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ProjectManager,
        ProjectDetailManager
    };
}
