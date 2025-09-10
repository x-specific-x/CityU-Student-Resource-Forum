# CityU学生资源论坛

这是一个为CityU学生设计的资源分享论坛Web应用，允许学生上传、分享和讨论各种学习资源,进行学生之间的交互例如社团招募、科研组队等。

## 项目概述

CityU学生资源论坛旨在为学生提供一个集中化的平台，方便他们共享课程资料、学习经验和其他有用的学术资源。该平台具有现代化的用户界面，支持响应式设计，可以在各种设备上使用。


## 技术栈

- 前端框架：React + TypeScript
- 构建工具：Vite
- 包管理器：npm

## 安装依赖

```bash
npm install
```

# 启动开发服务器
```bash
npm run dev
```



# 构建生产版本

```bash
npm run build
```


## 项目结构

-   **src/**
    -   `App.tsx` - 主应用组件，包含整体布局和路由配置
    -   `main.tsx` - 应用入口文件，初始化React应用并渲染根组件
    -   `index.css` - 全局基础样式文件
    -   `Attributions.md` - 第三方资源和版权归属说明文档
    -   **components/** - 组件目录，包含所有UI组件
        -   **figma/**
            -   `ImageWithFallback.tsx` - 带降级处理的图片组件
        -   **modules/** - 功能模块组件
            -   `AcademicResourcesModule.tsx` - 学术资源模块
            -   ……
        -   **ui/** - UI基础组件库
            -   `accordion.tsx` - 手风琴组件
            -   `alert-dialog.tsx` - 警告对话框组件
            -   `alert.tsx` - 警告组件
            -   `button.tsx` - 按钮组件
            -   `card.tsx` - 卡片组件
            -   `dialog.tsx` - 对话框组件
            -   `dropdown-menu.tsx` - 下拉菜单组件
            -   `input.tsx` - 输入框组件
            -   `sidebar.tsx` - 侧边栏组件
            -   `table.tsx` - 表格组件
            -   `use-mobile.ts` - 移动端检测Hook
            -   `utils.ts` - UI组件工具函数
            -   `Header.tsx` - 顶部导航栏组件
            -   `Sidebar.tsx` - 侧边栏导航组件
    -   **guidelines/** - 设计规范目录
        -   `Guidelines.md` - 项目设计和开发规范文档
    -   **styles/** - 样式目录
        -   `globals.css` - 全局样式定义文件
- `public/` - 静态资源目录
- `index.html` - 主页面入口
- `vite.config.ts` - Vite配置文件
- `package.json` - 项目依赖和脚本配置

## 主要功能
* 学生资源上传与下载
* 资源分类与搜索
* 为学生提供官方讨论组、社团活动线上空间
* 响应式界面设计，支持桌面端


## 开发指南
* 所有React组件位于 src 目录下
* 使用TypeScript进行类型检查
* 使用Vite作为构建工具，提供快速的开发体验
* 样式使用CSS或CSS-in-JS方案
