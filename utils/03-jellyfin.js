import dotenv from "dotenv";
dotenv.config();

const options = {
	method: "GET",
	headers: {
		Authorization: `MediaBrowser Token="${process.env.JELLYFIN_API_KEY}"`,
		Accept: "application/json",
	},
};
const params = new URLSearchParams({
	userId: process.env.JELLYFIN_USER_ID,
	limit: "1",
	sortBy: "DatePlayed",
	mediaTypes: "Shows",
	sortOrder: "Ascending",
	enableUserdata: "true",
	excludeActiveSessions: "false",
	includeItemType: "Episode",
	excludeItemTypes: "Movie",
});

const url = new URL(`https://${process.env.JELLYFIN_HOST}/UserItems/Resume`);
url.search = params.toString();

async function getWatchingStatus() {
	try {
		const req = await fetch(url.toString(), options);
		const json = await req.json();

		if (!json?.Items?.length) {
			return "## Jellyfin \n\n I'm not watching anything right now";
		}

		const item = json.Items[0];
		console.log(item.SeriesName);
		const title = item.SeriesName ?? item.Name;
		if (item.SeriesName) {
			return `## Jellyfin \n\nI'm watching ${title} ${item.SeasonName}`;
		} else {
			return `## Jellyfin \n\nI'm watching ${title}`;
		}

		return `## Jellyfin \n\nI'm watching ${title}`;
	} catch (err) {
		console.error(err);
		return "## Jellyfin \n\nUnable to fetch watching status";
	}
}

export default await getWatchingStatus();
