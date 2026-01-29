<template>
  <div>
    <div
      class="relative flex w-full h-80 bg-cover bg-center bg-no-repeat"
      style="background-image: url('/images/ac-components.png');"
    >
      <!-- Dark overlay -->
      <div class="absolute inset-0 bg-belk-dark-brown/40 backdrop-blur-sm"></div>

      <!-- Content -->
      <div class="relative z-10 flex w-full justify-center">
        <div class="flex flex-col sm:flex-row w-full justify-center sm:justify-between px-12 md:px-28 items-center space-y-6 sm:space-y-0 sm:gap-x-6">

          <h2 class="text-white text-center sm:text-start text-[32px] font-semibold">
            Call us to schedule a <span class="font-lobster italic font-semibold">Free</span> walkthrough estimate!
          </h2>

          <RoofingButton
            href="/contact"
            class="px-4 py-3 whitespace-nowrap text-sm sm:text-base"
            buttonClasses="primary"
            text="Schedule Free Estimate"
          />

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
