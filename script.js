// Функція для завантаження даних geo.json
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

// Функція для отримання списку папок з images
async function fetchImageFolders() {
  try {
    const response = await fetch('https://byhabui.shop/images/');
    if (!response.ok) throw new Error('Помилка завантаження images/');
    const htmlText = await response.text();

    // Припустимо, що імена папок містяться у тегах <a href="folderName/"> 
    const folderNames = [];
    const regex = /href="([^"]+\/)"/g;
    let match;
    while ((match = regex.exec(htmlText)) !== null) {
      // Видаляємо заключний слеш і переводимо в нижній регістр
      const folder = match[1].replace(/\/$/, '').toLowerCase();
      folderNames.push(folder);
    }
    // Унікальні значення
    return [...new Set(folderNames)];
  } catch (error) {
    console.error('Помилка завантаження папок з images:', error);
    return [];
  }
}

// Функція перевірки введеного запиту
async function checkEntry() {
  event.preventDefault(event);
  
  let input = document.getElementById("checkInput").value.trim();
  const parts = input.split(" - ");
  
  if (parts.length !== 3) {
    document.getElementById("result").innerText = "❌ Неправильний формат!";
    return;
  }
  
  // Нормалізуємо введені дані (видаляємо зайві пробіли, переводимо в нижній регістр)
  const [country, product, store] = parts.map(item => item.trim().toLowerCase());
  
  // Завантажуємо дані одночасно
  const [geoData, folderNames] = await Promise.all([fetchGeoData(), fetchImageFolders()]);
  
  let missing = [];
  
  // Перевірка першої частини: країна
  if (geoData) {
    // Припускаємо, що geoData є об'єктом, де ключі – це допустимі країни
    if (!(country in geoData)) {
      missing.push(`Країна: ${country}`);
    }
  } else {
    missing.push("Не вдалося завантажити дані geo.json");
  }
  
  // Перевірка другої частини: продукт
  if (!folderNames.includes(product)) {
    missing.push(`Продукт: ${product}`);
  }
  
  // Перевірка третьої частини: магазин
  if (!folderNames.includes(store)) {
    missing.push(`Магазин: ${store}`);
  }
  
  // Вивід результатів перевірки
  if (missing.length === 0) {
    document.getElementById("result").innerHTML = "✅ Всі елементи є!";
  } else {
    document.getElementById("result").innerHTML = "❌ Відсутні: <br>" + missing.join("<br>");
  }
}
