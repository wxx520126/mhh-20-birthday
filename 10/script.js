const STORAGE_KEY = "birthday-food-wheel-state-v4";
const ACTIVE_CATEGORY_KEY = "birthday-food-wheel-active-category-v4";
const CATEGORY_ORDER = ["eat", "fruit", "drink", "feast"];

const categories = {
  eat: {
    label: "吃的",
    wheelHint: "道可选美食",
    placeholder: "例如：手抓饼、烤冷面、炸酱面",
    emptyMessage: "先给吃的转盘加几道菜吧。",
    defaultItems: [
      "手抓饼",
      "肉夹馍",
      "福鼎肉片",
      "关东煮",
      "火爆鱿鱼",
      "大油边",
      "章鱼小丸子",
      "肠粉",
      "毛哥卷饼",
      "烤冷面",
      "海南粉",
      "儋州米烂",
      "生蚝",
      "奶酪炸潇排",
      "燕姐糟粕醋",
      "梅菜扣肉饼",
      "土豆泥捞饭",
      "骨汤肉丝面",
      "自选",
      "炸酱面",
      "肯德基",
      "麦当劳",
      "泡面",
      "潇猪",
    ],
    theme: {
      accent: "#c85d34",
      accentDeep: "#8d3f26",
      accentSoft: "#f1a55a",
    },
  },
  fruit: {
    label: "水果",
    wheelHint: "道可选水果",
    placeholder: "例如：西瓜、芒果、蓝莓",
    emptyMessage: "先给水果转盘加几种水果吧。",
    defaultItems: ["西瓜", "芒果", "蓝莓", "番茄夹乌梅", "椰青", "奶椰"],
    theme: {
      accent: "#d95a7f",
      accentDeep: "#9b3454",
      accentSoft: "#f29db0",
    },
  },
  drink: {
    label: "喝的",
    wheelHint: "道可选喝的",
    placeholder: "例如：黄记糖水、清补凉、椰子汁",
    emptyMessage: "先给喝的转盘加几杯想喝的。",
    defaultItems: ["黄记糖水", "财神糖水", "西瓜汁", "椰子汁", "菠萝冰", "清补凉"],
    theme: {
      accent: "#2d7b67",
      accentDeep: "#185043",
      accentSoft: "#7ec6b0",
    },
  },
  feast: {
    label: "大餐",
    wheelHint: "道可选大餐",
    placeholder: "例如：火锅鸡、巨井烤肉、川妹火锅",
    emptyMessage: "先给大餐转盘加几顿想吃的。",
    defaultItems: ["古鲁特烤肉", "火锅鸡", "匠子烤鱼", "巨井烤肉", "川妹火锅"],
    theme: {
      accent: "#8f4c2a",
      accentDeep: "#5f2e18",
      accentSoft: "#cb8a62",
    },
  },
};

const palette = ["#c85d34", "#d78948", "#2d7b67", "#8f5b3f", "#a73f32", "#e0a13f", "#b96f2d", "#3f8ca3", "#be7647", "#9d4834"];
const forbiddenEatItems = new Set(["古鲁特烤肉", "火锅鸡", "匠子烤鱼"]);

const categorySwitcher = document.getElementById("categorySwitcher");
const wheel = document.getElementById("wheel");
const wheelLabels = document.getElementById("wheelLabels");
const wheelCategoryLabel = document.getElementById("wheelCategoryLabel");
const wheelCategoryHint = document.getElementById("wheelCategoryHint");
const activeCategoryTitle = document.getElementById("activeCategoryTitle");
const quickChips = document.getElementById("quickChips");
const foodList = document.getElementById("foodList");
const itemCount = document.getElementById("itemCount");
const listCount = document.getElementById("listCount");
const resultText = document.getElementById("resultText");
const statusText = document.getElementById("statusText");
const spinButton = document.getElementById("spinButton");
const restoreCurrentButton = document.getElementById("restoreCurrentButton");
const restoreAllButton = document.getElementById("restoreAllButton");
const clearButton = document.getElementById("clearButton");
const addForm = document.getElementById("addForm");
const foodInput = document.getElementById("foodInput");
const resultModal = document.getElementById("resultModal");
const resultModalTitle = document.getElementById("resultModalTitle");
const resultModalReview = document.getElementById("resultModalReview");
const resultModalNote = document.getElementById("resultModalNote");
const resultModalClose = document.getElementById("resultModalClose");
const resultModalKeepButton = document.getElementById("resultModalKeepButton");
const resultModalDiscardButton = document.getElementById("resultModalDiscardButton");

