## 开发环境安装

```bash
# 1：安装node
前端开发框架和环境都是需要 Node.js ，先安装node.js开发环境，vue的运行是要依赖于node的npm的管理工具来实现，
下载https://nodejs.org/en/，（安装LTS版本）安装完成之后，打开cmd开始输入命令。（win10系统需要管理员权限，右键点击以管理员身份运行cmd，否则可能会出现很多报错）

# 2：查看node的版本号
下载好node之后，以管理员身份打开cmd管理工具，，输入 node -v ，回车，查看node版本号，出现版本号则说明安装成功。
使用 npm install npm -g 更新至最新;

#3、全局安装 vue-cli
npm install --global vue-cli
或 sudo npm install vue-cli -g
```

## 开发

```bash
# git clone 项目
http://git.th-leasing.com/udrive/udrive-web.git

# 进入项目目录
cd udrive-web/udrive-web-h5

# 安装依赖
npm install

# (可选）建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 http://localhost:9527

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

## 代码结构
```
├── dist                       // 打包产出文件
├── node_module                // npm加载所需的项目依赖模块
├── public                     // 静态入口
├── src                        // 源代码
│   ├── api                    // 所有API请求
│   ├── assets                 // 主题 字体 图片等静态资源
│   ├── common                 // 全局公用配置
│   │   ├── config             // 配置全局路由权限和错误捕获
│   │   ├── mixin              // 一些vue公用的mixin
│   │   └── js                 // 编写公有的方法
│   ├── components             // 全局公用组件
│   ├── directive              // 自定义指令
│   ├── filters                // 自定义过滤器
│   ├── icons                  // svg部分图标（svg-icon）
│   ├── router                 // 路由
│   ├── store                  // 全局 store管理
│   ├── style                  // 编写公有的样式
│   ├── vendor                 // 第三方组件引入
│   ├── views                  // view
│   │   ├── home               //   首页模块
│   │   ├── login              //   登录模块
│   │   ├── trip               //   启程管理
│   │   ├── race               //   路赛管理
│   │   ├── ad                 //   广告管理
│   │   ├── ops                //   运营管理
│   │   ├── mall               //   商城管理
│   │   ├── gameItem           //   道具管理
│   │   ├── user               //   用户管理
│   │   ├── best               //   优选管理
│   │   ├── group              //   拼团管理
│   │   ├── profile            //   个人中心模块
│   │   ├── redirect           //   重定向模块
│   │   └── sys                //   系统管理
│   ├── App.vue                // 入口页面
│   ├── main.js                // 入口 加载组件 初始化等
│   └── settings.js            // 系统设定参数
├── static                     // 第三方不打包资源
├── .babelrc                   // babel-loader 配置
├── eslintrc.js                // eslint 配置项
├── .gitignore                 // git 忽略项
├── plopfile.js                // 弹窗消息共通文件
├── vue.config.js              // vue-cli@3.0+ 配置文件
├── package.json               // package.json
└── README.md                  // 源码说明文件
```

## 功能相关介绍
|模块|功能|页面编码|描述|
|:---|:--|:------|:---|
|登录|登录|login|菜单中不显示|
|401|401|401|角色无访问权限时进入这个页面|
|404|404|404|访问菜单不存在时进入这个页面|
|首页|首页|home||
|-|个人中心|profile||
|-|修改密码|changePwd||
|商户管理||merchant||
|-|商户列表|merchantList||
|-|入驻审核|merchantApprove||
|-|店铺开通|shopManage||
|会员管理||vip||
|-|会员列表|vipList||
|运营管理||order||
|-|商户订单|orderList||
|-|商户退换货|orderReturnList||
|-|平台订单|platorderList||
|-|平台退换货|platorderReturnList||
|卡券核销||cardverify||
|-|卡券核销|cardverifyList||
|商品管理||goods||
|-|品类设定|categoryList||
|-|商品品牌|goodsbrandList||
|-|商品列表|goodsList||
|-|商品审核|goodsApprove|| 
|统计报表||report||
|-|商户订单统计|salesReportByStoreOrder||
|-|按品类销量统计|salesReportByCategory||
|-|日报|dailySalesReport||
|-|日月报|monthlySalesReport||
|-|库存报表|stockReport|| 
|财务管理||finance||
|-|商户帐户|merchantAccount||
|-|商户结算账单|merchantBill||
|-|商户收付款|merchantPayment||
|-|商户结算|merchantTransfer||
|系统管理||system||
|-|员工管理|staffList||
|-|角色权限|roleList||
|-|菜单管理|menuList||
|-|区域管理|areaList||
|-|敏感词库|sysConfig||
|-|系统设定|sysConfig||
|-|系统日志|log||
