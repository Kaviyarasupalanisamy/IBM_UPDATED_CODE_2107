const SET_ITEM = "set";
const SET_DELETE = "delete";
const SET_COMPLETE = "complete";
const SET_INCOMPLETE = "incomplete";
const SET_UPDATE = "updtae";
var SET_STORAGE_TODO = "todo";
var SET_STORAGE_COMPLETED = "completed";

var taskInput = document.getElementById("new-task");
var addButton = document.getElementsByTagName("button")[0];
var incompleteTasksHolder = document.getElementById("incomplete-tasks");
var completedTasksHolder = document.getElementById("completed-tasks");

var createNewTaskElement = function(taskString, arr) {
    listItem = document.createElement("li");
    checkBox = document.createElement("input");
    label = document.createElement("label");
    editInput = document.createElement("input");
    editButton = document.createElement("button");
    deleteButton = document.createElement("button");

    checkBox.type = "checkbox";
    editInput.type = "text";
    editButton.innerText = "Edit";
    editButton.className = "edit";
    deleteButton.innerText = "Delete";
    deleteButton.className = "delete";
    label.innerText = taskString;

    listItem.appendChild(checkBox);
    listItem.appendChild(label);
    listItem.appendChild(editInput);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);

    return listItem;
};

var addTask = function(storageValue) {
    var listItemName = taskInput.value
    if (listItemName.trim() == "") {
        taskInput.classList.add("error");
        return;
    } else {
        taskInput.classList.remove("error");
    }
    listItem = createNewTaskElement(listItemName)
    console.log(listItemName);
    setLocalStorage(SET_ITEM, SET_STORAGE_TODO, listItemName);
    incompleteTasksHolder.appendChild(listItem)
    console.log(listItem);
    bindTaskEvents(listItem, taskCompleted)
    taskInput.value = "";
};

var editTask = function() {
    var listItem = this.parentNode;
    var editInput = listItem.querySelectorAll("input[type=text")[0];
    var containsClass = listItem.classList.contains("editMode");
    var label = listItem.querySelector("label");
    if (containsClass) {
        var listItemName = editInput.value;
        if (listItemName.trim() == "") {
            editInput.classList.add("error");
            return;
        } else {
            editInput.classList.remove("error");
            setLocalStorage(SET_UPDATE, SET_STORAGE_TODO, editInput.value, label.innerText);
        }
    }



    var button = listItem.getElementsByTagName("button")[0];

    if (containsClass) {
        label.innerText = editInput.value
        button.innerText = "Edit";
    } else {
        editInput.value = label.innerText
        button.innerText = "Save";
    }

    listItem.classList.toggle("editMode");
};

var deleteTask = function(el) {
    var listItem = this.parentNode;
    var ul = listItem.parentNode;
    ul.removeChild(listItem);
    setLocalStorage(SET_DELETE, SET_STORAGE_TODO, listItem.querySelector("label").innerText);
};

var taskCompleted = function(el) {
    var listItem = this.parentNode;
    completedTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskIncomplete);
    setLocalStorage(SET_COMPLETE, SET_STORAGE_TODO, listItem.querySelector("label").innerText);

};

var taskIncomplete = function() {
    var listItem = this.parentNode;
    incompleteTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskCompleted);
    setLocalStorage(SET_INCOMPLETE, SET_STORAGE_TODO, listItem.querySelector("label").innerText);
};

var bindTaskEvents = function(taskListItem, checkBoxEventHandler, cb) {
    var checkBox = taskListItem.querySelectorAll("input[type=checkbox]")[0];
    var editButton = taskListItem.querySelectorAll("button.edit")[0];
    var deleteButton = taskListItem.querySelectorAll("button.delete")[0];
    editButton.onclick = editTask;
    deleteButton.onclick = deleteTask;
    checkBox.onchange = checkBoxEventHandler;
    checkBox.onkeypress = function(e) {
        if ((e.keyCode ? e.keyCode : e.which) == 13) {
            checkBox.click();
        }
    };
};

addButton.addEventListener("click", addTask);

for (var i = 0; i < incompleteTasksHolder.children.length; i++) {
    bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
}

for (var i = 0; i < completedTasksHolder.children.length; i++) {
    bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
}
var toDoItem = [];
var completedItem = [];

