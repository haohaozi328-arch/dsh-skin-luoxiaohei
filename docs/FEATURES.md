# dsh-skin-luoxiaohei · 功能拆分

罗小黑主题皮肤插件（DeepSeek Harness Web GUI）。浅色「奶油森林」为主，深色「深夜森林」跟随系统自动切换。

参考模板：`Small-tailqwq/dsh-deep-whale`（maid-atelier，CC BY-NC-SA，功能设计参考）+ `fengguang10086/dsh-skin-dark-gold`（token 覆盖范式）。代码为原创实现。

## 项目结构

```
dsh-skin-luoxiaohei/
├── package.json          # 插件清单：dsh.client { inject:[], platform:"web" } + dsh.bundle.patch
├── cordis.patch.yml      # bundle patch：安装时自动注册 ui-skin-luoxiaohei 插件行
├── skin.json             # 皮肤元数据（id / name / accent / bodyAttr / preview）
├── lib/
│   ├── index.js          # host 半：apply 空（纯浏览器皮肤，无 host 行为）
│   └── client.js         # 浏览器半（生成产物）：__ModuleLoader__ 工厂，素材 base64 内嵌
├── scripts/
│   └── gen-assets.py     # 素材生成：assets/* → base64 data URI → 注入 client 模板
├── src/client/           # TS 源码（与 lib 等价，供未来 tsdown 正式构建）
├── assets/               # 素材源文件（罗小黑 Q 版 GIF / 背景图）
├── preview/              # UI 审核稿与截图
├── docs/FEATURES.md      # 本文件
├── README.md             # 安装 / 卸载 / 版权
├── LICENSE               # MIT（代码部分）
└── NOTICE                # 素材版权声明（罗小黑工作室）
```

## v1 功能模块

| 模块 | 功能 | 实现位置 | 参考 |
|---|---|---|---|
| M1 token 覆盖 | 全量 `--dsw-alias-*` 两套色板。body 默认=奶油森林，`body[data-ds-dark-theme]`=深夜森林，跟随系统深浅自动切换 | `lib/client.js` CSS 段 | dark-gold（90+ token 全量）；maid-atelier.module.css |
| M2 背景层 | `bg-cream.jpg`（浅色）/ `bg-forest.jpg`（深色）fixed 全屏背景 + 半透明遮罩，保证文字可读 | 同上，body 背景 + overlay | maid-atelier backdrop |
| M3 叶子动效 | canvas 绿色叶子缓慢飘落；`prefers-reduced-motion` 时降级为静态帧 | `lib/client.js` JS 段 | dark-gold particles 引擎 |
| M4 跑步小黑 | `lxh-run.gif` 固定在输入框（composer）左上角，气泡浮动动画 | JS 注入元素 + CSS | maid-atelier composer-frame |
| M5 body 属性租约 | `data-dsh-luoxiaohei` 属性：apply 设置 / dispose 撤回，多皮肤共存不打架 | JS lease 结构 | maid-atelier bodyAttributeLease |
| M6 清理契约 | 全部注入（style / chrome 元素 / 属性 / 监听器）由 `ctx.effect` 持有 disposer，停用即还原 | `apply(ctx)` | maid-atelier tests 契约 |
| M7 favicon + title | 小黑思考头像 favicon + 标题「小黑森林 · DeepSeek Harness」 | JS | maid-atelier titlebar-brand |
| M8 发送键皮肤 | `send-click.gif` 覆盖层替换 DSH 原生发送按钮（探测 `aria-label="发送消息"`，不动产品 DOM，停用还原） | JS 注入 + CSS | maid-atelier chrome 注入模式 |
| M9 图标表情替换 | 语义锚定（文本+位置）将界面 svg 图标替换为罗小黑表情 GIF：temp→跳跃1、设置→剪刀手、模式选择→探头、上下文注入→收到、Think→思考、能力列表→跳跃系列；可逆还原 | JS 替换 + MutationObserver | 发送键同款覆盖层模式 |

## v2 候选（不破坏现有功能，按需迭代）

- AI 生成中 loading 替换（小黑玩球 GIF）
- 右侧悬浮主题切换按钮
- 侧栏会话列表 GIF 图标点缀
- 发送键 / 保存键替换（send-click.gif / 扇子妥字.gif）
- 任务完成动效（冲浪 / 耶 / 妥）
- 空状态欢迎页「在这片森林里，你想构建什么？」

## 设计约束（开闭原则）

1. **只读探测、不改写产品 DOM**：装饰层全部是新增元素（`data-skin-chrome` / `data-skin-owner` 标记），不替换 DSH 原生组件。
2. **所有写入可逆**：body 属性走租约，样式/元素走 `ctx.effect` disposer，插件停用后界面完全还原。
3. **可读性优先**：面板层保持不透明/半透明底线，不做全表面半透明（参照 alphacoders 的踩坑教训）。
4. **降级**：`prefers-reduced-motion` 静态帧；WebGL 不可用不影响（叶子走 2D canvas）。
5. **素材独立声明**：罗小黑素材版权归罗小黑工作室，仅供个人使用；代码 MIT。

## token 覆盖表（M1 明细）

两套色板的关键值（完整 90+ 项在 `lib/client.js`）：

| token 组 | 浅色 · 奶油森林 | 深色 · 深夜森林 |
|---|---|---|
| bg-base | `rgba(253,251,245,0.72)` | `rgba(10,20,15,0.74)` |
| bg-layer-1/2/3 | 白玻璃 0.66 / 0.5 / 0.38 | 深绿玻璃 0.78 / 0.66 / 0.55 |
| label-primary / secondary | `#20352B` / `#5C6E62` | `#E9E4D0` / `#A9B4A4` |
| brand-primary | `#2E7D5B` 森林绿 | `#A8E10C` 瞳绿 |
| border-l1~l4 | 绿调 0.12~0.38 | 瞳绿调 0.12~0.4 |
| button-primary-fill | `#2E7D5B` | `#A8E10C` |
| state-success / warn / error | `#4C9A3E` / `#C98A1B` / `#C94F4F` | `#8FCF5A` / `#E0A93C` / `#E0705F` |
| markdown-code-block | `#14241B` 深墨绿（视觉锚点） | `#0A140F` |
| specific-sidebar-fill | 白玻璃 0.44 | 深绿玻璃 0.6 |
