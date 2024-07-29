window.onload = function () {
  includeHTML();
  clearAllInputs();
  getUserLists();
  loadContactList();
  checkInputs();
};

let priorityValue = "";
let kindValue = "";
let kindColor = "";
let selectionState = {};
let contacts = [];
let collaborators = [];
let subtaskArr = [];
let titleInput = document.getElementById("add-title");
let titleError = document.getElementById("title-error");
let textarea = document.getElementById("textarea-task");
let dateInput = document.getElementById("due-date");
let dateError = document.getElementById("date-error");
let createTaskBtn = document.getElementById("add-task-btn");
let clearTaskBtn = document.getElementById("clear-task-btn");
let selectBox = document.querySelector(".select-box");
let selectOption = document.querySelector(".select-option");
let selectValue = document.getElementById("select-value");
let optionSearch = document.getElementById("option-search");
let optionList = document.querySelectorAll(".option li");
let dropDownArrowCat = document.querySelector(".drop-down-arrow-cat");
let selectBoxCategory = document.querySelector(".select-box-category");
let selectCategoryOption = document.getElementById("select-category");
let categoryList = document.getElementById("category-list");
let changedInput = document.getElementById("change-to-focus");
let generatedContatcs = document.getElementById('hide-box');
let generateList = document.getElementById('generate-list');
let inputField = document.getElementById('subtask-input-field');




/**
 * Asynchronously retrieves user data and initializes the application's user-specific information.
 * Fetches user data based on `USER_ID`, sets user initials, and loads the user's contacts and tasks.
 * Updates the UI with the loaded contact list.
 *
 * @async
 * @function
 * @returns {Promise<void>} - A promise that resolves when the user data has been successfully fetched and processed.
 * @throws {Error} - Throws an error if the user data retrieval fails, which is logged to the console.
 */
