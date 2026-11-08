#!/usr/bin/env node
/**
 * dsh-skin-luoxiaohei · 构建脚本
 *
 * 与 scripts/gen-assets.py 的产物约定一致（素材内嵌 base64、CSS 里 __ASSET_<name>__
 * 占位符替换），区别是不再依赖 assets/ 目录也能重建：素材优先读 assets/，
 * 缺哪个就从当前 lib/client.js 的内嵌副本里还原出来。
 *
 * 用法：
 *   node scripts/build.mjs            # 生成 lib/client.js
 *   node scripts/build.mjs --check    # 只做语法检查，不落盘
 *
 * 输入：
 *   scripts/client.template.js        原插件模板（CSS + 骨架）
 *   scripts/parts/runtime.js          新的运行时代码（设置存储 / 皮肤引擎 / 设置页）
 *   scripts/parts/skin-cursor-block.css  替换原「设置面板注入」那段 CSS
 *   scripts/parts/page.css            设置页样式（独立样式表）
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..')
const TEMPLATE = join(HERE, 'client.template.js')
const OUT = join(ROOT, 'lib', 'client.js')
const ASSETS_DIR = join(ROOT, 'assets')
const RUNTIME = join(HERE, 'parts', 'runtime.js')
const CURSOR_BLOCK = join(HERE, 'parts', 'skin-cursor-block.css')
const PAGE_CSS = join(HERE, 'parts', 'page.css')

const MIME = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml'
}

const read = (path) => readFileSync(path, 'utf8')
const mimeOf = (name) => MIME[name.split('.').pop().toLowerCase()] || 'application/octet-stream'

/* ── 1 · 素材：assets/ 优先，缺失时从现有 lib/client.js 还原 ───────────── */

