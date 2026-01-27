<template>
	<div class="flex w-full justify-center p-4">
		<div class="w-full mt-8">
			<div class="flex items-center justify-between text-xs text-roofing-light-gray mb-2">
				<span>$0</span>
				<span>$1000</span>
			</div>

			<!-- Fake slider bar -->
			<div class="relative w-full h-2 bg-roofing-light-gray/40 rounded-full">
				<div class="absolute left-[15%] right-[20%] h-2 bg-roofing-orange rounded-full"></div>

				<!-- Fake dots -->
				<div class="absolute left-[15%] top-1/2 -translate-y-1/2 w-4 h-4 bg-roofing-orange border-2 border-white rounded-full"></div>
				<div class="absolute left-[80%] top-1/2 -translate-y-1/2 w-4 h-4 bg-roofing-orange border-2 border-white rounded-full"></div>
			</div>

			<div class="flex justify-between mt-3 text-xs text-white font-semibold">
				<span>$150</span>
				<span>$800</span>
			</div>
		</div>
	</div>
</template>

<script>
export default {}
</script>
