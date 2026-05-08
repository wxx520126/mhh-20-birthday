const storageKey = "birthday-letter-page-v1";

const elements = {
  title: document.querySelector(".title"),
  meta: document.querySelector(".meta"),
  body: document.getElementById("letterBody"),
  photoInput: document.getElementById("photoInput"),
  photoGrid: document.getElementById("photoGrid"),
  dropzone: document.getElementById("dropzone"),
  clearPhotos: document.getElementById("clearPhotos"),
  toast: document.getElementById("toast"),
};

const state = {
  photos: [],
};

function showToast(text) {
  elements.toast.textContent = text;
  elements.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    elements.toast.classList.remove("show");
  }, 1500);
}

function saveDraft(options = {}) {
  const draft = {
    title: elements.title?.innerText.trim() ?? "",
    meta: elements.meta?.innerText.trim() ?? "",
    body: elements.body?.innerText ?? "",
  };

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(draft));
  } catch {
    return;
  }

  if (!options.silent) {
    showToast("已保存到浏览器草稿");
  }
}

function loadDraft() {
  const raw = window.localStorage.getItem(storageKey);

  if (!raw) {
    return;
  }

  try {
    const draft = JSON.parse(raw);

    if (elements.title && draft.title) {
      elements.title.innerText = draft.title;
    }

    if (elements.meta && draft.meta) {
      elements.meta.innerText = draft.meta;
    }

    if (elements.body && draft.body) {
      elements.body.innerText = draft.body;
    }
  } catch {
    window.localStorage.removeItem(storageKey);
  }
}

function renderPhotos() {
  elements.photoGrid.innerHTML = "";

  if (state.photos.length === 0) {
    const emptyCard = document.createElement("div");
    emptyCard.className = "photo-card";
    emptyCard.style.display = "grid";
    emptyCard.style.placeItems = "center";
    emptyCard.style.minHeight = "180px";
    emptyCard.style.color = "#8c7367";
    emptyCard.textContent = "照片会出现在这里";
    elements.photoGrid.appendChild(emptyCard);
    return;
  }

  for (const photo of state.photos) {
    const card = document.createElement("figure");
    card.className = "photo-card";

    const image = document.createElement("img");
    image.src = photo.src;
    image.alt = photo.name || "照片预览";

    const caption = document.createElement("figcaption");
    const name = document.createElement("span");
    name.textContent = photo.name || "未命名照片";

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-photo";
    remove.textContent = "删除";
    remove.addEventListener("click", () => {
      URL.revokeObjectURL(photo.src);
      state.photos = state.photos.filter((item) => item.id !== photo.id);
      renderPhotos();
    });

    caption.append(name, remove);
    card.append(image, caption);
    elements.photoGrid.appendChild(card);
  }
}

function addFiles(files) {
  const images = Array.from(files).filter((file) => file.type.startsWith("image/"));

  if (images.length === 0) {
    return;
  }

  for (const file of images) {
    const src = URL.createObjectURL(file);
    state.photos.push({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: file.name,
      src,
    });
  }

  renderPhotos();
  showToast(`已添加 ${images.length} 张照片`);
}

function clearAllPhotos() {
  for (const photo of state.photos) {
    URL.revokeObjectURL(photo.src);
  }

  state.photos = [];
  renderPhotos();
}

function wireEditable(element) {
  if (!element) {
    return;
  }

  element.addEventListener("input", () => saveDraft({ silent: true }));
  element.addEventListener("blur", saveDraft);
}

wireEditable(elements.title);
wireEditable(elements.meta);
wireEditable(elements.body);

elements.photoInput?.addEventListener("change", (event) => {
  const input = event.currentTarget;
  if (input?.files) {
    addFiles(input.files);
    input.value = "";
  }
});

elements.clearPhotos?.addEventListener("click", () => {
  clearAllPhotos();
  showToast("照片已清空");
});

function preventDefaults(event) {
  event.preventDefault();
  event.stopPropagation();
}

if (elements.dropzone) {
  ["dragenter", "dragover", "dragleave", "drop"].forEach((name) => {
    elements.dropzone.addEventListener(name, preventDefaults, false);
  });

  ["dragenter", "dragover"].forEach((name) => {
    elements.dropzone.addEventListener(name, () => {
      elements.dropzone.classList.add("is-dragover");
    });
  });

  ["dragleave", "drop"].forEach((name) => {
    elements.dropzone.addEventListener(name, () => {
      elements.dropzone.classList.remove("is-dragover");
    });
  });

  elements.dropzone.addEventListener("drop", (event) => {
    const files = event.dataTransfer?.files;
    if (files?.length) {
      addFiles(files);
    }
  });
}

document.addEventListener("paste", (event) => {
  const files = Array.from(event.clipboardData?.files ?? []).filter((file) => file.type.startsWith("image/"));

  if (files.length > 0) {
    addFiles(files);
  }
});

window.addEventListener("beforeunload", () => {
  saveDraft({ silent: true });
});

loadDraft();
renderPhotos();
