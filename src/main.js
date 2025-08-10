const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false
    },
    show: false
  });

  mainWindow.loadFile('src/simple.html');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Create application menu
  createMenu();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New File',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-new-file');
          }
        },
        {
          label: 'Open File',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ['openFile'],
              filters: [
                { name: 'All Files', extensions: ['*'] },
                { name: 'JavaScript', extensions: ['js'] },
                { name: 'TypeScript', extensions: ['ts'] },
                { name: 'Python', extensions: ['py'] },
                { name: 'Java', extensions: ['java'] },
                { name: 'C++', extensions: ['cpp', 'cc', 'cxx'] },
                { name: 'C#', extensions: ['cs'] },
                { name: 'HTML', extensions: ['html', 'htm'] },
                { name: 'CSS', extensions: ['css'] },
                { name: 'JSON', extensions: ['json'] }
              ]
            });
            
            if (!result.canceled && result.filePaths.length > 0) {
              const filePath = result.filePaths[0];
              const content = fs.readFileSync(filePath, 'utf-8');
              mainWindow.webContents.send('file-opened', {
                path: filePath,
                content: content,
                name: path.basename(filePath)
              });
            }
          }
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('menu-save-file');
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Languages',
      submenu: [
        {
          label: 'Download JavaScript Template',
          click: () => {
            mainWindow.webContents.send('download-template', 'javascript');
          }
        },
        {
          label: 'Download Python Template',
          click: () => {
            mainWindow.webContents.send('download-template', 'python');
          }
        },
        {
          label: 'Download Java Template',
          click: () => {
            mainWindow.webContents.send('download-template', 'java');
          }
        },
        {
          label: 'Download C++ Template',
          click: () => {
            mainWindow.webContents.send('download-template', 'cpp');
          }
        },
        {
          label: 'Download C# Template',
          click: () => {
            mainWindow.webContents.send('download-template', 'csharp');
          }
        },
        {
          label: 'Download HTML Template',
          click: () => {
            mainWindow.webContents.send('download-template', 'html');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Handle file saving
ipcMain.handle('save-file', async (event, data) => {
  try {
    if (data.path) {
      fs.writeFileSync(data.path, data.content);
      return { success: true };
    } else {
      const result = await dialog.showSaveDialog(mainWindow, {
        defaultPath: data.defaultName || 'untitled.txt',
        filters: [
          { name: 'All Files', extensions: ['*'] },
          { name: 'JavaScript', extensions: ['js'] },
          { name: 'TypeScript', extensions: ['ts'] },
          { name: 'Python', extensions: ['py'] },
          { name: 'Java', extensions: ['java'] },
          { name: 'C++', extensions: ['cpp'] },
          { name: 'C#', extensions: ['cs'] },
          { name: 'HTML', extensions: ['html'] },
          { name: 'CSS', extensions: ['css'] },
          { name: 'JSON', extensions: ['json'] },
          { name: 'Text', extensions: ['txt'] }
        ]
      });
      
      if (!result.canceled) {
        fs.writeFileSync(result.filePath, data.content);
        return { success: true, path: result.filePath };
      }
    }
    return { success: false, error: 'Save cancelled' };
  } catch (error) {
    console.error('Error saving file:', error);
    return { success: false, error: error.message };
  }
});

// Add test IPC handler
ipcMain.handle('test-ipc', async () => {
  return { status: 'success', message: 'IPC is working' };
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
