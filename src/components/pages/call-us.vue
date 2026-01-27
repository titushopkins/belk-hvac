<template>
    <div>
        <!-- <img class="flex w-full" src="/images/brown-grid.svg" /> -->
      <div
        class="flex w-full bg-cover h-80 bg-center bg-no-repeat"
        style="background-image: url('/images/brown-bg-grid.svg');"
      >
        <div class="flex w-full justify-center">
          <div class="flex flex-col sm:flex-row w-full justify-center sm:justify-between px-12 md:px-28 items-center space-y-6 sm:space-y-0 sm:gap-x-6">
            <h2 class="text-white text-center sm:text-start text-[32px] font-semibold relative z-10">
                Call us and get a <span class="font-lobster italic font-semibold">Lott</span> better roof!
            </h2>
            <RoofingButton href="/contact" class="px-4 py-3 whitespace-nowrap text-sm sm:text-base" buttonClasses="primary"
            text="Request a Free Quote" />
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import RoofingButton from '../roofing-button.vue'

export default {
    components: {
        RoofingButton
    }
}
</script>
