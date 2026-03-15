let arrTodo = [];
let searchQuery = '';

let listTodo;
let totalTask;
let messageTodo;
let newTaskForm;
let newTaskInput;
let searchTaskForm;
let searchTaskInput;
let buttonDeleteAll;

const saveLocalStorage = () => {
  localStorage.setItem('tasks', JSON.stringify(arrTodo));
}

const addTask = (text) => {
  const newTask = {
    id: Date.now(),
    text: text,
    completed: false
  }
  arrTodo.push(newTask);
  saveLocalStorage();
  renderTasks();
}

const deleteTask = (id) => {
  arrTodo = arrTodo.filter(task => task.id !== id);
  saveLocalStorage();
  renderTasks();
}

const toggleTask = (id) => {
  arrTodo = arrTodo.map(task => {
    if (task.id === id) {
      return {
        ...task,
        completed: !task.completed
      };
    }
    return task;
  });
  
  saveLocalStorage();
  renderTasks();
}

const deleteAllTask = (item) => {
  arrTodo = [];
  saveLocalStorage();
  renderTasks();
}

const renderTasks = () => {
  if(!listTodo) return;
  listTodo.innerHTML = '';
  
  if (buttonDeleteAll) {
    if (arrTodo.length > 0) {
      buttonDeleteAll.classList.add('is-visible');
    } else {
      buttonDeleteAll.classList.remove('is-visible');
    }
  }

  let filteredTasks;
  if (searchQuery === '') {
    filteredTasks = arrTodo;
  } else {
    filteredTasks = arrTodo.filter(task => 
      task.text.toLowerCase().includes(searchQuery)
    );
  }

  totalTask.textContent = arrTodo.length;

  if (filteredTasks.length === 0) {
    if (arrTodo.length === 0) {
      messageTodo.textContent = 'There are no tasks yet';
    } else {
      messageTodo.textContent = 'No tasks found';
    }
    return;
  }

  messageTodo.textContent = '';

  filteredTasks.forEach((item) => {
    let li = document.createElement('li');
    li.classList.add('todo-item');
    li.dataset.id = item.id;
    
    let checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.classList.add('todo-item__checkbox');
    if (item.completed) {
      checkbox.checked = true;
    }

    let span = document.createElement('span');
    span.classList.add('todo-item__label');
    span.textContent = item.text;

    let buttonDelete = document.createElement('button');
    buttonDelete.classList.add('todo-item__delete-button');
    buttonDelete.textContent = '✕';

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(buttonDelete);
    listTodo.appendChild(li);
  });
}

//ИНИЦИАЛИЗАЦИЯ
const initApp = () => {
  listTodo = document.querySelector('[data-js-todo-list]');
  totalTask = document.querySelector('[data-js-todo-total-tasks]');
  messageTodo = document.querySelector('[data-js-todo-empty-message]');
  newTaskForm = document.querySelector('[data-js-todo-new-task-form]');
  newTaskInput = document.querySelector('[data-js-todo-new-task-input]');
  searchTaskForm = document.querySelector('[data-js-todo-search-task-form]');
  searchTaskInput = document.querySelector('[data-js-todo-search-task-input]');
  buttonDeleteAll = document.querySelector('[data-js-todo-delete-all-button]');

  newTaskForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const taskText = newTaskInput.value.trim();
    if(taskText === '') return;

    addTask(taskText);

    newTaskInput.value = '';
    newTaskInput.focus()
  })

  searchTaskInput.addEventListener('input', (event) => {
    searchQuery = event.target.value.trim().toLowerCase();
    renderTasks();
  })

  buttonDeleteAll.addEventListener('click', (deleteAllTask));

  listTodo.addEventListener('click', (event) => {
    let target = event.target;
    let deleteButton = target.closest('.todo-item__delete-button');
    
    if(deleteButton) {
      let taskItem = deleteButton.closest('.todo-item')
      if(taskItem) {
        let taskId = Number(taskItem.dataset.id);
        deleteTask(taskId);
      }
      return;
    }

    let checkbox = target.closest('.todo-item__checkbox');

    if(checkbox) {
      let taskItem = checkbox.closest('.todo-item')
      if(taskItem) {
        let taskId = Number(taskItem.dataset.id);
        toggleTask(taskId)
      }
    }
  })
  
  const savedTasks = localStorage.getItem('tasks');
  if(savedTasks) {
    arrTodo = JSON.parse(savedTasks);
  }
  renderTasks();
}

document.addEventListener('DOMContentLoaded', initApp);