const foodReviews = {
  eat: {
    "手抓饼": "潇潇超级喜欢的手抓饼，有时候会连着纸包装一起吃掉",
    "肉夹馍": "虽然其实是馍夹肉，但是肉肉吃起来也很满足",
    "福鼎肉片": "哎呀妈呀人太多了",
    "关东煮": "别忘了鱼籽福袋哦，希望今天的老板也能免费送晗一串丸子哈哈哈哈",
    "火爆鱿鱼": "香飞了，害怕章鱼的潇都拒绝不了他",
    "大油边": "美味多汁的大油边，嚼劲十足，潇要流口水了",
    "章鱼小丸子": "宝宝小心烫！可以给朋友一起分享哦",
    "肠粉": "正啊~",
    "毛哥卷饼": "宝宝，我刚才，好想你。",
    "烤冷面": "想你了一中烤冷面，为什么他可以这么香",
    "海南粉": "‘妈妈！’吃完湿腌海南粉的宝宝晗说道。",
    "儋州米烂": "比臭学校便宜太多啦",
    "生蚝": "晗晗的美容站，记得要老板多加炸蒜蓉哦",
    "奶酪炸潇排": "其实是晗排，略略略小晗晗要是不抽到这个就不知道我说她是小猪，哈哈哈哈哈",
    "燕姐糟粕醋": "最喜欢的造伯醋，多加点海菜哦",
    "梅菜扣肉饼": "便宜满足，但是好像在小巷子那边哦",
    "土豆泥捞饭": "好久没吃了，去试试吧",
    "骨汤肉丝面": "虽然有点远，但是好吃清淡",
    "自选": "经典套餐，茄子蒸蛋鸡腿，还有，它叫辣椒炒肉，才不叫青椒肉丝",
    "炸酱面": "听说比一中的还香？这个潇真的很想试试",
    "肯德基": "东吃汉堡夏吃姜，不用医生开药方",
    "麦当劳": "真神麦麦，不素之霸吃起来太爽了",
    "泡面": "拌面也可以哦，要是没有了记得联系潇潇补充物资！",
    "潇猪": `晗晗宝：吃什么？吃什么？吃什么呢？又？
  晗晗宝：先吃个潇潇，没吃饱
  潇猪猪：不要啊
  潇猪猪：吃了潇潇那你没男朋友怎么办
  晗晗宝：因为潇潇是我的开心果，我吃了一个之后就可以非常开心
  潇潇猪：好嘛
  潇潇猪：爱宝宝`,
  },
  fruit: {
    "西瓜": "超爽的西瓜瓜，宝宝可以买一个小西瓜用勺子挖着吃哦",
    "芒果": "海南特产，晗晗的好伙伴",
    "蓝莓": "酸酸甜甜真好吃",
    "番茄夹乌梅": "好像一个嘴巴把乌梅咬住啦",
    "椰青": "晗晗最爱",
    "奶椰": "潇潇最爱，可以砸开吃椰肉哦",
  },
  drink: {
    "黄记糖水": "生理期也可以吃哦，喜欢木薯",
    "财神糖水": "吃吃吃芋泥麻薯！",
    "西瓜汁": "今天的格外甜",
    "椰子汁": "也可以买小椰子哦",
    "菠萝冰": "冰冰的很好喝",
    "清补凉": "最喜欢的清补凉，离开海南也忘不了的清补凉",
  },
  feast: {
    "古鲁特烤肉": "伟大，无需多言",
    "火锅鸡": "吃完🐔后我们还能疯狂加素菜哈哈哈哈",
    "匠子烤鱼": "这个真的超级下饭，好香好香，鱼皮也treetree的",
    "巨井烤肉": "曾经的神，可惜遇见了古鲁特",
    "川妹火锅": "和潇潇一起来过的店呀，宝宝也可以去更好吃的火锅呀",
  },
};

