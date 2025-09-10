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

- `src/` - 源代码目录
- `public/` - 静态资源目录
- [index.html](.\index.html) - 主页面入口
- [vite.config.ts](.\vite.config.ts) - Vite配置文件
- [package.json](.\package.json) - 项目依赖和脚本配置

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
