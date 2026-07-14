// CDN 配置
// 图片资源的基础 URL
// 为空时使用本地路径（/portraits/xxx.jpg）
// 设置为 OSS/CDN 域名时使用 CDN 加速（https://bucket.oss-cn-region.aliyuncs.com/portraits/xxx.jpg）

// ⬇️ 创建 OSS Bucket 后，把下面的 URL 改成你的 Bucket 公开访问域名 ⬇️
export const CDN_BASE: string = 'https://last-tavern.oss-cn-hangzhou.aliyuncs.com';

/** 拼接 CDN 路径 */
export function cdnUrl(path: string): string {
  if (!CDN_BASE) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const cleanBase = CDN_BASE.endsWith('/') ? CDN_BASE.slice(0, -1) : CDN_BASE;
  return `${cleanBase}${cleanPath}`;
}

/** 在 <html> 上注入 CSS 变量，让 index.css 中的背景图也走 CDN */
export function injectCdnCssVars() {
  if (!CDN_BASE) return;
  const root = document.documentElement;
  root.style.setProperty('--bg-door-wall', `url('${cdnUrl('/bg/door-wall.jpg')}')`);
  root.style.setProperty('--bg-tavern-interior', `url('${cdnUrl('/bg/tavern-interior.jpg')}')`);
}
