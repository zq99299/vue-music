# vue-music

> 音乐播放器

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 项目目录结构，主要针对src
```
|- src
  |- api                              # 后端交互ajax请求
  |- common                           # 公共的资源文件和通用的js库
    |- fonts
    |- image
    |- js                             # 公共的js库
    |- stylus                         # css
  |-base                              # 基础组件
  |-components                        # 业务组件，类似页面，但是一个单页应用来说，其实都是组件而不是页面，所以这个分类仁者见仁
```
