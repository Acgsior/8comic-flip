const loadingGifSrc = chrome.extension.getURL('loading.gif');

const createLoadingLayer = () => {
  const loadingGif = document.createElement('img');
  loadingGif.src = loadingGifSrc;

  const loadingLayer = document.createElement('div');
  loadingLayer.id = 'flip-loading-layer';
  loadingLayer.style =
    'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #ffffff; opacity: .6; display: flex; justify-content: center; align-items: center;';
  loadingLayer.appendChild(loadingGif);

  document.querySelector('body').appendChild(loadingLayer);
};

const removeLoadingLayer = () => {
  const layer = document.querySelector('#flip-loading-layer');
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  layer && document.querySelector('body').removeChild(layer);
};

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes['ts'] && changes['ts'].newValue) {
    createLoadingLayer();

    const img = document.querySelector('img.alignnone.size-full.wp-image-87');
    console.log('=== img:', img);

    chrome.storage.local.get('volume', data => {
      let volume = data.volume;
      const volumeChanges = changes['volume'];
      if (volumeChanges) {
        volume = volumeChanges.newValue;
      }

      console.log('=== volume:', volume);
      const nextImgSrc = getNextImgSrc(img.src, volume);
      console.log('=== next src:', nextImgSrc);

      if (!img.onload) {
        img.onload = removeLoadingLayer;
      }
      if (!img.onerror) {
        img.onerror = removeLoadingLayer;
      }

      img.src = nextImgSrc;
    });
  }
});

const getNextImgSrc = (src, volume = 1) => {
  // src: http://pic.8comic.se/wp-content/uploads/a04cj84wj6uq04/1256/474/001.jpg

  const srcSplited = src.split('/');
  const imgName = srcSplited.pop(); // imgName: 001.jpg

  const imgNames = imgName.split('.');
  const imgIndex = parseInt(imgNames[0]);

  let nextImgIndex = imgIndex + volume;
  if (nextImgIndex <= 0) {
    nextImgIndex = 1;
    console.warn('### meet minimum img index.');
  } else {
    const selector = document.querySelector('#pull');
    const total = selector.options.length;
    if (nextImgIndex > total) {
      nextImgIndex = total;
      console.warn('### meet maximum img index.');
    }
  }

  if (nextImgIndex <= 9) {
    nextImgIndex = `00${nextImgIndex}`; // nextImgIndex: 001
  } else {
    nextImgIndex = `0${nextImgIndex}`; // // nextImgIndex: 010
  }

  return srcSplited.join('/') + '/' + nextImgIndex + '.' + imgNames[1];
};
