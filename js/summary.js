let tasksloaded = [];

/**
 * Function for load Tasks
 */
async function loadTasks() {
  try {
    const loadedTasks = await getItem("tasks");
    if (loadedTasks && loadedTasks.data && loadedTasks.data.value) {
      tasksloaded = JSON.parse(loadedTasks.data.value);
      rendertasksNumbers();
      renderTotalTasksNumber();
    } 
  } catch (error) {
    console.error("Loading error:", error);
  }
}

/**
 * Function for Rendering Numbers
 */

function rendertasksNumbers() {
  renderTasksNumber("todo", "task_todod_number");
  renderTasksNumber("task_in_progress", "task_progress_number");
  renderTasksNumber("task_await_feedback", "await_feedback_number");
  renderTasksNumber("task_done", "task_done_number");
  findUrgentTasks();
  greetUser();
}

/**
 * 
 * Rendering Task Numbers 
 */

function renderTasksNumber(position, elementId) {
  const tasksForPosition = tasksloaded.filter(
    (task) => task.position === position
  );
  const numberOfTasks = tasksForPosition.length;
  document.getElementById(elementId).innerHTML = numberOfTasks;
}

/**
 * Rendering Total Numbers
 */

function renderTotalTasksNumber() {
  const totalNumberOfTasks = tasksloaded.length;
  document.getElementById("task_board_number").innerHTML = totalNumberOfTasks;
}

function redirettoBoard () {
  window.location.href ="board.html";
}

function findUrgentTasks() {
  let urgentTasks = tasksloaded.filter(task => task.priority === 'urgent');
  let urgentTasksNumber = urgentTasks.length;

  document.getElementById("task_urgent_number").innerHTML = urgentTasksNumber;
}

function greetUser() {
  let currentUser = JSON.parse(localStorage.getItem('currentUser'));
  console.log(currentUser);
  document.getElementById('currentUser').innerHTML = currentUser.name;
}