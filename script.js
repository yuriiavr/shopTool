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

async function checkEntry() {
  event.preventDefault(event);
  
  let input = document.getElementById("checkInput").value.trim();
  const parts = input.split(" - ");
  
  if (parts.length !== 3) {
    document.getElementById("result").innerText = "❌ Неправильний формат!";
    return;
  }
  
  const [country, product, store] = parts.map(item => item.trim().toLowerCase());
  
  const [geoData, folderNames] = await Promise.all([fetchGeoData(), fetchImageFolders()]);
  
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
    document.getElementById("result").innerHTML = "✅ Всі елементи є!";
  } else {
    document.getElementById("result").innerHTML = "❌ Відсутні: <br>" + missing.join("<br>");
  }
}
