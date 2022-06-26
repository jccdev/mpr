import { app, BrowserWindow } from "electron";
import { invoke } from "./shared/invoke";

const useDevServer = process.env.DEV_SERVER == "true" ? true : false;
console.log("useDevServer", useDevServer);

const createWindow = () => {
	const win = new BrowserWindow({
		width: 1200,
		height: 800,
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
