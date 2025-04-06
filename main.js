import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query, where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginSection = document.getElementById("login-section");
const appSection = document.getElementById("app-section");
const lista = document.getElementById("lista");
const form = document.getElementById("form");

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password).catch(alert);
}

function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  createUserWithEmailAndPassword(auth, email, password).catch(alert);
}

function logout() {
  signOut(auth);
}

onAuthStateChanged(auth, user => {
  if (user) {
    loginSection.classList.add("hidden");
    appSection.classList.remove("hidden");

    const q = query(collection(db, "lancamentos"), where("uid", "==", user.uid));
    onSnapshot(q, snapshot => {
      lista.innerHTML = "";
      snapshot.forEach(doc => {
        const data = doc.data();
        const li = document.createElement("li");
        li.textContent = `${data.tipo.toUpperCase()}: R$${data.valor} - ${data.descricao}`;
        lista.appendChild(li);
      });
    });
  } else {
    loginSection.classList.remove("hidden");
    appSection.classList.add("hidden");
  }
});

form.addEventListener("submit", async e => {
  e.preventDefault();
  const descricao = document.getElementById("descricao").value;
  const valor = parseFloat(document.getElementById("valor").value);
  const tipo = document.getElementById("tipo").value;
  const user = auth.currentUser;

  if (!user) return;
  await addDoc(collection(db, "lancamentos"), {
    uid: user.uid,
    descricao,
    valor,
    tipo
  });
  form.reset();
});