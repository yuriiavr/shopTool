let countries = [],
  products = [],
  stores = [];

const JSON_URL = "https://api.jsonbin.io/v3/b/67c198e2e41b4d34e49e4958";

async function loadData() {
  try {
    let response = await fetch(JSON_URL, {});
    let data = await response.json();

    countries = data.record.countries.map((c) => c.trim().toLowerCase());
    products = data.record.products.map((p) => p.trim().toLowerCase());
    stores = data.record.stores.map((s) => s.trim().toLowerCase());

    document.querySelector("h3").innerText = "Дані завантажено!";
  } catch (error) {
    console.error("Помилка завантаження JSON", error);
    document.querySelector("h3").innerText = "❌ Помилка завантаження!";
  }
}

function checkEntry() {
    event.preventDefault();
    let input = document.getElementById("checkInput").value.trim().toLowerCase();
    let parts = input.split(" - ");
  
    if (parts.length !== 3) {
      document.getElementById("result").innerText = "❌ Неправильний формат!";
      return;
    }
  
    parts = parts.map(item => item.replace(/\s+/g, ''));
  
    let [country, product, store] = parts;
    let missing = [];
  
    if (!countries.includes(country)) missing.push(`Країна: ${country}`);
    if (!products.includes(product)) missing.push(`Продукт: ${product}`);
    if (!stores.includes(store)) missing.push(`Магазин: ${store}`);
  
    document.getElementById("result").innerHTML =
      missing.length === 0
        ? "✅ Всі елементи є в списках!"
        : "❌ Відсутні: <br>" + missing.join("<br>");
  }
  
  

loadData();
