<script>
	import { IconContext } from "phosphor-svelte"
	import "../app.pcss"
</script>

<nav class="sticky top-0 z-50 w-full border-b bg-background/95 p-4 shadow-sm">
	<a href="/"> Advent of Svelte 2023 </a>
</nav>
<div class="container mx-auto">
	<IconContext values={{ size: 24 }}>
		<slot />
	</IconContext>
</div>
