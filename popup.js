// mejebeckdfiannhkpfboappagkbbjiif

window.onload = () => {
  const prevBtn = document.querySelector('button.control-btn__prev');
  const nextBtn = document.querySelector('button.control-btn__next');

  nextBtn.addEventListener('click', () => {
    chrome.storage.local.set({ ts: new Date().getTime(), volume: 1 });
  });

  prevBtn.addEventListener('click', () => {
    chrome.storage.local.set({ ts: new Date().getTime(), volume: -1 });
  });
};
