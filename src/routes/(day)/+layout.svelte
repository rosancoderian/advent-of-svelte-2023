<script lang="ts">
	import * as Select from "$lib/components/ui/select"
	import challanges from "$lib/challanges"
	import { page } from "$app/stores"
	import { Button } from "$lib/components/ui/button"

	let title = $derived(challanges.find((c) => c.path === $page.url.pathname)?.label)
</script>

<div class="flex">
	<div class="py-4 w-[260px]">
		<p class="text-lg font-semibold">Challanges:</p>
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
	<div class="w-full p-4">
		<p class="text-center text-lg font-semibold pb-4">{title}</p>
		<slot />
	</div>
</div>
