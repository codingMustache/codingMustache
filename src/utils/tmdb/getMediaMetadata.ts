import dotenv from "dotenv";
import type { TvShow } from "../jellyfin/getLastPlayed.ts";

dotenv.config();

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMG_BASE_URL = "https://image.tmdb.org/t/p/w300_and_h300_face";
const TMDB_HEADERS = {
	Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
	Accept: "application/json",
} as const;

export interface TmdbResult {
	vote: number;
	overview: string;
	imgUrl: string;
}

interface TmdbApiResult {
	poster_path?: string;
	overview?: string;
	original_name?: string;
	vote_average?: number;
}

interface TmdbResponse {
	results: TmdbApiResult[];
}

function buildSearchQuery(src: string | TvShow): string {
	return typeof src === "string" ? src : src.series;
}

export default async function getMediaMetadata(
	src: string | TvShow,
): Promise<TmdbResult | TvShow | string | undefined> {
	const url = new URL(
		`${TMDB_BASE_URL}/search/${typeof src !== "string" ? "tv" : "movie"}`,
	);
	url.searchParams.set("limit", "1");
	url.searchParams.set("query", buildSearchQuery(src));

	try {
		const res = await fetch(url, {
			method: "GET",
			headers: TMDB_HEADERS,
		});
		if (!res.ok)
			throw new Error(`HTTP ${res.status}: ${res.statusText}`);

		const { results } = (await res.json()) as TmdbResponse;

		const first = results?.[0];
		if (
			first?.poster_path &&
			first?.overview &&
			first?.original_name &&
			first?.vote_average
		) {
			return {
				vote: parseFloat(first.vote_average.toFixed(2)),
				overview: first.overview,
				imgUrl: `${TMDB_IMG_BASE_URL}${first.poster_path}`,
			};
		}

		return src;
	} catch (err) {
		console.error(`Error reaching TMDB: ${err}`);
		return undefined;
	}
}
