<script lang="ts">
	import Progress from "$lib/components/ui/progress/progress.svelte"
	import { onMount } from "svelte"

	type Present = { name: string; weight: number }

	let warehouse: Present[] = $state([])
	let cargo: Present[] = $state([])
	let draggedFrom: "warehouse" | "cargo" | null = $state(null)
	let draggedPresent: Present | null = $state(null)
	let draggedPresentIndex: number | null = $state(null)
	let totalLoad = $derived(Number(cargo.reduce((acc, p) => acc + p.weight, 0).toFixed(2)))

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

	function handleDrag(from: "warehouse" | "cargo", p: Present, i: number) {
		return (ev: DragEvent) => {
			draggedPresent = p
			draggedPresentIndex = i
			draggedFrom = from
		}
	}

	function handleOver(draggedTo: "cargo" | "warehouse") {
		return (ev: DragEvent) => {
			ev.preventDefault()
			if (
				ev.dataTransfer &&
				((draggedFrom == "warehouse" && draggedTo == "cargo") ||
					(draggedFrom == "cargo" && draggedTo == "warehouse"))
			) {
				ev.dataTransfer.dropEffect = "move"
			}
		}
	}

	function handleDrop(draggedTo: "cargo" | "warehouse") {
		return (ev: DragEvent) => {
			if (draggedPresent && draggedPresentIndex !== null) {
				if (draggedFrom == "cargo" && draggedTo == "warehouse") {
					warehouse.push(draggedPresent)
					cargo.splice(draggedPresentIndex, 1)
				} else if (
					draggedFrom == "warehouse" &&
					draggedTo == "cargo" &&
					!isWillOverload(draggedPresent.weight)
				) {
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

	function isWillOverload(load: number) {
		return totalLoad + load > 100
	}
</script>

<div class="flex flex-col gap-4">
	<div class="flex w-full gap-2">
		<div
			class="flex h-[640px] w-1/2 flex-wrap place-content-start justify-items-center gap-2 overflow-y-auto rounded-md border p-2"
			role="list"
			on:dragover={handleOver("warehouse")}
			on:drop={handleDrop("warehouse")}
		>
			{#each warehouse as p, i}
				<div
					class="h-[66px] min-w-[100px] select-none rounded-md border bg-white p-2 hover:cursor-move"
					role="button"
					tabindex={i}
					draggable="true"
					on:dragstart={(ev) => {
						// why?
						handleDrag("warehouse", p, i)(ev)
					}}
				>
					<p>{p.name}</p>
					<p>Weight: {p.weight}</p>
				</div>
			{/each}
		</div>

		<div class="flex h-[640px] w-1/2 flex-col gap-2">
			<div>Load: {totalLoad}/100</div>
			<Progress class="w-full" value={cargo.reduce((acc, p) => acc + p.weight, 0)} max={100} />
			<div
				class="flex h-full w-full flex-wrap place-content-start justify-items-center gap-2 overflow-y-auto rounded-md border p-2"
				role="list"
				on:dragover={handleOver("cargo")}
				on:drop={handleDrop("cargo")}
			>
				{#each cargo as p, i}
					<div
						class="h-[66px] min-w-[100px] select-none rounded-md border bg-white p-2 hover:cursor-move"
						role="button"
						tabindex={i}
						draggable="true"
						on:dragstart={(ev) => {
							// why?
							handleDrag("cargo", p, i)(ev)
						}}
					>
						<p>{p.name}</p>
						<p>Weight: {p.weight}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
