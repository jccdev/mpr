import fsp from "fs/promises";
import path from "path";
import { FileExplorer } from "../shared/types/api";

async function getFiles(): Promise<{ location: string; blob: Blob }[]> {
	const tmpDataBuffer = await fsp.readFile("./tmp/data.json");
	const tmpData: { dir: string } = JSON.parse(tmpDataBuffer.toString());
	const dirFiles = await fsp.readdir(tmpData.dir);
	const results: { location: string; blob: Blob }[] = [];
	for (const fileName of dirFiles) {
		if (path.extname(fileName) === ".flac") {
			const location = path.join(tmpData.dir, fileName);
			const fileBuffer = await fsp.readFile(location);
			const blob = new Blob([fileBuffer], { type: "audio/flac" });
			results.push({
				location,
				blob: blob,
			});
		} else {
			console.log("skip", fileName);
		}
	}

	return results;
}

const fileExplorer: FileExplorer = { getFiles };
export default fileExplorer;
