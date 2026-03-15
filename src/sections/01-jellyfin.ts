import getLatestPlayed from "../utils/jellyfin/getLastPlayed.ts";
import getMediaMetadata from "../utils/tmdb/getMediaMetadata.ts";
import type { TmdbResult } from "../utils/tmdb/getMediaMetadata.ts";

function formatMovie(title: string, meta: TmdbResult): string {
	return `## 🎬 Now Watching

<table>
  <tr>
    <td valign="top" width="75%">
      <h3>${title}</h3>
      <p>${meta.overview}</p>
      <p>⭐ <strong>${meta.vote}</strong> / 10</p>
    </td>
    <td valign="top" align="right">
      <img src="${meta.imgUrl}" alt="${title}" width="150px"/>
    </td>
  </tr>
</table>`;
}

function formatTvShow(
	series: string,
	season: number,
	episodeNumber: number,
	episodeName: string,
	meta: TmdbResult,
): string {
	const s = String(season).padStart(2, "0");
	const e = String(episodeNumber).padStart(2, "0");
	return `## 📺 Now Watching

<table>
  <thead>
    <tr>
      <th>🖼️</th>
      <th>Series</th>
      <th>Season / Episode</th>
      <th>Rating</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><img src="${meta.imgUrl}" alt="${series}" width="100%" height="auto"/></td>
      <td><strong>${series}</strong></td>
      <td><code>S${s}E${e}</code> <em>${episodeName}</em></td>
      <td>⭐ ${meta.vote} / 10</td>
      <td>${meta.overview}</td>
    </tr>
  </tbody>
</table>`;
}

async function getWatchingStatus(): Promise<string> {
	try {
		const lastPlayed = await getLatestPlayed();
		if (!lastPlayed) return "";

		const tmdbMetadata = await getMediaMetadata(lastPlayed);
		const meta = tmdbMetadata as TmdbResult;

		if (typeof lastPlayed === "string") {
			return meta
				? formatMovie(lastPlayed, meta)
				: `## 🎬 Now Watching\n\n**${lastPlayed}**`;
		}

		if ("series" in lastPlayed) {
			const { series, season, episodeNumber, episodeName } =
				lastPlayed;
			return meta
				? formatTvShow(
						series,
						season,
						episodeNumber,
						episodeName,
						meta,
					)
				: `## 📺 Now Watching\n\n **${series}** — S${String(season).padStart(2, "0")}E${String(episodeNumber).padStart(2, "0")}`;
		}

		return "";
	} catch (err) {
		console.error(`Error in getWatchingStatus: ${err}`);
		return "";
	}
}

export default await getWatchingStatus();
