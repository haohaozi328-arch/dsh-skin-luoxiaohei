# dsh-skin-luoxiaohei · 小黑森林

罗小黑主题皮肤插件 —— DeepSeek Harness Web GUI。

- 浅色 **「奶油森林」**：米白玻璃面板 + 森林绿 accent + 罗小黑瞳绿点缀
- 深色 **「深夜森林」**：墨绿黑底（小黑蹲在森林里）+ 瞳荧光绿 accent + 暖沙文字
- 跟随系统深浅色自动切换（`body[data-ds-dark-theme]`）
- 装饰层：背景插画、飘落叶、输入框左上角跑步小黑
- 纯客户端插件：不修改产品 DOM、不依赖 host 行为，停用即完全还原

## 安装

```sh
# 在 deepseek-harness 源码目录下（或任意 dsh CLI 可用的环境）：
dsh plugin --profile web add "D:\workspace\DeepSeek\dsh-skin-luoxiaohei"
# 或相对路径：
dsh plugin --profile web add ../dsh-skin-luoxiaohei
```

重启 `dsh web`，刷新页面即生效。

> 安装会通过 `cordis.patch.yml`（bundle patch）自动注册 `ui-skin-luoxiaohei` 插件行，无需手动编辑。

## 卸载

```sh
dsh plugin --profile web remove dsh-skin-luoxiaohei
```

重启 `dsh web`，皮肤完全还原。

## 功能

| 模块 | 说明 |
|---|---|
| 主题覆盖 | 全量 `--dsw-alias-*` 语义 token（90+），两套色板，跟随系统切换 |
| 背景层 | 浅色「罗小黑全家福」/ 深色「森林探头」插画，半透明遮罩保证可读性 |
| 叶子动效 | canvas 绿色叶子缓慢飘落；`prefers-reduced-motion` 时降级静态帧 |
| 跑步小黑 | `lxh-run.gif` 固定在输入框左上角，气泡浮动 |
| 清理契约 | body 属性租约 + effect disposer，停用即还原；多皮肤共存安全 |
| favicon | 小黑思考头像 + 标题「小黑森林 · DeepSeek Harness」 |

## 开发

```sh
# 重新生成 lib/client.js（素材变更后）：
python scripts/gen-assets.py

# 渲染验证（本地 http 服务）：
python -m http.server 8377 --directory .
# 打开 http://127.0.0.1:8377/preview/test-render.html
```

- `scripts/client.template.js` 是浏览器半源码模板（含全量 token 覆盖表）
- `lib/client.js` 为生成产物：素材以 base64 内嵌，单文件自包含
- UI 审核稿：`preview/index.html`（浅色/深色、token 标注、空状态首页、对话/轨迹双视图）
- 功能拆分与 v2 路线：`docs/FEATURES.md`

## 版权声明

- **代码**：MIT License（见 LICENSE）
- **素材**：罗小黑相关图片/GIF 版权归 **MTJJ / 罗小黑工作室**（© 罗小黑工作室）所有，仅供个人学习使用，禁止商用与二次分发。见 NOTICE。

## 兼容性

- 参考实现：`Small-tailqwq/dsh-deep-whale`（maid-atelier，CC BY-NC-SA，功能设计参考）；`fengguang10086/dsh-skin-dark-gold`（token 覆盖范式）
- 在 DeepSeek Harness `0.1.0-rc.5` Web GUI 上开发验证；`dsh.client` manifest 与 rc.6 契约一致（`{ inject: [], platform: "web" }`）
