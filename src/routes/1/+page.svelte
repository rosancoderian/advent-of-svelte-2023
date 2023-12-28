<script lang="ts">
	import { onMount } from "svelte"
	import * as Table from "$lib/components/ui/table"
	import { Button } from "$lib/components/ui/button"
	import { Input } from "$lib/components/ui/input"
	import { EditableText } from "$lib/components/editable-text"

	import { ChevronLeft, ChevronRight, PlusCircle, Trash2 } from "lucide-svelte"

	const perPage = 10

	let data: { name: string; tally: number }[] = $state([])
	let page = $state(1)
	let newName = $state("")
	let newTally = $state(0)

	let totalPage = $derived(data.length / perPage)
	let filteredData = $derived(data.slice((page - 1) * perPage, page * perPage))

	onMount(async () => {
		if (!localStorage.getItem("data") || localStorage.getItem("data") === "[]") {
			await fetch("https://advent.sveltesociety.dev/data/2023/day-one.json")
				.then((res) => res.json())
				.then((data) => {
					localStorage.setItem("data", JSON.stringify(data))
				})
		}
		data = JSON.parse(localStorage.getItem("data") || "[]")
	})

	function nextPage() {
		if (page < totalPage) page++
	}

	function prevPage() {
		if (page > 1) page--
	}

	function tallyStatus(tally: number) {
		if (tally > 50) {
			return "Nice!"
		} else if (tally < 0) {
			return "Naughty"
		} else {
			return "So so"
		}
	}

	function no(i: number) {
		return i + 1 + 10 * (page - 1)
	}

	function addRecord() {
		data = [{ name: newName, tally: newTally }, ...data]
		newName = ""
		newTally = 0
		localStorage.setItem("data", JSON.stringify(data))
		page = 1
	}

	function removeRecord(index: number) {
		return () => {
			const i = no(index) - 1
			data = data.toSpliced(i, 1)
			localStorage.setItem("data", JSON.stringify(data))
			if (filteredData.length == 0) prevPage()
		}
	}

	function updateRecord(index: number, key: string) {
		return (ev: CustomEvent) => {
			const i = no(index) - 1
			const record = {
				...data[i],
				[key]: ev.detail.value
			}
			data = data.toSpliced(i, 1, record)
			localStorage.setItem("data", JSON.stringify(data))
		}
	}

	function isEditable() {
		return !!newName
	}
</script>

<div class="mx-auto flex h-[924px] w-[560px] flex-col justify-between">
	<div>
		<div class="flex justify-end gap-2 py-4">
			<Input name="name" type="text" placeholder="Name" bind:value={newName} />
			<Input
				name="tally"
				type="number"
				placeholder="Tally"
				class="w-[100px]"
				bind:value={newTally}
			/>
			<Button on:click={addRecord} disabled={!isEditable()}>
				<!-- <PlusCircle class="mr-2" /> -->
				Add
			</Button>
		</div>
		<div class="rounded-md border">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head class="w-[60px]">NO.</Table.Head>
						<Table.Head>Name</Table.Head>
						<Table.Head class="w-[100px] text-right">Tally</Table.Head>
						<Table.Head class="w-1">Status</Table.Head>
						<Table.Head class="w-1"></Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each filteredData as { name, tally }, i}
						<Table.Row>
							<Table.Cell>{no(i)}</Table.Cell>
							<Table.Cell>
								<EditableText value={name} on:change={updateRecord(i, "name")} />
							</Table.Cell>
							<Table.Cell class="text-right">
								<EditableText value={tally} on:change={updateRecord(i, "tally")} />
							</Table.Cell>
							<Table.Cell>{tallyStatus(tally)}</Table.Cell>
							<Table.Cell class="float-end">
								<Button variant="destructive" on:click={removeRecord(i)}>
									<!-- <Trash2 class="mr-2" /> -->
									Remove
								</Button>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	</div>
	<div class="flex w-full justify-center gap-4 p-4">
		<Button variant="outline" on:click={prevPage}>
			<ChevronLeft />
		</Button>
		<Input type="number" class="w-[80px]" min="1" max={totalPage} bind:value={page} />
		<Button variant="outline" on:click={nextPage}>
			<ChevronRight />
		</Button>
	</div>
</div>
