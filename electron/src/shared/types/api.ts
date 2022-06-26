export interface FileExplorer {
	getFiles: () => Promise<{ location: string; blob: Blob }[]>;
}

export interface Api {
	fileExplorer: FileExplorer;
}
