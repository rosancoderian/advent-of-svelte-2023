<script lang="ts">
	import { onMount } from "svelte"
	import { Progress } from "$lib/components/ui/progress"
	import * as Card from "$lib/components/ui/card"

	type Present = { name: string; weight: number }

	let warehouse: Present[] = $state([])
	let cargo: Present[] = $state([])
	let draggedFrom: "warehouse" | "cargo" | null = $state(null)
	let draggedPresent: Present | null = $state(null)
	let draggedPresentIndex: number | null = $state(null)

	onMount(async () => {
		if (!localStorage.getItem("warehouse") || localStorage.getItem("warehouse") === "[]") {
			await fetch("https://advent.sveltesociety.dev/data/2023/day-three.json")
				.then((res) => res.json())
				.then((data) => {
					localStorage.setItem("warehouse", JSON.stringify(data))
				})
		}
		warehouse = JSON.parse(localStorage.getItem("warehouse") || "[]")
    warehouse.sort((a, b) => a.weight - b.weight)
	})

	function handleDragFromWarehouse(p: Present, i: number) {
		return (ev: DragEvent) => {
			draggedPresent = p
			draggedPresentIndex = i
			draggedFrom = "warehouse"
		}
	}

	function handleDragFromCargo(p: Present, i: number) {
		return (ev: DragEvent) => {
			draggedPresent = p
			draggedPresentIndex = i
			draggedFrom = "cargo"
		}
	}

	function handleOverToCargo(ev: DragEvent) {
		ev.preventDefault()
		if (ev.dataTransfer && draggedFrom == "warehouse") {
			ev.dataTransfer.dropEffect = "move"
		}
	}

	function handleOverToWarehouse(ev: DragEvent) {
		ev.preventDefault()
		if (ev.dataTransfer && draggedFrom == "cargo") {
			ev.dataTransfer.dropEffect = "move"
		}
	}

	function handleDrop(draggedTo: "cargo" | "warehouse") {
		return (ev: DragEvent) => {
			if (draggedPresent && draggedPresentIndex !== null) {
				if (draggedFrom == "cargo" && draggedTo == "warehouse") {
					warehouse.push(draggedPresent)
					cargo.splice(draggedPresentIndex, 1)
				} else if (draggedFrom == "warehouse" && draggedTo == "cargo") {
					cargo.push(draggedPresent)
					warehouse.splice(draggedPresentIndex, 1)
				}
			}
			resetDragData()
      warehouse.sort((a, b) => a.weight - b.weight)
      cargo.sort((a, b) => a.weight - b.weight)
		}
	}

	function resetDragData() {
		draggedPresent = null
		draggedPresentIndex = null
		draggedFrom = null
	}
</script>

<div class="flex flex-col gap-4">
	<div class="flex w-full gap-2">
		<div
			class="flex h-[640px] w-1/2 flex-wrap place-content-start justify-items-center gap-2 overflow-y-auto rounded-md border p-2"
			role="list"
			on:dragover={handleOverToWarehouse}
			on:drop={handleDrop("warehouse")}
		>
			{#each warehouse as p, i}
				<div
					class="h-[66px] min-w-[100px] select-none rounded-md border bg-white p-2 hover:cursor-move"
					role="button"
					tabindex={i}
					draggable="true"
					on:dragstart={handleDragFromWarehouse(p, i)}
				>
					<p>{p.name}</p>
					<p>Weight: {p.weight}</p>
				</div>
			{/each}
		</div>

		<div
			class="flex h-[640px] w-1/2 flex-wrap place-content-start justify-items-center gap-2 overflow-y-auto rounded-md border p-2"
			role="list"
			on:dragover={handleOverToCargo}
			on:drop={handleDrop("cargo")}
		>
			{#each cargo as p, i}
				<div
					class="h-[66px] min-w-[100px] select-none rounded-md border bg-white p-2 hover:cursor-move"
					role="button"
					tabindex={i}
					draggable="true"
					on:dragstart={handleDragFromCargo(p, i)}
				>
					<p>{p.name}</p>
					<p>Weight: {p.weight}</p>
				</div>
			{/each}
		</div>
	</div>
</div>
