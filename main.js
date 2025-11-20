const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");

let mainWindow;
let noteWindows = {};

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 460,
        height: 620,
        resizable: false,
        autoHideMenuBar: true,
        frame: false,
        transparent: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });

    mainWindow.loadFile("index.html");
}

function createNoteWindow(data) {
    const id = data.index;

    if (noteWindows[id] && !noteWindows[id].isDestroyed()) {
        noteWindows[id].focus();
        return;
    }

    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    const randomX = Math.floor(Math.random() * (width - 350)) + 20;
    const randomY = Math.floor(Math.random() * (height - 250)) + 20;

    const win = new BrowserWindow({
        width: 280,
        height: 200,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        resizable: true,
        x: randomX,
        y: randomY,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });

    noteWindows[id] = win;

    win.loadFile("note.html");

    win.on("closed", () => {
        noteWindows[id] = null;
    });

    win.webContents.on("did-finish-load", () => {
        win.webContents.send("note-text", data);
    });
}

ipcMain.on("open-note-window", (event, data) => createNoteWindow(data));

ipcMain.on("update-task", (event, data) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send("update-task", data);
    }
});

ipcMain.on("close-main", () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.close();
    }
});

app.whenReady().then(createWindow);
