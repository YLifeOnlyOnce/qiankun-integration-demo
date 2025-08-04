# 微应用CSS统一样式规范

## 1. 概述

本文档旨在为基于qiankun微前端架构的多个微应用提供统一的CSS样式规范，确保各微应用之间视觉风格的一致性，提升用户体验，并降低样式冲突的可能性。

### 1.1 目标

- 统一各微应用的视觉风格
- 减少样式冲突
- 提高开发效率
- 优化用户体验
- 便于维护和扩展

### 1.2 适用范围

本规范适用于所有基于qiankun微前端架构接入的微应用，包括但不限于基于Vue、React等框架开发的应用。

## 2. 样式框架结构

### 2.1 样式层级结构

```
├── 全局样式（Global Styles）
│   ├── 重置样式（Reset）
│   ├── 基础变量（Variables）
│   ├── 主题配置（Themes）
│   └── 通用工具类（Utilities）
├── 组件样式（Component Styles）
│   ├── 基础组件（Basic Components）
│   ├── 业务组件（Business Components）
│   └── 布局组件（Layout Components）
└── 页面样式（Page Styles）
    ├── 公共页面样式（Common Pages）
    └── 特定页面样式（Specific Pages）
```

### 2.2 样式隔离策略

为避免微应用间样式冲突，采用以下隔离策略：

1. **CSS命名空间**：每个微应用使用统一前缀
2. **Shadow DOM**：必要时可考虑使用
3. **CSS Modules**：推荐在组件级别使用
4. **qiankun样式沙箱**：利用微前端框架提供的样式隔离能力

## 3. 样式规范明细

### 3.1 命名规范

#### 3.1.1 CSS类名命名规则

- 采用BEM（Block-Element-Modifier）命名方法
- 微应用统一前缀：`app-[name]`，如`app-system`
- 组件命名格式：`[app-prefix]-[block]__[element]--[modifier]`
- 使用小写字母和连字符（-）

示例：
```css
/* 系统管理微应用的导航组件中的活跃项 */
.app-system-nav__item--active {
  color: var(--primary-color);
}
```

#### 3.1.2 变量命名规则

- 使用有意义的描述性名称
- 遵循`--[category]-[property]-[variant]`格式

示例：
```css
--color-primary: #1890ff;
--spacing-margin-small: 8px;
--font-size-heading: 20px;
```

### 3.2 颜色系统

#### 3.2.1 主色调

```css
:root {
  --color-primary: #1890ff;       /* 主色 */
  --color-primary-light: #40a9ff;  /* 主色-浅色 */
  --color-primary-dark: #096dd9;   /* 主色-深色 */
  
  --color-success: #52c41a;        /* 成功色 */
  --color-warning: #faad14;        /* 警告色 */
  --color-error: #f5222d;          /* 错误色 */
  --color-info: #1890ff;           /* 信息色 */
}
```

#### 3.2.2 中性色

```css
:root {
  --color-text-primary: rgba(0, 0, 0, 0.85);    /* 主要文字 */
  --color-text-secondary: rgba(0, 0, 0, 0.65);   /* 次要文字 */
  --color-text-disabled: rgba(0, 0, 0, 0.25);    /* 禁用文字 */
  
  --color-border: #d9d9d9;                       /* 边框色 */
  --color-border-light: #f0f0f0;                 /* 浅边框色 */
  
  --color-background: #f0f2f5;                   /* 背景色 */
  --color-background-light: #fafafa;             /* 浅背景色 */
  --color-background-dark: #f5f5f5;              /* 深背景色 */
}
```

### 3.3 字体规范

```css
:root {
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
  
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 600;
  
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-loose: 1.8;
}
```

### 3.4 间距规范

```css
:root {
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-xxl: 48px;
  
  /* 内边距 */
  --padding-card: var(--spacing-md);
  --padding-container: var(--spacing-lg);
  
  /* 外边距 */
  --margin-component: var(--spacing-md);
  --margin-section: var(--spacing-xl);
}
```

### 3.5 阴影规范

```css
:root {
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  
  /* 特定元素阴影 */
  --shadow-card: var(--shadow-md);
  --shadow-dropdown: var(--shadow-lg);
  --shadow-modal: var(--shadow-xl);
}
```

### 3.6 圆角规范

```css
:root {
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 16px;
  --radius-circle: 50%;
  
  /* 特定元素圆角 */
  --radius-button: var(--radius-md);
  --radius-card: var(--radius-md);
  --radius-input: var(--radius-md);
}
```

### 3.7 动画与过渡

```css
:root {
  --transition-fast: 0.2s;
  --transition-normal: 0.3s;
  --transition-slow: 0.5s;
  
  --easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --easing-accelerate: cubic-bezier(0.4, 0, 1, 1);
  --easing-decelerate: cubic-bezier(0, 0, 0.2, 1);
  
  /* 常用过渡 */
  --transition-all: all var(--transition-normal) var(--easing-standard);
  --transition-color: color var(--transition-fast) var(--easing-standard);
  --transition-transform: transform var(--transition-normal) var(--easing-standard);
}
```

## 4. 组件样式规范

### 4.1 按钮（Button）

```css
.app-[name]-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  line-height: 1.5;
  padding: 4px 15px;
  border-radius: var(--radius-button);
  transition: var(--transition-all);
  cursor: pointer;
}

.app-[name]-btn--primary {
  background-color: var(--color-primary);
  color: white;
  border: 1px solid var(--color-primary);
}

.app-[name]-btn--default {
  background-color: white;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}
```

### 4.2 输入框（Input）