async function getUserLists() {
  try {
    CURRENT_USER_DATA = await getUserData(USER_ID);
    setUserInitals();
    contacts = CURRENT_USER_DATA.contacts || [];
    tasks = CURRENT_USER_DATA.tasks || [];
    loadContactList();
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}
    
/**
 * Clears all input fields, UI elements, and internal states to reset the form or application state.
 * This function performs a complete reset by calling helper functions to handle inputs, UI, and application states.
 *
 * @function
 * @returns {void}
 */
function clearAllInputs() {
  resetInputFields();
  resetUIElements();
  clearAllStates();
}

/**
 * Resets all form input fields to their default values.
 * This function clears the values of input fields, text areas, and selects default options for dropdowns.
 *
 * @function
 * @returns {void}
 */
function resetInputFields() {
  titleInput.value = "";
  textarea.value = "";
  dateInput.value = "";
  selectValue.value = "Select contacts to assign";
  optionSearch.value = "";
  selectCategoryOption.querySelector("input").value = "Select Category";
}


/**
 * Resets UI elements to their default state.
 * This function hides or resets various UI elements such as dropdowns, error messages, and styling.
 *
 * @function
 * @returns {void}
 */
function resetUIElements() {
  selectBox.classList.remove("active-task");
  categoryList.style.display = "none";
  dropDownArrowCat.style.transform = "rotate(0deg)";
  optionList.forEach((li) => (li.style.display = ""));
  titleError.style.display = "none";
  dateError.style.display = "none";
  titleInput.style.borderBottomColor = "";
  dateInput.style.borderBottomColor = "";
}


/**
 * Clears all internal states related to the form or application.
 * This function resets application states such as subtasks, priorities, collaborators, and selected contacts.
 * It also triggers re-rendering of subtasks and contact lists.
 *
 * @function
 * @returns {void}
 */
function clearAllStates() {
  subtaskArr = [];
  resetPriorityButtons();
  clearCollaborators();
  clearSelectedContacts();
  renderSubtasks();
  loadContactList();
}

/**
 * Resets the priority buttons by removing the "selected-btn" class from all buttons and their associated images.
 * This function is used to clear any visual selection state on the priority buttons, ensuring that none are marked as selected.
 *
 * @function
 * @returns {void}
 */
function resetPriorityButtons() {
  document.querySelectorAll(".buttons button").forEach((btn) => {
    btn.classList.remove("selected-btn");
    btn.querySelector(".button-img").classList.remove("selected-btn");
  });
}

/**
 * Validates the form inputs and enables or disables the task creation button accordingly.
 * This function checks if the title and date input fields are not empty and updates the `createTaskBtn` button's
 * disabled state based on the validity of these inputs.
 *
 * @function
 * @returns {void}
 */
function checkInputs() {
  let isTitleValid = titleInput.value.trim() !== "";
  let isDateValid = dateInput.value.trim() !== "";
  createTaskBtn.disabled = !(isTitleValid && isDateValid);
}
  
/**
 * Disables the task creation button by setting its `disabled` property to `true`.
 * This function is used to prevent user interaction with the button, typically when certain conditions are not met.
 *
 * @function
 * @returns {void}
 */
function disableButton() {
  createTaskBtn.disabled = true;
}

/**
 * Selects a priority button and updates its visual state. Only one priority can be selected at a time.
 * This function manages the selection state of priority buttons, ensuring only the chosen button is marked as selected.
 * If the button is already selected, it will be deselected.
 *
 * @function
 * @param {string} priority - The priority level to select, represented as a string. The string should match the ID of the button element.
 * @returns {void}
 */
function selectPriority(priority) {
  
  let selectedButton = document.getElementById(priority.toLowerCase());
  let isSelected = selectedButton.classList.contains("selected-btn");
  document.querySelectorAll(".buttons button").forEach((btn) => {
    btn.classList.remove("selected-btn");
    btn.querySelector(".button-img").classList.remove("selected-btn");
  });
  if (!isSelected) {
    selectedButton.classList.add("selected-btn");
    selectedButton.querySelector(".button-img").classList.add("selected-btn");
    priorityValue = priority;
  } else {
    
    priorityValue = null;
  }
}
  
/**
 * Clears the list of collaborators and resets the selection state.
 * This function empties the `collaborators` array, clears the `selectionState` object,
 * and updates the UI to reflect the cleared collaborator list.
 *
 * @function
 * @returns {void}
 */
function clearCollaborators() {
  collaborators = [];
  selectionState = {};
  renderCollaborators();
}

/**
 * Initializes event handlers for the subtask input field and sets focus on it.
 * This function focuses on the input field, adds event listeners for the `blur` and `keypress` events,
 * and also sets up a document-wide click event listener to handle clicks outside the input field.
 *
 * @function
 * @returns {void}
 */
function handleInputFocusAndEvents() {
  
  let inputField = document.getElementById('subtask-input-field');
  inputField.focus();
  inputField.addEventListener('blur', function () {
    addSubtaskList();
  });
  inputField.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault(); 
      addSubtaskList();
    }
  });
  document.addEventListener('click', handleClickOutside, true);
}

/**
 * Updates the content of the subtask input field and sets up event handlers for it.
 * This function replaces the inner HTML of the element with the ID `input-subtask-add` with the HTML
 * for the subtask input field and then initializes event handlers and focus management for the input field.
 *
 * @function
 * @returns {void}
 */
function changeToFocus() {
  
  let changedInput = document.getElementById('input-subtask-add');
  changedInput.innerHTML = getSubtaskInputHTML();
  handleInputFocusAndEvents();
}

/**
 * Adds a new subtask to the list and updates the UI.
 * This function retrieves the value from the subtask input field, creates a new subtask object if the input is not empty,
 * assigns a unique ID, and adds it to the `subtaskArr` array. After adding the subtask, it clears the input field
 * and calls `renderSubtasks` to update the display. If the input is empty, it calls `clearInputSubtask` to handle the empty case.
 *
 * @function
 * @returns {void}
 */
