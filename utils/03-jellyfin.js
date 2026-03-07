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
	includeExternalContent: true,
	Recursive: true,
	presetViews: '"tvshows"',
	Limit: 1,
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
		stringBuilder =
			stringBuilder +
			(item.Type == "Episode"
				? `I'm watching: <strong>📺 ${item?.SeriesName}  ${item.SeasonName} Episode ${item.IndexNumber}</strong> \n\n ${item.Name}`
				: item?.Name
					? `🎥 I'm watching: **${item.Name}**`
					: "");

		if (item.SeriesName.length > 0 || item.Name.length > 0) {
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
				query: item?.SeriesName ?? item.Name,
			});
			tmdb_url.search = tmdb_params.toString();

			const req = await fetch(tmdb_url.toString(), tmdb_options);
			const json = await req.json();
			const { poster_path, overview, original_name, vote_average } =
				json.results[0];
			if (poster_path && overview && original_name && vote_average) {
				const tmdbImgSrc = `https://image.tmdb.org/t/p/w300_and_h300_face${poster_path}`;
				stringBuilder =
					stringBuilder +
					` ⭐️ ${vote_average.toFixed(2)} \n\n${overview} \n\n![movie poster](${tmdbImgSrc})`;
			}
		}
	} catch (err) {
		console.error(`error reaching tmdb: ${err}`);
		stringBuilder =
			stringBuilder +
			`\n\nSomething went wrong with getting the Image, I'll fix it later.`;
	}

	return stringBuilder;
}

export default await getWatchingStatus();
