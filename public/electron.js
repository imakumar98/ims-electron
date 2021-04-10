const electron = require('electron');

const { app } = electron;
const { BrowserWindow } = electron;

const path = require('path');
const isDev = require('electron-is-dev');

const { sqlite3 } = require('sqlite3')
const Promise = require('bluebird');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({ width: 900, height: 680, webPreferences: { nodeIntegration: true } });
    mainWindow.loadURL('http://localhost:3000/');
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});