function createDefaultState(categoryId) {
  return {
    items: [...categories[categoryId].defaultItems],
    rotation: 0,
    activeIndex: -1,
    lastResultIndex: -1,
    lastResultName: "",
  };
}

function normalizeList(list) {
  return Array.isArray(list) ? list.map((name) => String(name).trim()).filter(Boolean) : [];
}

function loadStates() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (stored && typeof stored === "object") {
      const nextStates = {};

      CATEGORY_ORDER.forEach((categoryId) => {
        const defaultState = createDefaultState(categoryId);
        const categoryState = stored[categoryId];
        const loadedItems = Array.isArray(categoryState?.items) ? normalizeList(categoryState.items) : defaultState.items;
        nextStates[categoryId] = {
          items: categoryId === "eat" ? loadedItems.filter((name) => !forbiddenEatItems.has(name)) : loadedItems,
          rotation: Number.isFinite(categoryState?.rotation) ? categoryState.rotation : 0,
          activeIndex: Number.isInteger(categoryState?.activeIndex) ? categoryState.activeIndex : -1,
          lastResultIndex: -1,
          lastResultName: "",
        };
      });

      return nextStates;
    }
  } catch (error) {
    console.warn("无法读取本地转盘状态", error);
  }

  return Object.fromEntries(CATEGORY_ORDER.map((categoryId) => [categoryId, createDefaultState(categoryId)]));
}

function loadActiveCategory() {
  const stored = localStorage.getItem(ACTIVE_CATEGORY_KEY);
  return CATEGORY_ORDER.includes(stored) ? stored : "eat";
}

let states = loadStates();
let currentCategoryId = loadActiveCategory();
let spinning = false;

function saveStates() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
}

function saveActiveCategory() {
  localStorage.setItem(ACTIVE_CATEGORY_KEY, currentCategoryId);
}

function getCurrentCategory() {
  return categories[currentCategoryId];
}

function getCurrentState() {
  return states[currentCategoryId];
}

