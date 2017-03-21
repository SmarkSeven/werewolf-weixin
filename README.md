# one

> A Vue.js project

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

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
####公共请求参数

| key      | value |
| ------    | -----    |
| user_di  |  用户ID |
| channel |  pp        |
| version  |  版本号(4.0.7) |
| uuid       |  00000000-41eb-998f-dab4-6c1045072748 |
| platform |  android |
####HOST
http://v3.wufazhuce.com:8000
###接口列表
[1.登录判断](#1)
[2.获取ID列表](#2)
[3.每日页面](#3)
[4.Movie详情](#4)
[5.Movie故事详情](#5)
[6.相关推荐](#6)

<h5 id="1">1.登录判断</h5>
**URL：/api/signin**
**Method：**POST
**Form：**

| key      | value |
| ------    | -----    |
| jwt       |  Json Web Token |
| vendor | 2 |
| client_type | ANDROID |
| client_id | AuQ55AMouMHgzftCN4N25uHNFw9wtQNL4Ce_PbwyAzBu|
--------
<h5 id=2>获取ID列表</h5>
**URL：/api/onelist/idlist/**

<h5 id=3>每日页面<h5.
**URL：**

---------
<h5 id=4>Movie详情</h5>
**URL：/api/movie/detail/id**
**Method：** POST
----------
<h5 id=5>Movie故事详情</h5>
**URL：/api/movie/566/story/1/0**
**Method：**GET
---------
<h5 id=6>相关推荐</h5>
**URL：/api/related/[question|movie|]/id**
**Method：**GET

----------
<h5 id=7>作者信息</h5>
**URL：/api/author/list?content_id=1636&category=4**
**Method：**GET

----------

-------

/api/channel/[reading]/more/0

---------
http://v3.wufazhuce.com:8000/api/onelist/3826/0
