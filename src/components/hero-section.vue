<template>
  <div class="relative h-screen max-h-[700px] lg:max-h-[750px] xl:max-h-screen flex flex-col justify-end overflow-hidden">

    <!-- Background image layer -->
    <div
      class="absolute inset-0 bg-[url('/images/hero-background.jpg')] bg-cover bg-center"
    >
      <!-- Overlay ONLY on background image -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-20% via-black/30 to-transparent" />
    </div>

    <!-- Content layer -->
    <div class="relative z-10 w-full h-auto rounded-lg shadow-sm flex">
      <div class="flex w-full gap-2 pt-4">

        <!-- Left content -->
          <div class="pl-6 sm:pl-12 xl:pl-20 space-y-8 xl:space-y-12 text-white flex flex-col h-[500px] md:h-full">
            <h1 class="text-3xl xs:text-4xl sm:text-5xl xl:text-7xl leading-tight font-semibold text-shadow-xl max-w-xs sm:max-w-lg md:max-w-none">
              The
              <span class="font-lobster font-semibold px-1 inline">trusted</span>
              roofer of Woodville, Texas.
              <span class="font-lobster font-semibold px-1 inline">39 years</span>
               on top and still climbing.
            </h1>

            <a href="/contact"
              class="text-base sm:font-semibold text-white bg-roofing-red
                     rounded-full px-4 sm:px-8 py-4 w-fit"
            >
              Request a Free Quote
            </a>

            <!-- Bottom-fixed content -->
             <div class="bottom-0 absolute pb-8 xl:pb-12">
              <div class="flex flex-col md:flex-row w-full items-center gap-4 mt-auto">
                <div class="flex flex-col gap-[1px]">
                  <img src="/images/stars.svg" class="w-[85px]" />
                  <p class="text-sm">5 stars on Google</p>
                </div>

                <div class="flex flex-col gap-[2px]">
                  <p class="text-base font-semibold">2,000+</p>
                  <p class="text-sm">Satisfied customers</p>
                </div>

                <div class="hidden md:flex flex-col gap-[2px]">
                  <p class="text-base font-semibold">1986</p>
                  <p class="text-sm">Founded</p>
                </div>
              </div>
            </div>
          </div>


        <!-- Right image -->
        <div class="flex w-full justify-end items-end max-h-[500px] xl:max-h-[700px] absolute md:relative bottom-0">
          <img
            src="/images/justin-Illustration.svg"
            alt=""
            class="w-auto h-full xs:h-[500px] min-w-[150px] md:hidden rounded-tl-[80px]"
          />
          <img
            src="/images/hero-character.png"
            alt=""
            class="w-auto h-full xs:h-[500px] xl:h-[700px] min-w-[400px] xl:min-w-[590px] hidden md:block rounded-tl-[80px]"
          />
        </div>

      </div>
    </div>

  </div>
</template>



<script>
import RoofingButton from './roofing-button.vue'

export default {
    name: 'HeroSection',
    components: { RoofingButton },
    props: {
        buttonText: {
            type: String,
            default: 'Request a Free Quote'
        },
        // Route path or URL to go to when the button is clicked
        buttonLink: {
            type: String,
            default: null
        }
    },
    methods: {
        handleButtonClick() {
            // If you're using vue-router:
            if (this.buttonLink && this.$router) {
                this.$router.push(this.buttonLink)
            }
            // If your RoofingButton already handles links (like a `to` prop),
            // you can instead pass `buttonLink` down and remove this method.
        }
    }
}
</script>
