import dotenv from "dotenv";
dotenv.config();

const JELLYFIN_BASE_URL = `https://${process.env.JELLYFIN_HOST}`;
const JELLYFIN_HEADERS = {
	Authorization: `MediaBrowser Token="${process.env.JELLYFIN_API_KEY}"`,
	Accept: "application/json",
} as const;

interface JellyfinItem {
	Name?: string;
	SeriesName?: string;
	IndexNumber?: number;
	ParentIndexNumber?: number;
}

interface JellyfinResponse {
	Items?: JellyfinItem[];
}

export interface TvShow {
	series: string;
	season: number;
	episodeNumber: number;
	episodeName: string;
}

async function fetchJson<T>(url: URL, options: RequestInit): Promise<T> {
	const res = await fetch(url, options);
	if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
	return res.json() as Promise<T>;
}

export default async function getLatestPlayed(): Promise<
	TvShow | string | undefined
> {
	if (process.env.JELLYFIN_USER_ID === undefined)
		throw new Error("Missing JELLYFIN_USER_ID in the env");
	if (process.env.JELLYFIN_API_KEY === undefined)
		throw new Error("Missing JELLYFIN_API_KEY in the env");
	if (process.env.JELLYFIN_HOST === undefined)
		throw new Error("Missing JELLYFIN_HOST in the env");

	const url = new URL(
		`${JELLYFIN_BASE_URL}/Users/${process.env.JELLYFIN_USER_ID ?? ""}/Items`,
	);
	url.searchParams.set("SortBy", "DatePlayed");
	url.searchParams.set("SortOrder", "Descending");
	url.searchParams.set("Filters", "IsPlayed");
	url.searchParams.set("Recursive", "true");
	url.searchParams.set("Limit", "1");

	try {
		const { Items } = await fetchJson<JellyfinResponse>(url, {
			method: "GET",
			headers: JELLYFIN_HEADERS,
		});

		if (!Items?.length)
			throw new Error("Jellyfin API returned no items");

		const item = Items[0];

		if (
			typeof item.SeriesName === "string" &&
			typeof item.ParentIndexNumber === "number" &&
			typeof item.IndexNumber === "number"
		) {
			return {
				series: item.SeriesName,
				season: item.ParentIndexNumber ?? 0,
				episodeNumber: item.IndexNumber ?? 0,
				episodeName: item.Name ?? "",
			} satisfies TvShow;
		}

		return item.Name;
	} catch (err) {
		console.error(`Error reaching Jellyfin: ${err}`);
		return undefined;
	}
}
