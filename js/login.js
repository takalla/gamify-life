// js/login.js
const API_URL = "https://gamify-life-psi.vercel.app";

const firebaseConfig = {
  apiKey: "AIzaSyD_XLcVP2KSynm19akbXJOmt-bAMqOJ_2U",
  authDomain: "gamify-life-2025.firebaseapp.com",
  projectId: "gamify-life-2025",
  storageBucket: "gamify-life-2025.firebasestorage.app",
  messagingSenderId: "67156140086",
  appId: "1:67156140086:web:1a2d8593998bbaa463b897",
  measurementId: "G-L9KEJTSDJ1"
};

firebase.initializeApp(firebaseConfig);
let currentUser = null;

firebase.auth().onAuthStateChanged(user => {
  currentUser = user;
  if (user) {
    document.body.classList.add("logged-in");
    document.getElementById("login-box")?.remove();
    if (typeof loadUserData === "function") loadUserData();
  } else {
    document.body.classList.remove("logged-in");
    showLoginModal();
  }
});

function showLoginModal() {
  if (document.getElementById("login-box")) return;
  const box = document.createElement("div");
  box.id = "login-box";
  box.innerHTML = `
    <div class="login-modal__content">
      <h2>Welcome to Gamify Life</h2>
      <p>Sign in to save your data across devices</p>
      <input id="email" class="login-modal__input" placeholder="Email"><br>
      <input id="password" type="password" class="login-modal__input" placeholder="Password"><br>
      <button onclick="login()" class="btn">Log In</button>
      <button onclick="signup()" class="btn">Sign Up</button>
      <button onclick="googleLogin()" class="btn">Google Sign-In</button>
      <p><small>or <a href="#" onclick="document.getElementById('login-box').remove()">continue as guest</a> (no save)</small></p>
    </div>
  `;
  document.body.appendChild(box);
}

window.login = () => firebase.auth().signInWithEmailAndPassword(document.getElementById("email").value, document.getElementById("password").value).catch(e=>alert(e.message));
window.signup = () => firebase.auth().createUserWithEmailAndPassword(document.getElementById("email").value, document.getElementById("password").value).catch(e=>alert(e.message));
window.googleLogin = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
};