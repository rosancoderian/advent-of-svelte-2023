<script>
	import { IconContext } from "phosphor-svelte"
	import "../app.pcss"
</script>

<nav class="sticky top-0 z-50 w-full border-b bg-background/95 p-4 shadow-sm">
	<div class="container">
		<a href="/"> Advent of Svelte 2023 </a>
	</div>
</nav>
<div class="container mx-auto">
	<IconContext values={{ size: 24 }}>
		<slot />
	</IconContext>
</div>
