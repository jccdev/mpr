export interface FileExplorer {
	getFiles: () => Promise<Track[]>;
}

export interface Api {
	fileExplorer: FileExplorer;
}

export interface Track {
	location: string;
	blob: Blob;
	artist: string;
	album: string;
	title: string;
}
