		/* ══════════════════════════════════════════════════════════════
		 * 1 · 常量
		 * ══════════════════════════════════════════════════════════════ */
		const PLUGIN_ID = "dsh-skin-luoxiaohei";
		const SKIN_OWNER = "luoxiaohei";
		const BODY_ATTR = "data-dsh-luoxiaohei";
		const DARK_ATTR = "data-lxh-dark";
		const CURSOR_ATTR = "data-lxh-cursor";
		const SKIN_CSS_TAG_ID = PLUGIN_ID + "/skin.css";
		const PAGE_CSS_TAG_ID = PLUGIN_ID + "/page.css";
		const SETTINGS_KEY = PLUGIN_ID + ":settings";
		const BG_KEY = PLUGIN_ID + ":bg";
		const LEGACY_CURSOR_KEY = PLUGIN_ID + ":cursor";
		const SECTION_SLOT = "settings.section";
		const SECTION_ID = "luoxiaohei";
		const SECTION_ORDER = 60;
		const SECTION_LABEL = "小黑森林";
		const VERSION = "0.2.0";

		const THEMES = ["system", "light", "dark"];
		const BACKGROUNDS = ["forest", "plain", "custom"];
		const LEAF_COUNTS = { off: 0, low: 8, normal: 14, high: 26 };

		/* 全部设置项都在这里：新增开关只加一行 + 页面上一行 Row 即可 */
		const DEFAULTS = {
			enabled: true,          // 皮肤总开关
			theme: "system",        // system | light | dark
			background: "forest",   // forest | plain | custom
			leaves: "normal",       // off | low | normal | high
			cursor: "lxh",          // default | lxh
			sendButton: true,       // 发送键 GIF 覆盖层
			toolIcons: true,        // 工具 / 权限图标替换
			hero: true              // 首屏小黑 + 标题文案
		};

		/* ══════════════════════════════════════════════════════════════
		 * 2 · 设置存储（localStorage，单键 JSON）
		 * ══════════════════════════════════════════════════════════════ */
		function safeGet(key) {
			try { return window.localStorage.getItem(key); } catch (e) { return null; }
		}
		function safeSet(key, value) {
			try { window.localStorage.setItem(key, value); return true; } catch (e) { return false; }
		}
		function safeRemove(key) {
			try { window.localStorage.removeItem(key); } catch (e) { /* 忽略 */ }
		}

		function normalizeSettings(input) {
			const next = Object.assign({}, DEFAULTS, input || {});
			if (THEMES.indexOf(next.theme) < 0) next.theme = DEFAULTS.theme;
			if (BACKGROUNDS.indexOf(next.background) < 0) next.background = DEFAULTS.background;
			if (next.background === "custom" && !safeGet(BG_KEY)) next.background = "forest";
			if (!Object.prototype.hasOwnProperty.call(LEAF_COUNTS, next.leaves)) next.leaves = DEFAULTS.leaves;
			next.cursor = next.cursor === "default" ? "default" : "lxh";
			next.enabled = next.enabled !== false;
			next.sendButton = next.sendButton !== false;
			next.toolIcons = next.toolIcons !== false;
			next.hero = next.hero !== false;
			return next;
		}

		function readSettings() {
			const raw = safeGet(SETTINGS_KEY);
			if (!raw) {
				/* 旧版本把光标 / 背景各自存一个键，这里做一次性迁移 */
				const legacy = {};
				const legacyCursor = safeGet(LEGACY_CURSOR_KEY);
				if (legacyCursor === "default" || legacyCursor === "lxh") legacy.cursor = legacyCursor;
				if (safeGet(BG_KEY)) legacy.background = "custom";
				return normalizeSettings(legacy);
			}
			let parsed = null;
			try { parsed = JSON.parse(raw); } catch (e) { parsed = null; }
			return normalizeSettings(parsed || {});
		}

		function createSettingsStore() {
			let state = readSettings();
			const listeners = new Set();
			function emit() {
				listeners.forEach(function (fn) {
					try { fn(state); } catch (e) { /* 单个订阅失败不影响其余 */ }
				});
			}
			return {
				get: function () { return state; },
				patch: function (patch) {
					state = normalizeSettings(Object.assign({}, state, patch));
					safeSet(SETTINGS_KEY, JSON.stringify(state));
					emit();
				},
				reset: function () {
					state = normalizeSettings({});
					safeRemove(SETTINGS_KEY);
					emit();
				},
				subscribe: function (fn) {
					listeners.add(fn);
					return function () { listeners.delete(fn); };
				}
			};
		}

		/* ══════════════════════════════════════════════════════════════
		 * 3 · 皮肤引擎
		 * ══════════════════════════════════════════════════════════════ */

		/**
		 * 主题模式落地方式：样式表里的深色规则统一挂在 [data-ds-dark-theme] 上。
		 * - 跟随系统：原样注入，由 DSH 自己的深浅色决定
		 * - 强制深色：把该选择器换成本插件自己的 [data-lxh-dark] 并写到 body
		 * - 强制浅色：换成一个永不出现的属性，深色规则整段失效
		 */
		function buildSkinCss(themeMode) {
			if (themeMode === "dark") return SKIN_CSS.split("[data-ds-dark-theme]").join("[" + DARK_ATTR + "]");
			if (themeMode === "light") return SKIN_CSS.split("[data-ds-dark-theme]").join("[data-lxh-light-locked]");
			return SKIN_CSS;
		}

		function restoreAttr(el, name, previous) {
			if (previous === null || previous === undefined) el.removeAttribute(name);
			else el.setAttribute(name, previous);
		}

		/**
		 * 按当前设置把皮肤装上去，返回一个把页面还原干净的 disposer。
		 * 设置一变就整体拆掉重装 —— 皮肤都是幂等的纯装饰，重建比增量打补丁更可靠。
		 */
		function mountSkin(store) {
			const body = document.body;
			const head = document.head;
			const settings = store.get();
			if (!settings.enabled) return function () {};

			const disposers = [];
			function push(fn) { disposers.push(fn); }

			/* ── body 属性租约：皮肤总开关 / 强制深色 / 指针 ── */
			const previousBody = body.getAttribute(BODY_ATTR);
			const previousDark = body.getAttribute(DARK_ATTR);
			const previousCursor = body.getAttribute(CURSOR_ATTR);
			body.setAttribute(BODY_ATTR, "");
			if (settings.theme === "dark") body.setAttribute(DARK_ATTR, "");
			if (settings.cursor === "lxh") body.setAttribute(CURSOR_ATTR, "lxh");
			push(function () {
				restoreAttr(body, BODY_ATTR, previousBody);
				restoreAttr(body, DARK_ATTR, previousDark);
				restoreAttr(body, CURSOR_ATTR, previousCursor);
			});

			/* ── 皮肤样式表 ── */
			const styleTag = document.createElement("style");
			styleTag.dataset.plugin = PLUGIN_ID;
			styleTag.dataset.pluginCss = SKIN_CSS_TAG_ID;
			styleTag.textContent = buildSkinCss(settings.theme);
			head.appendChild(styleTag);
			push(function () { styleTag.remove(); });

			/* ── 背景：森林插画 / 纯色玻璃 / 自定义图片 ── */
			const previousBgValue = body.style.getPropertyValue("--dsh-lxh-bg-forest");
			const previousBgPriority = body.style.getPropertyPriority("--dsh-lxh-bg-forest");
			if (settings.background === "plain") {
				body.style.setProperty("--dsh-lxh-bg-forest", "none");
			} else if (settings.background === "custom") {
				const custom = safeGet(BG_KEY);
				body.style.setProperty("--dsh-lxh-bg-forest", custom ? 'url("' + custom + '")' : "none");
			}
			push(function () {
				if (previousBgValue) body.style.setProperty("--dsh-lxh-bg-forest", previousBgValue, previousBgPriority);
				else body.style.removeProperty("--dsh-lxh-bg-forest");
			});

			/* ── 发送键皮肤：send-click.gif 覆盖层 ── */
			const SEND_BTN_SELECTORS = [
				'button[aria-label="发送消息"]',
				'button[aria-label*="send"]',
				'button[aria-label*="Send"]'
			];
			const sendDisposers = [];
			let sendBtn = null;
			function decorateSendButton() {
				if (sendBtn && document.body.contains(sendBtn)) return;
				let btn = null;
				for (let i = 0; i < SEND_BTN_SELECTORS.length; i++) {
					btn = document.querySelector(SEND_BTN_SELECTORS[i]);
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
				sendDisposers.push(function () {
					overlay.remove();
					if (svg) svg.style.visibility = "";
					if (btn && btn.dataset.skinSendDone) delete btn.dataset.skinSendDone;
					if (btn.style.position === "relative") btn.style.position = "";
				});
			}

			/* ── Hero 欢迎页形象：罗小黑剪刀手 GIF ── */
			const heroDisposers = [];
			let heroWrap = null;
			function injectHeroMascot() {
				if (heroWrap && document.body.contains(heroWrap)) return;
				const hero = document.querySelector('[data-phase="hero"]');
				if (!hero) return;
				/* headlineText 的 hash class 保留 "headlineText" 子串，可稳定锚定 */
				const hText = hero.querySelector('span[class*="headlineText"]');
				if (!hText) return;
				const stack = hText.parentElement && hText.parentElement.parentElement;
				if (!stack || stack.querySelector(".dsh-lxh-hero-mascot")) return;
				const wrap = document.createElement("div");
				wrap.className = "dsh-lxh-hero-mascot";
				wrap.dataset.skinMascot = "1";
				wrap.setAttribute("aria-hidden", "true");
				const gifSrc = ASSETS["scissor.gif"] || "";
				const staticSrc = ASSETS["scissor-last.png"] || gifSrc;
				let playing = false;
				let clickTimer = 0;
				const img = document.createElement("img");
				img.className = "dsh-lxh-hero-gif";
				img.alt = "";
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
				wrap.addEventListener("click", playOnce);
				playOnce();
				stack.insertBefore(wrap, stack.firstChild);
				heroWrap = wrap;
				heroDisposers.push(function () {
					window.clearTimeout(clickTimer);
					wrap.removeEventListener("click", playOnce);
					wrap.remove();
					heroWrap = null;
				});
			}

			/* ── Hero 标题：替换为「小黑在森林里等你」（鲸鱼 logo 保留） ── */
			const HERO_TITLE = "小黑在森林里等你";
			const titleSwaps = [];
			function syncHeroTitle() {
				const hero = document.querySelector('[data-phase="hero"]');
				if (!hero) return;
				const hText = hero.querySelector('span[class*="headlineText"]');
				if (!hText) return;
				if (hText.dataset.skinTitleDone) return;
				/* 仅替换纯文本（单个文本节点），拆成逐字 span 实现放大动效 */
				if (hText.childNodes.length !== 1 || !hText.firstChild || hText.firstChild.nodeType !== 3) return;
				hText.dataset.skinOrigTitle = hText.textContent;
				hText.textContent = "";
				const chars = HERO_TITLE.split("");
				for (let i = 0; i < chars.length; i++) {
					const outer = document.createElement("span");
					outer.className = "dsh-lxh-title-char";
					const inner = document.createElement("span");
					inner.className = "dsh-lxh-title-char-inner";
					inner.textContent = chars[i];
					inner.style.animationDelay = (0.15 + i * 0.12).toFixed(2) + "s";
					outer.appendChild(inner);
					hText.appendChild(outer);
				}
				hText.dataset.skinTitleDone = "1";
				titleSwaps.push(hText);
			}
			function restoreHeroTitles() {
				for (let i = 0; i < titleSwaps.length; i++) {
					const node = titleSwaps[i];
					try {
						if (node.dataset && node.dataset.skinTitleDone) {
							node.textContent = ("skinOrigTitle" in node.dataset) ? node.dataset.skinOrigTitle : HERO_TITLE;
							delete node.dataset.skinTitleDone;
							delete node.dataset.skinOrigTitle;
						}
					} catch (e) { /* 节点已被 React 卸载 */ }
				}
			}

			/* ── 工具图标替换：静态尾帧 + 悬停播放一次 ── */
			const TOOL_ICONS = [
				{ keys: ["上下文注入", "context injection", "context-injection", "skill catalog", "skill-catalog"], a: "tool-ctx.gif", s: "tool-ctx.png", ms: 2100 },
				{ keys: ["think", "思考", "推理", "reasoning"], a: "tool-think.gif", s: "tool-think.png", ms: 1800 },
				{ keys: ["read", "读取", "读取图片", "查看", "read image", "read file"], a: "tool-read.gif", s: "tool-read.png", ms: 3000 },
				{ keys: ["write", "edit", "写入", "编辑", "修改", "创建", "write file", "edit file"], a: "tool-write.gif", s: "tool-write.png", ms: 900 },
				{ keys: ["search", "grep", "glob", "搜索", "查找", "检索", "web search"], a: "tool-search.gif", s: "tool-search.png", ms: 2200 }
			];
			const DEFAULT_TOOL_ICON = { keys: [], a: "thumb-zoom.png", s: "thumb.png", ms: 900 };
			const toolRegistry = [];
			function matchTool(name) {
				const raw = String(name == null ? "" : name).trim();
				if (!raw) return DEFAULT_TOOL_ICON;
				const lower = raw.toLowerCase();
				for (let i = 0; i < TOOL_ICONS.length; i++) {
					const cfg = TOOL_ICONS[i];
					for (let k = 0; k < cfg.keys.length; k++) {
						if (raw === cfg.keys[k] || lower === cfg.keys[k].toLowerCase()) return cfg;
					}
				}
				for (let i = 0; i < TOOL_ICONS.length; i++) {
					const cfg = TOOL_ICONS[i];
					for (let k = 0; k < cfg.keys.length; k++) {
						if (lower.indexOf(cfg.keys[k].toLowerCase()) >= 0) return cfg;
					}
				}
				return DEFAULT_TOOL_ICON;
			}
			function scanToolRows() {
				const rows = document.querySelectorAll("[data-disclosure-row]");
				for (let r = 0; r < rows.length; r++) {
					const row = rows[r];
					const leading = row.querySelector('span[class*="_leading_"]');
					if (!leading) continue;
					const existing = leading.querySelector("img[data-skin-tool-img]");
					/* 取首个「非 chevron」的 svg：展开箭头不能动，否则交互提示就没了 */
					const svgs = leading.querySelectorAll("svg");
					let svg = null;
					for (let s = 0; s < svgs.length; s++) {
						const cls = svgs[s].getAttribute("class") || "";
						if (cls.indexOf("chevron") < 0) { svg = svgs[s]; break; }
					}
					if (!svg) continue;
					if (existing) {
						/* React 可能重建了 svg：重新隐藏，避免双图标 */
						if (svg.style.display !== "none") svg.style.display = "none";
						continue;
					}
					const titleEl = row.querySelector('[class*="_title_"]');
					const summaryEl = row.querySelector('[class*="_summary"]');
					const label = ((titleEl ? titleEl.textContent : "") || (summaryEl ? summaryEl.textContent : "") || row.textContent || "").trim();
					const cfg = matchTool(label) || DEFAULT_TOOL_ICON;
					const img = document.createElement("img");
					img.dataset.skinToolImg = "1";
					img.alt = "";
					img.setAttribute("aria-hidden", "true");
					const staticSrc = (ASSETS[cfg.s] || ASSETS[cfg.a]) || "";
					img.src = staticSrc;
					img.style.cssText = "width:18px;height:18px;object-fit:contain;vertical-align:-3px;display:inline-block;";
					/* 不能 replaceWith 拔掉 React 托管的 svg（协调会崩），隐藏 + 旁插 */
					svg.style.display = "none";
					svg.insertAdjacentElement("afterend", img);
					const entry = { img: img, svg: svg };
					let playing = false;
					let timer = 0;
					const play = function () {
						if (playing || !ASSETS[cfg.a]) return;
						playing = true;
						img.src = ASSETS[cfg.a];
						window.clearTimeout(timer);
						timer = window.setTimeout(function () { img.src = staticSrc; playing = false; }, cfg.ms);
					};
					row.addEventListener("mouseenter", play);
					entry.off = function () { row.removeEventListener("mouseenter", play); };
					toolRegistry.push(entry);
				}
			}

			/* ── 权限图标：菜单项 + 外部选中按钮 ── */
			const PERM_ICONS = [
				["read", "perm-1.gif"],
				["workspace write", "perm-2.gif"],
				["full", "perm-3.gif"]
			];
			const permRegistry = [];
			function matchPerm(name) {
				const n = (name || "").toLowerCase();
				for (let p = 0; p < PERM_ICONS.length; p++) {
					if (n.indexOf(PERM_ICONS[p][0]) >= 0) return PERM_ICONS[p];
				}
				return null;
			}
			function makePermImg(cfg) {
				const img = document.createElement("img");
				img.alt = "";
				img.setAttribute("aria-hidden", "true");
				img.src = ASSETS[cfg[1]] || "";
				img.style.cssText = "width:18px;height:18px;object-fit:contain;vertical-align:-4px;display:inline-block;";
				return img;
			}
			function scanPermMenu() {
				const items = document.querySelectorAll('[role="menuitem"]');
				for (let i = 0; i < items.length; i++) {
					const it = items[i];
					if (it.dataset.skinPerm) continue;
					const cfg = matchPerm(it.textContent || "");
					if (!cfg) continue;
					const iconWrap = it.querySelector('span[class*="_itemIcon_"]');
					const svg = iconWrap && iconWrap.querySelector("svg");
					if (!svg) continue;
					it.dataset.skinPerm = "1";
					const img = makePermImg(cfg);
					svg.style.display = "none";
					svg.insertAdjacentElement("afterend", img);
					permRegistry.push({ img: img, svg: svg });
				}
			}
			function scanPermTrigger() {
				const trigs = Array.prototype.slice.call(document.querySelectorAll("button")).filter(function (bt) {
					if (bt.getAttribute("role") === "menuitem") return false;
					return /Read Only|Workspace Write|Full access/.test(bt.textContent || "");
				});
				for (let i = 0; i < trigs.length; i++) {
					const bt = trigs[i];
					const cfg = matchPerm(bt.textContent || "");
					if (!cfg) continue;
					const iconWrap = bt.querySelector('span[class*="triggerIcon"]') || bt.querySelector('span[class*="_itemIcon_"]') || bt;
					const img = iconWrap.querySelector("img[data-skin-perm-trigger]");
					if (img) {
						if (img.dataset.perm !== cfg[1]) { img.dataset.perm = cfg[1]; img.src = ASSETS[cfg[1]] || ""; }
						continue;
					}
					const svg = iconWrap.querySelector("svg");
					if (!svg) continue;
					const next = makePermImg(cfg);
					next.dataset.skinPermTrigger = "1";
					next.dataset.perm = cfg[1];
					svg.style.display = "none";
					svg.insertAdjacentElement("afterend", next);
					permRegistry.push({ img: next, svg: svg });
				}
			}

			/* ── 首次落地 + 统一 DOM 监听（单一 observer + rAF 合批） ── */
			const scanFns = [];
			if (settings.sendButton) {
				/* 清理器无条件注册：输入框可能晚于挂载才渲染，装饰由 observer 补上，
				   如果只在「首次就装饰成功」时才登记清理器，后补的那份就永远拆不掉。 */
				push(function () {
					for (let i = 0; i < sendDisposers.length; i++) {
						try { sendDisposers[i](); } catch (e) { /* 忽略 */ }
					}
					sendDisposers.length = 0;
					sendBtn = null;
				});
				decorateSendButton();
				scanFns.push(decorateSendButton);
			}
			if (settings.hero) {
				push(function () {
					for (let i = 0; i < heroDisposers.length; i++) {
						try { heroDisposers[i](); } catch (e) { /* 忽略 */ }
					}
					heroDisposers.length = 0;
				});
				injectHeroMascot();
				syncHeroTitle();
				push(restoreHeroTitles);
				scanFns.push(injectHeroMascot);
				scanFns.push(syncHeroTitle);
			}
			if (settings.toolIcons) {
				scanToolRows();
				push(function () {
					for (let i = 0; i < toolRegistry.length; i++) {
						const entry = toolRegistry[i];
						try { if (entry.off) entry.off(); } catch (e) { /* 忽略 */ }
						try { entry.img.remove(); } catch (e) { /* 忽略 */ }
						try { if (entry.svg) entry.svg.style.display = ""; } catch (e) { /* 忽略 */ }
					}
				});
				scanPermMenu();
				scanPermTrigger();
				push(function () {
					for (let i = 0; i < permRegistry.length; i++) {
						try { permRegistry[i].img.remove(); } catch (e) { /* 忽略 */ }
						try { if (permRegistry[i].svg) permRegistry[i].svg.style.display = ""; } catch (e) { /* 忽略 */ }
					}
				});
				scanFns.push(scanToolRows);
				scanFns.push(scanPermMenu);
				scanFns.push(scanPermTrigger);
			}
			if (scanFns.length) {
				let scanQueued = false;
				let scanAlive = true;
				let rafHandle = 0;
				const masterObserver = new MutationObserver(function () {
					if (scanQueued || !scanAlive) return;
					scanQueued = true;
					rafHandle = window.requestAnimationFrame(function () {
						scanQueued = false;
						/* 拆装竞态守卫：拆卸后排队的那一帧不能再往页面上加装饰 */
						if (!scanAlive) return;
						for (let i = 0; i < scanFns.length; i++) {
							try { scanFns[i](); } catch (e) { /* 单个扫描失败不拖垮其余 */ }
						}
					});
				});
				masterObserver.observe(body, { childList: true, subtree: true });
				push(function () {
					scanAlive = false;
					masterObserver.disconnect();
					if (rafHandle) window.cancelAnimationFrame(rafHandle);
				});
			}

			/* ── 背景树叶（canvas 飘落，reduced-motion 静态帧） ── */
			const leafCount = LEAF_COUNTS[settings.leaves] || 0;
			if (leafCount > 0) {
				const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
				const canvas = document.createElement("canvas");
				canvas.className = "dsh-lxh-leaves";
				canvas.dataset.skinChrome = "leaves";
				canvas.dataset.skinOwner = SKIN_OWNER;
				canvas.setAttribute("aria-hidden", "true");
				body.appendChild(canvas);

				const ctx2d = canvas.getContext("2d");
				const LEAF_COLORS = ["#A8E10C", "#7FBF3F", "#5AA45A", "#8FD14F", "#B8E986"];
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
						alpha: 0.5 + Math.random() * 0.4
					};
				}
				for (let i = 0; i < leafCount; i++) leaves.push(makeLeaf(true));

				function drawLeaf(leaf) {
					ctx2d.save();
					ctx2d.translate(leaf.x, leaf.y);
					ctx2d.rotate(leaf.rot);
					ctx2d.globalAlpha = leaf.alpha;
					ctx2d.fillStyle = leaf.color;
					ctx2d.beginPath();
					ctx2d.ellipse(0, 0, leaf.size, leaf.size * 0.42, 0, 0, Math.PI * 2);
					ctx2d.fill();
					ctx2d.strokeStyle = "rgba(20,45,30,0.25)";
					ctx2d.lineWidth = Math.max(1, leaf.size * 0.08);
					ctx2d.beginPath();
					ctx2d.moveTo(-leaf.size * 0.9, 0);
					ctx2d.lineTo(leaf.size * 0.9, 0);
					ctx2d.stroke();
					ctx2d.restore();
				}

				function tick(now) {
					const dt = Math.min((now - last) / 16.667, 3);
					last = now;
					ctx2d.clearRect(0, 0, canvas.width, canvas.height);
					for (let i = 0; i < leaves.length; i++) {
						const leaf = leaves[i];
						leaf.sway += leaf.swaySpeed * dt;
						leaf.y += leaf.vy * dt;
						leaf.x += leaf.vx * dt + Math.sin(leaf.sway) * 0.5 * dt;
						leaf.rot += leaf.rotSpeed * dt;
						if (leaf.y > canvas.height + 40 * devicePixelRatio || leaf.x > canvas.width + 40 * devicePixelRatio) {
							leaves[i] = makeLeaf(false);
						}
						drawLeaf(leaf);
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

				push(function () {
					if (rafId) cancelAnimationFrame(rafId);
					window.removeEventListener("resize", sizeCanvas);
					canvas.remove();
				});
			}

			return function dispose() {
				/* 逆序拆：监听器先停，装饰再撤，避免拆到一半又被回调挂回去 */
				for (let i = disposers.length - 1; i >= 0; i--) {
					try { disposers[i](); } catch (e) { /* 单项还原失败不影响其余 */ }
				}
				disposers.length = 0;
			};
		}

		/* ══════════════════════════════════════════════════════════════
		 * 4 · 设置页（settings.section 槽位）
		 * ══════════════════════════════════════════════════════════════ */
		function injectPageCss() {
			if (typeof document === "undefined" || !document.head) return null;
			const head = document.head;
			if (head.querySelector('style[data-plugin-css="' + PAGE_CSS_TAG_ID + '"]')) return null;
			const tag = document.createElement("style");
			tag.dataset.plugin = PLUGIN_ID;
			tag.dataset.pluginCss = PAGE_CSS_TAG_ID;
			tag.textContent = PAGE_CSS;
			head.appendChild(tag);
			return tag;
		}

		function registerSettingsPage(ctx, store) {
			if (!ctx || !ctx.slots || typeof ctx.slots.inject !== "function" || typeof ctx.slots.register !== "function") return;
			let React = null;
			try { React = require("react"); } catch (e) { React = null; }
			if (!React || typeof React.createElement !== "function") return;
			const h = React.createElement;

			/* React 18 的 useSyncExternalStore；老运行时退回 useState + 订阅 */
			function useSettings() {
				if (typeof React.useSyncExternalStore === "function") {
					return React.useSyncExternalStore(store.subscribe, store.get, store.get);
				}
				const pair = React.useState(store.get());
				const value = pair[0];
				const setValue = pair[1];
				React.useEffect(function () { return store.subscribe(setValue); }, []);
				return value;
			}

			function Switch(props) {
				return h("button", {
					type: "button",
					role: "switch",
					"aria-checked": props.checked ? "true" : "false",
					className: "dsh-lxh-switch",
					onClick: function () { props.onChange(!props.checked); }
				}, h("span", { className: "dsh-lxh-switch-knob" }));
			}

			function Segmented(props) {
				return h("div", { className: "dsh-lxh-seg", role: "group" },
					props.options.map(function (option) {
						return h("button", {
							key: option.value,
							type: "button",
							"aria-pressed": props.value === option.value ? "true" : "false",
							onClick: function () { props.onChange(option.value); }
						}, option.label);
					})
				);
			}

			function Row(props) {
				return h("div", { className: "dsh-lxh-row" },
					h("div", { className: "dsh-lxh-row-text" },
						h("div", { className: "dsh-lxh-row-title" }, props.title),
						props.desc ? h("div", { className: "dsh-lxh-row-desc" }, props.desc) : null),
					h("div", { className: "dsh-lxh-row-ctl" }, props.children)
				);
			}

			/* 背景：预览 + 上传 + 恢复 */
			function BackgroundControl(props) {
				const settings = props.settings;
				const statePair = React.useState("");
				const error = statePair[0];
				const setError = statePair[1];
				const busyPair = React.useState(false);
				const busy = busyPair[0];
				const setBusy = busyPair[1];
				const inputRef = React.useRef(null);

				const preview = settings.background === "custom"
					? (safeGet(BG_KEY) || "")
					: settings.background === "forest" ? (ASSETS["bg-forest.jpg"] || "") : "";

				function handleFile(event) {
					const file = event.target.files && event.target.files[0];
					event.target.value = "";
					if (!file) return;
					setBusy(true);
					setError("");
					const reader = new FileReader();
					reader.onload = function (loadEvent) {
						const img = new Image();
						img.onload = function () {
							try {
								const maxWidth = 1920;
								const scale = Math.min(1, maxWidth / img.width);
								const canvas = document.createElement("canvas");
								canvas.width = Math.round(img.width * scale);
								canvas.height = Math.round(img.height * scale);
								canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
								const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
								if (!safeSet(BG_KEY, dataUrl)) {
									setError("这张图压完还是太大，本地存储放不下，换一张小一点的试试");
									setBusy(false);
									return;
								}
								store.patch({ background: "custom" });
							} catch (e) {
								setError("图片处理失败：" + ((e && e.message) || e));
							}
							setBusy(false);
						};
						img.onerror = function () { setError("这张图片读不出来，换一张试试"); setBusy(false); };
						img.src = loadEvent.target.result;
					};
					reader.onerror = function () { setError("读取文件失败"); setBusy(false); };
					reader.readAsDataURL(file);
				}

				return h("div", { className: "dsh-lxh-row-ctl-stack" },
					h("div", { className: "dsh-lxh-row-ctl" },
						preview ? h("div", {
							className: "dsh-lxh-bg-preview",
							style: { backgroundImage: 'url("' + preview + '")' },
							"aria-hidden": "true"
						}) : null,
						h(Segmented, {
							value: settings.background,
							onChange: function (value) { store.patch({ background: value }); },
							options: [
								{ value: "forest", label: "森林插画" },
								{ value: "plain", label: "纯色玻璃" },
								{ value: "custom", label: "自定义" }
							]
						}),
						h("button", {
							type: "button",
							className: "dsh-lxh-btn",
							disabled: busy,
							onClick: function () { if (inputRef.current) inputRef.current.click(); }
						}, busy ? "处理中…" : "上传图片"),
						h("input", {
							ref: inputRef,
							type: "file",
							accept: "image/*",
							style: { display: "none" },
							onChange: handleFile
						})
					),
					error ? h("div", { className: "dsh-lxh-error" }, error) : null
				);
			}

			function Section() {
				const settings = useSettings();
				return h("div", { className: "dsh-lxh-page" },
					h("div", { className: "dsh-lxh-page-head" },
						h("img", {
							src: ASSETS["thumb-zoom.png"] || ASSETS["thumb.png"] || "",
							alt: "",
							"aria-hidden": "true"
						}),
						h("div", { className: "dsh-lxh-page-headtext" },
							h("div", { className: "dsh-lxh-page-title" }, SECTION_LABEL),
							h("div", { className: "dsh-lxh-page-sub" }, "罗小黑主题皮肤 · 改动立即生效，无需重启")),
						h(Switch, {
							checked: settings.enabled,
							onChange: function (value) { store.patch({ enabled: value }); }
						})
					),

					h("div", { className: "dsh-lxh-group" },
						h("div", { className: "dsh-lxh-group-title" }, "外观"),
						h(Row, {
							title: "主题模式",
							desc: "「跟随系统」按 DSH 当前深浅色切换，两个固定档位强制指定配色"
						}, h(Segmented, {
							value: settings.theme,
							onChange: function (value) { store.patch({ theme: value }); },
							options: [
								{ value: "system", label: "跟随系统" },
								{ value: "light", label: "奶油森林" },
								{ value: "dark", label: "深夜森林" }
							]
						})),
						h(Row, {
							title: "背景",
							desc: "森林插画、纯色玻璃，或上传本地图片（压缩后只存在本机）"
						}, h(BackgroundControl, { settings: settings }))
					),

					h("div", { className: "dsh-lxh-group" },
						h("div", { className: "dsh-lxh-group-title" }, "动效与装饰"),
						h(Row, {
							title: "落叶",
							desc: "画布上飘落的叶子数量，选择「关」可省掉这部分开销"
						}, h(Segmented, {
							value: settings.leaves,
							onChange: function (value) { store.patch({ leaves: value }); },
							options: [
								{ value: "off", label: "关" },
								{ value: "low", label: "少" },
								{ value: "normal", label: "标准" },
								{ value: "high", label: "多" }
							]
						})),
						h(Row, {
							title: "发送键皮肤",
							desc: "把发送按钮换成小黑 GIF 覆盖层"
						}, h(Switch, {
							checked: settings.sendButton,
							onChange: function (value) { store.patch({ sendButton: value }); }
						})),
						h(Row, {
							title: "工具与权限图标",
							desc: "工具调用行、权限菜单里的图标换成小黑表情"
						}, h(Switch, {
							checked: settings.toolIcons,
							onChange: function (value) { store.patch({ toolIcons: value }); }
						})),
						h(Row, {
							title: "首屏形象与文案",
							desc: "欢迎页的小黑剪刀手，以及「小黑在森林里等你」标题"
						}, h(Switch, {
							checked: settings.hero,
							onChange: function (value) { store.patch({ hero: value }); }
						}))
					),

					h("div", { className: "dsh-lxh-group" },
						h("div", { className: "dsh-lxh-group-title" }, "指针"),
						h(Row, {
							title: "鼠标样式",
							desc: "全局指针换成小黑拇指，输入框内保持文本光标"
						}, h(Segmented, {
							value: settings.cursor,
							onChange: function (value) { store.patch({ cursor: value }); },
							options: [
								{ value: "default", label: "系统默认" },
								{ value: "lxh", label: "小黑拇指" }
							]
						}))
					),

					h("div", { className: "dsh-lxh-foot" },
						h("div", { className: "dsh-lxh-foot-text" }, "v" + VERSION + " · 皮肤只改外观，不读写会话内容"),
						h("button", {
							type: "button",
							className: "dsh-lxh-btn",
							onClick: function () { store.reset(); }
						}, "恢复默认")
					)
				);
			}

			ctx.slots.inject(SECTION_SLOT, function () {
				return ctx.slots.register({
					name: SECTION_SLOT,
					id: SECTION_ID,
					order: SECTION_ORDER,
					label: function () { return SECTION_LABEL; }
				}, Section);
			});
		}

		/* ══════════════════════════════════════════════════════════════
		 * 5 · 插件入口
		 * ══════════════════════════════════════════════════════════════ */

		/**
		 * 客户端插件必须声明自己要用到的服务：Cordis 的严格模式下，
		 * 没在 inject 里列出的服务一访问就抛 "cannot get property ... without inject"。
		 * 这里只需要 slots（设置页槽位）。
		 */
		const inject = ["slots"];
		exports.inject = inject;

		/** 单步失败只降级该步，不把整条 web boot 拖垮（皮肤永远不该挡住启动）。 */
		function safeStage(name, fn) {
			try {
				return fn();
			} catch (e) {
				if (window.console && console.warn) console.warn("[dsh-skin-luoxiaohei] " + name + " 失败：" + ((e && e.stack) || e));
				return null;
			}
		}

		function apply(ctx) {
			if (typeof document === "undefined" || !document.body) return;
			if (window.__dshSkinLuoXiaoheiActive) return;
			window.__dshSkinLuoXiaoheiActive = true;

			const store = createSettingsStore();
			const pageCssTag = safeStage("设置页样式注入", injectPageCss);
			safeStage("设置页注册", function () { registerSettingsPage(ctx, store); });

			let skinDispose = null;
			function sync() {
				if (skinDispose) {
					try { skinDispose(); } catch (e) { /* 忽略 */ }
					skinDispose = null;
				}
				try {
					skinDispose = mountSkin(store);
				} catch (e) {
					skinDispose = null;
					if (window.console && console.warn) console.warn("[dsh-skin-luoxiaohei] 皮肤挂载失败", e);
				}
			}
			sync();
			const unsubscribe = store.subscribe(sync);

			if (ctx && typeof ctx.effect === "function") {
				ctx.effect(function () {
					return function () {
						unsubscribe();
						if (skinDispose) {
							try { skinDispose(); } catch (e) { /* 忽略 */ }
							skinDispose = null;
						}
						if (pageCssTag) pageCssTag.remove();
						window.__dshSkinLuoXiaoheiActive = false;
					};
				}, "dsh-skin-luoxiaohei: teardown");
			}
		}
