import type { PageLoad } from "./$types"

export const load: PageLoad = async ({ params }) => {
	return {
		heartRate: await fetch("https://advent.sveltesociety.dev/data/2023/day-four.json")
			.then((res) => res.json())
			.then((data) => data.heartRate)
	}
}
