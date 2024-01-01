<script>
	import { IconContext } from "phosphor-svelte"
	import "../app.pcss"
</script>

<IconContext values={{ size: 24 }}>
	<div class="container mx-auto py-6">
		<slot />
	</div>
</IconContext>