function addSubtaskList() {
  
  let subtaskInput = document.getElementById('subtask-input-field').value;
  if (subtaskInput.trim() !== "") {
    let uniqueId = Number(Date.now().toString());
    let newSubtask = {
      name: subtaskInput,
      id: uniqueId,
      state: 'open'
    };
    subtaskArr.push(newSubtask);
    document.getElementById('subtask-input-field').value = "";
    renderSubtasks();
  } else {
    
    clearInputSubtask();
  }
}

/**
 * Handles clicks outside of the subtask input field to clear the input and remove the click event listener.
 * This function checks if the click event occurred outside the element with the ID `subtask-input-wrapper`.
 * If so, it clears the subtask input field and removes the document-wide click event listener that invoked this function.
 *
 * @function
 * @param {Event} event - The click event object representing the user's click action.
 * @returns {void}
 */
function handleClickOutside(event) {
  
  let inputWrapper = document.getElementById('subtask-input-wrapper');
  if (inputWrapper && !inputWrapper.contains(event.target)) {
    clearInputSubtask();
    document.removeEventListener('click', handleClickOutside, true);
  }
}

/**
 * Reveals the icons inside the element that triggered the event.
 * This function is intended to be used as an event handler for mouse enter events.
 * It locates the child element with the class `subtask-add-icons` and removes
 * the `d-none` class to make it visible.
 *
 * @function
 * @param {Event} event - The mouse enter event object, representing the user's interaction.
 * @returns {void}
 */
function showIcons(event) {
  
  let icons = event.currentTarget.querySelector(".subtask-add-icons");
  if (icons) {
    icons.classList.remove("d-none");
  }
}
  
  
  

/**
 * Hides the icons inside the element that triggered the event.
 * This function is intended to be used as an event handler for mouse leave events.
 * It locates the child element with the class `subtask-add-icons` and adds
 * the `d-none` class to hide it from view.
 *
 * @function
 * @param {Event} event - The mouse leave event object, representing the user's interaction.
 * @returns {void}
 */
function hideIcons(event) {
  
  let icons = event.currentTarget.querySelector(".subtask-add-icons");
  if (icons) {
    icons.classList.add("d-none");
  }
}

/**
 * Adds mouse hover event listeners to elements with the class `input-positioning-subtask`.
 * The event listeners handle showing and hiding icons based on mouse interactions.
 * - On `mouseenter`, the `showIcons` function is called to display the icons.
 * - On `mouseleave`, the `hideIcons` function is called to hide the icons.
 *
 * @function
 * @returns {void}
 */
function addHoverEventListeners() {
  
  let taskDivs = document.querySelectorAll(".input-positioning-subtask");
    taskDivs.forEach(function (taskDiv) {
    taskDiv.addEventListener("mouseenter", showIcons);
    taskDiv.addEventListener("mouseleave", hideIcons);
  });
}

/**
 * Adds event listeners to the subtask input field associated with the given task.
 * Specifically, it attaches a `dblclick` event listener to the subtask input field for the provided task ID.
 * When a double-click event occurs on the input field, the `editSubtask` function is called with the task ID.
 *
 * @function
 * @param {Object} task - The task object for which the subtask input field event listener is being added.
 * @param {number} task.id - The unique identifier for the task, used to target the specific subtask input field.
 * @returns {void}
 */
function addSubtaskEventListeners(task) {
  
  document.getElementById(`subtask-input-field-sub-${task.id}`).addEventListener('dblclick', function () {
    editSubtask(task.id);
  });
}

/**
 * Renders the list of subtasks and updates the DOM with the current subtask data.
 * This function clears the existing subtask elements in the `added-subtask` container,
 * iterates through the `subtaskArr` array, generates HTML for each subtask, and appends it to the container.
 * It also adds event listeners to each subtask and updates hover effects.
 *
 * @function
 * @returns {void}
 */
