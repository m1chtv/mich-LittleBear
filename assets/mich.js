let deferredPrompt;

const installBtn = document.createElement("button");
installBtn.className = "btn btn-primary install-btn";
installBtn.innerText = "نصب اپ خرس کوچولو 🐻";
Object.assign(installBtn.style, {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  zIndex: "1000",
  borderRadius: "12px",
  boxShadow: "0 0 10px #a855f7",
  background: "#a855f7",
  color: "#fff",
  fontWeight: "bold",
  display: "none"
});

installBtn.onclick = async () => {
  if (!deferredPrompt) return;
  installBtn.disabled = true;
  deferredPrompt.prompt();

  const choiceResult = await deferredPrompt.userChoice;
  if (choiceResult.outcome === "accepted") {
    console.log("User accepted the install prompt");
    installBtn.remove();
  } else {
    console.log("User dismissed the install prompt");
    installBtn.disabled = false;
  }

  deferredPrompt = null;
};

document.body.appendChild(installBtn);

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = "block";
});

const defaultTasks = [
  "۷ الی ۸ ساعت خواب 😴",
  "کشش بدن بعد از بیدار شدن 🧎‍♀️",
  "مرتب کردن تخت بعد از بیدار شدن 🛏️",
  "مراقبت پوست 🧖‍♀️",
  "مدیتیشن یا یوگا 🧘‍♀️",
  "نوشیدن ۸ لیوان آب 💧",
  "نوشتن ژورنال ✍",
  "خوردن میوه و سبزیجات 🥗",
  "ورزش حداقل 20 دقیقه 🏃‍♀️",
  "لبخند زدن 😄",
  "خوندن یک صفحه کتاب 📕",
  "تمیز کردن یک گوشه از اتاق 🧽",
  "نوشتن ۳ نکته مثبت روز ✨",
  "دوری از گوشی حداقل ۱ ساعت 📵",
  "پیاده‌روی در هوای آزاد 🚶‍♀️",
  "گرفتن یک دوش آرامش‌بخش 🚿"
];

const taskList = document.getElementById("task-list");
const newTaskInput = document.getElementById("new-task");
const noteInput = document.getElementById("daily-note");
const gallery = document.getElementById("gallery");
const loveQuote = document.getElementById("love-quote");
const calendar = document.getElementById("calendar");

let chartInstance = null;
let completedDays = JSON.parse(localStorage.getItem("completedDays") || "[]");
let taskStatus = JSON.parse(localStorage.getItem("taskStatus") || "{}");
let quotes = [
  "تو قشنگ‌ترین قسمت روز منی 💖",
  "خرس کوچولوی من، همیشه بدرخش ✨",
  "به خودت افتخار کن، امروز هم عالی بودی 💪",
  "یه قلب خوشحال منتظرته 💜"
];

const meditationDescriptions = {
  mindful: `در این مدیتیشن، تمرکزت رو روی لحظه حال بگذار. و نفس هات رو بشمار جوری که دیگه صدایی توی ذهنت نباشه, فقط صدای شماردنت باشه.`,
  breathing: `یک دم عمیق از بینی بکش، چند ثانیه نگه‌دار و آرام از دهان خارج کن. این کار را با ریتم ثابت ادامه بده.`,
  muscle: `عضلات بدن رو به ترتیب منقبض و رها کن. مثلاً از پاها شروع کن و به سمت بالا حرکت کن تا ریلکسیشن کامل اتفاق بیفته.`,
  bodyscan: `چشمانت رو ببند و تمرکزت رو از نوک پا تا بالای سر حرکت بده. به هر قسمتی که رسیدی، فقط حسش کن و رهاش کن.`,
};

document.getElementById("meditationType").addEventListener("change", function () {
  const selected = this.value;
  const descBox = document.getElementById("meditationDescription");
  if (meditationDescriptions[selected]) {
    descBox.textContent = meditationDescriptions[selected];
    descBox.style.display = "block";
  } else {
    descBox.style.display = "none";
  }
});


