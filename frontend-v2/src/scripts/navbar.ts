import { isLoggedIn, getUser, logout } from "../lib/auth";

function initNavbar() {
  const authContainer = document.getElementById("auth-actions");
  if (!authContainer) return;

  if (isLoggedIn()) {
    const user = getUser();

    const authorName =
      user?.author?.name || user?.username || "Dashboard";

    const avatarUrl = user?.author?.avatar?.url;

    authContainer.innerHTML = `
      <a
        href="/dashboard"
        class="
          group
          flex items-center gap-3
          rounded-full
          px-2 py-1
          transition
          hover:bg-neutral-100
        "
      >
        ${
          avatarUrl
            ? `
              <img
                src="${avatarUrl}"
                alt="${authorName}"
                class="h-8 w-8 rounded-full object-cover"
              />
            `
            : `
              <div
                class="
                  flex h-8 w-8 items-center justify-center
                  rounded-full
                  bg-[#2B6CB0]
                  text-sm
                  font-bold
                  text-white
                "
              >
                ${authorName.charAt(0).toUpperCase()}
              </div>
            `
        }

        <span
          class="
            text-sm
            font-bold
            text-[#2B6CB0]
            group-hover:underline
          "
        >
          ${authorName}
        </span>
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

    document
      .getElementById("logout-btn")
      ?.addEventListener("click", logout);
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
