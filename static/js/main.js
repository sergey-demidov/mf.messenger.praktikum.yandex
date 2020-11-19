/* eslint-disable no-unused-vars, no-console */

const openDialog = (src, elementId = 'mpy_dialog', parseTag = 'main') => {
  const dialog = document.getElementById(elementId);
  if (!dialog) {
    // static
    window.location = src;
  }
  else {
    dialog.style.width = `${window.innerWidth}px`;
    dialog.style.height = `${window.innerHeight}px`;
    dialog.style.position = 'fixed';
    dialog.style.top = '0';
    dialog.style.left = '0';
    fetch(src)
      .then((response) => response.text())
      .then((page) => {
        const reg = new RegExp(`<${parseTag}>(.*)</${parseTag}>`, 'si');
        const content = page.match(reg);
        if (content) {
          const [, html] = content;
          dialog.innerHTML = html;
          dialog.hidden = false;
          dialog.style.opacity = '1';
        }
        else {
          dialog.hidden = true;
          console.warn(`cant parse tag '${parseTag}' from url '${src}'`);
        }
      })
      .catch((e) => {
        dialog.hidden = true;
        console.error(e);
      });
  }
  return false;
};

function closeDialog(elementId = 'mpy_dialog') {
  const dialog = document.getElementById(elementId);
  if (!dialog) {
    // static
    window.history.back();
  }
  else {
    dialog.style.opacity = '0';
    setTimeout(() => {
      dialog.hidden = true;
    }, 300);
  }
  return false;
}

function submitForm(form) {
  const formData = new FormData(form);
  const res = Array.from(formData.entries()).reduce((memo, pair) => ({
    ...memo,
    [pair[0]]: pair[1]
  }), {});
  console.dir(res);
  closeDialog();
}
