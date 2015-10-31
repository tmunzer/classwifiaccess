(function() {
  var FaviconAwesome = function(icon, color, bg) {
    'use strict';
    var
      container = document.createElement('div'),
      span = document.createElement('span'),
      body = document.body,
      content,
      canvas = document.createElement('canvas'),
      getContext = function(w) {
        canvas.width = canvas.height = w;
        context = canvas.getContext('2d');
        context.font = 'normal normal normal 32px/' + w + 'px FontAwesome';
        context.textBaseline = 'middle';
        return context;
      },
      context = getContext(32),
      iconWidth,
      link = document.createElement('link');
    if(!window.getComputedStyle || !canvas.toDataURL || !document.querySelectorAll)
      return;
    container.style.display = 'none';
    span.className = 'fa fa-' + icon.replace(/^fa-/, '');
    container.appendChild(span);
    body.appendChild(container);
    content = window.getComputedStyle(span, ':before').getPropertyValue('content').replace(/'/g, '');
    body.removeChild(container);
    iconWidth = context.measureText(content).width;
    if(iconWidth > canvas.width)
      context = getContext(iconWidth);
    if(bg) {
      context.rect(0, 0, canvas.width, canvas.height);
      context.fillStyle = bg;
      context.fill();
    }
    context.fillStyle = color;
    context.fillText(content, (canvas.width - iconWidth) / 2, canvas.height / 2);
    link.setAttribute('rel', 'icon');
    link.setAttribute('type', 'image/png');
    link.setAttribute('href', canvas.toDataURL('image/png'));
    for(var icons = document.querySelectorAll('link[rel*=icon]'), i = 0, l = icons.length; i < l; i++)
      icons[i].parentNode.removeChild(icons[i]);
    document.getElementsByTagName('head')[0].appendChild(link);
  };
  if(typeof define !== 'undefined' && define.amd)
    define([], function() {
      return FaviconAwesome;
    });
  else if(typeof module !== 'undefined' && module.exports)
    module.exports = FaviconAwesome;
  else
    this.FaviconAwesome = FaviconAwesome;
})();
