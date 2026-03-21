import { execSync } from "node:child_process";

const GitHandler = {
	addReadMe: async () => {
		try {
			const readMe = "./README.md";
			execSync(`git add ${readMe}`);
		} catch (e) {
			console.error(`Error using git push: ${e}`);
		}
	},
	commitReadMe: async () => {
		try {
			const msg = `Profile README update: ${new Date().toISOString()}`;
			execSync(`git commit -m "${msg}"`);
		} catch (e) {
			console.error(`Error using git push: ${e}`);
		}
	},
	pushReadMe: async () => {
		try {
			execSync("git push");
		} catch (e) {
			console.error(`Error using git push: ${e}`);
		}
	},
	pullReadMe: async () => {
		try {
			execSync(`git pull`);
		} catch (e) {
			console.error(`Error using git pull: ${e}`);
		}
	},
};

export const handleAllGitActions = async () => {
	try {
		await GitHandler.pullReadMe();
		await GitHandler.addReadMe();
		await GitHandler.commitReadMe();
		await GitHandler.pushReadMe();
	} catch (er) {
		console.error(`Error handling git actions: ${er}`);
	}
};
