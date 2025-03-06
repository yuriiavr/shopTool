async function fetchGeoData() {
  try {
    const response = await fetch('https://byhabui.shop/json/geo.json');
    if (!response.ok) throw new Error('Помилка завантаження geo.json');
    const geoData = await response.json();
    return geoData;
  } catch (error) {
    console.error('Помилка завантаження geo.json:', error);
    return null;
  }
}

async function fetchImageFolders() {
  try {
    const response = await fetch('https://byhabui.shop/images/');
    if (!response.ok) throw new Error('Помилка завантаження images/');
    const htmlText = await response.text();

    const folderNames = [];
    const regex = /href="([^"]+\/)"/g;
    let match;
    while ((match = regex.exec(htmlText)) !== null) {
      const folder = match[1].replace(/\/$/, '').toLowerCase();
      folderNames.push(folder);
    }
    return [...new Set(folderNames)];
  } catch (error) {
    console.error('Помилка завантаження папок з images:', error);
    return [];
  }
}

function showPushNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.classList.add('push-notification', type);
  notification.innerHTML = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('hide');
    setTimeout(() => {
      notification.remove();
    }, 300); 
  }, 5000);
}

async function checkEntry() {
  event.preventDefault();

  let input = document.getElementById("checkInput").value.trim();
  const parts = input.split(" - ");

  if (parts.length !== 3) {
    showPushNotification("<img src='img/wrong.gif' width='80'> Неправильний формат!", "error");
    return;
  }

  const [country, product, store] = parts.map(item =>
    item.trim().replace(/\s+/g, '').toLowerCase()
  );

  const [geoData, folderNames] = await Promise.all([
    fetchGeoData(),
    fetchImageFolders()
  ]);

  let missing = [];

  if (geoData) {
    if (!(country in geoData)) {
      missing.push(`Країна: ${country}`);
    }
  } else {
    missing.push("Не вдалося завантажити дані geo.json");
  }

  if (!folderNames.includes(product)) {
    missing.push(`Продукт: ${product}`);
  }

  if (!folderNames.includes(store)) {
    missing.push(`Магазин: ${store}`);
  }

  if (missing.length === 0) {
    showPushNotification('<img src="img/ok.gif" width="100"> Всі елементи є!', "success");
  } else {
    showPushNotification(
      `<img src="img/no.gif" width="80" style="margin-right:20px">Відсутні: <br>${missing.join("<br>")}`,
      "error"
    );
  }
}


let currentVideo = 1;

function toggleVideo() {
  let activeVideo, inactiveVideo;
  
  if (currentVideo === 1) {
    activeVideo = document.getElementById("videoPlayer1");
    inactiveVideo = document.getElementById("videoPlayer2");
  } else {
    activeVideo = document.getElementById("videoPlayer2");
    inactiveVideo = document.getElementById("videoPlayer1");
  }
  
  const currentTime = activeVideo.currentTime;
  
  inactiveVideo.currentTime = currentTime;
  inactiveVideo.play();

  activeVideo.style.opacity = 0;
  inactiveVideo.style.opacity = 1;

  currentVideo = currentVideo === 1 ? 2 : 1;
}