const notyf = new Notyf({ duration: 3000, ripple: true });

function renderTasks() {
  if (!localStorage.getItem("tasks")) {
    localStorage.setItem("tasks", JSON.stringify(defaultTasks));
  }

  taskList.innerHTML = "";
  const tasks = JSON.parse(localStorage.getItem("tasks")) || defaultTasks;

  tasks.forEach((task, i) => {
    const isDefault = i < defaultTasks.length;
    const checked = taskStatus[i] ? "checked" : "";

    const li = document.createElement("li");
    li.className = `list-group-item d-flex justify-content-between align-items-center task-item px-3 py-2 ${taskStatus[i] ? "done" : ""}`;
    li.setAttribute("data-index", i);
    li.style.cursor = "pointer";

    li.innerHTML = `
      <span class="task-text flex-grow-1">${task}</span>
      <div class="d-flex align-items-center gap-2">
        ${!isDefault ? `<button class="btn btn-sm btn-danger delete-btn">حذف</button>` : ""}
      </div>
    `;

    li.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-btn")) return;
      toggleTask(i);
    });

    if (!isDefault) {
      li.querySelector(".delete-btn").addEventListener("click", () => {
        tasks.splice(i, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        delete taskStatus[i];
        localStorage.setItem("taskStatus", JSON.stringify(taskStatus));
        renderTasks();
      });
    }

    taskList.appendChild(li);
  });
}

function addTask() {
  const task = newTaskInput.value.trim();
  if (!task) return;
  let tasks = JSON.parse(localStorage.getItem("tasks")) || defaultTasks;
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  newTaskInput.value = "";
  renderTasks();
}

function toggleTask(i) {
  taskStatus[i] = !taskStatus[i];
  localStorage.setItem("taskStatus", JSON.stringify(taskStatus));
  renderTasks();
}

function deleteTask(i) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || defaultTasks;
  tasks.splice(i, 1);
  delete taskStatus[i];
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("taskStatus", JSON.stringify(taskStatus));
  renderTasks();
}

