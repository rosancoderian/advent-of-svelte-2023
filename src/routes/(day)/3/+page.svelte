<script lang="ts">
	import { onMount } from "svelte"
	import { Progress } from "$lib/components/ui/progress"
	import * as Card from "$lib/components/ui/card"

	type Present = { name: string; weight: number }

	let presents: Present[] = $state([])
	let cargo: Present[] = $state([])
	let draggedPresent: Present | null = $state(null)
  let draggedPresentIndex: number | null = $state(null)

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

	function handleDragPresent(p: Present, i: number) {
		return (ev: DragEvent) => {
			console.log("drag", ev)
			draggedPresent = p
      draggedPresentIndex = i
		}
	}

	function handleOverCargo(ev: DragEvent) {
		console.log("over", ev)
		ev.preventDefault()
		if (ev.dataTransfer) {
			ev.dataTransfer.dropEffect = "move"
		}
	}

	function handleDropToCargo(ev: DragEvent) {
		console.log("drop", ev)
		if (draggedPresent && draggedPresentIndex !== null) {
			cargo.push(draggedPresent)
      presents.splice(draggedPresentIndex, 1)
		}
		draggedPresent = null
    draggedPresentIndex = null
	}
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
					on:dragstart={handleDragPresent(p, i)}
				>
					<p>{p.name}</p>
					<p>Weight: {p.weight}</p>
				</div>
			{/each}
		</div>

		<div
			class="flex h-[640px] w-1/2 flex-wrap place-content-start justify-items-center gap-2 overflow-y-auto rounded-md border p-2"
			role="list"
			on:dragover={handleOverCargo}
			on:drop={handleDropToCargo}
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
