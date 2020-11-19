// eslint-disable-next-line no-unused-vars
const openDialog = (src, elementId = 'dialog', parseTag = 'main') => {
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
    dialog.style.opacity = '0';
    dialog.hidden = false;
    fetch(src)
      .then((response) => response.text())
      .then((page) => {
        const reg = new RegExp(`<${parseTag}>(.*)</${parseTag}>`, 'si');
        const content = page.match(reg);
        if (content) {
          const [, html] = content;
          dialog.innerHTML = html;
          setTimeout(() => {
            dialog.style.opacity = '1';
          }, 0);
        }
        else {
          dialog.hidden = true;
          // eslint-disable-next-line no-console
          console.warn(`cant parse tag '${parseTag}' from url '${src}'`);
        }
      })
      .catch((e) => {
        dialog.hidden = true;
        // eslint-disable-next-line no-console
        console.error(e);
      });
  }
  return false;
};

function closeDialog(elementId = 'dialog') {
  const dialog = document.getElementById(elementId);
  if (!dialog) {
    // static
    window.history.back();
  }
  else {
    dialog.style.opacity = '0';
    setTimeout(() => {
      dialog.hidden = true;
    }, 500, dialog);
  }
  return false;
}

// eslint-disable-next-line no-unused-vars
function submitForm(form) {
  const formData = new FormData(form);
  const res = Array.from(formData.entries()).reduce((memo, pair) => ({
    ...memo,
    [pair[0]]: pair[1]
  }), {});
  // eslint-disable-next-line no-console
  console.dir(res);
  closeDialog();
}
