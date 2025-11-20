const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    openNote: (data) => ipcRenderer.send("open-note-window", data),

    updateTask: (data) => ipcRenderer.send("update-task", data),

    onUpdateTask: (callback) =>
        ipcRenderer.on("update-task", (event, data) => callback(data)),

    onNoteText: (callback) =>
        ipcRenderer.on("note-text", (event, data) => callback(data)),

    closeMain: () => ipcRenderer.send("close-main")
});
