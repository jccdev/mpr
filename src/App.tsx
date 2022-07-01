import { useEffect, useState, useRef } from "react";
import "./App.css";
import { invoke } from "../electron/src/shared/invoke";
import { Api, Track } from "../electron/src/shared/types/api";
import pretty from "pretty-format";
import {
	MoreHorizontal,
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
	const [files, setFiles] = useState<Track[]>([]);
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

	function playTrack(ix: number) {
		setCurrentTrackIx(ix);
		setPlaying(true);
		const track = files[ix];
		const dataUrl = URL.createObjectURL(track.blob);
		audioEl.current.src = dataUrl;
		audioEl.current.setAttribute("type", track.blob.type);
		audioEl.current.play();
	}

	function play() {
		setPlaying(true);
		audioEl.current.play();
	}

	function pause() {
		setPlaying(false);
		audioEl.current.pause();
	}

	function trackList(tracks: Track[]) {
		const trackRows: JSX.Element[] = [];
		for (let ix = 0; ix < tracks.length; ix++) {
			const track = tracks[ix];
			trackRows.push(
				<tr
					key={ix}
					className="hover:bg-stone-800 hover:cursor-pointer"
					onClick={() => playTrack(ix)}
				>
					<td className="py-3">
						<div className="ml-10 bg-gray-50 w-10 h-10 flex">
							<Music
								className="mx-auto my-auto dark:text-slate-600"
								width={15}
								height={15}
							/>
						</div>
					</td>
					<td className="py-3">{track.title}</td>
					<td className="py-3">{track.album}</td>
					<td className="py-3">{track.artist}</td>
					<td className="py-3">1:23</td>
					<td
						className="py-3"
						onClick={(e) => {
							e.stopPropagation();
							alert("todo");
						}}
					>
						<button type="button">
							<MoreHorizontal
								width={20}
								height={20}
								className="hover:dark:text-white"
							/>
						</button>
					</td>
				</tr>
			);
		}

		return (
			<table className="table-auto w-full">
				<thead>
					{/*  maybe border-t */}
					<tr className="text-left">
						<th></th>
						<th>Title</th>
						<th>Album</th>
						<th>Artist</th>
						<th>Duration</th>
						<th></th>
					</tr>
				</thead>
				<tbody>{trackRows}</tbody>
			</table>
		);
	}

	return (
		<div className="h-screen flex flex-col">
			<div className="grow min-h-0 overflow-y-auto">
				<header>
					<h1 className="text-3xl">mpr</h1>
					<hr />
				</header>
				<main>
					<div className="container mx-auto">{trackList(files)}</div>
					{/* <pre>{pretty(files)}</pre> */}
				</main>
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
