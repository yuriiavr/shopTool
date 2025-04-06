async function uploadImage() {
  const fileInput = document.getElementById("imageInput");
  const resultEl = document.getElementById("result");

  if (!fileInput.files.length) {
    resultEl.textContent = "Выберите файл для загрузки";
    return;
  }

  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("file", file);
  formData.append("requireSignedURLs", "false");

  try {
    const response = await fetch(
      "https://api.cloudflare.com/client/v4/accounts/0fb5430cc41e86296e8cffa51593070b/images/v1",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer xA1k5aZ6ile-ymQpqLzxQFkcI9Dn46W10VbNRA3f",
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (
      data.success &&
      data.result.variants &&
      data.result.variants.length > 0
    ) {
      resultEl.innerHTML = `<a href="${data.result.variants[0]}" target="_blank">Ссылка на картинку</a>`;
    } else {
      resultEl.textContent =
        "Загрузка не удалась: " + JSON.stringify(data.errors);
    }
  } catch (err) {
    resultEl.textContent = "Ошибка: " + err.message;
  }
}

function showPushNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.classList.add("push-notification", type);
  notification.innerHTML = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("hide");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
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