/** 从一份已生成的 client.js 里解析出 { name: dataUri } */
function parseAssets(source) {
  const start = source.indexOf('var ASSETS = {')
  if (start < 0) throw new Error('在现有 client.js 里找不到 ASSETS 对象')
  const end = source.indexOf('};', start)
  if (end < 0) throw new Error('ASSETS 对象没有闭合')
  const block = source.slice(start, end)
  const assets = {}
  const re = /"([^"]+)"\s*:\s*"(data:[^"]+)"/g
  let match
  while ((match = re.exec(block)) !== null) assets[match[1]] = match[2]
  return assets
}

function dataUriToBuffer(uri) {
  const comma = uri.indexOf(',')
  return Buffer.from(uri.slice(comma + 1), 'base64')
}

function loadAssets() {
  const assets = {}

  if (existsSync(ASSETS_DIR)) {
    for (const name of readdirSync(ASSETS_DIR).sort()) {
      const path = join(ASSETS_DIR, name)
      if (!name.includes('.')) continue
      const buffer = readFileSync(path)
      assets[name] = `data:${mimeOf(name)};base64,${buffer.toString('base64')}`
    }
  }

  if (Object.keys(assets).length === 0) {
    if (!existsSync(OUT)) throw new Error('既没有 assets/，也没有可还原的 lib/client.js')
    const embedded = parseAssets(read(OUT))
    mkdirSync(ASSETS_DIR, { recursive: true })
    for (const [name, uri] of Object.entries(embedded)) {
      assets[name] = uri
      writeFileSync(join(ASSETS_DIR, name), dataUriToBuffer(uri))
      console.log(`  assets/${name} ← 从内嵌副本还原`)
    }
  }

  return assets
}

/* ── 2 · 从模板里切出 CSS 与骨架 ──────────────────────────────────────── */

function splitTemplate(template) {
  const marker = 'const css = `'
  const start = template.indexOf(marker)
  if (start < 0) throw new Error('模板里找不到 CSS 起始标记')
  const bodyStart = start + marker.length
  const bodyEnd = template.indexOf('\n`;', bodyStart)
  if (bodyEnd < 0) throw new Error('模板里找不到 CSS 结束标记')

  const css = template.slice(bodyStart, bodyEnd)
  if (css.includes('`')) throw new Error('CSS 里出现反引号，无法安全内嵌')

  return {
    head: template.slice(0, start),
    css,
    tail: template.slice(bodyEnd + '\n`;'.length)
  }
}

/* ── 3 · 改写：CSS 换掉旧注入块，骨架换掉旧运行时 ─────────────────────── */

const CURSOR_BLOCK_START = '/* ═══ 设置面板：鼠标样式选项 ═══ */'
const CURSOR_BLOCK_END = '/* ═══ 变色玻璃：设置面板'

function rewriteCss(css, cursorBlock) {
  const start = css.indexOf(CURSOR_BLOCK_START)
  const end = css.indexOf(CURSOR_BLOCK_END)
  if (start < 0 || end < 0 || end < start) {
    throw new Error('CSS 里找不到旧的「设置面板注入」块，模板可能已被改动')
  }
  return css.slice(0, start) + cursorBlock.trim() + '\n\n' + css.slice(end)
}

const RUNTIME_START = '//#region 注入与生命周期'
const RUNTIME_END = 'exports.apply = apply;'

function rewriteRuntime(tail, runtime) {
  const start = tail.indexOf(RUNTIME_START)
  const end = tail.indexOf(RUNTIME_END)
  if (start < 0 || end < 0 || end < start) {
    throw new Error('骨架里找不到旧运行时区域，模板可能已被改动')
  }
  return tail.slice(0, start) + runtime.trim() + '\n\n\t\t' + tail.slice(end)
}

/* ── 4 · 头部注释 ──────────────────────────────────────────────────────── */

const HEADER = `/**
 * dsh-skin-luoxiaohei · browser half（由 scripts/build.mjs 生成，请改模板/parts）
 *
 * 皮肤层：奶油森林 / 深夜森林两套 token、森林背景、飘落叶子、发送键与图标装饰。
 * 设置页：注册到 DSH 设置面板的 settings.section 槽位，插件全部选项都在那一页里，
 *         不再往任意 [role="dialog"] 里插行（旧版的串页 bug 就出在这里）。
 * 存储：localStorage 单键 JSON（${'dsh-skin-luoxiaohei'}:settings），自定义背景图单独一键。
 * 清理：所有写入都由 Cordis effect disposer 还原，停用即恢复原样。
 */`

/* ── 5 · 组装 ──────────────────────────────────────────────────────────── */

function build() {
  const assets = loadAssets()
  const template = read(TEMPLATE)
  const { css, tail } = splitTemplate(template)

  const cursorBlock = read(CURSOR_BLOCK)
  const pageCss = read(PAGE_CSS)
  const runtime = read(RUNTIME)

  const skinCss = rewriteCss(css, cursorBlock).replace(/__ASSET_([a-zA-Z0-9._-]+)__/g, (whole, name) =>
    assets[name] ? assets[name] : whole
  )

  const unresolved = skinCss.match(/__ASSET_[a-zA-Z0-9._-]+__/g)
  if (unresolved) throw new Error(`有素材占位符没替换成功：${unresolved.join(', ')}`)

  const assetsJs = '{\n' + Object.entries(assets)
    .map(([name, uri]) => `  ${JSON.stringify(name)}: ${JSON.stringify(uri)},\n`)
    .join('') + '}'

  const body = `window.__ModuleLoader__.load({
\tid: "dsh-skin-luoxiaohei",
\tfactory: (require) => {
\t\tvar module = { exports: {} };
\t\tvar exports = module.exports;
\t\tObject.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

\t\t//#region 素材（构建脚本注入，base64 data URI）
\t\tvar ASSETS = ${assetsJs};
\t\t//#endregion

\t\t//#region 样式表
\t\tconst SKIN_CSS = ${JSON.stringify(skinCss)};
\t\tconst PAGE_CSS = ${JSON.stringify(pageCss)};
\t\t//#endregion

${rewriteRuntime(tail, runtime)}`

  const output = `${HEADER}\n${body}`
  return { output, assetCount: Object.keys(assets).length }
}

/* ── 6 · 入口 ──────────────────────────────────────────────────────────── */

const checkOnly = process.argv.includes('--check')
const { output, assetCount } = build()

if (checkOnly) {
  writeFileSync(OUT + '.tmp', output)
  execFileSync(process.execPath, ['--check', OUT + '.tmp'], { stdio: 'inherit' })
  console.log(`✓ 语法检查通过（${assetCount} 个素材，${Math.round(output.length / 1024)} KB）`)
  writeFileSync(OUT + '.tmp', '')
} else {
  writeFileSync(OUT, output)
  execFileSync(process.execPath, ['--check', OUT], { stdio: 'inherit' })
  console.log(`✓ lib/client.js 已生成（${assetCount} 个素材，${Math.round(output.length / 1024)} KB）`)
}
