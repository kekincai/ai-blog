/** 纯函数工具，服务端和浏览器都能用 */
export function formatDate(d: string) {
  return d.replaceAll("-", ".");
}