function normalizeName(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function colorForIndex(index) {
  return palette[index % palette.length];
}

function getFoodReview(categoryId, itemName, index) {
  const reviewTable = foodReviews[categoryId] || {};
  if (reviewTable[itemName]) {
    return reviewTable[itemName];
  }

  const fallbackReviewBanks = {
    eat: ["这口很稳，今天很适合认真吃一顿。", "香气已经很有画面感了，适合安排。"],
    fruit: ["清爽路线，吃完会轻松很多。", "甜甜的，很适合当今天的小奖励。"],
    drink: ["顺口又解渴，今天很适合来一杯。", "这杯看起来就很舒服。"],
    feast: ["这顿一看就很有仪式感。", "适合认真奖励一下自己。"],
  };

  const bank = fallbackReviewBanks[categoryId] || fallbackReviewBanks.eat;
  return bank[index % bank.length];
}

function getLandingIndex(rotation, itemCount) {
  if (!itemCount) {
    return -1;
  }

  const normalizedRotation = ((rotation % 360) + 360) % 360;
  const pointerAngle = (360 - normalizedRotation) % 360;
  const slice = 360 / itemCount;
  return Math.floor(pointerAngle / slice) % itemCount;
}

function buildWheelGradient() {
  const items = getCurrentState().items;

  if (!items.length) {
    return "conic-gradient(from -90deg, #f5d7b9 0deg 360deg)";
  }

  const slice = 360 / items.length;
  const stops = items.map((_, index) => {
    const start = index * slice;
    const end = start + slice;
    return `${colorForIndex(index)} ${start}deg ${end}deg`;
  });

  return `conic-gradient(from -90deg, ${stops.join(", ")})`;
}

function openResultModal(categoryId, itemName, review, canDiscard) {
  resultModalTitle.textContent = itemName;
  resultModalReview.textContent = review;
  resultModalNote.textContent = `这是「${categories[categoryId].label}」转盘的结果。你可以保留它，或者删掉并重转。`;
  resultModalDiscardButton.hidden = !canDiscard;
  resultModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeResultModal() {
  resultModal.hidden = true;
  document.body.classList.remove("modal-open");
}

function renderCategorySwitcher() {
  categorySwitcher.innerHTML = "";

  CATEGORY_ORDER.forEach((categoryId) => {
    const category = categories[categoryId];
    const state = states[categoryId];
    const button = document.createElement("button");
    button.type = "button";
    button.className = `switch-button${categoryId === currentCategoryId ? " is-active" : ""}`;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(categoryId === currentCategoryId));
    button.dataset.category = categoryId;
    button.innerHTML = `<span>${category.label}</span><small>${state.items.length}</small>`;
    button.addEventListener("click", () => switchCategory(categoryId));
    categorySwitcher.appendChild(button);
  });
}

function renderWheel() {
  const state = getCurrentState();
  const category = getCurrentCategory();

  wheel.style.background = buildWheelGradient();
  wheelLabels.innerHTML = "";
  wheelCategoryLabel.textContent = category.label;
  wheelCategoryHint.textContent = category.wheelHint;
  activeCategoryTitle.textContent = category.label;
  foodInput.placeholder = category.placeholder;

  if (!state.items.length) {
    wheelLabels.innerHTML = `<div class="empty-state">${category.emptyMessage}</div>`;
    return;
  }

  const slice = 360 / state.items.length;
  const radius = Math.max(wheel.getBoundingClientRect().width * 0.5, 280);

  state.items.forEach((name, index) => {
    const label = document.createElement("span");
    label.className = "wheel-label";
    label.dataset.index = String(index);
    label.style.setProperty("--angle", `${index * slice + slice / 2}deg`);
    label.style.setProperty("--radius", `${radius}px`);
    label.textContent = name;

    if (index === state.activeIndex) {
      label.classList.add("is-active");
    }

    wheelLabels.appendChild(label);
  });
}

function renderList() {
  const state = getCurrentState();
  itemCount.textContent = String(state.items.length);
  listCount.textContent = `${state.items.length} 条`;
  foodList.innerHTML = "";

  if (!state.items.length) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = getCurrentCategory().emptyMessage;
    foodList.appendChild(empty);
    spinButton.disabled = true;
    return;
  }

  spinButton.disabled = state.items.length < 2 || spinning;

  state.items.forEach((name, index) => {
    const row = document.createElement("li");
    row.className = `food-item${index === state.activeIndex ? " is-active" : ""}`;

    const label = document.createElement("span");
    label.textContent = `${index + 1}. ${name}`;

    const remove = document.createElement("button");
    remove.className = "delete-button";
    remove.type = "button";
    remove.textContent = "×";
    remove.title = `删除 ${name}`;
    remove.addEventListener("click", () => {
      removeItem(index);
    });

    row.append(label, remove);
    foodList.appendChild(row);
  });
}

function renderQuickChips() {
  const category = getCurrentCategory();
  quickChips.innerHTML = "";

  category.defaultItems.slice(0, 6).forEach((name) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.dataset.food = name;
    chip.textContent = name;
    chip.addEventListener("click", addQuickItem);
    quickChips.appendChild(chip);
  });
}

function syncWheelRotation() {
  wheel.style.transform = `rotate(${getCurrentState().rotation}deg)`;
}