function renderSubtasks() {
  
  let addedSubtask = document.getElementById('added-subtask');
  addedSubtask.innerHTML = "";
  for (let i = 0; i < subtaskArr.length; i++) {
    let task = subtaskArr[i];

    addedSubtask.innerHTML += `
      <div class="input-positioning-subtask" id="input-positioning-${String(task.id)}">
        <input class="subtask-css-input" id="subtask-input-field-sub-${String(task.id)}" type="text" value="${task.name}" readonly />
        <div class="center-flexbox">
          <div class="subtask-add-icons d-none" id="d-none-${String(task.id)}">
            <div class="icons-subtask center-flexbox"><img src="../assets/img/bin.svg" onclick="removeSubtask(${String(task.id)})"></div>
            <div class="separator-subtask"></div>
            <div class="icons-subtask center-flexbox"><img src="../assets/img/subtask_save.svg"></div>
          </div>
        </div>
      </div>
    `;

    document.getElementById(`subtask-input-field-sub-${String(task.id)}`).addEventListener('dblclick', function () {
      editSubtask(String(task.id));
    });
  }
  addHoverEventListeners();
}


/**
 * Enables editing mode for a subtask with the specified ID.
 * This function locates the subtask element, input field, and icon elements based on the provided ID.
 * It then makes the subtask editable and sets up the necessary input events for user interactions.
 *
 * @function
 * @param {number} id - The unique identifier of the subtask to be edited.
 * @returns {void}
 */
function editSubtask(id) {

  let subTaskDiv = document.getElementById('input-positioning-' + id);
  let inputField = document.getElementById(`subtask-input-field-sub-${id}`);
  let showIcons = document.getElementById('d-none-' + id);
  makeEditable(subTaskDiv, showIcons, inputField);
  setupInputEvents(id, inputField);
}


/**
 * Configures the provided subtask element to be editable.
 * This function sets the subtask element to an editable state by adding a CSS class,
 * showing the icons associated with the subtask, and making the input field interactive.
 * It also focuses the input field to allow immediate user input.
 *
 * @function
 * @param {HTMLElement} subTaskDiv - The container element for the subtask to be made editable.
 * @param {HTMLElement} showIcons - The element containing icons related to the subtask, which should be made visible.
 * @param {HTMLElement} inputField - The input field element that will be used for editing the subtask.
 * @returns {void}
 */
function makeEditable(subTaskDiv, showIcons, inputField) {
  
  subTaskDiv.classList.add('editable');
  showIcons.classList.remove('d-none');
  inputField.removeAttribute('readonly');
  inputField.focus();
}

/**
 * Sets up event listeners for the provided input field associated with a subtask.
 * This function adds a `blur` event listener to handle when the input field loses focus,
 * and a `keypress` event listener to handle user keypresses, such as the Enter key.
 *
 * @function
 * @param {number} id - The unique identifier of the subtask, used to identify which subtask is being edited.
 * @param {HTMLElement} inputField - The input field element where subtask editing occurs.
 * @returns {void}
 */
function setupInputEvents(id, inputField) {
  
  inputField.addEventListener('blur', function () {
    handleBlurEvent(id, inputField);
  });
  inputField.addEventListener('keypress', function (event) {
    handleKeyPressEvent(event, inputField);
  });
}
  
/**
 * Handles the blur event for an input field by updating the subtask with the new value.
 * When the input field loses focus, this function attempts to update the subtask with the provided ID.
 * If an error occurs during the update, an alert is displayed with the error message, and the input field is refocused.
 *
 * @function
 * @param {number} id - The unique identifier of the subtask being updated.
 * @param {HTMLElement} inputField - The input field element containing the new value for the subtask.
 * @returns {void}
 * @throws {Error} If an error occurs during the update process, an alert is shown and the input field is refocused.
 */
function handleBlurEvent(id, inputField) {
  try {
   updateSubtask(id, inputField.value);
  } catch (error) {
    alert(error.message);
    inputField.focus();
  }
}

