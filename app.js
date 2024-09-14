document.addEventListener("DOMContentLoaded", () => {
  let tasks = [];

  // Function to simulate an asynchronous API call with a promise
  const simulateApiCall = (data) =>
    new Promise((resolve) => setTimeout(() => resolve(data), 1000));

  // Function to create a new task element
  const createTaskElement = (task) => {
    const li = document.createElement("li");
    li.classList.add("task-item");
    li.classList.add(`${task.priority}-priority`);
    li.dataset.id = task.id;
    if (task.completed) li.classList.add("completed");

    const span = document.createElement("span");
    span.textContent = task.text;
    li.appendChild(span);

    const editBtn = document.createElement("button");
    editBtn.textContent = "✎";
    editBtn.classList.add("edit-btn");
    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const newText = prompt("Edit task:", task.text);
      if (newText) {
        task.text = newText;
        span.textContent = newText;
        saveTasksToLocalStorage();
      }
    });
    li.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✖";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      li.remove();
      tasks = tasks.filter((t) => t.id !== task.id);
      saveTasksToLocalStorage();
    });
    li.appendChild(deleteBtn);

    li.addEventListener("click", () => {
      li.classList.toggle("completed");
      task.completed = li.classList.contains("completed");
      saveTasksToLocalStorage();
    });

    return li;
  };

  // Function to add a new task
  const addTask = () => {
    const taskInput = document.getElementById("task-input");
    const prioritySelect = document.getElementById("priority-select");
    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;

    if (taskText) {
      const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        priority,
      };
      tasks.push(newTask);
      simulateApiCall(newTask).then((task) => {
        const taskElement = createTaskElement(task);
        document.getElementById("task-list").appendChild(taskElement);
        taskInput.value = "";
        saveTasksToLocalStorage();
      });
    }
  };

  // Function to save tasks to local storage
  const saveTasksToLocalStorage = () =>
    localStorage.setItem("tasks", JSON.stringify(tasks));

  // Function to load tasks from local storage
  const loadTasksFromLocalStorage = () => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = savedTasks;
    return savedTasks;
  };

  // Function to initialize tasks from local storage
  const initializeTasks = () => {
    const savedTasks = loadTasksFromLocalStorage();
    savedTasks.forEach((task) => {
      const taskElement = createTaskElement(task);
      document.getElementById("task-list").appendChild(taskElement);
    });
  };

  // Function to filter tasks based on status
  const filterTasks = (status) => {
    const taskItems = document.querySelectorAll("#task-list .task-item");
    taskItems.forEach((item) => {
      if (status === "all") {
        item.style.display = "";
      } else if (status === "completed") {
        item.style.display = item.classList.contains("completed") ? "" : "none";
      } else if (status === "pending") {
        item.style.display = !item.classList.contains("completed")
          ? ""
          : "none";
      }
    });
  };

  // Function to sort tasks based on the order
  const sortTasks = (order) => {
    const taskList = document.getElementById("task-list");
    const taskItems = Array.from(taskList.querySelectorAll(".task-item"));

    taskItems.sort((a, b) => {
      const aId = parseInt(a.dataset.id, 10);
      const bId = parseInt(b.dataset.id, 10);

      if (order === "asc") {
        return aId - bId;
      } else {
        return bId - aId;
      }
    });

    taskList.innerHTML = "";
    taskItems.forEach((item) => taskList.appendChild(item));
  };

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    document.body.classList.toggle("dark-mode");
  };

  // Event listener for Add Task button
  document.getElementById("add-task-btn").addEventListener("click", addTask);

  // Event listener for Enter key to add tasks
  document
    .getElementById("task-input")
    .addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        addTask();
      }
    });

  // Event listener for filter buttons
  document
    .getElementById("filter-all")
    .addEventListener("click", () => filterTasks("all"));
  document
    .getElementById("filter-completed")
    .addEventListener("click", () => filterTasks("completed"));
  document
    .getElementById("filter-pending")
    .addEventListener("click", () => filterTasks("pending"));

  // Event listener for sort buttons
  document
    .getElementById("sort-asc")
    .addEventListener("click", () => sortTasks("asc"));
  document
    .getElementById("sort-desc")
    .addEventListener("click", () => sortTasks("desc"));

  // Event listener for dark mode toggle
  document
    .getElementById("dark-mode-toggle")
    .addEventListener("click", toggleDarkMode);

  // Initialize tasks on page load
  initializeTasks();
});