function refreshUI() {
  saveStates();
  saveActiveCategory();
  renderCategorySwitcher();
  renderWheel();
  renderList();
  renderQuickChips();

  const state = getCurrentState();
  const category = getCurrentCategory();

  if (!state.items.length) {
    statusText.textContent = `${category.label}列表为空，先加几道再开始。`;
    resultText.textContent = "还没有结果";
  } else if (state.items.length === 1) {
    statusText.textContent = `只有 1 项，直接决定${category.label}吃 ${state.items[0]}。`;
    resultText.textContent = state.items[0];
  } else if (!spinning && state.lastResultIndex < 0) {
    statusText.textContent = `点击开始转盘，看看今天的${category.label}。`;
    resultText.textContent = "还没有结果";
  }
}

function setActiveIndex(index) {
  getCurrentState().activeIndex = index;
}

function addItem(rawValue) {
  const value = normalizeName(rawValue);

  if (!value) {
    statusText.textContent = "请输入一个名字。";
    return;
  }

  const state = getCurrentState();
  if (state.items.includes(value)) {
    statusText.textContent = `「${value}」已经在当前转盘里了。`;
    return;
  }

  state.items.unshift(value);
  state.lastResultIndex = -1;
  state.lastResultName = "";
  foodInput.value = "";
  setActiveIndex(-1);
  refreshUI();
  statusText.textContent = `已经添加「${value}」。`;
}

function removeItem(index) {
  const state = getCurrentState();

  if (spinning || index < 0 || index >= state.items.length) {
    return;
  }

  const removed = state.items.splice(index, 1)[0];
  const removedLastResult = state.lastResultIndex === index;

  if (removedLastResult) {
    state.lastResultIndex = -1;
    state.lastResultName = "";
  } else if (state.lastResultIndex > index) {
    state.lastResultIndex -= 1;
  }

  if (state.activeIndex === index) {
    setActiveIndex(-1);
  } else if (state.activeIndex > index) {
    setActiveIndex(state.activeIndex - 1);
  }

  if (removedLastResult) {
    resultText.textContent = "还没有结果";
  }

  refreshUI();
  statusText.textContent = `已删除「${removed}」。`;
}

function restoreCurrentDefaults() {
  states[currentCategoryId] = createDefaultState(currentCategoryId);
  spinning = false;
  wheel.style.transition = "none";
  syncWheelRotation();

  requestAnimationFrame(() => {
    wheel.style.transition = "transform 5.5s cubic-bezier(0.15, 0.82, 0.14, 1)";
  });

  refreshUI();
  statusText.textContent = `已恢复${getCurrentCategory().label}默认示例。`;
  resultText.textContent = "还没有结果";
}

function clearItems() {
  const state = getCurrentState();

  if (!state.items.length) {
    return;
  }

  state.items = [];
  state.activeIndex = -1;
  state.lastResultIndex = -1;
  state.lastResultName = "";
  spinning = false;
  state.rotation = 0;
  wheel.style.transition = "none";
  syncWheelRotation();
  refreshUI();
  resultText.textContent = "还没有结果";
  statusText.textContent = `已清空${getCurrentCategory().label}列表，继续添加新的内容吧。`;
}

function restoreAllDefaults() {
  CATEGORY_ORDER.forEach((categoryId) => {
    states[categoryId] = createDefaultState(categoryId);
  });

  spinning = false;
  wheel.style.transition = "none";
  syncWheelRotation();
  refreshUI();
  statusText.textContent = "已恢复全部转盘默认示例。";
  resultText.textContent = "还没有结果";
}

