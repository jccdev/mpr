import { app, BrowserWindow } from "electron";
import { invoke } from "./shared/invoke";

// TODO need to check for prod here, and disable
const useDevServer = process.env.DEV_SERVER == "true" ? true : false;
console.log("useDevServer", useDevServer);

const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
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
