export interface Library {
	getAlbum(id: number): Promise<Album>;
	getTrackBlob(id: number): Promise<Blob>;
}

export interface Api {
	init(): Promise<void>;
	library: Library;
}

export interface Artist {
	id: number;
	name: string;
}

export interface Album {
	id: number;
	name: string;
	artist: Artist;
	tracks: Track[];
}

export interface Track {
	id: number;
	title: string;
	artist: Artist;
	album: Album;
	mimeType: string;
	blob?: Blob;
}