/**
 * Handles the keypress event for an input field by checking for the Enter key.
 * If the Enter key is pressed, this function triggers a blur event on the input field,
 * which typically causes the input field to lose focus and any associated blur event handlers to execute.
 *
 * @function
 * @param {KeyboardEvent} event - The keypress event triggered by the user.
 * @param {HTMLElement} inputField - The input field element that is being monitored for keypress events.
 * @returns {void}
 */
function handleKeyPressEvent(event, inputField) {
  
  if (event.key === 'Enter') {
   inputField.blur();
  }
}

/**
 * Updates the value of a subtask identified by the given ID.
 * This function trims the input value, removes any leading bullet points, 
 * and then updates or removes the subtask using the `findAndUpdateOrRemoveSubtask` function.
 * After updating, it re-renders the list of subtasks to reflect the changes.
 *
 * @function
 * @param {number} id - The unique identifier of the subtask to be updated.
 * @param {string} newValue - The new value to set for the subtask, which is trimmed and formatted.
 * @returns {void}
 */
function updateSubtask(id, newValue) {
  
  newValue = newValue.trim();
  let bulletPattern = /^•\s*/;
   if (bulletPattern.test(newValue)) {
    newValue = newValue.replace(bulletPattern, '');
   }
  findAndUpdateOrRemoveSubtask(id, newValue);
  renderSubtasks();
}

/**
 * Finds a subtask by its ID and either updates its name or removes it from the list.
 * If the `newValue` is an empty string, the subtask with the matching ID is removed from the `subtaskArr` array.
 * Otherwise, the subtask's name is updated with the provided `newValue`.
 *
 * @function
 * @param {number} id - The unique identifier of the subtask to be updated or removed.
 * @param {string} newValue - The new value to set for the subtask. If an empty string is provided, the subtask is removed.
 * @returns {void}
 */
function findAndUpdateOrRemoveSubtask(id, newValue) {
  if (newValue === "") {
    for (let i = 0; i < subtaskArr.length; i++) {
      if (subtaskArr[i].id === id) {
        subtaskArr.splice(i, 1);
        break;
      }
    }
  } else {
    for (let i = 0; i < subtaskArr.length; i++) {
      if (subtaskArr[i].id === id) {
        subtaskArr[i].name = newValue;
        break;
      }
    }
  }
}

/**
 * Removes a subtask from the list based on its unique identifier.
 * This function filters out the subtask with the specified `id` from the `subtaskArr` array
 * and then re-renders the list of subtasks to reflect the removal.
 *
 * @function
 * @param {number} id - The unique identifier of the subtask to be removed.
 * @returns {void}
 */
function removeSubtask(id) {
  
  subtaskArr = subtaskArr.filter(task => task.id !== id);
  renderSubtasks();
}


/**
 * Clears the value of the subtask input field.
 * This function sets the value of the input field with the ID 'subtask-input-field' to an empty string,
 * effectively clearing any text entered by the user.
 *
 * @function
 * @returns {void}
 */
function clearInputSubtask() {
  document.getElementById('subtask-input-field').value = '';
}

/**
 * Toggles the visibility of the category list and rotates the dropdown arrow.
 * This function checks the current display style of the category list. If it is set to "block",
 * it hides the list and resets the arrow rotation. If it is set to "none", it shows the list
 * and rotates the arrow to indicate the expanded state.
 *
 * @function
 * @returns {void}
 */
function toggleCategoryList() {
  if (categoryList.style.display === "block") {
    categoryList.style.display = "none";
    dropDownArrowCat.style.transform = "rotate(0deg)";
  } else {
    categoryList.style.display = "block";
    dropDownArrowCat.style.transform = "rotate(180deg)";
  }
}

