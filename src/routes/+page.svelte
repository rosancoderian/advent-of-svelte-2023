<script>
	import * as Card from "$lib/components/ui/card"

	const challanges = ["Naughty or Nice", "Merry Munch-o-Meter", "Jingle Bell Balancer"]
</script>

<div class="flex justify-center gap-4">
	{#each challanges as challange, i}
		<a href="/{i + 1}">
			<Card.Root class="w-[300px]">
				<Card.Header>
					<Card.Title>Day {i + 1}</Card.Title>
					<Card.Description>{challange}</Card.Description>
				</Card.Header>
			</Card.Root>
		</a>
	{/each}
</div>
