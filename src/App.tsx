import { useEffect, useState, useRef } from "react";
import "./App.css";
import { invoke } from "../electron/src/shared/invoke";
import { Api } from "../electron/src/shared/types/api";
import pretty from "pretty-format";

declare global {
	interface Window {
		api: Api;
	}
}

function App() {
	const [files, setFiles] = useState<{ location: string; blob: Blob }[]>([]);
	const [currentTrackIx, setCurrentTrackIx] = useState<number>(null);
	const audioEl = useRef<HTMLAudioElement>(null);
	useEffect(() => {
		invoke(async () => {
			console.log("window.api", window.api);
			setFiles(await window.api.fileExplorer.getFiles());
		});
	}, []);

	useEffect(() => {
		if (files?.length > 0) {
			setCurrentTrackIx(0);
			const currentTrack = files[0];
			const dataUrl = URL.createObjectURL(currentTrack.blob);
			audioEl.current.src = dataUrl;
			audioEl.current.setAttribute("type", currentTrack.blob.type);
			audioEl.current.play();
		}
	}, [files]);

	function trackEnded() {
		let nextTrackIx = currentTrackIx + 1;

		if (nextTrackIx >= files.length) {
			nextTrackIx = 0;
		}

		setCurrentTrackIx(nextTrackIx);

		const nextTrack = files[nextTrackIx];
		const dataUrl = URL.createObjectURL(nextTrack.blob);
		audioEl.current.src = dataUrl;
		audioEl.current.setAttribute("type", nextTrack.blob.type);
		audioEl.current.play();
	}

	// function audioControl() {
	// 	if (currentTrackIx != null) {
	// 		const currentTrack = files[currentTrackIx];
	// 		console.log("audioControl currentTrackIx", currentTrackIx);
	// 		console.log("audioControl currentTrack", currentTrack.location);
	// 		const dataUrl = URL.createObjectURL(currentTrack.blob);
	// 		return (
	// 		);
	// 	} else {
	// 		return <div>No Files</div>;
	// 	}
	// }

	return (
		<div className="App">
			<header>
				<h1 className="text-3xl">mpr</h1>
				<div>Files:</div>
				<pre>{pretty(files)}</pre>
			</header>
			<div>
				<audio onEnded={() => trackEnded()} controls ref={audioEl}></audio>
			</div>
		</div>
	);
}

export default App;
