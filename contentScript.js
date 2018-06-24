const getNextImgSrc = (src, volume = 1) => {
  // src: http://pic.8comic.se/wp-content/uploads/a04cj84wj6uq04/1256/474/001.jpg

  const srcSplited = src.split('/');
  const imgName = srcSplited.pop();

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
    nextImgIndex = `00${nextImgIndex}`;
  } else {
    nextImgIndex = `0${nextImgIndex}`;
  }

  const nextImgSrc = srcSplited.join('/') + '/' + nextImgIndex + '.' + imgNames[1];

  console.log('=== next src:', nextImgSrc);
  return nextImgSrc;
};

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes['ts'] && changes['ts'].newValue) {
    const img = document.querySelector('img.alignnone.size-full.wp-image-87');
    console.log('=== img:', img);

    chrome.storage.local.get('volume', data => {
      let volume = data.volume;
      const volumeChanges = changes['volume'];
      if (volumeChanges) {
        volume = volumeChanges.newValue;
      }
      console.log('=== volume:', volume);

      const nextSrc = getNextImgSrc(img.src, volume);
      img.src = nextSrc;
    });
  }
});
