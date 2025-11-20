let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

function normalizeTasks() {
    tasks = tasks.map(t =>
        typeof t === "string" ? { text: t, done: false } : t
    );
    save();
}
normalizeTasks();

const input = document.getElementById("taskInput");
const list = document.getElementById("list");
const addBtn = document.getElementById("addBtn");
const closeBtn = document.getElementById("closeMain");

function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    normalizeTasks();
    list.innerHTML = "";

    tasks.forEach((task, index) => {
        const div = document.createElement("div");
        div.className = "task";
        div.innerText = task.text;

        if (task.done) div.classList.add("done");

        div.addEventListener("click", (e) => {
            heartPop(e, div);
            tasks[index].done = !tasks[index].done;
            save();
            loadTasks();
        });

        div.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            window.electronAPI.openNote({
                text: task.text,
                index: index
            });
        });

        list.appendChild(div);
    });

    updateDoneCount();
}

function addTask() {
    const text = input.value.trim();
    if (!text) return;

    tasks.unshift({ text, done: false });
    save();
    loadTasks();
    input.value = "";
}

addBtn.onclick = addTask;

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        addTask();
    }
});

function heartPop(event) {
    const heart = document.createElement("div");
    heart.className = "float-heart";
    heart.style.left = event.clientX + "px";
    heart.style.top = event.clientY + "px";
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 1000);
}

window.electronAPI.onUpdateTask((data) => {
    tasks[data.index].text = data.text;
    save();
    loadTasks();
});

document.querySelector(".trash-box").addEventListener("click", () => {
    tasks = tasks.filter(t => !t.done);
    save();
    loadTasks();
});

function updateDoneCount() {
    document.getElementById("trashCount").innerText =
        tasks.filter(t => t.done).length;
}

closeBtn.onclick = () => {
    window.electronAPI.closeMain();
};

loadTasks();
