import { Library, Album, Artist, Track } from "../shared/types/api";
import db from "./db";
import fsp from "fs/promises";

async function getAlbum(id: number): Promise<Album> {
	const albumDb = await db.getAlbum(id);
	const artistDb = await db.getArtist(albumDb.artist_id);
	const tracksDb = await db.getTracksByAlbum(id);
	const artist: Artist = {
		id: artistDb.id,
		name: artistDb.name,
	};

	const album: Album = {
		id: albumDb.id,
		name: albumDb.name,
		artist: artist,
		tracks: [],
	};

	for (const tdb of tracksDb) {
		const fileBuffer = await fsp.readFile(tdb.file_path);
		const blob = new Blob([fileBuffer], { type: tdb.mime_type });

		album.tracks.push({
			id: tdb.id,
			title: tdb.title,
			mimeType: tdb.mime_type,
			blob: blob,
			album: album,
			artist: artist,
		});
	}

	return album;
}

async function getTrackBlob(id: number): Promise<Blob> {
	const dbTrack = await db.getTrack(id);
	const fileBuffer = await fsp.readFile(dbTrack.file_path);
	return new Blob([fileBuffer], { type: dbTrack.mime_type });
}

const library: Library = { getAlbum, getTrackBlob };
export default library;
