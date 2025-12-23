import { signIn } from "../lib/auth";

const form = document.getElementById("signin-form") as HTMLFormElement;
const errorEl = document.getElementById("error") as HTMLElement;

if (form && errorEl) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.classList.add("hidden");

    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await signIn(email, password);
      window.location.href = "/";
    } catch {
      errorEl.textContent = "Invalid email or password";
      errorEl.classList.remove("hidden");
    }
  });
}
