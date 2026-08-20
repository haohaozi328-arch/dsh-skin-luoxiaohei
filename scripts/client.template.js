/**
 * dsh-skin-luoxiaohei · browser half (template) — 精简版
 *
 * 由 scripts/gen-assets.py 生成：素材对象与 __ASSET_*__ 占位符会被替换为
 * 素材 base64 data URI，产物输出到 lib/client.js。
 *
 * 只保留两样皮肤元素（其余一律删除干净）：
 *   1. token 配色：奶油森林 / 深夜森林（跟随系统深浅），纯色玻璃界面，无插画背景
 *   2. 背景树叶：canvas 飘落的绿色叶子
 *   3. 发送键：send-click.gif 覆盖 DSH 原生发送按钮
 *
 * 全部写入由 Cordis effect disposer 清理，停用即还原。
 */
window.__ModuleLoader__.load({
	id: "dsh-skin-luoxiaohei",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		//#region assets（生成脚本注入）
		var ASSETS = __ASSETS__;
		//#endregion

		//#region skin.css
		const css = `
/* ── dsh-skin-luoxiaohei · 极简版（奶油森林 / 深夜森林） ─────────── */

/* ═══ M1 · 全量 token 覆盖 · 浅色「奶油森林」 ═══ */
body {
  --dsw-alias-bg-base: rgba(250, 246, 236, 0.55);
  --dsw-alias-bg-layer-1: rgba(255, 255, 255, 0.6);
  --dsw-alias-bg-layer-2: rgba(255, 255, 255, 0.46);
  --dsw-alias-bg-layer-3: rgba(255, 255, 255, 0.36);
  --dsw-alias-bg-overlay: rgba(255, 255, 255, 0.9);
  --dsw-alias-bg-module-platform: rgba(255, 255, 255, 0.5);
  --dsw-alias-bg-multi-select: rgba(255, 255, 255, 0.5);
  --dsw-alias-bg-skeleton: rgba(46, 125, 91, 0.08);
  --dsw-alias-bg-mask-1: rgba(20, 36, 27, 0.4);
  --dsw-alias-bg-mask-2: rgba(20, 36, 27, 0.28);
  --dsw-alias-bg-mask-3: rgba(20, 36, 27, 0.18);
  --dsw-alias-bg-mask-drop: rgba(250, 246, 236, 0.88);
  --dsw-alias-bg-mask-photo: rgba(250, 246, 236, 0.72);

  --dsw-alias-label-primary: #20352B;
  --dsw-alias-label-primary-dimmed: #2C4538;
  --dsw-alias-label-primary-bluish: #20352B;
  --dsw-alias-label-primary-foreground: #F4FAF2;
  --dsw-alias-label-primary-inverted: #F4FAF2;
  --dsw-alias-label-secondary: #5C6E62;
  --dsw-alias-label-tertiary: #7C8E80;
  --dsw-alias-label-caption: #8A9A8E;
  --dsw-alias-label-dimmed: #A3B1A6;

  --dsw-alias-brand-primary: #2E7D5B;
  --dsw-alias-brand-primary-invert: #F4FAF2;
  --dsw-alias-brand-text: #2E7D5B;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #A8E10C;

  --dsw-alias-border-l1: rgba(46, 125, 91, 0.12);
  --dsw-alias-border-l2: rgba(46, 125, 91, 0.22);
  --dsw-alias-border-l2-darkmode-thin: rgba(46, 125, 91, 0.14);
  --dsw-alias-border-l3: rgba(46, 125, 91, 0.3);
  --dsw-alias-border-l4: rgba(46, 125, 91, 0.38);
  --dsw-alias-border-inverted: rgba(46, 125, 91, 0.14);
  --dsw-alias-border-inverted2: rgba(46, 125, 91, 0.2);

  --dsw-alias-interactive-bg-hover: rgba(46, 125, 91, 0.08);
  --dsw-alias-interactive-bg-active: rgba(46, 125, 91, 0.14);
  --dsw-alias-interactive-bg-hover-accent: rgba(168, 225, 12, 0.2);
  --dsw-alias-interactive-bg-hover-solid: #2E7D5B;
  --dsw-alias-interactive-bg-hover-danger: rgba(201, 79, 79, 0.1);

  --dsw-alias-button-primary-fill: #2E7D5B;
  --dsw-alias-button-primary-hover: #24694C;
  --dsw-alias-button-primary-dimmed: rgba(46, 125, 91, 0.18);
  --dsw-alias-button-contrast-fill: #20352B;
  --dsw-alias-button-elevated-fill: rgba(255, 255, 255, 0.82);
  --dsw-alias-button-floating-fill: rgba(255, 255, 255, 0.76);
  --dsw-alias-button-floating-hover: rgba(255, 255, 255, 0.92);
  --dsw-alias-button-ghost-active-fill: rgba(46, 125, 91, 0.12);
  --dsw-alias-button-ghost-active-hover: rgba(46, 125, 91, 0.18);
  --dsw-alias-button-ghost-active-border: #2E7D5B;
  --dsw-alias-button-info-fill: #2E7D5B;
  --dsw-alias-button-info-hover: #24694C;
  --dsw-alias-button-tool-bar-fill: rgba(46, 125, 91, 0.1);
  --dsw-alias-button-tool-bar-fill-invisible: rgba(46, 125, 91, 0.06);
  --dsw-alias-button-tool-bar-hover: rgba(46, 125, 91, 0.16);

  --dsw-alias-scrollbar-bg-l1: rgba(46, 125, 91, 0.16);
  --dsw-alias-scrollbar-bg-l2: rgba(46, 125, 91, 0.22);
  --dsw-alias-scrollbar-hover-l1: rgba(46, 125, 91, 0.32);
  --dsw-alias-scrollbar-hover-l2: rgba(46, 125, 91, 0.4);

  --dsw-alias-toast-bg: rgba(46, 125, 91, 0.92);
  --dsw-alias-tooltip-bg: rgba(32, 53, 43, 0.94);

  --dsw-alias-state-business-primary: #2E7D5B;
  --dsw-alias-state-business-tertiary: rgba(46, 125, 91, 0.16);
  --dsw-alias-state-success-primary: #4C9A3E;
  --dsw-alias-state-success-secondary: #3D8233;
  --dsw-alias-state-success-tertiary: rgba(76, 154, 62, 0.14);
  --dsw-alias-state-warn-primary: #C98A1B;
  --dsw-alias-state-warn-secondary: #B07A14;
  --dsw-alias-state-warn-label: #C98A1B;
  --dsw-alias-state-warn-tertiary: rgba(201, 138, 27, 0.14);
  --dsw-alias-state-error-primary: #C94F4F;
  --dsw-alias-state-error-secondary: #B23E3E;

  --dsw-specific-sidebar-fill: rgba(250, 246, 236, 0.4);
  --dsw-specific-sidebar-nav-item-active: rgba(46, 125, 91, 0.12);
  --dsw-specific-sidebar-nav-item-active-accent: rgba(168, 225, 12, 0.16);
  --dsw-specific-sidebar-nav-item-hover: rgba(46, 125, 91, 0.08);
  --dsw-specific-bubble: rgba(255, 255, 255, 0.5);
  --dsw-specific-bubble-highlight: rgba(255, 255, 255, 0.66);
  --dsw-specific-input-major: rgba(255, 255, 255, 0.6);
  --dsw-specific-login-input: rgba(255, 255, 255, 0.55);
  --dsw-specific-menu: rgba(255, 255, 255, 0.92);
  --dsw-specific-selector: rgba(255, 255, 255, 0.68);
  --dsw-specific-tip: rgba(255, 255, 255, 0.92);

  --dsw-alias-markdown-inline-code: rgba(163, 230, 53, 0.16);
  --dsw-alias-markdown-code-block: #14241B;
  --dsw-alias-markdown-code-block-banner: #1B3226;
  --dsw-alias-markdown-code-segment-selected: #1B3226;
  --dsw-alias-markdown-code-segment-unselected: #14241B;
  --dsw-alias-markdown-citation: rgba(46, 125, 91, 0.1);
  --dsw-alias-markdown-placeholder: rgba(255, 255, 255, 0.45);
  --dsw-alias-markdown-tag: rgba(46, 125, 91, 0.12);

  --shiki-foreground: #DCE8D4;
  --shiki-background: var(--dsw-alias-markdown-code-block);
}

/* ═══ M1 · 深色「深夜森林」 ═══ */
body[data-ds-dark-theme] {
  --dsw-alias-bg-base: rgba(8, 16, 12, 0.6);
  --dsw-alias-bg-layer-1: rgba(17, 33, 25, 0.78);
  --dsw-alias-bg-layer-2: rgba(22, 41, 31, 0.66);
  --dsw-alias-bg-layer-3: rgba(28, 51, 38, 0.55);
  --dsw-alias-bg-overlay: rgba(17, 33, 25, 0.94);
  --dsw-alias-bg-module-platform: rgba(22, 41, 31, 0.66);
  --dsw-alias-bg-multi-select: rgba(22, 41, 31, 0.66);
  --dsw-alias-bg-skeleton: rgba(168, 225, 12, 0.08);
  --dsw-alias-bg-mask-1: rgba(0, 0, 0, 0.5);
  --dsw-alias-bg-mask-2: rgba(0, 0, 0, 0.36);
  --dsw-alias-bg-mask-3: rgba(0, 0, 0, 0.24);
  --dsw-alias-bg-mask-drop: rgba(8, 16, 12, 0.88);
  --dsw-alias-bg-mask-photo: rgba(8, 16, 12, 0.66);

  --dsw-alias-label-primary: #E9E4D0;
  --dsw-alias-label-primary-dimmed: #CFC9B2;
  --dsw-alias-label-primary-bluish: #E9E4D0;
  --dsw-alias-label-primary-foreground: #16281A;
  --dsw-alias-label-primary-inverted: #16281A;
  --dsw-alias-label-secondary: #A9B4A4;
  --dsw-alias-label-tertiary: #8B9787;
  --dsw-alias-label-caption: #77836F;
  --dsw-alias-label-dimmed: #5F6B5F;

  --dsw-alias-brand-primary: #A8E10C;
  --dsw-alias-brand-primary-invert: #16281A;
  --dsw-alias-brand-text: #A8E10C;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #A8E10C;

  --dsw-alias-border-l1: rgba(168, 225, 12, 0.12);
  --dsw-alias-border-l2: rgba(168, 225, 12, 0.2);
  --dsw-alias-border-l2-darkmode-thin: rgba(168, 225, 12, 0.1);
  --dsw-alias-border-l3: rgba(168, 225, 12, 0.3);
  --dsw-alias-border-l4: rgba(168, 225, 12, 0.4);
  --dsw-alias-border-inverted: rgba(168, 225, 12, 0.12);
  --dsw-alias-border-inverted2: rgba(168, 225, 12, 0.18);

  --dsw-alias-interactive-bg-hover: rgba(168, 225, 12, 0.08);
  --dsw-alias-interactive-bg-active: rgba(168, 225, 12, 0.14);
  --dsw-alias-interactive-bg-hover-accent: rgba(168, 225, 12, 0.2);
  --dsw-alias-interactive-bg-hover-solid: #1B3226;
  --dsw-alias-interactive-bg-hover-danger: rgba(224, 112, 95, 0.14);

  --dsw-alias-button-primary-fill: #A8E10C;
  --dsw-alias-button-primary-hover: #C2F23A;
  --dsw-alias-button-primary-dimmed: rgba(168, 225, 12, 0.16);
  --dsw-alias-button-contrast-fill: #E9E4D0;
  --dsw-alias-button-elevated-fill: rgba(22, 41, 31, 0.72);
  --dsw-alias-button-floating-fill: rgba(22, 41, 31, 0.68);
  --dsw-alias-button-floating-hover: rgba(28, 51, 38, 0.82);
  --dsw-alias-button-ghost-active-fill: rgba(168, 225, 12, 0.1);
  --dsw-alias-button-ghost-active-hover: rgba(168, 225, 12, 0.16);
  --dsw-alias-button-ghost-active-border: #A8E10C;
  --dsw-alias-button-info-fill: #A8E10C;
  --dsw-alias-button-info-hover: #C2F23A;
  --dsw-alias-button-tool-bar-fill: rgba(168, 225, 12, 0.08);
  --dsw-alias-button-tool-bar-fill-invisible: rgba(168, 225, 12, 0.05);
  --dsw-alias-button-tool-bar-hover: rgba(168, 225, 12, 0.13);

  --dsw-alias-scrollbar-bg-l1: rgba(168, 225, 12, 0.14);
  --dsw-alias-scrollbar-bg-l2: rgba(168, 225, 12, 0.2);
  --dsw-alias-scrollbar-hover-l1: rgba(168, 225, 12, 0.28);
  --dsw-alias-scrollbar-hover-l2: rgba(168, 225, 12, 0.36);

  --dsw-alias-toast-bg: rgba(28, 51, 38, 0.95);
  --dsw-alias-tooltip-bg: rgba(22, 41, 31, 0.96);

  --dsw-alias-state-business-primary: #A8E10C;
  --dsw-alias-state-business-tertiary: rgba(168, 225, 12, 0.12);
  --dsw-alias-state-success-primary: #8FCF5A;
  --dsw-alias-state-success-secondary: #74B255;
  --dsw-alias-state-success-tertiary: rgba(143, 207, 90, 0.14);
  --dsw-alias-state-warn-primary: #E0A93C;
  --dsw-alias-state-warn-secondary: #C68F2C;
  --dsw-alias-state-warn-label: #E0A93C;
  --dsw-alias-state-warn-tertiary: rgba(224, 169, 60, 0.14);
  --dsw-alias-state-error-primary: #E0705F;
  --dsw-alias-state-error-secondary: #C95A4C;

  --dsw-specific-sidebar-fill: rgba(10, 20, 15, 0.46);
  --dsw-specific-sidebar-nav-item-active: rgba(168, 225, 12, 0.1);
  --dsw-specific-sidebar-nav-item-active-accent: rgba(168, 225, 12, 0.16);
  --dsw-specific-sidebar-nav-item-hover: rgba(168, 225, 12, 0.07);
  --dsw-specific-bubble: rgba(22, 41, 31, 0.7);
  --dsw-specific-bubble-highlight: rgba(28, 51, 38, 0.75);
  --dsw-specific-input-major: rgba(22, 41, 31, 0.7);
  --dsw-specific-login-input: rgba(22, 41, 31, 0.66);
  --dsw-specific-menu: rgba(22, 41, 31, 0.96);
  --dsw-specific-selector: rgba(22, 41, 31, 0.8);
  --dsw-specific-tip: rgba(22, 41, 31, 0.96);

  --dsw-alias-markdown-inline-code: rgba(163, 230, 53, 0.14);
  --dsw-alias-markdown-code-block: #0A140F;
  --dsw-alias-markdown-code-block-banner: #14241B;
  --dsw-alias-markdown-code-segment-selected: #14241B;
  --dsw-alias-markdown-code-segment-unselected: #0A140F;
  --dsw-alias-markdown-citation: rgba(168, 225, 12, 0.08);
  --dsw-alias-markdown-placeholder: rgba(10, 20, 15, 0.6);
  --dsw-alias-markdown-tag: rgba(168, 225, 12, 0.1);

  --shiki-foreground: #C9D8C0;
  --shiki-background: var(--dsw-alias-markdown-code-block);
}

/* ═══ 背景层：森林插画壁纸 + 极淡绿光氛围；面板 token 保持半透明，森林从玻璃下透出 ═══ */
/* 背景图定义一次，浅/深两套共用，避免同一 base64 内嵌多次 */
body { --dsh-lxh-bg-forest: url("__ASSET_bg-forest.jpg__"); }
body {
  background-color: var(--dsw-alias-bg-base);
  background-image:
    radial-gradient(1200px 700px at 85% -10%, rgba(168, 225, 12, 0.1), transparent 60%),
    radial-gradient(1000px 800px at -10% 110%, rgba(46, 125, 91, 0.1), transparent 55%),
    var(--dsh-lxh-bg-forest);
  background-size: auto, auto, cover;
  background-position: 0% 0%, 0% 0%, center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
/* 深色「深夜森林」：压暗插画做暗化遮罩层，保住可读性与夜间氛围 */
body[data-ds-dark-theme] {
  background-image:
    radial-gradient(1200px 700px at 85% -10%, rgba(168, 225, 12, 0.06), transparent 60%),
    radial-gradient(1000px 800px at -10% 110%, rgba(46, 125, 91, 0.12), transparent 55%),
    linear-gradient(rgba(5, 13, 9, 0.62), rgba(5, 13, 9, 0.62)),
    var(--dsh-lxh-bg-forest);
  background-size: auto, auto, auto, cover;
  background-position: 0% 0%, 0% 0%, 0% 0%, center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
#root, #app, [data-app-shell] {
  background: transparent;
}

/* ═══ 叶子画布 ═══ */
.dsh-lxh-leaves {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2147483000;
  pointer-events: none;
}

/* ═══ Hero 欢迎页形象：罗小黑剪刀手 GIF ═══ */
.dsh-lxh-hero-mascot {
  display: flex;
  justify-content: center;
  margin-top: 2px;
}
.dsh-lxh-hero-mascot img {
  width: 148px;
  height: 148px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(168, 225, 12, 0.65);
  box-shadow: 0 0 0 9px rgba(168, 225, 12, 0.12), 0 14px 34px rgba(20, 45, 30, 0.2);
  background: rgba(255, 255, 255, 0.45);
}
body[data-ds-dark-theme] .dsh-lxh-hero-mascot img {
  border-color: rgba(168, 225, 12, 0.55);
  box-shadow: 0 0 0 9px rgba(168, 225, 12, 0.1), 0 14px 34px rgba(0, 0, 0, 0.4);
  background: rgba(17, 33, 25, 0.6);
}

/* ═══ Hero 动效：剪刀手悬浮 · 绿环呼吸 · 标题淡入 ═══ */
.dsh-lxh-hero-mascot {
  position: relative;
  cursor: pointer;
}
.dsh-lxh-hero-mascot::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 172px;
  height: 172px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(168, 225, 12, 0.3), transparent 66%);
  animation: dshHeroBreath 3.6s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
}
.dsh-lxh-hero-mascot img {
  position: relative;
  z-index: 1;
  animation: dshHeroFloat 4s ease-in-out infinite;
}
@keyframes dshHeroFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
@keyframes dshHeroBreath {
  0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(0.94); }
  50% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.04); }
}

/* 标题逐字由 .dsh-lxh-title-char 负责入场，headlineText 容器本身不再自带淡入 */
[data-phase="hero"] span[class*="headlineText"] {
  font-variant-numeric: normal;
}

/* 标题配色：炭墨绿 → 酸荧光绿渐变（与绿环光晕呼应） */
[data-phase="hero"] span[class*="headlineText"] {
  color: #1C4F39; /* fallback */
}
/* 标题逐字放大弹跳：每个字依次 scale 放大，像蹦出来打招呼 */
.dsh-lxh-title-char {
  display: inline-block;
  transition: transform 0.28s cubic-bezier(0.3, 0.9, 0.3, 1.15);
}
.dsh-lxh-title-char:hover {
  transform: scale(1.3);
}
.dsh-lxh-title-char-inner {
  display: inline-block;
  background: linear-gradient(180deg, #2E7D5B, #7FBF3F, #A8E10C);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: dshCharPop 0.62s cubic-bezier(0.2, 0.9, 0.3, 1.3) both;
}
body[data-ds-dark-theme] .dsh-lxh-title-char-inner {
  background: linear-gradient(180deg, #A8E10C, #D9F98A);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
@keyframes dshCharPop {
  0% { transform: scale(0.4); opacity: 0; }
  62% { transform: scale(1.26); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

/* ═══ Hero 配色微调（皮肤层，其余不动） ═══ */
/* 预览版标签 → 米白底 + 酸绿字 */
[data-phase="hero"] span[class*="previewBadge"] {
  background: rgba(255, 251, 235, 0.9);
  color: #2E7D5B;
  border-color: rgba(46, 125, 91, 0.25);
}
body[data-ds-dark-theme] [data-phase="hero"] span[class*="previewBadge"] {
  background: rgba(22, 41, 31, 0.78);
  color: #A8E10C;
  border-color: rgba(168, 225, 12, 0.3);
}

/* 输入框聚焦 → 酸荧光绿光标 + 柔和光晕 */
[data-phase="hero"] textarea {
  caret-color: #A8E10C;
  transition: box-shadow 0.25s ease;
}
[data-phase="hero"] textarea:focus {
  box-shadow: 0 0 0 3px rgba(168, 225, 12, 0.18), 0 0 22px rgba(168, 225, 12, 0.14);
}

/* 感知减弱：动效全部静止 */
@media (prefers-reduced-motion: reduce) {
  .dsh-lxh-hero-mascot::before,
  .dsh-lxh-hero-mascot img,
  .dsh-lxh-title-char-inner {
    animation: none !important;
  }
  .dsh-lxh-title-char {
    transition: none !important;
  }
}

/* ═══ 选中色 ═══ */
::selection {
  background: rgba(168, 225, 12, 0.35);
}

/* ═══ 设置面板：鼠标样式选项 ═══ */
.dsh-lxh-cursor-setting,
.dsh-lxh-bg-setting {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 2px 6px;
  margin-top: 8px;
  border-top: 1px solid var(--dsw-alias-border-l2);
}
.dsh-lxh-cursor-setting .t,
.dsh-lxh-bg-setting .t {
  font-size: 14px;
  font-weight: 500;
  color: var(--dsw-alias-label-primary);
}
.dsh-lxh-cursor-setting .d,
.dsh-lxh-bg-setting .d {
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-caption);
}
.dsh-lxh-cursor-setting .btns,
.dsh-lxh-bg-setting .btns {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}
.dsh-lxh-cursor-setting .btns button,
.dsh-lxh-bg-setting .btns button {
  padding: 5px 14px;
  border-radius: 14px;
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-specific-menu);
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  cursor: pointer;
}
.dsh-lxh-cursor-setting .btns button[aria-pressed="true"],
.dsh-lxh-bg-setting .btns button[aria-pressed="true"] {
  background: var(--dsw-alias-button-primary-fill);
  color: var(--dsw-alias-label-primary-foreground);
  border-color: transparent;
}

/* ═══ 变色玻璃：设置面板（多彩渐变缓慢流动 + 毛玻璃模糊，禁蓝紫） ═══ */
[role="dialog"].bi44ca_panel {
  background-color: rgba(250, 246, 236, 0.5);
  background-image: linear-gradient(115deg, rgba(46,125,91,0.26), rgba(216,180,106,0.2), rgba(168,225,12,0.2), rgba(244,250,242,0.4), rgba(201,138,27,0.16), rgba(46,125,91,0.26));
  background-size: 300% 300%;
  background-position: 0% 30%;
  animation: dshGlassFlow 16s ease-in-out infinite;
  backdrop-filter: blur(16px) saturate(1.4);
  -webkit-backdrop-filter: blur(16px) saturate(1.4);
}
body[data-ds-dark-theme] [role="dialog"].bi44ca_panel {
  background-color: rgba(17, 33, 25, 0.62);
  background-image: linear-gradient(115deg, rgba(46,125,91,0.36), rgba(168,225,12,0.14), rgba(216,180,106,0.16), rgba(10,20,15,0.5), rgba(46,125,91,0.36));
  background-size: 300% 300%;
  background-position: 0% 30%;
  animation: dshGlassFlow 16s ease-in-out infinite;
  backdrop-filter: blur(16px) saturate(1.4);
  -webkit-backdrop-filter: blur(16px) saturate(1.4);
}
@keyframes dshGlassFlow {
  0%, 100% { background-position: 0% 30%; }
  50% { background-position: 100% 70%; }
}

/* ═══ 消息列水平居中（主聊天 + 上下文气泡） ═══ */
.ejCY5G_column {
  margin-left: auto !important;
  margin-right: auto !important;
}

/* ═══ QQ 式聊天气泡：用户提问（右）与 AI 回答正文（左）的透明玻璃气泡 ═══ */
/* 静态透明玻璃（无变色流动动画）；锚点用结构子串，宿主不重建则稳定 */
/* 用户提问：MessageItem 已有 .bubble 容器（userStack 内），补玻璃质感 */
[class*="_userStack"] > [class*="_bubble"] {
  background: rgba(250, 246, 236, 0.55);
  backdrop-filter: blur(12px) saturate(1.3);
  -webkit-backdrop-filter: blur(12px) saturate(1.3);
  border: 1px solid rgba(46, 125, 91, 0.42);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 6px 18px rgba(0, 0, 0, 0.14);
}
/* AI 回答正文：AssistantMarkdown 的 markdown 正文块（gshEtW_body 直接子，与 think 平级） */
[class*="gshEtW_body"] > [class*="_markdown_"] {
  width: fit-content;
  max-width: 100%;
  background-color: rgba(250, 246, 236, 0.5);
  background-image: linear-gradient(115deg, rgba(46,125,91,0.18), rgba(216,180,106,0.14), rgba(168,225,12,0.15), rgba(244,250,242,0.3), rgba(201,138,27,0.11), rgba(46,125,91,0.18));
  backdrop-filter: blur(12px) saturate(1.3);
  -webkit-backdrop-filter: blur(12px) saturate(1.3);
  border: 1px solid rgba(46, 125, 91, 0.42);
  border-radius: 20px;
  padding: 12px 18px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 8px 22px rgba(0, 0, 0, 0.12);
}
body[data-ds-dark-theme] [class*="_userStack"] > [class*="_bubble"] {
  background: rgba(16, 34, 25, 0.56);
  border-color: rgba(168, 225, 12, 0.38);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 8px 22px rgba(0, 0, 0, 0.35);
}
body[data-ds-dark-theme] [class*="gshEtW_body"] > [class*="_markdown_"] {
  background-color: rgba(17, 33, 25, 0.52);
  background-image: linear-gradient(115deg, rgba(46,125,91,0.26), rgba(168,225,12,0.13), rgba(216,180,106,0.13), rgba(10,20,15,0.46), rgba(46,125,91,0.26));
  border-color: rgba(168, 225, 12, 0.38);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 8px 22px rgba(0, 0, 0, 0.35);
}

/* ═══ 变色玻璃：行内代码标签（snake.html 这类小徽章，浅透流动，替代原先的深墨绿块） ═══ */
/* 锚点用 markdown 内容容器子串匹配，不依赖 CSS Modules hash；只命中行内 code，不动代码块 */
[class*="_markdown_"] code:not(pre code) {
  background-color: transparent;
  background-image: linear-gradient(100deg,
    rgba(219, 249, 157, 0.22),
    rgba(110, 231, 183, 0.3),
    rgba(245, 222, 179, 0.24),
    rgba(163, 230, 53, 0.2),
    rgba(219, 249, 157, 0.22));
  background-size: 260% 100%;
  color: #24402f;
  border-radius: 7px;
  backdrop-filter: blur(8px) saturate(1.35);
  -webkit-backdrop-filter: blur(8px) saturate(1.35);
  box-shadow: inset 0 0 0 1px rgba(163, 230, 53, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  animation: dshGlassCode 8s linear infinite;
}
@keyframes dshGlassCode {
  0%   { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}
body[data-ds-dark-theme] [class*="_markdown_"] code:not(pre code) {
  background-image: linear-gradient(100deg,
    rgba(134, 239, 172, 0.16),
    rgba(212, 162, 78, 0.14),
    rgba(219, 249, 157, 0.18),
    rgba(110, 231, 183, 0.16),
    rgba(134, 239, 172, 0.16));
  color: #d9f99d;
  box-shadow: inset 0 0 0 1px rgba(163, 230, 53, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

/* ═══ 透明框：全部工具块（上下文注入/Think/Read/Write/搜索），区分背景 ═══ */
/* 锚点用 [data-disclosure-row] 的直接父级（:has），不依赖 CSS Modules hash；静态透明玻璃，不染色 */
.U-D4Iq_root,
div:has(> [data-disclosure-row]) {
  width: max-content;
  min-width: 260px;
  max-width: 100%;
  margin: 4px 0;
  padding: 6px 14px;
  border-radius: 14px;
  background-color: rgba(250, 246, 236, 0.5);
  background-image: linear-gradient(115deg, rgba(46,125,91,0.18), rgba(216,180,106,0.14), rgba(168,225,12,0.15), rgba(244,250,242,0.3), rgba(201,138,27,0.11), rgba(46,125,91,0.18));
  border: 1px solid rgba(46, 125, 91, 0.42);
  backdrop-filter: blur(14px) saturate(1.3);
  -webkit-backdrop-filter: blur(14px) saturate(1.3);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 4px 14px rgba(0, 0, 0, 0.1);
}
body[data-ds-dark-theme] .U-D4Iq_root,
body[data-ds-dark-theme] div:has(> [data-disclosure-row]) {
  background-color: rgba(17, 33, 25, 0.52);
  background-image: linear-gradient(115deg, rgba(46,125,91,0.26), rgba(168,225,12,0.13), rgba(216,180,106,0.13), rgba(10,20,15,0.46), rgba(46,125,91,0.26));
  border: 1px solid rgba(168, 225, 12, 0.38);
  backdrop-filter: blur(14px) saturate(1.3);
  -webkit-backdrop-filter: blur(14px) saturate(1.3);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 14px rgba(0, 0, 0, 0.3);
}
`;
		//#endregion

		//#region 注入与生命周期（M6 清理契约）
		const SKIN_OWNER = "luoxiaohei";
		const BODY_ATTR = "data-dsh-luoxiaohei";
		const CSS_TAG_ID = "dsh-skin-luoxiaohei/skin.css";
		const COMPOSER_SELECTORS = [
			"[data-slot='conversation.composer']",
			"[class*='composer']",
			"[class*='Composer']",
			"footer",
		];

		function apply(ctx) {
			if (typeof document === "undefined") return;

			const body = document.body;
			const head = document.head;
			const disposers = [];

			/* ── 幂等守卫：双注册 / 热重载导致的重复 apply 直接跳过 ── */
			if (window.__dshSkinLuoXiaoheiActive ||
				document.querySelector('canvas.dsh-lxh-leaves[data-skin-owner="' + SKIN_OWNER + '"]')) {
				return;
			}
			window.__dshSkinLuoXiaoheiActive = true;

			/* ── M5 · body 属性租约 ── */
			const originalAttr = body.getAttribute(BODY_ATTR);
			body.setAttribute(BODY_ATTR, "");
			disposers.push(() => {
				if (body.getAttribute(BODY_ATTR) !== "") return;
				if (originalAttr === null) body.removeAttribute(BODY_ATTR);
				else body.setAttribute(BODY_ATTR, originalAttr);
			});

						/* ── 自定义光标：小黑拇指（可在设置中选 默认 / 小黑拇指放大） ── */
			const CURSOR_KEY = 'dsh-skin-luoxiaohei:cursor';
			const CURSOR_CSS_RULE = "*:not(input):not(textarea):not(select):not([contenteditable]):not(a):not(button):not(summary):not([role=\"button\"]):not([role=\"link\"]):not([role=\"menuitem\"]):not([role=\"option\"]):not([role=\"checkbox\"]){cursor:url('" + ASSETS['thumb.png'] + "') 16 8,auto !important;} a,button,summary,[role=\"button\"],[role=\"link\"],[role=\"menuitem\"],[role=\"option\"],[role=\"checkbox\"],[onclick]{cursor:url('" + (ASSETS['thumb-zoom.png'] || ASSETS['thumb.png']) + "') 28 14,auto !important;} input,textarea,select,[contenteditable]{cursor:text !important;}";
			let cursorStyleEl = null;
			let cursorTeardown = false;
			const origBodyCursor = body.style.cursor;
			function getCursorPref() {
				try { return localStorage.getItem(CURSOR_KEY) === 'default' ? 'default' : 'lxh'; }
				catch (e) { return 'lxh'; }
			}
			function applyCursor(pref) {
				// 停用后不再响应设置面板残留控件的点击，避免皮肤复活
				if (cursorTeardown) return;
				if (pref === 'default') {
					if (cursorStyleEl) { cursorStyleEl.remove(); cursorStyleEl = null; }
					body.style.cursor = origBodyCursor;
					return;
				}
				if (!ASSETS['thumb.png']) return;
				if (!cursorStyleEl) {
					cursorStyleEl = document.createElement('style');
					cursorStyleEl.dataset.plugin = 'dsh-skin-luoxiaohei';
					cursorStyleEl.dataset.pluginCss = 'cursor';
					cursorStyleEl.textContent = CURSOR_CSS_RULE;
					head.appendChild(cursorStyleEl);
				}
				body.style.cursor = "url('" + ASSETS['thumb.png'] + "') 16 8, auto";
			}
			applyCursor(getCursorPref());
			disposers.push(() => {
				cursorTeardown = true;
				if (cursorStyleEl) cursorStyleEl.remove();
				body.style.cursor = origBodyCursor;
			});

			/* ── 设置面板：鼠标样式选项 ── */
			function injectCursorSetting() {
				const content = document.querySelector('[role="dialog"] .bi44ca_content');
				if (!content || content.querySelector('.dsh-lxh-cursor-setting')) return;
				const row = document.createElement('div');
				row.className = 'dsh-lxh-cursor-setting';
				row.innerHTML = '<div class="t">鼠标样式</div><div class="d">选择全局鼠标光标：系统默认，或罗小黑竖大拇指（悬停可点元素时放大）</div><div class="btns"><button type="button" data-cursor="default">默认</button><button type="button" data-cursor="lxh">小黑拇指</button></div>';
				const bDefault = row.querySelector('[data-cursor="default"]');
				const bLxh = row.querySelector('[data-cursor="lxh"]');
				function refresh() {
					const cur = getCursorPref();
					bDefault.setAttribute('aria-pressed', String(cur === 'default'));
					bLxh.setAttribute('aria-pressed', String(cur === 'lxh'));
				}
				bDefault.addEventListener('click', function () { try { localStorage.setItem(CURSOR_KEY, 'default'); } catch (e) {} applyCursor('default'); refresh(); });
				bLxh.addEventListener('click', function () { try { localStorage.setItem(CURSOR_KEY, 'lxh'); } catch (e) {} applyCursor('lxh'); refresh(); });
				content.appendChild(row);
				cursorSettingRows.push(row);
				refresh();
			}
			const cursorSettingRows = [];
			injectCursorSetting();
			// 设置面板注入的「鼠标样式」行也要可逆：停用时移除残留控件
			disposers.push(() => {
				for (let i = 0; i < cursorSettingRows.length; i++) {
					try { cursorSettingRows[i].remove(); } catch (e) {}
				}
			});

			/* ── 设置面板：背景图片自定义（本地上传，覆盖默认森林图） ── */
			const BG_KEY = 'dsh-skin-luoxiaohei:bg';
			function applyCustomBg() {
				try {
					const url = localStorage.getItem(BG_KEY);
					if (url) body.style.setProperty('--dsh-lxh-bg-forest', 'url("' + url + '")');
					else body.style.removeProperty('--dsh-lxh-bg-forest');
				} catch (e) {}
			}
			function injectBgSetting() {
				const content = document.querySelector('[role="dialog"] .bi44ca_content');
				if (!content || content.querySelector('.dsh-lxh-bg-setting')) return;
				const row = document.createElement('div');
				row.className = 'dsh-lxh-bg-setting';
				row.innerHTML = '<div class="t">背景图片</div><div class="d">上传本地图片作为主界面背景（自动压缩保存到本地）</div><div class="btns"><button type="button" data-bg="upload">上传图片</button><button type="button" data-bg="reset">恢复默认</button></div>';
				const bUpload = row.querySelector('[data-bg="upload"]');
				const bReset = row.querySelector('[data-bg="reset"]');
				const fileInput = document.createElement('input');
				fileInput.type = 'file';
				fileInput.accept = 'image/*';
				fileInput.style.display = 'none';
				row.appendChild(fileInput);
				function refresh() {
					let has = false;
					try { has = !!localStorage.getItem(BG_KEY); } catch (e) {}
					bUpload.setAttribute('aria-pressed', String(has));
					bReset.setAttribute('aria-pressed', String(has));
				}
				bUpload.addEventListener('click', function () { fileInput.click(); });
				fileInput.addEventListener('change', function () {
					const f = fileInput.files && fileInput.files[0];
					if (!f) return;
					const reader = new FileReader();
					reader.onload = function (ev) {
						const img = new Image();
						img.onload = function () {
							const maxW = 1920;
							const scale = Math.min(1, maxW / img.width);
							const canvas = document.createElement('canvas');
							canvas.width = Math.round(img.width * scale);
							canvas.height = Math.round(img.height * scale);
							canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
							const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
							try { localStorage.setItem(BG_KEY, dataUrl); } catch (e) {}
							applyCustomBg();
							refresh();
						};
						img.src = ev.target.result;
					};
					reader.readAsDataURL(f);
					fileInput.value = '';
				});
				bReset.addEventListener('click', function () {
					try { localStorage.removeItem(BG_KEY); } catch (e) {}
					applyCustomBg();
					refresh();
				});
				content.appendChild(row);
				bgSettingRows.push(row);
				refresh();
			}
			const bgSettingRows = [];
			injectBgSetting();
			applyCustomBg();
			disposers.push(() => {
				for (let i = 0; i < bgSettingRows.length; i++) {
					try { bgSettingRows[i].remove(); } catch (e) {}
				}
				// 停用即还原默认背景
				try { body.style.removeProperty('--dsh-lxh-bg-forest'); } catch (e) {}
			});

/* ── M1 · 注入样式 ── */
			if (head.querySelector("style[data-plugin-css=\"" + CSS_TAG_ID + "\"]") === null) {
				const tag = document.createElement("style");
				tag.dataset.plugin = "dsh-skin-luoxiaohei";
				tag.dataset.pluginCss = CSS_TAG_ID;
				tag.textContent = css;
				head.appendChild(tag);
				disposers.push(() => tag.remove());
			}

			/* ── 发送键皮肤（send-click.gif 覆盖） ── */
			const SEND_BTN_SELECTORS = [
				'button[aria-label="发送消息"]',
				'button[aria-label*="send"]',
				'button[aria-label*="Send"]',
			];
			const sendDisposers = [];
			let sendBtn = null;
			function decorateSendButton() {
				if (sendBtn && document.body.contains(sendBtn)) return;
				let btn = null;
				for (const sel of SEND_BTN_SELECTORS) {
					btn = document.querySelector(sel);
					if (btn) break;
				}
				if (!btn || btn.dataset.skinSendDone) return;
				const overlay = document.createElement("img");
				overlay.src = ASSETS["send-click.gif"] || "";
				overlay.alt = "";
				overlay.setAttribute("aria-hidden", "true");
				overlay.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit;pointer-events:none;z-index:2;";
				if (getComputedStyle(btn).position === "static") btn.style.position = "relative";
				const svg = btn.querySelector("svg");
				if (svg) svg.style.visibility = "hidden";
				btn.appendChild(overlay);
				btn.dataset.skinSendDone = "1";
				sendBtn = btn;
				sendDisposers.push(() => {
					overlay.remove();
					if (svg) svg.style.visibility = "";
					if (btn && btn.dataset.skinSendDone) delete btn.dataset.skinSendDone;
					if (btn.style.position === "relative") btn.style.position = "";
				});
			}
			decorateSendButton();
			if (sendDisposers.length) disposers.push(() => { for (const d of sendDisposers) d(); });

			/* ── Hero 欢迎页形象：罗小黑剪刀手 GIF（参考图二，其余区域不动） ── */
			const heroDisposers = [];
			let heroWrap = null;
			function injectHeroMascot() {
				if (heroWrap && document.body.contains(heroWrap)) return;
				const hero = document.querySelector('[data-phase="hero"]');
				if (!hero) return;
				// headlineText 的 hash class 保留 "headlineText" 子串，可稳定锚定
				const hText = hero.querySelector('span[class*="headlineText"]');
				if (!hText) return;
				const stack = hText.parentElement && hText.parentElement.parentElement;
				if (!stack || stack.querySelector('.dsh-lxh-hero-mascot')) return;
				const wrap = document.createElement('div');
				wrap.className = 'dsh-lxh-hero-mascot';
				wrap.dataset.skinMascot = '1';
				wrap.setAttribute('aria-hidden', 'true');
								const gifSrc = ASSETS['scissor.gif'] || '';
				const staticSrc = ASSETS['scissor-last.png'] || gifSrc;
				let playing = false;
				let clickTimer = 0;
				const img = document.createElement('img');
				img.className = 'dsh-lxh-hero-gif';
				img.alt = '';
				img.src = staticSrc;
				wrap.appendChild(img);
				function playOnce() {
					if (!gifSrc || playing) return;
					playing = true;
					img.src = gifSrc;
					window.clearTimeout(clickTimer);
					clickTimer = window.setTimeout(function () {
						img.src = staticSrc;
						playing = false;
					}, 1400);
				}
				wrap.addEventListener('click', playOnce);
				// 每次进入/刷新时自动播放一次，随后静止在尾帧
				playOnce();
				stack.insertBefore(wrap, stack.firstChild);
				heroWrap = wrap;
				heroDisposers.push(() => {
					window.clearTimeout(clickTimer);
					wrap.removeEventListener('click', playOnce);
					wrap.remove();
					heroWrap = null;
				});
			}
			injectHeroMascot();
			if (heroDisposers.length) disposers.push(() => { for (const d of heroDisposers) d(); });

			/* ── Hero 标题：替换为「小黑在森林里等你」（鲸鱼 logo 保留） ── */
			const HERO_TITLE = '小黑在森林里等你';
			const titleSwaps = [];
			function syncHeroTitle() {
				const hero = document.querySelector('[data-phase="hero"]');
				if (!hero) return;
				const hText = hero.querySelector('span[class*="headlineText"]');
				if (!hText) return;
				if (!hText.dataset.skinTitleDone) {
					// 仅替换纯文本（单个文本节点），拆成逐字 span 实现放大动效
					if (hText.childNodes.length === 1 && hText.firstChild && hText.firstChild.nodeType === 3) {
						hText.dataset.skinOrigTitle = hText.textContent;
						hText.textContent = '';
						const chars = HERO_TITLE.split('');
						for (let i = 0; i < chars.length; i++) {
							const outer = document.createElement('span');
							outer.className = 'dsh-lxh-title-char';
							const inner = document.createElement('span');
							inner.className = 'dsh-lxh-title-char-inner';
							inner.textContent = chars[i];
							inner.style.animationDelay = (0.15 + i * 0.12).toFixed(2) + 's';
							outer.appendChild(inner);
							hText.appendChild(outer);
						}
						hText.dataset.skinTitleDone = '1';
						titleSwaps.push(hText);
					}
				}
			}
			syncHeroTitle();
			// 卸载时还原所有被替换的标题节点
			disposers.push(() => {
				for (let i = 0; i < titleSwaps.length; i++) {
					const n = titleSwaps[i];
					try {
						if (n.dataset && n.dataset.skinTitleDone) {
							n.textContent = ('skinOrigTitle' in n.dataset) ? n.dataset.skinOrigTitle : HERO_TITLE;
							delete n.dataset.skinTitleDone;
							delete n.dataset.skinOrigTitle;
						}
					} catch (e) { }
				}
			});

						/* ── 工具图标替换（上下文注入/思考/Read/Write/Search）：静态尾帧 + 悬停播放一次 ── */
			const TOOL_ICONS = [
				{ key: '上下文注入', a: 'tool-ctx.gif', s: 'tool-ctx.png', ms: 2100 },
				{ key: 'think', a: 'tool-think.gif', s: 'tool-think.png', ms: 1800, ic: true },
				{ key: 'read', a: 'tool-read.gif', s: 'tool-read.png', ms: 3000, ic: true },
				{ key: 'write', a: 'tool-write.gif', s: 'tool-write.png', ms: 900, ic: true },
				{ key: 'search', a: 'tool-search.gif', s: 'tool-search.png', ms: 2200, ic: true },
			];
			const toolRegistry = [];
			function matchTool(name) {
				const n = (name || '').toLowerCase();
				for (let i = 0; i < TOOL_ICONS.length; i++) {
					const c = TOOL_ICONS[i];
					if (c.ic ? n.indexOf(c.key) >= 0 : name === c.key) return c;
				}
				if (n.indexOf('搜索') >= 0) {
					for (let i = 0; i < TOOL_ICONS.length; i++) {
						if (TOOL_ICONS[i].key === 'search') return TOOL_ICONS[i];
					}
				}
				return null;
			}
			function scanToolRows() {
				const rows = document.querySelectorAll('[data-disclosure-row]');
				for (let r = 0; r < rows.length; r++) {
					const row = rows[r];
					const t = row.querySelector('[class*="_title_"]');
					if (!t) continue;
					const leading = row.querySelector('span[class*="_leading_"]');
					if (!leading) continue;
					const svg = leading.querySelector('svg');
					const existing = leading.querySelector('img[data-skin-tool-img]');
					if (existing) {
						// 已注入：React 可能重建了 svg，重新隐藏，避免双图标
						if (svg && svg.style.display !== 'none') svg.style.display = 'none';
						continue;
					}
					const cfg = matchTool(t.textContent.trim());
					if (!cfg) continue;
					if (!svg) continue;
					const img = document.createElement('img');
					img.dataset.skinToolImg = '1';
					img.alt = ''; img.setAttribute('aria-hidden', 'true');
					const staticSrc = (ASSETS[cfg.s] || ASSETS[cfg.a]) || '';
					img.src = staticSrc;
					img.style.cssText = 'width:18px;height:18px;object-fit:contain;vertical-align:-3px;display:inline-block;';
					// 关键修复：不能 replaceWith 拔掉 React 托管的 svg（展开/收缩触发重渲染时
					// React 协调崩溃，整个工具块会消失）。改为隐藏原生图标 + 旁插皮肤图，
					// React 节点树保持完整，停用时再还原。
					svg.style.display = 'none';
					svg.insertAdjacentElement('afterend', img);
					const entry = { img: img, svg: svg };
					let playing = false, timer = 0;
					const play = function () {
						if (playing || !ASSETS[cfg.a]) return;
						playing = true; img.src = ASSETS[cfg.a];
						window.clearTimeout(timer);
						timer = window.setTimeout(function () { img.src = staticSrc; playing = false; }, cfg.ms);
					};
					row.addEventListener('mouseenter', play);
					entry.off = function () { row.removeEventListener('mouseenter', play); };
					toolRegistry.push(entry);
				}
			}
			scanToolRows();
			disposers.push(() => {
				for (let i = 0; i < toolRegistry.length; i++) {
					const e = toolRegistry[i];
					try { if (e.off) e.off(); } catch (x) {}
					try { e.img.remove(); } catch (x) {}
					try { if (e.svg) e.svg.style.display = ''; } catch (x) {}
				}
			});

						/* ── 权限图标：菜单项 + 外部选中按钮，用 跳跃1/2/3.gif 动图 ── */
			const PERM_ICONS = [
				['read', 'perm-1.gif'],
				['workspace write', 'perm-2.gif'],
				['full', 'perm-3.gif'],
			];
			const permRegistry = [];
			function matchPerm(name) {
				const n = (name || '').toLowerCase();
				for (let p = 0; p < PERM_ICONS.length; p++) {
					if (n.indexOf(PERM_ICONS[p][0]) >= 0) return PERM_ICONS[p];
				}
				return null;
			}
			function makePermImg(cfg) {
				const img = document.createElement('img');
				img.alt = ''; img.setAttribute('aria-hidden', 'true');
				img.src = ASSETS[cfg[1]] || '';
				img.style.cssText = 'width:18px;height:18px;object-fit:contain;vertical-align:-4px;display:inline-block;';
				return img;
			}
			function scanPermMenu() {
				const items = document.querySelectorAll('[role="menuitem"]');
				for (let i = 0; i < items.length; i++) {
					const it = items[i];
					if (it.dataset.skinPerm) continue;
					const cfg = matchPerm(it.textContent || '');
					if (!cfg) continue;
					const iconWrap = it.querySelector('span[class*="_itemIcon_"]');
					const svg = iconWrap && iconWrap.querySelector('svg');
					if (!svg) continue;
					it.dataset.skinPerm = '1';
					const img = makePermImg(cfg);
					// 同工具图标：不拔 React 节点，隐藏 + 旁插
					svg.style.display = 'none';
					svg.insertAdjacentElement('afterend', img);
					permRegistry.push({ img: img, svg: svg });
				}
			}
			function scanPermTrigger() {
				const trigs = [...document.querySelectorAll('button')].filter(function (bt) {
					if (bt.getAttribute('role') === 'menuitem') return false;
					return /Read Only|Workspace Write|Full access/.test(bt.textContent || '');
				});
				for (let i = 0; i < trigs.length; i++) {
					const bt = trigs[i];
					const cfg = matchPerm(bt.textContent || '');
					if (!cfg) continue;
					const iconWrap = bt.querySelector('span[class*="triggerIcon"]') || bt.querySelector('span[class*="_itemIcon_"]') || bt;
					let img = iconWrap.querySelector('img[data-skin-perm-trigger]');
					if (img) {
						if (img.dataset.perm !== cfg[1]) { img.dataset.perm = cfg[1]; img.src = ASSETS[cfg[1]] || ''; }
						continue;
					}
					const svg = iconWrap.querySelector('svg');
					if (!svg) continue;
					const im2 = makePermImg(cfg);
					im2.dataset.skinPermTrigger = '1'; im2.dataset.perm = cfg[1];
					svg.style.display = 'none';
					svg.insertAdjacentElement('afterend', im2);
					permRegistry.push({ img: im2, svg: svg });
				}
			}
			scanPermMenu(); scanPermTrigger();
			disposers.push(() => {
				for (let i = 0; i < permRegistry.length; i++) {
					try { permRegistry[i].img.remove(); } catch (e) {}
					try { if (permRegistry[i].svg) permRegistry[i].svg.style.display = ''; } catch (e) {}
				}
			});

			/* ── 统一 DOM 监听：单一 MutationObserver + rAF 合批 ──
			   替代原先 7 个各自全量扫描 body 的 observer；流式输出时每帧最多扫一轮 */
			const scanFns = [injectCursorSetting, injectBgSetting, decorateSendButton, injectHeroMascot, syncHeroTitle, scanToolRows, scanPermMenu, scanPermTrigger];
			let scanQueued = false;
			const masterObserver = new MutationObserver(function () {
				if (scanQueued) return;
				scanQueued = true;
				window.requestAnimationFrame(function () {
					scanQueued = false;
					for (let i = 0; i < scanFns.length; i++) {
						try { scanFns[i](); } catch (e) { /* 单个扫描失败不拖垮其余 */ }
					}
				});
			});
			masterObserver.observe(body, { childList: true, subtree: true });
			disposers.push(() => masterObserver.disconnect());

/* ── 背景树叶（canvas 飘落，reduced-motion 静态帧） ── */
			const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
			const canvas = document.createElement("canvas");
			canvas.className = "dsh-lxh-leaves";
			canvas.dataset.skinChrome = "leaves";
			canvas.dataset.skinOwner = SKIN_OWNER;
			canvas.setAttribute("aria-hidden", "true");
			body.appendChild(canvas);

			const ctx2d = canvas.getContext("2d");
			const LEAF_COLORS = ["#A8E10C", "#7FBF3F", "#5AA45A", "#8FD14F", "#B8E986"];
			const COUNT = 14;
			let leaves = [];
			let rafId = 0;
			let last = performance.now();

			function sizeCanvas() {
				canvas.width = window.innerWidth * devicePixelRatio;
				canvas.height = window.innerHeight * devicePixelRatio;
				canvas.style.width = window.innerWidth + "px";
				canvas.style.height = window.innerHeight + "px";
			}
			sizeCanvas();
			window.addEventListener("resize", sizeCanvas);

			function makeLeaf(init) {
				return {
					x: Math.random() * canvas.width,
					y: init ? Math.random() * canvas.height : -30 * devicePixelRatio,
					size: (8 + Math.random() * 10) * devicePixelRatio,
					vy: (0.5 + Math.random() * 0.7) * devicePixelRatio,
					vx: (0.3 + Math.random() * 0.6) * devicePixelRatio,
					sway: Math.random() * Math.PI * 2,
					swaySpeed: 0.008 + Math.random() * 0.012,
					rot: Math.random() * Math.PI * 2,
					rotSpeed: (0.004 + Math.random() * 0.01) * (Math.random() < 0.5 ? 1 : -1),
					color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
					alpha: 0.5 + Math.random() * 0.4,
				};
			}
			for (let i = 0; i < COUNT; i++) leaves.push(makeLeaf(true));

			function drawLeaf(l) {
				ctx2d.save();
				ctx2d.translate(l.x, l.y);
				ctx2d.rotate(l.rot);
				ctx2d.globalAlpha = l.alpha;
				ctx2d.fillStyle = l.color;
				ctx2d.beginPath();
				ctx2d.ellipse(0, 0, l.size, l.size * 0.42, 0, 0, Math.PI * 2);
				ctx2d.fill();
				ctx2d.strokeStyle = "rgba(20,45,30,0.25)";
				ctx2d.lineWidth = Math.max(1, l.size * 0.08);
				ctx2d.beginPath();
				ctx2d.moveTo(-l.size * 0.9, 0);
				ctx2d.lineTo(l.size * 0.9, 0);
				ctx2d.stroke();
				ctx2d.restore();
			}

			function tick(now) {
				const dt = Math.min((now - last) / 16.667, 3);
				last = now;
				ctx2d.clearRect(0, 0, canvas.width, canvas.height);
				for (let i = 0; i < leaves.length; i++) {
					const l = leaves[i];
					l.sway += l.swaySpeed * dt;
					l.y += l.vy * dt;
					l.x += l.vx * dt + Math.sin(l.sway) * 0.5 * dt;
					l.rot += l.rotSpeed * dt;
					if (l.y > canvas.height + 40 * devicePixelRatio || l.x > canvas.width + 40 * devicePixelRatio) {
						leaves[i] = makeLeaf(false);
					}
					drawLeaf(l);
				}
				rafId = requestAnimationFrame(tick);
			}

			if (reduceMotion) {
				for (let j = 0; j < leaves.length; j++) {
					leaves[j].y = Math.random() * canvas.height;
					drawLeaf(leaves[j]);
				}
			} else {
				rafId = requestAnimationFrame(tick);
			}

			disposers.push(() => {
				if (rafId) cancelAnimationFrame(rafId);
				window.removeEventListener("resize", sizeCanvas);
				canvas.remove();
			});

			/* ── M6 · 注册 disposer ── */
			if (ctx && typeof ctx.effect === "function") {
				ctx.effect(() => () => {
					for (const dispose of disposers) dispose();
					window.__dshSkinLuoXiaoheiActive = false;
				}, "dsh-skin-luoxiaohei: skin teardown");
			}
		}
		//#endregion

		exports.apply = apply;
		return module.exports;
	}
});
