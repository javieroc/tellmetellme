import { logout } from "../lib/auth";

function initDashboardSidebar() {
  const sidebar = document.getElementById("dashboard-sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  const toggleBtn = document.getElementById("sidebar-toggle");
  const logoutBtn = document.getElementById("sidebar-logout");

  if (!sidebar || !overlay || !toggleBtn) return;

  function openSidebar() {
    sidebar?.classList.remove("-translate-x-full");
    overlay?.classList.remove("hidden");
  }

  function closeSidebar() {
    sidebar?.classList.add("-translate-x-full");
    overlay?.classList.add("hidden");
  }

  toggleBtn.addEventListener("click", openSidebar);
  overlay.addEventListener("click", closeSidebar);
  logoutBtn?.addEventListener("click", logout);
}

document.addEventListener("DOMContentLoaded", initDashboardSidebar);
