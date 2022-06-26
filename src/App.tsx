import { useEffect, useState } from "react";
import fsp from "fs/promises";
import "./App.css";
import { invoke } from "../electron/src/shared/invoke";

function App() {
	const [files, setFiles] = useState<string[]>([]);

	useEffect(() => {
		invoke(async () => {
			const fileList = await fsp.readdir(
				`I:\\WhatCd\\Billions and Billions Flac`
			);
			setFiles(files);
		});
	});

	return (
		<div className="App">
			<header>
				<h1 className="text-3xl">mpr</h1>
			</header>
		</div>
	);
}

export default App;
