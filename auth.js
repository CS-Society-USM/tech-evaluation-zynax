const signupForm = document.querySelector("#signupForm");
const loginForm = document.querySelector("#loginForm");
const authMessage = document.querySelector("#authMessage");

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.querySelector("#signupEmail").value;
  const password = document.querySelector("#signupPassword").value;

  authMessage.textContent = "Sedang mencipta akaun...";

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  if (error) {
    authMessage.textContent = `Ralat: ${error.message}`;
    return;
  }

  if (data.session) {
    authMessage.textContent = "Akaun berjaya dibuat. Sekarang awak sudah log masuk.";
  } else {
    authMessage.textContent = "Akaun dibuat. Semak emel untuk mengesahkan akaun.";
  }

  signupForm.reset();
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.querySelector("#loginEmail").value;
  const password = document.querySelector("#loginPassword").value;

  authMessage.textContent = "Sedang log masuk...";

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    authMessage.textContent = `Ralat: ${error.message}`;
    return;
  }

  authMessage.textContent = `Berjaya log masuk sebagai ${data.user.email}.`;
  loginForm.reset();
  window.location.href = "dashboard.html";
});