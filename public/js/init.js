M.Sidenav.init(document.querySelector('.sidenav'));
M.FormSelect.init(document.querySelector('#status'));

CKEDITOR.replace('body', {
  plugins: 'wysiwygarea, toolbar, basicstyles, link'
});
