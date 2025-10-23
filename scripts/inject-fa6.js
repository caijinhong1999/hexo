/* scripts/inject-fa6.js */
const LINK = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">';

hexo.extend.filter.register('after_render:html', function (html) {
  // 已经注入过就不重复
  if (html.includes('cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css')) return html;

  // 尽量插在 </head> 之前；如果找不到，就原样返回
  const i = html.lastIndexOf('</head>');
  if (i === -1) return html;

  return html.slice(0, i) + '\n  ' + LINK + '\n' + html.slice(i);
});
