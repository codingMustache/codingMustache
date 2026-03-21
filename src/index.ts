import { handleAllGitActions } from "./utils/git-actions.ts";
import { handleReadMeRewrite } from "./utils/readme-rewrite.ts";

try {
	await handleReadMeRewrite();
} catch (e) {
	console.error(e);
}
try {
	await handleAllGitActions();
} catch (e) {
	console.error(e);
}
