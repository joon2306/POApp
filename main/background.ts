import path from 'path'
import { app, ipcMain } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers'
import { deleteCard, getKanbanCards, modifyCard, saveKanbanCard } from './kanbanCard'
import { generateFeature } from './generate'
import { refineFeature } from './refine'
import { summaryFeature } from './summary'
import { exportFeature } from './export'
import translate from "./translate"; 
import { generateJira } from './jira'
import improve from './english'
import getDatabase from './database/database'

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (isProd) {
    await mainWindow.loadURL('app://./home')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    mainWindow.webContents.openDevTools()
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})
getKanbanCards();
saveKanbanCard();
deleteCard();
modifyCard();
generateFeature();
refineFeature();
summaryFeature();
exportFeature();
translate();
generateJira();
improve();
