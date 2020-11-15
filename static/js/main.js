function submitForm(form) {
  const formData = new FormData(form);
  // const res = {};
  // for (const key of formData.keys()) {
  //   res[key] = formData.get(key);
  // }
  const res = Array.from(formData.entries()).reduce((memo, pair) => ({
    ...memo,
    [pair[0]]: pair[1]
  }), {});
  console.dir(res);
}

function openDialog(src, elementId = 'dialog', parseTag = 'main') {
  const dialog = document.getElementById(elementId);
  if (!dialog) {
    // static
    window.location = src;
    return false;
  }
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
      const main = page.match(reg);
      if (main) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(main[0], 'text/html');
        dialog.innerHTML = '';
        dialog.appendChild(doc.getRootNode().body);
        document.body.appendChild(dialog);
        setTimeout(() => {
          dialog.style.opacity = '1';
        }, 0);
      }
      else {
        console.warn(`cant parse tag '${parseTag}' from url '${src}'`);
      }
    })
    .catch((e) => {
      console.warn(`something wrong: ${e}`);
    });
  return false;
}

function closeDialog(elementId = 'dialog') {
  const dialog = document.getElementById(elementId);
  if (!dialog) {
    // static
    window.history.back();
  }
  else {
    // was created through openDialog
    dialog.style.opacity = '0';
    setTimeout(() => {
      dialog.innerHTML = '';
      dialog.hidden = true;
    }, 500, dialog);
  }
  return false;
}