/**
 * Extracts the first letter from a given name and converts it to uppercase.
 * This function takes a string representing a name, extracts the first character, and
 * returns it in uppercase format. It is useful for generating initials or displaying the 
 * first letter of a name.
 *
 * @function
 * @param {string} name - The name from which to extract the first letter.
 * @returns {string} The uppercase first letter of the provided name.
 */
function getFirstLetterOfName(name) {
  name = name.slice(0, 1);
  return name.toUpperCase();
}


/**
 * Adds a new task to the `tasks` array with the current input values and properties.
 * This function creates a new task object with various attributes including an ID, date,
 * title, kind, color, description, category, priority, collaborators, and subtasks.
 * The new task is then appended to the `tasks` array.
 *
 * @function
 * @returns {void}
 */
function pushTaskToTasks() {
  // Add a new task object to the tasks array
  tasks.push({
    id: Date.now().toString(),           
    date: dateInput.value,    
    title: titleInput.value,   
    kind: kindValue,                   
    taskColor: kindColor,          
    description: textarea.value,  
    category: "toDo",             
    priority: priorityValue,   
    collaborators: collaborators,      
    subtask: subtaskArr,                
  });
}


/**
 * Sets the task kind and its associated color based on the provided kind identifier.
 * This function updates the `kindValue` and `kindColor` variables according to the kind identifier.
 * The function supports specific kinds of tasks such as "Technical task" and "User Story", each with a unique color.
 *
 * @function
 * @param {string} kind - The identifier for the kind of task. Can be "TT" for Technical task or "US" for User Story.
 * @returns {void}
 */
function setTaskKind(kind) {
  
  if (kind === "TT") {
    kindColor = "#0038FF";
    kindValue = "Technical task";
  }
  if (kind === "US") {
    kindColor = "#FF7A00";
    kindValue = "User Story";
  }
}

/**
 * Clears the current task kind settings by resetting `kindColor` and `kindValue`.
 * This function is used to remove any previously set kind and its associated color, 
 * effectively resetting these properties to their default empty values.
 *
 * @function
 * @returns {void}
 */
function clearTaskKind() {
  kindColor = "";   // Reset the color associated with the task kind
  kindValue = "";   // Reset the description of the task kind
}

/**
 * Handles the task creation process when a form is submitted.
 * This function prevents the default form submission, adds the new task to the `tasks` array,
 * updates the user data with the new task list, disables the task creation button, and clears
 * all input fields after a short delay. Additionally, it triggers an animation to indicate the
 * successful creation of the task.
 *
 * @function
 * @param {Event} event - The event object representing the form submission event.
 * @returns {void}
 */
function createTask(event) {
  event.preventDefault(); 
  pushTaskToTasks();       
  updateUser(
    CURRENT_USER_DATA.name,    
    CURRENT_USER_DATA.email,   
    CURRENT_USER_DATA.password,
    CURRENT_USER_DATA.contacts,
    tasks                     
  );
  disableButton();           
  setTimeout(() => {
    clearAllInputs();       
  }, 0);
  showAnimation();          
}


/**
 * Displays an animation to indicate a successful task creation.
 * This function makes an animation element visible, triggers a CSS animation by adding a class,
 * then hides the animation element and redirects the user to the 'board.html' page.
 *
 * The animation is displayed by setting its `display` style to `flex`, and the CSS class `show`
 * is added to trigger the animation effect. After a short delay, the class is removed, and the
 * element is hidden again. Finally, the user is redirected to the 'board.html' page.
 *
 * @function
 * @returns {void}
 */
function showAnimation() {
  let animationDiv = document.getElementById('added-animation');  
  animationDiv.style.display = 'flex';                            
  setTimeout(function() {
    animationDiv.classList.add('show');                           
  }, 10);                                                          

  setTimeout(function() {
    animationDiv.classList.remove('show');                        
    setTimeout(function() {
      animationDiv.style.display = 'none';                         
      window.location.href = 'board.html';                         
    }, 500);                                                       
  }, 1000);                                                        
}




  






  





