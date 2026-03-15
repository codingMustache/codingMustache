import { writeFile, readdir } from "node:fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

export const handleReadMeRewrite = async () => {
	const dir = "../sections";
	const readMe = "./README.md";
	try {
		const __filename: string = fileURLToPath(import.meta.url);
		const __dirname: string = dirname(__filename);
		const files = (await readdir(join(__dirname, dir))).sort();
		const contents = await Promise.all(
			files.map(async (file) => {
				const imp = await import(join(__dirname, dir, file));
				return imp.default;
			}),
		);
		await writeFile(readMe, contents.join(`\n\n`), {
			flag: "w+",
		});
	} catch (e) {
		console.error(e);
	}
};