```css
.app-[name]-input {
  width: 100%;
  padding: 4px 11px;
  font-size: var(--font-size-sm);
  line-height: 1.5;
  color: var(--color-text-primary);
  background-color: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-input);
  transition: var(--transition-all);
}

.app-[name]-input:focus {
  border-color: var(--color-primary-light);
  outline: 0;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}
```

### 4.3 卡片（Card）

```css
.app-[name]-card {
  background-color: white;
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  padding: var(--padding-card);
  margin-bottom: var(--margin-component);
}

.app-[name]-card__header {
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.app-[name]-card__content {
  color: var(--color-text-secondary);
}
```

## 5. 布局规范

### 5.1 网格系统

采用12列网格系统，可使用CSS Grid或Flex实现：

```css
.app-[name]-row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 calc(-1 * var(--spacing-md));
}

.app-[name]-col {
  padding: 0 var(--spacing-md);
  box-sizing: border-box;
}

.app-[name]-col--1 { width: 8.33%; }
.app-[name]-col--2 { width: 16.66%; }
.app-[name]-col--3 { width: 25%; }
.app-[name]-col--4 { width: 33.33%; }
.app-[name]-col--5 { width: 41.66%; }
.app-[name]-col--6 { width: 50%; }
.app-[name]-col--7 { width: 58.33%; }
.app-[name]-col--8 { width: 66.66%; }
.app-[name]-col--9 { width: 75%; }
.app-[name]-col--10 { width: 83.33%; }
.app-[name]-col--11 { width: 91.66%; }
.app-[name]-col--12 { width: 100%; }
```

### 5.2 容器（Container）

```css
.app-[name]-container {
  width: 100%;
  padding-right: var(--padding-container);
  padding-left: var(--padding-container);
  margin-right: auto;
  margin-left: auto;
}

.app-[name]-container--fluid {
  max-width: none;
}

.app-[name]-container--sm {
  max-width: 576px;
}

.app-[name]-container--md {
  max-width: 768px;
}

.app-[name]-container--lg {
  max-width: 992px;
}

.app-[name]-container--xl {
  max-width: 1200px;
}
```

## 6. 响应式设计

### 6.1 断点定义

```css
:root {
  --breakpoint-xs: 576px;
  --breakpoint-sm: 768px;
  --breakpoint-md: 992px;
  --breakpoint-lg: 1200px;
  --breakpoint-xl: 1600px;
}
```

### 6.2 媒体查询混合

```scss
// SCSS Mixins示例
@mixin respond-xs {
  @media (max-width: var(--breakpoint-xs)) {
    @content;
  }
}

@mixin respond-sm {
  @media (min-width: var(--breakpoint-xs)) and (max-width: var(--breakpoint-sm)) {
    @content;
  }
}

@mixin respond-md {
  @media (min-width: var(--breakpoint-sm)) and (max-width: var(--breakpoint-md)) {
    @content;
  }
}

@mixin respond-lg {
  @media (min-width: var(--breakpoint-md)) and (max-width: var(--breakpoint-lg)) {
    @content;
  }
}

@mixin respond-xl {
  @media (min-width: var(--breakpoint-lg)) {
    @content;
  }
}
```

## 7. 实施指南

### 7.1 样式引入方式

1. **CSS变量共享**：主应用定义全局CSS变量，微应用引用
2. **公共样式库**：抽取为NPM包，各微应用安装使用
3. **样式文件复用**：通过构建工具复制到各微应用

### 7.2 样式冲突解决方案

1. **命名空间前缀**：确保每个微应用使用唯一前缀
2. **CSS Modules**：在组件级别使用局部作用域
3. **Shadow DOM**：必要时使用Web Components隔离样式
4. **qiankun样式沙箱**：启用严格样式隔离模式

```javascript
// 主应用注册微应用时启用严格样式隔离
registerMicroApps([
  {
    name: 'app1',
    entry: '//localhost:8080',
    container: '#container',
    activeRule: '/app1',
    props: { name: 'app1' },
    sandbox: {
      strictStyleIsolation: true // 开启严格样式隔离
    }
  }
]);
```

### 7.3 样式检查与执行

1. **Stylelint配置**：统一样式规范检查
2. **CI/CD集成**：在构建流程中加入样式检查
3. **样式审查**：代码审查过程中关注样式规范遵循情况

## 8. 最佳实践

1. 优先使用CSS变量实现主题定制
2. 避免使用!important覆盖样式
3. 避免过深的选择器嵌套（不超过3层）
4. 使用简写属性提高代码可读性
5. 按功能组织样式代码，而非按选择器类型
6. 使用注释说明复杂样式的用途
7. 定期检查和移除未使用的样式
8. 使用预处理器（如SCSS）提高开发效率

## 9. 附录

### 9.1 样式规范检查配置（Stylelint）

```json
{
  "extends": ["stylelint-config-standard"],
  "rules": {
    "selector-class-pattern": "^app-[a-z]+(-[a-z]+)*(__[a-z]+(-[a-z]+)*)?(--[a-z]+(-[a-z]+)*)?$",
    "max-nesting-depth": 3,
    "no-duplicate-selectors": true,
    "no-empty-source": true,
    "color-hex-case": "lower",
    "color-hex-length": "short",
    "font-family-name-quotes": "always-where-recommended",
    "function-url-quotes": "always",
    "declaration-no-important": true
  }
}
```

### 9.2 常见问题解答

1. **Q: 如何处理第三方组件库的样式冲突？**  
   A: 可以通过CSS变量覆盖第三方组件库的默认样式，或使用样式隔离技术。

2. **Q: 微应用间如何共享主题？**  
   A: 主应用定义CSS变量，微应用通过继承获取，或通过props传递主题配置。

3. **Q: 如何处理动态主题切换？**  
   A: 使用CSS变量结合JavaScript动态修改:root或html元素的样式属性。