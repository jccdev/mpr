import { Api } from "../shared/types/api";
import library from "./library";
import db from "./db";
import fsp from "fs/promises";
import path from "path";

let isInit = false;

async function getDirContents() {
	const tmpDataBuffer = await fsp.readFile("./tmp/data.json");
	const tmpData: { dir: string } = JSON.parse(tmpDataBuffer.toString());
	const dirFiles = await fsp.readdir(tmpData.dir);

	const results: {
		filePath: string;
		artist: string;
		album: string;
		title: string;
		mimeType: string;
	}[] = [];

	for (const fileName of dirFiles) {
		if (path.extname(fileName) === ".flac") {
			const filePath = path.join(tmpData.dir, fileName);
			const match = filePath.match(/\/\d+ (.*).flac/);
			const parsedTitle = match[1];
			results.push({
				filePath,
				mimeType: "audio/flac",
				artist: "Billions and Billions",
				album: "Billions and Billions",
				title: parsedTitle,
			});
		} else {
			console.log("skip", fileName);
		}
	}

	return results;
}

async function init() {
	try {
		if (!isInit) {
			await db.setup();
			isInit = true;
			await db.setup();
			// await db.resetAll();
			// const artistDb = await db.insertArtist({ name: "Billions and Billions" });

			// const albumDb = await db.insertAlbum({
			// 	name: "Billions and Billions",
			// 	artist_id: artistDb.id,
			// });

			// const contents = await getDirContents();
			// for (const item of contents) {
			// 	await db.insertTrack({
			// 		title: item.title,
			// 		mime_type: item.mimeType,
			// 		file_path: item.filePath,
			// 		artist_id: artistDb.id,
			// 		album_id: albumDb.id,
			// 	});
			// }
		}
	} catch (e) {
		console.error(e);
		throw e;
	}
}

const api: Api = { init, library };
export default api;
