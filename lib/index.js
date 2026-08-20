/**
 * dsh-skin-luoxiaohei · host half
 *
 * 纯浏览器皮肤：host 侧无行为。浏览器半（exports["./client"]）负责
 * token 覆盖、背景、叶子与装饰层，所有写入由 effect disposer 还原。
 */

/** Cordis plugin name. */
const name = "dsh-skin-luoxiaohei";

/** No host-side behavior. */
function apply() {}

export { apply, name };
