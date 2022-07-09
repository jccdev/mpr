import knex from "knex";

interface ArtistDb {
	id: number;
	name: string;
}

interface AlbumDb {
	id: number;
	name: string;
	artist_id: number;
}

interface TrackDb {
	id: number;
	title: string;
	file_path: string;
	mime_type: string;
	album_id: number;
	artist_id: number;
}

async function getKnex() {
	// open the database
	return await knex({
		client: "better-sqlite3",
		connection: {
			filename: "./tmp/data.sqlite3",
			debug: true,
		},
		debug: true,
	});
}

async function setup() {
	const knex = await getKnex();

	await knex.schema.createTableIfNotExists("artists", function (table) {
		table.increments().primary();
		table.string("name");
	});

	await knex.schema.createTableIfNotExists("albums", function (table) {
		table.increments().primary();
		table.string("name");
		table.integer("artist_id");
	});

	await knex.schema.createTableIfNotExists("tracks", function (table) {
		table.increments().primary();
		table.string("title");
		table.string("file_path");
		table.string("mime_type");
		table.integer("artist_id");
		table.integer("album_id");
	});
}

async function resetAll() {
	const knex = await getKnex();
	await knex("tracks").del();
	await knex("albums").del();
	await knex("artists").del();
}

async function insertArtist(values: Omit<ArtistDb, "id">): Promise<ArtistDb> {
	const knex = await getKnex();
	const res = await knex<ArtistDb>("artists").insert(values).returning("id");
	return {
		...values,
		id: res[0].id,
	};
}

async function insertAlbum(values: Omit<AlbumDb, "id">): Promise<AlbumDb> {
	const knex = await getKnex();
	const res = await knex<AlbumDb>("albums").insert(values).returning("id");
	return {
		...values,
		id: res[0].id,
	};
}

async function insertTrack(values: Omit<TrackDb, "id">): Promise<TrackDb> {
	const knex = await getKnex();
	const res = await knex<TrackDb>("tracks").insert(values).returning("id");
	return {
		...values,
		id: res[0].id,
	};
}

async function getArtist(id: number): Promise<ArtistDb> {
	const knex = await getKnex();
	return await knex<ArtistDb>("artists").where("id", id).first();
}
async function getAlbum(id: number): Promise<AlbumDb> {
	const knex = await getKnex();
	return await knex<AlbumDb>("albums").where("id", id).first();
}

async function tempGetFirstArtist(): Promise<ArtistDb> {
	const knex = await getKnex();
	return await knex<ArtistDb>("artists").first();
}

async function tempGetFirstAlbum(): Promise<AlbumDb> {
	const knex = await getKnex();
	return await knex<AlbumDb>("albums").first();
}

async function getTrack(id: number): Promise<TrackDb> {
	const knex = await getKnex();
	return await knex<TrackDb>("tracks").where("id", id).first();
}

async function getTracksByAlbum(albumId: number): Promise<TrackDb[]> {
	const knex = await getKnex();
	return await knex<TrackDb>("tracks").where("album_id", albumId);
}

const db = {
	setup,
	getArtist,
	getAlbum,
	getTrack,
	getTracksByAlbum,
	tempGetFirstArtist,
	tempGetFirstAlbum,
	resetAll,
	insertArtist,
	insertAlbum,
	insertTrack,
};

export default db;
