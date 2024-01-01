<script>
	import { Button } from "$lib/components/ui/button"
	import { Progress } from "$lib/components/ui/progress"
	import { Cookie } from "phosphor-svelte"

	let cookies = $state(5)
	let eaten = $state(0)
</script>

<div class="flex flex-col gap-4">
	<div class="flex items-center gap-2">
		<Button on:click={() => cookies++}>Add a cookie</Button>
		<Button on:click={() => (eaten < cookies ? eaten++ : null)}>Eat a cookie</Button>
		<Button on:click={() => (eaten = 0)}>Reset</Button>
	</div>
	<div class="flex gap-2">
		{#each { length: cookies } as _, i}
			<Cookie size={42} opacity={i + 1 > cookies - eaten ? 0.5 : 1} />
		{/each}
	</div>
	<Progress value={eaten} max={cookies} class="w-full" />
	<div>
		Cookies: {cookies}
		<br />
		Eaten: {eaten}
	</div>
</div>