function setLocalStorage(opertation, name, value, oldvalue = '') {
    if (typeof(Storage) !== "undefined") {
        if (opertation == SET_ITEM) {
            var tasks = JSON.parse(localStorage.getItem("tasks"));
            var updatedtasks = [...tasks, {
                name: value,
                completed: false,
                editmode: false,
                default: false,
                deleted: false,
            }]
            localStorage.setItem("tasks", JSON.stringify(updatedtasks));

        } else if (opertation == SET_DELETE) {

            var tasks = JSON.parse(localStorage.getItem("tasks"));
            tasks.find(val => val.name == value).deleted = true;
            localStorage.setItem("tasks", JSON.stringify(tasks));


        } else if (opertation == SET_COMPLETE) {
            var tasks = JSON.parse(localStorage.getItem("tasks"));
            tasks.find(val => val.name == value).completed = true;
            localStorage.setItem("tasks", JSON.stringify(tasks));
        } else if (opertation == SET_INCOMPLETE) {
            var tasks = JSON.parse(localStorage.getItem("tasks"));
            tasks.find(val => val.name == value).completed = false;
            localStorage.setItem("tasks", JSON.stringify(tasks));
        } else if (opertation == SET_UPDATE) {
            var tasks = JSON.parse(localStorage.getItem("tasks"));
            tasks.find(val => val.name == oldvalue).deleted = true;

            var updatedtasks = [...tasks, {
                name: value,
                completed: false,
                editmode: false,
                default: false,
                deleted: false,
            }]
            localStorage.setItem("tasks", JSON.stringify(updatedtasks));


        }
    } else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
    }


}


document.addEventListener('DOMContentLoaded', function(event) {
    var incompleteTasksHolder = document.getElementById("incomplete-tasks");
    var completedTasksHolder = document.getElementById("completed-tasks");


    if (typeof(Storage) !== "undefined") {
        var todo = JSON.parse(localStorage.getItem("tasks"));
        if (todo) {
            todoFiltered = todo.filter((val => val.completed == false && val.default == false))
            todoFiltered.map((val) => {
                listItem = createNewTaskElement(val.name);
                incompleteTasksHolder.appendChild(listItem);
                bindTaskEvents(listItem, taskCompleted)
            });


            completed = todo.filter((val => val.completed == true && val.default == false))
            completed.map((val) => {
                var completedCont = `<li><input type="checkbox" checked><label>${val.name}</label><input type="text"><button class="edit">Edit</button><button class="delete">Delete</button></li>`;
                //var HTMLStr = stringToHTML(completedCont);
                //listItem = createNewTaskElement(val.name);
                var HTMLStr = stringToHTML(completedCont);
                completedTasksHolder.appendChild(HTMLStr);
                bindTaskEvents(HTMLStr, taskIncomplete);
            });
        }
    } else {
        console.log("localstorage not available");
    }

    if (localStorage.getItem("tasks") == null) {

        var tasks = [];
        for (var i = 0; i < incompleteTasksHolder.children.length; i++) {
            if (incompleteTasksHolder.children[i].classList.contains("editMode")) {
                tasks = [...tasks, {
                    name: document.getElementById("incomplete-tasks").children[i].querySelector("label").innerText,
                    completed: false,
                    editmode: true,
                    default: true,
                    deleted: false,
                }];
                localStorage.setItem("tasks", JSON.stringify(tasks));
            } else {
                tasks = [...tasks, {
                    name: document.getElementById("incomplete-tasks").children[i].querySelector("label").innerText,
                    completed: false,
                    editmode: false,
                    default: true,
                    deleted: false,
                }];
                localStorage.setItem("tasks", JSON.stringify(tasks));
            }
        }

        //complete task holder


        for (var i = 0; i < completedTasksHolder.children.length; i++) {
            if (completedTasksHolder.children[i].classList.contains("editMode")) {
                tasks = [...tasks, {
                    name: completedTasksHolder.children[i].querySelector("label").innerText,
                    completed: true,
                    editmode: true,
                    default: true,
                    deleted: false,
                }];
                localStorage.setItem("tasks", JSON.stringify(tasks));
            } else {
                tasks = [...tasks, {
                    name: completedTasksHolder.children[i].querySelector("label").innerText,
                    completed: true,
                    editmode: false,
                    default: true,
                    deleted: false,
                }];
                localStorage.setItem("tasks", JSON.stringify(tasks));
            }

        }
    } else {
        var tasks = JSON.parse(localStorage.getItem("tasks"));
        var removeItem = [];
        for (var i = 0; i < incompleteTasksHolder.children.length; i++) {
            var listItem = incompleteTasksHolder.children[i];
            var taskText = listItem.querySelector("label").innerText;
            if (tasks.findIndex(a => a.name == taskText && a.deleted == true) != -1) {
                removeItem.push(listItem);
                console.log(removeItem);
            }
        }
        for (var j = 0; j < removeItem.length; j++) {
            removeItem[j].remove();
        }

        var removeItemCompleted = [];
        for (var i = 0; i < completedTasksHolder.children.length; i++) {
            var listItem = completedTasksHolder.children[i];
            var taskText = listItem.querySelector("label").innerText;
            if (tasks.findIndex(a => a.name == taskText && a.deleted == true) != -1) {
                removeItemCompleted.push(listItem);
                console.log(removeItemCompleted);
            }
        }
        for (var j = 0; j < removeItemCompleted.length; j++) {
            removeItemCompleted[j].remove();
        }

    }
});

var stringToHTML = function(str) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, 'text/html');
    console.log(doc.body.getElementsByTagName("li")[0]);
    return doc.body.getElementsByTagName("li")[0];
};