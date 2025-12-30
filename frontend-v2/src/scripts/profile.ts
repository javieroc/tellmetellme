import { getUser, getToken, fetchMe } from "../lib/auth";

document.addEventListener("DOMContentLoaded", () => {
  const user = getUser();
  const token = getToken();

  if (!user || !token) {
    window.location.href = "/signin";
    return;
  }

  const authorName = document.getElementById("author-name") as HTMLInputElement;
  const authorEmail = document.getElementById("author-email") as HTMLInputElement;
  const saveBtn = document.getElementById("save-profile") as HTMLButtonElement;

  if (!authorName || !authorEmail || !saveBtn) return;

  authorName.value = user.author?.name ?? "";
  authorEmail.value = user.author?.email ?? "";

  saveBtn.addEventListener("click", async () => {
    try {
      if (user.author?.id) {
        await fetch(
          `${import.meta.env.PUBLIC_STRAPI_URL}/authors/${user.author.documentId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              data: {
                name: authorName.value,
                email: authorEmail.value,
              },
            }),
          }
        );
      }

      const me = await fetchMe(token);
      localStorage.setItem("user", JSON.stringify(me));
      alert("Author profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update author profile");
    }
  });
});
