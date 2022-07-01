import fsp from "fs/promises";
import path from "path";
import { FileExplorer, Track } from "../shared/types/api";

async function getFiles(): Promise<Track[]> {
	const tmpDataBuffer = await fsp.readFile("./tmp/data.json");
	const tmpData: { dir: string } = JSON.parse(tmpDataBuffer.toString());
	const dirFiles = await fsp.readdir(tmpData.dir);
	const results: Track[] = [];
	for (const fileName of dirFiles) {
		if (path.extname(fileName) === ".flac") {
			const location = path.join(tmpData.dir, fileName);
			const fileBuffer = await fsp.readFile(location);
			const blob = new Blob([fileBuffer], { type: "audio/flac" });
			const match = location.match(/\\\d+ (.*).flac/);
			const parsedTitle = match[1];
			results.push({
				location,
				blob: blob,
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

const fileExplorer: FileExplorer = { getFiles };
export default fileExplorer;
