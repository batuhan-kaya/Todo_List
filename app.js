const todoInput = document.querySelector(".todo__input"),
  form = document.getElementById("todoForm"),
  addButton = document.querySelector(".todo__button"),
  container = document.querySelector(".todo__container"),
  clearButton = document.querySelector(".all__delete");

eventListeners();

function eventListeners() {
  // Tüm event listenerlar
  addButton.addEventListener("click", addTodo);
  document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
  container.addEventListener("click", deleteTodo);
  clearButton.addEventListener("click", clearAllTodos);
}

function clearAllTodos(e) {
  Swal.fire({
    title: "Are you sure?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete all!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Deleted!", "All todos have been deleted...", "success");
      // container.innerHTML = ""; // bu yavaş yöntem
      while (container.firstElementChild != null) {
        container.removeChild(container.firstElementChild);
        localStorage.removeItem("todos");
      }
    }
    // null olana kadar tüm elementleri silme
  });
  e.preventDefault();
}

function todoControl(newTodo) {
  if (getTodosFromStorage().indexOf(newTodo) === -1) {
    return false;
  }
  return true;
}

function addTodo(e) {
  const newTodo = todoInput.value.trim();

  if (newTodo === "") {
    showAlert("danger", "Please enter a To-do");
  } else if (todoControl(newTodo)) {
    showAlert("warning", "Such a todo already exists!");
  } else {
    addTodoToUI(newTodo);
    addTodoToStorage(newTodo);
    showAlert("success", "To-do added successfully.");
  }
  e.preventDefault();
}

// LocalStorage
function loadAllTodosToUI() {
  let todos = getTodosFromStorage();

  todos.forEach(function (todo) {
    addTodoToUI(todo);
  });
}

function getTodosFromStorage() {
  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  return todos;
}

function addTodoToStorage(newTodo) {
  let todos = getTodosFromStorage();

  todos.push(newTodo);

  localStorage.setItem("todos", JSON.stringify(todos));
}

function showAlert(type, message) {
  const alert = document.createElement("span");

  alert.className = `alerts ${type}`;

  alert.textContent = message;

  form.appendChild(alert);

  setTimeout(function () {
    alert.remove();
  }, 2000);
}

function deleteTodo(e) {
  // console.log(e.target); ile click yapılacak yer belirlenebilir.
  if (e.target.className === "trash") {
    e.target.parentElement.parentElement.remove();
    deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
    showAlert("success", "Todo Deleted.");
  }
}

function deleteTodoFromStorage(deleteTodo) {
  let todos = getTodosFromStorage();

  todos.forEach(function (todo, index) {
    if (todo === deleteTodo) {
      todos.splice(index, 1); //Arrayden değer silebiliriz.
    }
  });
  localStorage.setItem("todos", JSON.stringify(todos));
}

// UI
function addTodoToUI(newTodo) {
  const listItem = document.createElement("div");
  const todoCheckBox = document.createElement("input");
  const todoText = document.createElement("li");
  const todoIcons = document.createElement("div");

  // <div class="todos animate__animated animate__flipInX">
  // 					<input type="checkbox" />
  // 					<li>Lorem, ipsum dolor.</li>
  // 					<div class="todos__icon">
  // 						<img src="./icon/trash.png" alt="" />
  // 					</div>
  // 				</div>

  todoCheckBox.type = "checkbox";
  todoCheckBox.className = "todos__checkbox";
  listItem.className = "todos animate__animated animate__flipInX";
  todoIcons.className = "todos__icon";
  todoIcons.innerHTML = "<img src='./icon/trash.png' class='trash' />";

  todoText.appendChild(document.createTextNode(newTodo));
  listItem.appendChild(todoCheckBox);
  listItem.appendChild(todoText);
  listItem.appendChild(todoIcons);

  container.appendChild(listItem);

  todoInput.value = "";
}
