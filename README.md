# 小黑森林 · DeepSeek Harness 主题

给 DeepSeek Harness 换上罗小黑主题。浅色「奶油森林」与深色「深夜森林」双主题，跟随系统深浅自动切换，让工作界面焕然一新。

> **兼容性**：已适配 **DeepSeek Harness 桌面端 App**（`desktop` profile）与命令行 `dsh web`（`web` profile），实测版本 `0.1.7-rc.2`。

## 效果

### 主界面

![主界面](./img/1.jpg)

### 对话界面

![对话界面](./img/2.jpg)

### 设置面板

![设置面板](./img/3.jpg)

## 功能

- 浅色「奶油森林」/ 深色「深夜森林」双主题，跟随系统自动切换
- 森林插画背景 + 飘落叶片动效
- 透明玻璃气泡：AI 回答与工具调用都有干净的玻璃框
- 设置面板「变色玻璃」：多彩渐变缓慢流动 + 毛玻璃模糊
- 工具调用图标：思考 / 读取 / 写入 / 编辑 / 搜索 / 上下文注入各配小黑动图，其余工具（运行命令等）统一用兜底小黑图标
- 自定义背景：设置面板上传本地图片，替换默认背景
- 鼠标样式可切换：系统默认 / 小黑拇指
- 停用皮肤即完全还原，不影响其他功能

## 安装

### 桌面端 App

桌面端的 profile（`desktop`）由 Electron 应用独占管理，`dsh plugin --profile desktop …` 会被拒绝（`profile "desktop" is managed exclusively by the Electron application`），请走应用内安装：

1. 打开桌面端 → 左下角「设置」→「插件」
2. 从本地路径或 Git 仓库安装 `dsh-skin-luoxiaohei`
3. 装好后重启桌面端应用（皮肤是客户端插件，重启或刷新页面后生效）

也可以手动挂载：把仓库 link 进 `~/.dsh/profiles/desktop/node_modules`，并在该 profile 的 `package.json` 里把 `dsh-skin-luoxiaohei` 追加到 `dsh.profile.bundles`。

### 命令行 / 浏览器（`dsh web`）

一键安装（交给 AI 助手或任意终端）：

```sh
dsh plugin --profile web add https://github.com/haohaozi328-arch/dsh-skin-luoxiaohei.git
```

手动安装：

```sh
git clone https://github.com/haohaozi328-arch/dsh-skin-luoxiaohei.git
cd dsh-skin-luoxiaohei
dsh plugin --profile web add .
```

安装后重启 `dsh web`，刷新页面即可生效。

## 卸载

```sh
dsh plugin --profile web remove dsh-skin-luoxiaohei
```

桌面端：设置 →「插件」里移除后重启应用（手动挂载的则从 `dsh.profile.bundles` 去掉并重装依赖）。

## 使用

- 左下角「设置」：切换外观（浅色 / 深色 / 跟随系统）、鼠标样式
- 设置里的「背景图片」：上传自己的图片作为主界面背景

## 更新记录

### 2026-09-24 · 适配 DSH 桌面端 `0.1.7-rc.2`

- **token 层叠覆盖**：DSH 的主题样式（`design-platform.css` 等）改为在插件样式之后注入，与皮肤同为 `body` 选择器时后者胜，90+ 个 `--dsw-alias-*` 被静默覆盖 —— 表现为森林背景消失（`AppFrame` 用不透明 `#fff` 盖住）。token 块改锚 `html body[data-dsh-luoxiaohei]`，不依赖注入顺序
- **设置面板「变色玻璃」**：锚点不再绑定构建 hash（`[role="dialog"].bi44ca_panel` → `role="dialog"`），并抬特异度压过面板自带背景，渐变与流动动画恢复
- **AI 正文玻璃框**：`[class*="gshEtW_body"] > [class*="_markdown_"]` → `[class*="_markdown_"]:not(:where([data-disclosure-row] *))`
- **工具图标**：识别本地化标题（思考 / 读取 / 写入 / 编辑 / 读取图片 / 搜索文件内容…），无专属素材的工具（运行命令 / bash / pwsh / 以后新增的）统一用兜底小黑图标；不再跳过没有标题的汇总行，同时显式跳过展开箭头
- **设置项找回**：设置面板内容容器改按结构查找（`[class*="_options"]` / `[class*="_content"]`），「鼠标样式」「背景图片」两行恢复，并补上小黑图标
- **代码块对比度**：深墨绿底配浅墨绿代码文字，`--shiki-token-*` 换成深底可读色系（对比度 1.4:1 → 12.7:1）
