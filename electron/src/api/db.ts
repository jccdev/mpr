import Sqlite3, { RunResult } from "sqlite3";
const sqlite3 = Sqlite3.verbose();
import util from "util";

async function setup() {
	const db = new sqlite3.Database("./tmp/data.sqlite3");

	await new Promise<void>((resolve, reject) => {
		db.run(
			`--sql
				create table if not exists artists (
					id integer primary key,
					name text
				)
		`,
			(err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			}
		);
	});
	await new Promise<void>((resolve, reject) => {
		db.run(
			`--sql
				create table if not exists albums (
					id integer primary key,
					name text,
					artist_id integer
				)
		`,
			(err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			}
		);
	});
	await new Promise<void>((resolve, reject) => {
		db.run(
			`--sql
				create table if not exists tracks (
					id integer primary key,
					title text,
					artist_id integer,
					album_id integer,
					file_path text,
					mime_type text
				)
		`,
			(err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			}
		);
	});
}

async function resetAll() {
	const db = new sqlite3.Database("./tmp/data.sqlite3");
	await new Promise<void>((resolve, reject) => {
		db.run(
			`--sql
				delete from tracks where 1 = 1
			`,
			(err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			}
		);
	});

	await new Promise<void>((resolve, reject) => {
		db.run(
			`--sql --ignore
				delete from albums where 1 = 1
			`,
			(err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			}
		);
	});

	await new Promise<void>((resolve, reject) => {
		db.run(
			`--sql
				delete from artists where 1 = 1
			`,
			(err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			}
		);
	});
}

async function insertArtist({
	name,
}: {
	name: string;
}): Promise<{ id: number; name: string }> {
	const db = new sqlite3.Database("./tmp/data.sqlite3");

	return await new Promise((resolve, reject) => {
		db.get(
			`--sql
				insert into artists(name)
				values ($name)
				returning id;
		`,
			{ $name: name },
			(err, row) => {
				console.log("err", err);
				console.log("row", row);
				if (err) {
					reject(err);
				} else {
					resolve({
						id: row.id as number,
						name,
					});
				}
			}
		);
	});
}

async function insertAlbum({
	name,
	artist_id,
}: {
	name: string;
	artist_id: number;
}): Promise<{ id: number; name: string; artist_id: number }> {
	const db = new sqlite3.Database("./tmp/data.sqlite3");

	return await new Promise((resolve, reject) => {
		db.get(
			`--sql
				insert into albums(name, artist_id)
				values ($name, $artist_id)
				returning id;
		`,
			{ $name: name, $artist_id: artist_id },
			(err, row) => {
				if (err) {
					reject(err);
				} else {
					resolve({
						id: row.id as number,
						name,
						artist_id,
					});
				}
			}
		);
	});
}

async function insertTrack({
	title,
	file_path,
	mime_type,
	artist_id,
	album_id,
}: {
	title: string;
	file_path: string;
	mime_type: string;
	album_id: number;
	artist_id: number;
}): Promise<{
	id: number;
	title: string;
	file_path: string;
	mime_type: string;
	album_id: number;
	artist_id: number;
}> {
	const db = new sqlite3.Database("./tmp/data.sqlite3");

	return await new Promise((resolve, reject) => {
		db.get(
			`--sql
				insert into tracks (
					title,
					file_path,
					mime_type,
					artist_id,
					album_id
				)
				values (
					$title,
					$file_path,
					$mime_type,
					$artist_id,
					$album_id
				)
				returning id;
		`,
			{
				$title: title,
				$file_path: file_path,
				$mime_type: mime_type,
				$artist_id: artist_id,
				$album_id: album_id,
			},
			(err, row) => {
				if (err) {
					reject(err);
				} else {
					resolve({
						id: row.id as number,
						title,
						file_path,
						mime_type,
						artist_id,
						album_id,
					});
				}
			}
		);
	});
}

async function getArtist(id: number): Promise<{ id: number; name: string }> {
	const db = new sqlite3.Database("./tmp/data.sqlite3");

	return await new Promise<{ id: number; name: string }>((resolve, reject) => {
		db.get(
			`--sql
				select *
				from artists
				where id = $id
		`,
			{ $id: id },
			(err, row) => {
				if (err) {
					reject(err);
				} else {
					resolve(row);
				}
			}
		);
	});
}

async function getAlbum(
	id: number
): Promise<{ id: number; name: string; artist_id: number }> {
	const db = new sqlite3.Database("./tmp/data.sqlite3");

	return await new Promise<{ id: number; name: string; artist_id: number }>(
		(resolve, reject) => {
			db.get(
				`--sql
				select *
				from albums
				where id = $id
		`,
				{ $id: id },
				(err, row) => {
					if (err) {
						reject(err);
					} else {
						resolve(row);
					}
				}
			);
		}
	);
}

async function getTrack(id: number): Promise<{
	id: number;
	title: string;
	file_path: string;
	mime_type: string;
	album_id: string;
	artist_id: number;
}> {
	const db = new sqlite3.Database("./tmp/data.sqlite3");

	return await new Promise<{
		id: number;
		title: string;
		file_path: string;
		mime_type: string;
		album_id: string;
		artist_id: number;
	}>((resolve, reject) => {
		db.get(
			`--sql
				select *
				from tracks
				where id = $id
		`,
			{ $id: id },
			(err, row) => {
				if (err) {
					reject(err);
				} else {
					resolve(row);
				}
			}
		);
	});
}

async function getTracksByAlbum(albumId: number): Promise<
	{
		id: number;
		title: string;
		file_path: string;
		mime_type: string;
		album_id: string;
		artist_id: number;
	}[]
> {
	const db = new sqlite3.Database("./tmp/data.sqlite3");

	return await new Promise<
		{
			id: number;
			title: string;
			file_path: string;
			mime_type: string;
			album_id: string;
			artist_id: number;
		}[]
	>((resolve, reject) => {
		db.all(
			`--sql
				select *
				from tracks
				where album_id = $album_id
		`,
			{ $album_id: albumId },
			(err, row) => {
				if (err) {
					reject(err);
				} else {
					resolve(row);
				}
			}
		);
	});
}

const db = {
	setup,
	getArtist,
	getAlbum,
	getTrack,
	getTracksByAlbum,
	resetAll,
	insertArtist,
	insertAlbum,
	insertTrack,
};
export default db;
