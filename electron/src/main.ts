import { app, BrowserWindow } from "electron";
import { invoke } from "./shared/invoke";
import path from "path";

const useDevServer = process.env.DEV_SERVER == "true" ? true : false;

const createWindow = () => {
	const win = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			contextIsolation: true,
			preload: path.join(__dirname, "preload.js"),
		},
	});

	if (!app.isPackaged && useDevServer) {
		win.loadURL("http://localhost:3000");
	} else {
		win.loadFile("../web/index.html");
	}
};

invoke(async () => {
	await app.whenReady();
	createWindow();
});