function submitDay() {
  const note = noteInput.value.trim();
  if (!note) return notyf.error("یادداشت روزانه را پر کن!");

  taskStatus = JSON.parse(localStorage.getItem("taskStatus")) || {};
  const checkedTasks = Object.values(taskStatus).filter(Boolean);
  if (checkedTasks.length === 0) return notyf.error("حداقل یک کار را انجام بده!");

  const today = new Date().toLocaleDateString("fa-IR");

  if (!completedDays.includes(today)) {
    completedDays.push(today);
    localStorage.setItem("completedDays", JSON.stringify(completedDays));
  }

  const tasks = JSON.parse(localStorage.getItem("tasks")) || defaultTasks;
  const doneTasks = [];
  const notDoneTasks = [];

  Object.entries(taskStatus).forEach(([i, done]) => {
    const taskText = tasks[i];
    if (done) doneTasks.push(`✔️ ${taskText}`);
    else notDoneTasks.push(`❌ ${taskText}`);
  });

  const moods = JSON.parse(localStorage.getItem("moods") || "{}");
  const mood = moods[today] || "ثبت نشده 😶";



  const sleepData = JSON.parse(localStorage.getItem("sleepData") || "{}");
  const todaySleep = sleepData[today];
  const sleepInfo = todaySleep
    ? `😴 خواب: ${todaySleep.sleep}\n⏰ بیداری: ${todaySleep.wake}\n🕒 مدت: ${todaySleep.duration.toFixed(1)} ساعت`
    : "اطلاعات خواب ثبت نشده 😴";

  const meals = {
    breakfast: document.getElementById("breakfast").value.trim(),
    lunch: document.getElementById("lunch").value.trim(),
    dinner: document.getElementById("dinner").value.trim(),
    snack: document.getElementById("snack").value.trim()
  };

  localStorage.setItem("dailyMeals", JSON.stringify(meals));

  const meditation = {
    type: document.getElementById("meditationType").value.trim(),
    duration: document.getElementById("meditationDuration").value.trim()
  };
  localStorage.setItem("dailyMeditation", JSON.stringify(meditation));

  const message =
    `📅 *تاریخ:* ${today}\n\n` +
    `📝 *یادداشت روزانه:*\n${note}\n\n` +
    `💖 *مود امروز:* ${mood}\n\n` +
    `🛌 *خواب:*\n${sleepInfo}\n\n` +
    `🍽️ *وعده‌ها:*\n` +
    `• صبحانه: ${meals.breakfast || "نخوردی؟"}\n` +
    `• ناهار: ${meals.lunch || "رد دادی؟"}\n` +
    `• شام: ${meals.dinner || "مگه رژیمی؟"}\n` +
    `• میان‌وعده: ${meals.snack || "هیچی؟"}\n\n` +
    `🧘 *مدیتیشن و تنفس:*\n` +
    (meditation.type ? `• نوع تمرین: ${meditation.type}\n` : "") +
    (meditation.duration ? `• مدت: ${meditation.duration} دقیقه\n\n` : "• ثبت نشده\n\n") +

    `✅ *انجام شده‌ها:*\n${doneTasks.length ? doneTasks.join("\n") : "هیچ‌کدام"}\n\n` +
    `❌ *انجام نشده‌ها:*\n${notDoneTasks.length ? notDoneTasks.join("\n") : "هیچ‌کدام"}`;

  fetch("https://api.telegram.org/bot<your_token>/sendMessage", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: <your_chat_id>,
      text: message,
      parse_mode: "Markdown"
    })
  });

  taskStatus = {};
  noteInput.value = "";
  localStorage.removeItem("taskStatus");
  ["breakfast", "lunch", "dinner", "snack"].forEach(id => {
    document.getElementById(id).value = "";
  });
  document.getElementById("meditationType").value = "";
  document.getElementById("meditationDuration").value = "";
  delete moods[today];
  localStorage.setItem("moods", JSON.stringify(moods));

  notyf.success("ثبت شد خرس کوچولو! 💜");

  renderTasks();
  renderCalendar();
  renderChart();
}

function openModal(src) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  modalImg.src = src;
  modal.classList.add("show");
}

function closeModal(event) {
  if (event.target.id === "modalImage") return;
  document.getElementById("imageModal").classList.remove("show");
}

function renderGallery() {
  const images = JSON.parse(localStorage.getItem("images") || "[]");
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  images.forEach((src, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "image-wrapper position-relative";

    const img = document.createElement("img");
    img.src = src;
    img.style.width = "100px";
    img.style.height = "100px";
    img.style.objectFit = "cover";
    img.className = "rounded";

    img.onclick = () => openModal(src);

    const delBtn = document.createElement("button");
    delBtn.innerText = "×";
    delBtn.className = "delete-image-btn";
    delBtn.onclick = () => {
      images.splice(index, 1);
      localStorage.setItem("images", JSON.stringify(images));
      renderGallery();
    };

    wrapper.appendChild(img);
    wrapper.appendChild(delBtn);
    gallery.appendChild(wrapper);
  });
}

document.getElementById("image-upload").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const images = JSON.parse(localStorage.getItem("images") || "[]");
    images.push(reader.result);
    localStorage.setItem("images", JSON.stringify(images));
    renderGallery();
  };
  reader.readAsDataURL(file);
});

renderGallery();



function saveSleepData() {
  const sleepTime = document.getElementById("sleep-time").value;
  const wakeTime = document.getElementById("wake-time").value;
  if (!sleepTime || !wakeTime) {
    notyf.error("ساعت خواب و بیداری را وارد کن!");
    return;
  }

  const today = new Date().toLocaleDateString("fa-IR");
  const sleep = new Date(`1970-01-01T${sleepTime}`);
  const wake = new Date(`1970-01-01T${wakeTime}`);

  let duration = (wake - sleep) / 1000 / 60 / 60;
  if (duration < 0) duration += 24;

  const sleepData = JSON.parse(localStorage.getItem("sleepData") || "{}");
  sleepData[today] = { sleep: sleepTime, wake: wakeTime, duration };
  localStorage.setItem("sleepData", JSON.stringify(sleepData));

  document.getElementById("sleep-duration").textContent =
    `مدت خواب: ${duration.toFixed(1)} ساعت`;

  notyf.success("خواب ثبت شد 😴");
}

