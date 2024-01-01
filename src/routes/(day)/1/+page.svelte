<script lang="ts">
	import { onMount } from "svelte"
	import * as Table from "$lib/components/ui/table"
	import { Button } from "$lib/components/ui/button"
	import { Input } from "$lib/components/ui/input"
	import { EditableText } from "$lib/components/editable-text"

	import { CaretLeft, CaretRight, Trash, PlusCircle } from "phosphor-svelte"

	import { page } from "$app/stores"
	import { goto } from "$app/navigation"

	const perPage = 10

	let data: { name: string; tally: number }[] = $state([])
	let currPage = $state(Number($page.url.searchParams.get("p")) || 1)
	let newName = $state("")
	let newTally = $state(0)

	let totalPage = $derived(Math.ceil(data.length / perPage))
	let filteredData = $derived(data.slice((currPage - 1) * perPage, currPage * perPage))
	let isEditable = $derived(!!newName)

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

	$effect(() => {
		$page.url.searchParams.set("p", currPage.toString())
		goto($page.url.toString(), { noScroll: true, keepFocus: true })
	})

	function handleNextPage() {
		if (currPage < totalPage) currPage++
	}

	function handlePrevPage() {
		if (currPage > 1) currPage--
	}

	function handleAdd() {
		data = [{ name: newName, tally: newTally }, ...data]
		newName = ""
		newTally = 0
		localStorage.setItem("data", JSON.stringify(data))
		currPage = 1
	}

	function handleRemove(index: number) {
		return () => {
			const i = rowNum(index) - 1
			data.splice(i, 1)
			localStorage.setItem("data", JSON.stringify(data))
			if (filteredData.length == 0) handlePrevPage()
		}
	}

	function handleUpdate(index: number, key: string) {
		return (ev: CustomEvent) => {
			const i = rowNum(index) - 1
			data[i] = {
				...data[i],
				[key]: ev.detail.value
			}
			localStorage.setItem("data", JSON.stringify(data))
		}
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

	function rowNum(i: number) {
		return i + 1 + 10 * (currPage - 1)
	}
</script>

<div class="mx-auto flex h-[924px] w-[1024px] flex-col justify-between">
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
			<Button on:click={handleAdd} disabled={!isEditable}>
				<PlusCircle class="mr-2" />
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
							<Table.Cell>{rowNum(i)}</Table.Cell>
							<Table.Cell>
								<EditableText value={name} on:change={handleUpdate(i, "name")} />
							</Table.Cell>
							<Table.Cell class="text-right">
								<EditableText value={tally} on:change={handleUpdate(i, "tally")} />
							</Table.Cell>
							<Table.Cell>{tallyStatus(tally)}</Table.Cell>
							<Table.Cell class="float-end">
								<Button variant="destructive" on:click={handleRemove(i)}>
									<Trash />
								</Button>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	</div>
	<div class="flex w-full justify-center gap-4 p-4">
		<Button variant="outline" size="icon" on:click={handlePrevPage} disabled={currPage <= 1}>
			<CaretLeft />
		</Button>
		<Input type="number" class="w-[80px]" min="1" max={totalPage} bind:value={currPage} />
		<Button
			variant="outline"
			size="icon"
			on:click={handleNextPage}
			disabled={currPage >= totalPage}
		>
			<CaretRight />
		</Button>
	</div>
</div>
