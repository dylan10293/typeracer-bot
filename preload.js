const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('versions', {
	node: () => process.versions.node,
	chrome: () => process.versions.chrome,
	electron: () => process.versions.electron,
	startBot: (args) => ipcRenderer.invoke('startBot', args),
	// we can also expose variables, not just functions
});