window.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toLocaleDateString("fa-IR");
  const sleepData = JSON.parse(localStorage.getItem("sleepData") || "{}");
  if (sleepData[today]) {
    document.getElementById("sleep-time").value = sleepData[today].sleep;
    document.getElementById("wake-time").value = sleepData[today].wake;
    document.getElementById("sleep-duration").textContent =
      `مدت خواب: ${sleepData[today].duration.toFixed(1)} ساعت`;
  }
});

function renderQuote() {
  loveQuote.textContent = quotes[Math.floor(Math.random() * quotes.length)];
}

function renderCalendar() {
  calendar.innerHTML = "";
  let days = [...new Set(completedDays)].slice(-30);
  days.forEach(d => {
    const div = document.createElement("div");
    div.className = "active";
    div.title = d;
    div.textContent = d.split("/").pop();
    calendar.appendChild(div);
  });
}

function faToEn(str) {
  return str.replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
}

function renderChart() {
  const ctx = document.getElementById("progressChart");
  if (chartInstance) chartInstance.destroy();

  const completedData = Array(7).fill(0);
  const sleepData = Array(7).fill(0);

  const sleepLog = JSON.parse(localStorage.getItem("sleepData") || "{}");

  completedDays.forEach(d => {
    const [y, m, d2] = faToEn(d).split("/");
    const date = new Date(`${y}-${m}-${d2}`);
    if (!isNaN(date)) {
      const day = (date.getDay() + 1) % 7;
      completedData[day]++;
    }
  });

  Object.entries(sleepLog).forEach(([dateStr, obj]) => {
    const [y, m, d2] = faToEn(dateStr).split("/");
    const date = new Date(`${y}-${m}-${d2}`);
    if (!isNaN(date)) {
      const day = (date.getDay() + 1) % 7;
      sleepData[day] += obj.duration || 0;
    }
  });

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"],
      datasets: [
        {
          label: "روزهای انجام‌شده ✅",
          data: completedData,
          backgroundColor: "#a855f7"
        },
        {
          label: "ساعت خواب 😴",
          data: sleepData,
          backgroundColor: "#60a5fa"
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 }
        }
      },
      plugins: {
        legend: {
          labels: {
            font: { family: "Vazirmatn", size: 14 }
          }
        },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              const val = ctx.raw;
              return ctx.dataset.label + ": " + (ctx.dataset.label.includes("خواب") ? val.toFixed(1) + " ساعت" : val + " روز");
            }
          }
        }
      }
    }
  });
}

function saveMood(mood) {
  const today = new Date().toLocaleDateString("fa-IR");
  const moods = JSON.parse(localStorage.getItem("moods") || "{}");
  moods[today] = mood;
  localStorage.setItem("moods", JSON.stringify(moods));
}
function loadTodayMood() {
  const today = new Date().toLocaleDateString("fa-IR");
  const moods = JSON.parse(localStorage.getItem("moods") || "{}");
  const selectedMood = moods[today];

  document.querySelectorAll(".mood-btn").forEach(btn => {
    btn.classList.remove("selected");
    if (btn.dataset.mood === selectedMood) {
      btn.classList.add("selected");
    }
  });
}
document.querySelectorAll(".mood-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const mood = btn.dataset.mood;

    document.querySelectorAll(".mood-btn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");

    saveMood(mood);
  });
});
loadTodayMood();


function notifyUser() {
  if (Notification.permission === "granted") {
    new Notification("خرس کوچولو 💜", {
      body: "وقتشه که روتین قشنگتو انجام بدی!",
    });
  }
}

if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}


renderTasks();
renderGallery();
renderQuote();
renderCalendar();
renderChart();
setTimeout(notifyUser, 5000);