function spinWheel() {
  const state = getCurrentState();

  if (spinning || state.items.length === 0) {
    return;
  }

  if (state.items.length === 1) {
    state.lastResultIndex = 0;
    state.lastResultName = state.items[0];
    const review = getFoodReview(currentCategoryId, state.items[0], 0);
    resultText.textContent = state.items[0];
    statusText.textContent = `只有 1 项，直接决定${getCurrentCategory().label}吃 ${state.items[0]}。`;
    openResultModal(currentCategoryId, state.items[0], review, false);
    return;
  }

  spinning = true;
  spinButton.disabled = true;

  const selectedIndex = Math.floor(Math.random() * state.items.length);
  const slice = 360 / state.items.length;
  const centerAngle = selectedIndex * slice + slice / 2;
  const extraTurns = 5 + Math.floor(Math.random() * 3);
  const targetRotation = state.rotation + extraTurns * 360 + (360 - centerAngle);

  setActiveIndex(-1);
  state.lastResultIndex = -1;
  state.lastResultName = "";
  wheel.style.transition = "transform 5.5s cubic-bezier(0.15, 0.82, 0.14, 1)";
  wheel.style.transform = `rotate(${targetRotation}deg)`;
  state.rotation = targetRotation;
  statusText.textContent = `${getCurrentCategory().label}转盘正在旋转...`;
  resultText.textContent = "等待揭晓";

  const finish = () => {
    wheel.removeEventListener("transitionend", finish);
    spinning = false;
    const landedIndex = getLandingIndex(state.rotation, state.items.length);
    setActiveIndex(landedIndex);
    state.lastResultIndex = landedIndex;
    state.lastResultName = state.items[landedIndex];
    const landedName = state.items[landedIndex];
    const review = getFoodReview(currentCategoryId, landedName, landedIndex);
    refreshUI();
    resultText.textContent = landedName;
    statusText.textContent = `今天的${getCurrentCategory().label}是 ${landedName}。`;
    openResultModal(currentCategoryId, landedName, review, state.items.length > 1);
    spinButton.disabled = state.items.length < 2;
  };

  wheel.addEventListener("transitionend", finish);
}

function addQuickItem(event) {
  const button = event.target.closest(".chip");

  if (!button) {
    return;
  }

  addItem(button.dataset.food);
}

function applyCategoryTheme(categoryId) {
  const theme = categories[categoryId].theme;
  document.documentElement.style.setProperty("--accent", theme.accent);
  document.documentElement.style.setProperty("--accent-deep", theme.accentDeep);
  document.documentElement.style.setProperty("--accent-soft", theme.accentSoft);
}

function switchCategory(categoryId) {
  if (!CATEGORY_ORDER.includes(categoryId) || categoryId === currentCategoryId || spinning) {
    return;
  }

  currentCategoryId = categoryId;
  applyCategoryTheme(categoryId);
  syncWheelRotation();
  refreshUI();
}

function discardCurrentResultAndSpin() {
  const state = getCurrentState();

  if (spinning || state.lastResultIndex < 0 || state.lastResultIndex >= state.items.length) {
    return;
  }

  const categoryId = currentCategoryId;
  const removedName = state.lastResultName || state.items[state.lastResultIndex];
  closeResultModal();
  removeItem(state.lastResultIndex);

  state.lastResultIndex = -1;
  state.lastResultName = "";
  resultText.textContent = "已删除，准备重新转";

  if (state.items.length >= 2) {
    statusText.textContent = `已删除「${removedName}」，重新转一次。`;
    refreshUI();
    window.setTimeout(() => {
      if (!spinning && currentCategoryId === categoryId) {
        spinWheel();
      }
    }, 120);
  } else {
    refreshUI();
    statusText.textContent = `已删除「${removedName}」，当前转盘剩余太少，先继续加内容。`;
  }
}

function init() {
  applyCategoryTheme(currentCategoryId);
  wheel.style.background = buildWheelGradient();
  syncWheelRotation();
  refreshUI();

  addForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addItem(foodInput.value);
    foodInput.focus();
  });

  spinButton.addEventListener("click", spinWheel);
  restoreCurrentButton.addEventListener("click", restoreCurrentDefaults);
  restoreAllButton.addEventListener("click", restoreAllDefaults);
  clearButton.addEventListener("click", clearItems);
  resultModalDiscardButton.addEventListener("click", discardCurrentResultAndSpin);
  resultModalKeepButton.addEventListener("click", closeResultModal);
  resultModalClose.addEventListener("click", closeResultModal);
  resultModal.addEventListener("click", (event) => {
    if (event.target && event.target.hasAttribute("data-modal-close")) {
      closeResultModal();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !resultModal.hidden) {
      closeResultModal();
    }
  });

  window.addEventListener("resize", () => {
    renderWheel();
  });
}

init();
