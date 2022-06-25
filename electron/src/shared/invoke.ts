export function invoke(fn: () => Promise<void> | void) {
	fn();
}
