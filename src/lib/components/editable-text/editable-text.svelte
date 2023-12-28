<script lang="ts">
	import { Button } from "$lib/components/ui/button"
	import Input from "$lib/components/ui/input/input.svelte"
	import { createEventDispatcher } from "svelte"

	const dispatch = createEventDispatcher()

	let { value, type = "text", ...restProps } = $props()

	let elInput: HTMLInputElement | undefined = $state(undefined)
	let isEditMode = $state(false)

  function handleEnter(e: KeyboardEvent) {
    if (e.key === "Enter") {
      disableEdit()
    }
  }

	function enableEdit() {
		isEditMode = true
	}

	function disableEdit() {
		isEditMode = false
		dispatch("change", { value })
	}

  $effect(() => {
    if (elInput) elInput.focus()
  })
</script>

{#if isEditMode}
	<Input bind:ref={elInput} {type} on:blur={disableEdit} on:keydown={handleEnter} bind:value />
{:else}
	<Button variant="ghost" on:click={enableEdit}>
		{value}
	</Button>
{/if}
