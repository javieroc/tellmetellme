import { isLoggedIn, getUser } from "../lib/auth";

function initDashboardNavbar() {
  const container = document.getElementById("dashboard-user");
  if (!container) return;

  if (!isLoggedIn()) {
    location.href = "/signin";
    return;
  }

  const user = getUser();

  const authorName =
    user?.author?.name || user?.username || "User";

  const email = user?.email || "";
  const avatarUrl = user?.author?.avatar?.url;

  container.innerHTML = `
    <div class="relative group">
      <div
        class="
          flex items-center gap-3
          px-3 py-2
        "
      >
        ${
          avatarUrl
            ? `
              <img
                src="${avatarUrl}"
                alt="${authorName}"
                class="h-9 w-9 rounded-full object-cover"
              />
            `
            : `
              <div
                class="
                  flex h-9 w-9 items-center justify-center
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

        <div class="text-left lg:block">
          <div class="text-sm font-semibold text-neutral-900">
            ${authorName}
          </div>
          <div class="text-xs text-neutral-500">
            ${email}
          </div>
        </div>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", initDashboardNavbar);
