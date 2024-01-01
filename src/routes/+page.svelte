<script>
	import * as Card from "$lib/components/ui/card"
	import challanges from "$lib/challanges"
</script>

<div class="flex justify-center gap-4 py-4">
	{#each challanges as challange, i}
		<a href={challange.path}>
			<Card.Root class="w-[300px]">
				<Card.Header>
					<Card.Title>Day {i + 1}</Card.Title>
					<Card.Description>{challange.label}</Card.Description>
				</Card.Header>
			</Card.Root>
		</a>
	{/each}
</div>
