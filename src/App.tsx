import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
	const [count, setCount] = useState(0);

	return (
		<div className="App">
			<header className="text-center">
				<h1 className="text-3xl">mpr</h1>
			</header>
		</div>
	);
}

export default App;
