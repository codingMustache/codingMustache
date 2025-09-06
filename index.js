import { writeFile, readdir } from "node:fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { execSync } from "node:child_process";

const dir = "./utils";
const readMe = "README.md";
try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
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
} finally {
    console.log(`${readMe} written successfully!"`);
}
try {
    const msg = `Profile README update: ${new Date().toISOString()}`;
    execSync("git pull --rebase");
    execSync(`git add ${readMe}`);
    execSync(`git commit -m "${msg}`);
    execSync("git push");
} catch (e) {
    console.error(e);
} finally {
    console.log("new commit made and pushed up");
}
