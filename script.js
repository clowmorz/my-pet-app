// --- 1. Firebase 初始化設定 ---
const firebaseConfig = {
  apiKey: "AIzaSyA3Vz89SNBJ5YzaPYrYaAOmy85re5BXfbE",
  authDomain: "mypetapp-bb1dd.firebaseapp.com",
  databaseURL: "https://mypetapp-bb1dd-default-rtdb.firebaseio.com",
  projectId: "mypetapp-bb1dd",
  storageBucket: "mypetapp-bb1dd.firebasestorage.app",
  messagingSenderId: "133667668782",
  appId: "1:133667668782:web:08a52da6390e975544f0bf",
  measurementId: "G-CZ9V2LCNBC"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// --- 2. 預載手錶圖片 (避免換圖時閃爍) ---
const watchImg = new Image();
watchImg.src = "pet_watch.png"; 

// --- 3. 主要程式邏輯 ---
window.onload = function() {
    const startPet = document.getElementById('start-pet');
    const loginBtn = document.getElementById('login-btn');
    const mainPet = document.getElementById('main-pet'); 
    
    const startScreen = document.getElementById('start-screen');
    const loginContainer = document.getElementById('login-container');
    const roomContainer = document.getElementById('room-container');

    // [功能 A] 第一頁點擊寵物進入登入頁
    if(startPet) {
        startPet.onclick = function() {
            startScreen.classList.remove('active');
            loginContainer.classList.add('active');
        };
    }

    // [功能 B] 登入按鈕：儲存到 Firebase 並進入房間
    if(loginBtn) {
        loginBtn.onclick = function() {
            const name = document.getElementById('username').value;
            const pass = document.getElementById('password').value;

            if(name === "" || pass === "") {
                alert("主人，名字和密碼都要填喔！");
                return;
            }

            // 嘗試存檔到雲端
            database.ref('users/' + name).set({
                password: pass,
                lastLogin: new Date().toLocaleString()
            })
            .then(() => {
                loginContainer.classList.remove('active');
                roomContainer.classList.add('active');
                startPetMoving(); 
            })
            .catch((error) => {
                console.error("連連線出錯：", error);
                alert("資料庫連線失敗，請檢查 Firebase Rules 是否設為 true！");
            });
        };
    }

    // [功能 C] 房間寵物互動：使用 Time API 抓取時間
    if (mainPet) {
        mainPet.addEventListener('click', () => {
            // 1. 換成看手錶的圖片
            mainPet.src = "pet_watch.png"; 

            // 2. 呼叫 Time API (台北時間)
            fetch('https://worldtimeapi.org/api/timezone/Asia/Taipei')
                .then(response => response.json())
                .then(data => {
                    // 從 API 回傳的 datetime 中截取時間部分 (HH:mm)
                    const apiTime = data.datetime.slice(11, 16);

                    // 3. 彈出時間（稍微延遲讓圖片切換有感）
                    setTimeout(() => {
                        alert("API 抓取的標準時間是：" + apiTime);
                        mainPet.src = "c_00.png"; // 換回原本圖片
                    }, 200);
                })
                .catch(error => {
                    console.error("API 抓取失敗，改用電腦時間:", error);
                    // 備案：如果 API 失敗，使用本機時間
                    const now = new Date();
                    const localTime = now.getHours() + ":" + String(now.getMinutes()).padStart(2, '0');
                    setTimeout(() => {
                        alert("目前時間是 (本機)：" + localTime);
                        mainPet.src = "c_00.png";
                    }, 200);
                });
        });
    }
};

// [功能 D] 房間小寵物亂跑邏輯
function startPetMoving() {
    const pet = document.getElementById('main-pet');
    if(!pet) return;

    setInterval(() => {
        const randomX = 40 + Math.random() * 20;
        const randomY = 45 + Math.random() * 20;
        
        pet.style.left = randomX + "%";
        pet.style.top = randomY + "%";
    }, 3000); 
}