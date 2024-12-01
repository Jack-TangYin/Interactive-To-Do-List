// DOM Elements
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const filterButtons = document.querySelectorAll(".filter-btn");

// Load Tasks from Local Storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Add Task
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false,
    priority: "Low", // Default priority
    dueDate: "", // Default due date
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  taskInput.value = ""; // Clear input
}

// Delete Task
function deleteTask(taskId) {
  tasks = tasks.filter(task => task.id !== taskId);
  saveTasks();
  renderTasks();
}

// Toggle Task Completion
function toggleTaskCompletion(taskId) {
  const task = tasks.find(task => task.id === taskId);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

// Edit Task
function editTask(taskId) {
  const task = tasks.find(task => task.id === taskId);
  if (task) {
    const newText = prompt("Edit your task:", task.text);
    if (newText !== null && newText.trim() !== "") {
      task.text = newText.trim();
      saveTasks();
      renderTasks();
    }
  }
}

// Set Task Priority
function setTaskPriority(taskId, priority) {
  const task = tasks.find(task => task.id === taskId);
  if (task) {
    task.priority = priority;
    saveTasks();
    renderTasks();
  }
}

// Set Task Due Date
function setTaskDueDate(taskId, dueDate) {
  const task = tasks.find(task => task.id === taskId);
  if (task) {
    task.dueDate = dueDate;
    saveTasks();
    renderTasks();
  }
}

// Clear All Tasks
function clearAllTasks() {
  if (confirm("Are you sure you want to clear all tasks?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
}

// Filter Tasks
function filterTasks(filter) {
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelector(`.filter-btn[data-filter="${filter}"]`).classList.add("active");

  renderTasks(filter);
}

// Render Tasks
function renderTasks(filter = "all") {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  filteredTasks.forEach(task => {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");
    if (task.completed) taskItem.classList.add("completed");

    // Priority Color Mapping
    const priorityColors = {
      High: "#ff6b6b",
      Medium: "#ffa500",
      Low: "#4caf50",
    };

    taskItem.innerHTML = `
      <span>${task.text}</span>
      <div class="task-meta">
        <span class="priority-indicator" style="background-color: ${
          priorityColors[task.priority]
        };"></span>
        <small>${task.dueDate || "No Due Date"}</small>
      </div>
      <div>
        <button class="btn edit-btn btn-primary" onclick="editTask(${task.id})"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
</svg></button>
        <button class="btn delete-btn" onclick="deleteTask(${task.id})"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
</svg></button>
        <button class="btn toggle-btn" onclick="toggleTaskCompletion(${task.id})">
        
        ${
      task.completed ? "Undo" : "Complete"
    }</button>
      </div>
    `;
    taskList.appendChild(taskItem);
  });
}

// Save Tasks to Local Storage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Event Listeners
addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});
filterButtons.forEach(btn =>
  btn.addEventListener("click", () => filterTasks(btn.getAttribute("data-filter")))
);

// Clear All Tasks Button
const clearAllBtn = document.createElement("button");
clearAllBtn.textContent = "Clear All Tasks";
clearAllBtn.classList.add("btn-clear");
clearAllBtn.addEventListener("click", clearAllTasks);
document.querySelector(".container").appendChild(clearAllBtn);

// Initial Render
renderTasks();
