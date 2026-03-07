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
	SortBy: "DatePlayed",
	SortOrder: "Descending",
	Limit: 1,
	Filters: "IsPlayed",
	Recursive: true,
	Fields: "UserData",
});

const url = new URL(
	`https://${process.env.JELLYFIN_HOST}/Users/${process.env.JELLYFIN_USER_ID}/Items`,
);
url.search = params.toString();

async function getWatchingStatus() {
	let stringBuilder = "## Jellyfin\n\n";
	try {
		const req = await fetch(url.toString(), options);

		const json = await req.json();

		if (!json?.Items?.length) {
			stringBuilder =
				stringBuilder + "I'm not watching anything right now";
		}

		const item = json.Items[0];
		const title = item?.SeriesName ?? item?.Name;
		if (item.SeriesName) {
			stringBuilder =
				stringBuilder +
				`📺 I'm watching: <strong>${title} ${item.SeasonName} Episode ${item.IndexNumber}</strong>`;
		} else if (item.Name) {
			stringBuilder = stringBuilder + `🎥 I'm watching: **${title}**`;
		}

		if (title.length > 0) {
			try {
				const tmdb_url = new URL(
					`https://api.themoviedb.org/3/search/tv`,
				);
				const tmdb_options = {
					method: "GET",
					headers: {
						Authorization: `Bearer ${process.env.TMBDB_API_KEY}`,
						Accept: "application/json",
					},
				};
				const tmdb_params = new URLSearchParams({
					limit: "1",
					query: title,
				});
				tmdb_url.search = tmdb_params.toString();

				const req = await fetch(tmdb_url.toString(), tmdb_options);
				const json = await req.json();
				const result = json.results[0].poster_path;
				console.log(result);
				// get img path
				const tmdbBaseImgPath = `https://image.tmdb.org/t/p/w300_and_h300_face${result}`;
				if (result) {
					stringBuilder =
						stringBuilder +
						`\n\n![movie poster](${tmdbBaseImgPath})`;
				}
			} catch (err) {
				console.error(`error reaching tmdb: ${err}`);
				stringBuilder =
					stringBuilder +
					`Something went wrong with getting the Image, I'll fix it later.`;
			}
		}
	} catch (err) {
		console.error(`error reaching jellyfin: ${err}`);
		return stringBuilder;
	}
	return stringBuilder;
}

export default await getWatchingStatus();
