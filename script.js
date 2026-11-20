// Taskly: To-Do List & Task Manager
// Tasks are saved in the browser using localStorage.

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const remainingCount = document.getElementById("remainingCount");
const clearCompletedButton = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasklyTasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasklyTasks", JSON.stringify(tasks));
}

function updateSummary() {
  const completed = tasks.filter(task => task.completed).length;
  totalCount.textContent = tasks.length;
  completedCount.textContent = completed;
  remainingCount.textContent = tasks.length - completed;
}

function renderTasks() {
  taskList.innerHTML = "";

  const visibleTasks = tasks.filter(task => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  visibleTasks.forEach(task => {
    const item = document.createElement("li");
    item.className = `task-item ${task.completed ? "completed" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark ${task.text} as completed`);
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editButton = document.createElement("button");
    editButton.className = "icon-btn";
    editButton.type = "button";
    editButton.textContent = "✎";
    editButton.title = "Edit task";
    editButton.setAttribute("aria-label", `Edit ${task.text}`);
    editButton.addEventListener("click", () => editTask(task.id));

    const deleteButton = document.createElement("button");
    deleteButton.className = "icon-btn delete";
    deleteButton.type = "button";
    deleteButton.textContent = "×";
    deleteButton.title = "Delete task";
    deleteButton.setAttribute("aria-label", `Delete ${task.text}`);
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    actions.append(editButton, deleteButton);
    item.append(checkbox, text, actions);
    taskList.appendChild(item);
  });

  emptyState.style.display = visibleTasks.length === 0 ? "block" : "none";
  updateSummary();
}

function addTask(text) {
  tasks.push({
    id: Date.now(),
    text: text,
    completed: false
  });
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function editTask(id) {
  const task = tasks.find(task => task.id === id);
  if (!task) return;

  const updatedText = prompt("Edit your task:", task.text);
  if (updatedText === null) return;

  const cleanText = updatedText.trim();
  if (cleanText === "") {
    alert("Task cannot be empty.");
    return;
  }

  tasks = tasks.map(task =>
    task.id === id ? { ...task, text: cleanText } : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

taskForm.addEventListener("submit", event => {
  event.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;
  addTask(text);
  taskInput.value = "";
  taskInput.focus();
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    renderTasks();
  });
});

clearCompletedButton.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

// Display today's date in the header.
const today = new Date();
document.getElementById("dayName").textContent =
  today.toLocaleDateString("en-IN", { weekday: "long" });
document.getElementById("todayDate").textContent =
  today.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

renderTasks();
