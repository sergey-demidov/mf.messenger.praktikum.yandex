const loadImage = (element) => {
  const fileInput = element;
  const avatarPreview = document.getElementById('avatarPreview');
  const backupSrc = avatarPreview.src;
  avatarPreview.src = URL.createObjectURL(fileInput.files[0]);

  avatarPreview.onerror = function f() {
    fileInput.value = '';
    URL.revokeObjectURL(avatarPreview.src);
    avatarPreview.src = backupSrc;
    const errorSign = document.getElementById('errorSign');
    errorSign.classList.add('blink');

    setTimeout(() => {
      errorSign.classList.remove('blink');
    }, 2000);
  };
};
