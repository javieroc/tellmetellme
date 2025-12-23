import { signUp } from "../lib/auth";

const form = document.getElementById("signup-form") as HTMLFormElement;
const errorEl = document.getElementById("error") as HTMLElement;

if (form && errorEl) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.classList.add("hidden");

    const formData = new FormData(form);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await signUp(username, email, password);
      window.location.href = "/";
    } catch {
      errorEl.textContent = "Could not create account";
      errorEl.classList.remove("hidden");
    }
  });
}
