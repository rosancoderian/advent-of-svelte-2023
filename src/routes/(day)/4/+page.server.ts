import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ params }) => {
	return {
		heartRate: await fetch("https://advent.sveltesociety.dev/data/2023/day-four.json")
			.then((res) => res.json())
			.then((data) => data.heartRate)
	}
}
