<script lang="ts">
	import { onMount } from "svelte"
	import { Progress } from "$lib/components/ui/progress"
	import * as Card from "$lib/components/ui/card"

	type Present = { name: string; weight: number }

	let presents: Present[] = $state([])
	let cargo: Present[] = $state([])
	let draggedData: Present | null = $state(null)

	onMount(async () => {
		if (!localStorage.getItem("presents") || localStorage.getItem("presents") === "[]") {
			await fetch("https://advent.sveltesociety.dev/data/2023/day-three.json")
				.then((res) => res.json())
				.then((data) => {
					localStorage.setItem("presents", JSON.stringify(data))
				})
		}
		presents = JSON.parse(localStorage.getItem("presents") || "[]")
	})
</script>

<div class="flex flex-col gap-4">
	<div class="flex w-full gap-2">
		<div
			class="flex h-[640px] w-1/2 flex-wrap place-content-start justify-items-center gap-2 overflow-y-auto rounded-md border p-2"
		>
			{#each presents as p, i}
				<div
					class="h-[66px] min-w-[100px] select-none rounded-md border bg-white p-2 hover:cursor-move"
					role="button"
					tabindex={i}
					draggable="true"
					on:dragstart={(ev) => {
						draggedData = p
						console.log(ev)
					}}
				>
					<p>{p.name}</p>
					<p>Weight: {p.weight}</p>
				</div>
			{/each}
		</div>

		<div
			class="flex h-[640px] w-1/2 flex-wrap place-content-start justify-items-center gap-2 overflow-y-auto rounded-md border p-2"
			role="list"
			on:dragover={(ev) => {
				ev.preventDefault()
				if (ev.dataTransfer) {
					ev.dataTransfer.dropEffect = "move"
				}
			}}
			on:drop={(ev) => {
				console.log("drop", ev)
				if (draggedData) {
					cargo.push(draggedData)
				}
				draggedData = null
			}}
		>
			{#each cargo as p, i}
				<div
					class="h-[66px] min-w-[100px] select-none rounded-md border bg-white p-2 hover:cursor-move"
				>
					<p>{p.name}</p>
					<p>Weight: {p.weight}</p>
				</div>
			{/each}
		</div>
	</div>
</div>
