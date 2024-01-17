"use strict";

const form = document.getElementById("form");
const incompletedTaskList = document.getElementById("incompleted-task-list");
const completedTaskList = document.getElementById("completed-task-list");

class ToDO {
  constructor() {
    this.incompletedTask =
      JSON.parse(localStorage.getItem("incompletedTask")) || [];
    this.completedTask =
      JSON.parse(localStorage.getItem("completedTask")) || [];
  }
  addTask(task) {
    // add to incompleted task
    this.incompletedTask.push(task);

    // create element
    const li = document.createElement("li");
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = task;
    label.appendChild(input);
    label.innerHTML += task;
    li.appendChild(label);

    // append to UI
    incompletedTaskList.appendChild(li);

    // data store in local storage
    localStorage.setItem(
      "incompletedTask",
      JSON.stringify(this.incompletedTask)
    );
  }
  moveToCompletedTask(task) {
    // create element
    const li = document.createElement("li");
    const span = document.createElement("span");
    const button = document.createElement("button");
    button.classList.add("delete-btn");
    button.innerHTML = "Delete";
    li.appendChild(span);
    li.appendChild(button);
    span.innerHTML = task;

    // append to UI
    completedTaskList.appendChild(li);

    // add to completed task
    this.completedTask.push(task);

    // remove from incompleted task
    this.incompletedTask = this.incompletedTask.filter(
      (value) => value != task
    );

    // update local storage incompleted task list
    localStorage.setItem(
      "incompletedTask",
      JSON.stringify(this.incompletedTask)
    );

    // update local storage completed task list
    localStorage.setItem("completedTask", JSON.stringify(this.completedTask));
  }
  removeTask(task) {
    // remove from completed task
    this.completedTask = this.completedTask.filter((value) => value != task);
    // update local storage completed task list
    localStorage.setItem("completedTask", JSON.stringify(this.completedTask));
  }
  intialDataLoad() {
    // load incompleted task
    incompletedTaskList.innerHTML = this.incompletedTask
      .map(
        (task) => `<li>
                      <label>
                        <input type="checkbox" value=${task} />
                        ${task}
                      </label>
                    </li>`
      )
      .join("");

    // load completed task
    completedTaskList.innerHTML = this.completedTask
      .map(
        (task) => `<li>
                      <span> ${task} </span>
                      <button class="delete-btn">Delete</button>
                    </li> `
      )
      .join("");
  }
}

// create todo object
const todo = new ToDO();

// after data load
document.addEventListener("DOMContentLoaded", todo.intialDataLoad());

// add task to incompleted task
form.addEventListener("submit", function (event) {
  //prevent dafault
  event.preventDefault();
  const formData = new FormData(event.target);
  const { task } = Object.fromEntries(formData.entries());
  if (!task) {
    return alert("Please insert a task.");
  } else {
    // check if task already exist
    const isExist = todo.incompletedTask.some(
      (value) => value.toLowerCase() === task.toLowerCase()
    );
    if (isExist) {
      return alert("Task already exist.");
    }

    todo.addTask(task.trim());
    event.target.reset();
  }
});

// move to completed task
incompletedTaskList.addEventListener("click", function (event) {
  const checkbox = event.target.type === "checkbox";
  if (checkbox) {
    const value = event.target.value;
    // add to completed task
    todo.moveToCompletedTask(value.trim());
    // remove from incompleted task
    event.target.parentElement.parentElement.remove();
  }
});

// remove completed task
completedTaskList.addEventListener("click", function (event) {
  const checkbox = event.target.classList.contains("delete-btn");
  if (checkbox) {
    const value = event.target.previousElementSibling.innerHTML.trim();
    // remove from completed task
    event.target.parentElement.remove();
    // remove from storage
    todo.removeTask(value);
  }
});
