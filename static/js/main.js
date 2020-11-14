/* eslint-disable */
function submitForm(form) {
  console.log(form.name)
  const formData = new FormData(form);
  let obj = {};
  for (let key of formData.keys()) {
    obj[key] = formData.get(key);
  }
  console.dir(obj);
}
