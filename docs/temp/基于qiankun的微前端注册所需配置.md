# 微前端容器侧接入配置

## 1. 微前端注入配置

一个微应用接入需要提供的数据

- 微应用的应用名称 `[微应用提供]`：将用于构建部署文件夹名，此处统一为 package name，需唯一
- 微应用的 pathname `[可选][可qiankun决定]` 注：会在路由中进行 base 配置，如无配置则使用微应用应用的名称
- 微应用的菜单 menu 配置 `[微应用提供]`
- 微应用的 site 配置 `[微应用提供]`

## 2. 微前端菜单配置

容器需要集成微应用的菜单，同时接管菜单和面包屑导航，因此需要各注册的微应用提供`菜单配置 (menuConfig)`和对应的`站点配置(siteConfig)`

`菜单 menu`是`站点`的组织者，菜单中包含了分组性质的`菜单父节点`和对应实际页面的`叶子结点`。
`站点 site`是项目中页面（路由）的全集。

- 有些作为菜单的叶子结点，比如管理列表；
- 有些不在菜单中但是会用于组织面包屑导航，比如下钻的详情页面。

*通过两者合并起来才能共同生成“菜单”和“面包屑导航”。*

### 2.1 菜单配置说明

菜单配置为展示菜单的树形结构，其中包括`不对应页面的菜单（分组）节点`和`对应路由和页面的叶子结点`，具体示例如下：

```json
{
  "icon": '', // 定义可使用的图标配置
  "title": "page1", // 菜单的展示名称，
  "key": "system-page1", // 菜单的key，需唯一
  "children": [],
  "parentKey": "xxxx-key", // 【可选】该菜单的树形结构在容器菜单的指定层级下插入，没有配置时会延续在第一层级菜单的后方
  "extension": {
    // 拓展字段，通常用于功能性字段，比如页面级权限 code 等。
    // "permissionKey": "page permission code"
  },

  // NOTE: 下方内容仅叶子结点需要
  "siteNodeKey": "system-page1", // 有叶子结点的菜单 key 应与之保持一致
  "selectRule": {
    "path": `/${pathname}/page1/`, // 微应用的 pathname ( 默认为应用名称 )+ 路由
    "target": "_self" // 菜单打开方式 可选 _self （在当前页面） / _blank （打开一个新的tag页面）
  }
}

```

### 2.2 menuConfig 示例

整体 menuConfig 配置需要根据 `菜单展示` 来构建树形结构
如：菜单展示为

> 内容管理 -> 展示管理
>
> 展示管理

则配置为：

```javascript
[
  {
    title: '内容管理',
    selectRule:{
      path: '/pathname/content-manage',
      ...
    },
    ...
    children: [
      {
        title: '某方面内容管理',
        selectRule:{
          path: '/pathname/xxx-manage',
          ...
        }
        ...
      }
    ]
  },
  {
    title: '展示管理',
    selectRule:{
      path: '/pathname/display-manage'
      ...
    },
    ...
  }
]
```

### 2.3 siteConfig 配置描述

site 配置格式

```json
  "title": "系统页面",
  "key": "system-page1", // 需要与对应菜单的 siteNodeKey 保持一致，如没有对应菜单则保证唯一即可
  "path": "/${pathname}/page1/", // 微应用的 pathname ( 默认为应用名称 )+ 路由
  "children": [],
  "extension": {
    // 拓展字段，通常用于功能性字段，比如页面级权限 code 等。
    // "permissionKey": "page permission code"
  },
```

#### siteConfig 示例

整体的 site 配置需要根据`页面层级`来构建该树形结构。

如：页面为

> 内容管理 -> 管理详情 -> 单条明细
>
> 展示管理

则配置为：

```javascript
[
  {
    title: '内容管理',
    path: '/pathname/content-manage',
    ....
    children: [
      {
        title: '管理详情',
        path: '/pathname/content-manage/:id',
        ...
        children: [
          {
            title:'需求明细',
            path: '/pathname/content-manage/:id/item-detail',
            ...
          }
        ]
      }
    ]
  },
  {
    title: '展示管理',
    path: '/pathname/display-manage',
    ...
  }
]
```

## 3. demo 示例

假定需要接入两个微应用，分别为 `qiankun-vite-vue` 和 `qiankun-webpack-vue`，所有微应用的菜单配置方式完全一致，可针对其中一个进行查看。

`qiankun-vite-vue` 应用中需要的菜单结构：

- viteHome
- viteAbout

```json
{
  "name": "qiankun-vite-vue",
  "pathname": "/qiankun-vite-vue",
  "siteConfig": [
    {
      "key": "viteHome",
      "path": "/qiankun-vite-vue/home",
      "title": "viteHome",
      "children": [
        { 
          "key": "viteHomeDetail",
          "path": "/qiankun-vite-vue/home/:id",
          "title": "xx详情"
        }
      ]
    },
    {
      "key": "viteAbout",
      "path": "/qiankun-vite-vue/about",
      "title": "viteAbout"
    }
  ],
  "menuConfig": [
    {
      "icon": "icon-manager",
      "key": "vite-page1",
      "title": "vite-page1-title",
      "children": [
        {
          "icon": "",
          "key": "viteHome",
          "selectRule": {
            "path": "/qiankun-vite-vue/home",
            "target": "_self"
          },
          "siteNodeKey": "viteHome",
          "title": "viteHome"
        },
        {
          "icon": "",
          "key": "viteAbout",
          "selectRule": {
            "path": "/qiankun-vite-vue/about",
            "target": "_self"
          },
          "siteNodeKey": "viteAbout",
          "title": "viteAbout"
        }
      ]
    }
  ]
}

```

`qiankun-webpack-vue` 应用中需要的菜单结构：

- webpackHome
- webpackAbout

```json
{
  "name": "qiankun-webpack-vue",
  "pathname": "/qiankun-webpack-vue",
  "siteConfig": [
    {
      "key": "webpackHome",
      "path": "/qiankun-webpack-vue/home",
      "title": "webpackHome"
    },
    {
      "key": "webpackAbout",
      "path": "/qiankun-webpack-vue/about",
      "title": "webpackAbout"
    }
  ],
  "menuConfig": [
    {
      "icon": "",
      "key": "webpack-1",
      "title": "webpack1",
      "children": [
        {
          "icon": "",
          "key": "webpackHome",
          "selectRule": {
            "path": "/qiankun-webpack-vue/home",
            "target": "_self"
          },
          "siteNodeKey": "webpackHome",
          "title": "webpackHome"
        },
        {
          "icon": "",
          "key": "webpackAbout",
          "selectRule": {
            "path": "/qiankun-webpack-vue/about",
            "target": "_self"
          },
          "siteNodeKey": "webpackAbout",
          "title": "webpackAbout"
        }
      ]
    }
  ]
}
```

### 3.1 生产环境部署

部署地址 nginx ${root}/microapps/
  -qiankun-vite-vue
  -qiankun-webpack-vue
