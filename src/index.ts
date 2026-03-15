import { handleAllGitactions } from "./utils/git-actions.ts";
import { handleReadMeRewrite } from "./utils/readme-rewrite.ts";

try {
	await handleReadMeRewrite();
} catch (e) {
	console.error(e);
}
try {
	await handleAllGitactions();
} catch (e) {
	console.error(e);
}
