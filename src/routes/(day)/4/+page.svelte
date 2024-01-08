<script lang="ts">
	import { Heartbeat } from "phosphor-svelte"
	import { onMount } from "svelte"
	import { page } from "$app/stores"
	import { tweened } from "svelte/motion"
	import { cubicOut } from "svelte/easing"

	let heartRate = $state($page.data.heartRate)

	let heartSize = tweened(1, {
		duration: 500,
		easing: cubicOut
	})

	onMount(() => {
		const interval = setInterval(async () => {
			$heartSize += 0.1
			heartRate = await fetchHartrate()
			$heartSize -= 0.1
		}, 1000)
		return () => {
			clearInterval(interval)
		}
	})

	function fetchHartrate() {
		return fetch("https://advent.sveltesociety.dev/data/2023/day-four.json")
			.then((res) => res.json())
			.then((data) => data.heartRate)
	}
</script>

<div class="text-center">
	<Heartbeat class="mx-auto" style="transform: scale({$heartSize})" size={64} weight="fill" />
	{heartRate}
</div>
