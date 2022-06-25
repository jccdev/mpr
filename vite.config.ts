import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	base: process.env.ELECTRON == "true" ? "./" : "",
	build: {
		outDir: "dist/web",
	},
	plugins: [react()],
});
