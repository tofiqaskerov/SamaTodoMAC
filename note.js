let currentIndex = null;

window.electronAPI.onNoteText((data) => {
    document.getElementById("noteText").value = data.text;
    currentIndex = data.index;
});

document.getElementById("noteText").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();

        window.electronAPI.updateTask({
            index: currentIndex,
            text: document.getElementById("noteText").value
        });
    }
});

document.getElementById("closeNote").onclick = () => {
    window.close();
};
