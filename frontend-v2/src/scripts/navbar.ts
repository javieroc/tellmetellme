import { isLoggedIn, getUser, logout } from "../lib/auth";

function initNavbar() {
  const authContainer = document.getElementById("auth-actions");
  if (!authContainer) return;

  if (isLoggedIn()) {
    const user = getUser();

    authContainer.innerHTML = `
      <a
        href="/profile"
        class="font-bold text-[#2B6CB0] hover:underline"
      >
        ${user?.username ?? "Profile"}
      </a>

      <button
        id="logout-btn"
        class="
          cursor-pointer
          rounded-full
          border-2 border-[#2B6CB0]
          px-4 py-2
          font-bold
          text-[#2B6CB0]
          transition
          hover:bg-[#2B6CB0]
          hover:text-white
          active:scale-95
        "
      >
        Logout
      </button>
    `;

    document.getElementById("logout-btn")?.addEventListener("click", logout);
  } else {
    authContainer.innerHTML = `
      <button
        onclick="location.href='/signin'"
        class="
          cursor-pointer
          rounded-full
          border-2 border-[#2B6CB0]
          px-4 py-2
          font-bold
          text-[#2B6CB0]
          transition
          hover:bg-[#2B6CB0]
          hover:text-white
          active:scale-95
        "
      >
        Sign In
      </button>

      <button
        onclick="location.href='/signup'"
        class="
          cursor-pointer
          rounded-full
          bg-[#2B6CB0]
          px-4 py-2
          font-bold
          text-white
          transition
          hover:bg-[#2C5282]
          active:scale-95
        "
      >
        Sign Up
      </button>
    `;
  }
}

document.addEventListener("DOMContentLoaded", initNavbar);
