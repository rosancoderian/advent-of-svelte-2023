import type { PageLoad } from "./$types"

export type Task = {
	elf: string
	minutesTaken: number
	task: "WRAPPED_PRESENT" | "CREATED_TOY"
	date: string
}

export const load: PageLoad = async ({ params }) => {
	const tasks: Task[] = await fetch("https://advent.sveltesociety.dev/data/2023/day-five.json").then(
		(res) => res.json()
	)
	return {
		tasks
	}
}
