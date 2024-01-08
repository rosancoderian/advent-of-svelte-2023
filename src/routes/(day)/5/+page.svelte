<script lang="ts">
	import { onMount } from "svelte"
	import * as Card from "$lib/components/ui/card"
	import type { Task } from "./+page"

	const { data } = $props()

	let tasks: Task[] = $state(data.tasks ?? [])
	let tasksByElf: Record<string, Task[]> = $derived(getTaskByElf(tasks))
	let taskSummaryByElf = $derived(
		Object.entries(tasksByElf).map(([elf, tasks]) => taskSummary(tasks))
	)

	$effect(() => console.log(taskSummaryByElf))

	onMount(() => {
		const interval = setInterval(async () => {
			tasks = await fetchTasks()
		}, 3000)
		return () => {
			clearInterval(interval)
		}
	})

	function getTaskByElf(tasks: Task[]) {
		return tasks.reduce((acc: typeof tasksByElf, task) => {
			const elf = task.elf
			if (!acc[elf]) acc[elf] = []
			acc[elf].push(task)
			return acc
		}, {})
	}

	function taskSummary(tasks: Task[]) {
		return {
			elf: tasks[0].elf,
			totalTasks: tasks.length,
			totalCreatedToys: tasks.reduce(
				(acc, task) => (task.task === "CREATED_TOY" ? acc + 1 : acc),
				0
			),
			totalWrappedPresents: tasks.reduce(
				(acc, task) => (task.task === "WRAPPED_PRESENT" ? acc + 1 : acc),
				0
			),
			avgMinutes: tasks.reduce((acc, task) => acc + task.minutesTaken, 0) / tasks.length
		}
	}

	function fetchTasks() {
		return fetch("https://advent.sveltesociety.dev/data/2023/day-five.json").then((res) =>
			res.json()
		)
	}
</script>

<div class="flex flex-wrap gap-4">
	{#each taskSummaryByElf as { elf, totalTasks, totalCreatedToys, totalWrappedPresents, avgMinutes }}
		<Card.Root class="w-[300px]">
			<Card.Header>
				<Card.Title>{elf}</Card.Title>
			</Card.Header>
			<Card.Content>
				<div>Total tasks: {totalTasks}</div>
				<div>Total created toys: {totalCreatedToys}</div>
				<div>Total wrapped presents: {totalWrappedPresents}</div>
				<div>Avg min/task: {avgMinutes.toFixed(2)}</div>
			</Card.Content>
		</Card.Root>
	{/each}
</div>
