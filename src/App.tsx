import { useEffect, useState, useRef } from "react";
import "./App.css";
import { invoke } from "../electron/src/shared/invoke";
import { Api } from "../electron/src/shared/types/api";
import pretty from "pretty-format";
import {
	Music,
	Pause,
	Play,
	Repeat,
	Shuffle,
	SkipBack,
	SkipForward,
} from "react-feather";

declare global {
	interface Window {
		api: Api;
	}
}

function App() {
	const [files, setFiles] = useState<{ location: string; blob: Blob }[]>([]);
	const [currentTrackIx, setCurrentTrackIx] = useState<number>(null);
	const [playing, setPlaying] = useState<boolean>(false);
	const [currentTime, setCurrentTime] = useState<string>(null);
	const [duration, setDuration] = useState<string>(null);
	const audioEl = useRef<HTMLAudioElement>(null);
	useEffect(() => {
		invoke(async () => {
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

			// audioEl.current.play();
		}
	}, [files]);

	function nextTrack() {
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

	function prevTrack() {
		let prevTrackIx = currentTrackIx - 1;

		if (prevTrackIx < 0) {
			prevTrackIx = files.length - 1;
		}

		setCurrentTrackIx(prevTrackIx);

		const prevTrack = files[prevTrackIx];
		const dataUrl = URL.createObjectURL(prevTrack.blob);
		audioEl.current.src = dataUrl;
		audioEl.current.setAttribute("type", prevTrack.blob.type);
		audioEl.current.play();
	}

	function timeUpdate() {
		const timeFloat = audioEl.current.currentTime;
		const minutes = Math.floor(timeFloat / 60);
		const seconds = Math.floor(timeFloat % 60)
			.toString()
			.padStart(2, "0");
		setCurrentTime(`${minutes}:${seconds}`);
	}

	function durationChange() {
		const timeFloat = audioEl.current.duration;
		const minutes = Math.floor(timeFloat / 60);
		const seconds = Math.floor(timeFloat % 60)
			.toString()
			.padStart(2, "0");
		setDuration(`${minutes}:${seconds}`);
	}
	function play() {
		setPlaying(true);
		audioEl.current.play();
	}

	function pause() {
		setPlaying(false);
		audioEl.current.pause();
	}

	return (
		<div className="h-screen flex flex-col">
			<div className="grow min-h-0 overflow-y-auto">
				<header>
					<h1 className="text-3xl">mpr</h1>
					<div>Files:</div>
					<pre>{pretty(files)}</pre>
				</header>
				<div>
					<audio
						onEnded={() => nextTrack()}
						onTimeUpdate={() => timeUpdate()}
						onDurationChange={() => durationChange()}
						ref={audioEl}
					></audio>
				</div>
			</div>
			<footer className="h-24 bg-stone-800 flex justify-end">
				<div className="flex-1 flex items-center">
					<div className="ml-10 bg-gray-50 w-16 h-16 flex">
						<Music
							className="mx-auto my-auto dark:text-slate-600"
							width={30}
							height={30}
						/>
					</div>
					<div className="ml-4">
						<div>Track</div>
						<div>Artist - Album</div>
					</div>
					<div className="ml-4">
						{currentTime && duration && (
							<div>
								{currentTime}/{duration}
							</div>
						)}
					</div>
				</div>
				<div className="flex items-center">
					<SkipBack
						className="hover:dark:text-white hover:cursor-pointer"
						width={30}
						height={30}
						onClick={() => prevTrack()}
					/>
					{!playing && (
						<Play
							className="mx-2 hover:dark:text-white hover:cursor-pointer"
							width={40}
							height={40}
							onClick={() => play()}
						/>
					)}
					{playing && (
						<Pause
							className="mx-2 hover:dark:text-white hover:cursor-pointer"
							width={40}
							height={40}
							onClick={() => pause()}
						/>
					)}
					<SkipForward
						className="hover:dark:text-white hover:cursor-pointer"
						width={30}
						height={30}
						onClick={() => nextTrack()}
					/>

					<Repeat className="ml-10" width={20} height={20} />
					<Shuffle className="ml-2 mr-10" width={20} height={20} />
				</div>
			</footer>
		</div>
	);
}

export default App;
