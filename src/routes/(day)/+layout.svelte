<script lang="ts">
	import * as Select from "$lib/components/ui/select"
	import challanges from "$lib/challanges"
	import { page } from "$app/stores"
	import { goto } from "$app/navigation"
	import { type Selected } from "bits-ui"
	import { Button } from "$lib/components/ui/button"

	let title = $derived(challanges.find((c) => c.path === $page.url.pathname)?.label)
</script>

<div class="flex">
	<div class="p-4 w-[260px]">
		{#each challanges as c}
			<div>
				<Button variant="link" href={c.path}>
					{#if $page.url.pathname === c.path}
						<strong>{c.label}</strong>
					{:else}
						{c.label}
					{/if}
				</Button>
			</div>
		{/each}
	</div>
	<div class="w-full gap-2 border-l p-4">
		<slot />
	</div>
</div>
