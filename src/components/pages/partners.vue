<template>
    <section class="bg-belk-cream py-16 px-0">
        <div class="w-full">
            <p class="text-center text-sm font-bold uppercase mb-10" style="letter-spacing: 1.4px;">
                Recognized by leading organizations
            </p>
          <section class="flex w-full justify-around overflow-x-scroll">
            <div class="mx-auto">
              <div class="grid grid-rows-2 md:grid-rows-1 grid-flow-col auto-cols-max gap-4 sm:gap-6 flex w-full items-center p-4 justify-center mix-blend-luminosity">
                <img
                  v-for="(logo, index) in logos"
                  :key="index"
                  :src="logo"
                  class="max-w-20 max-h-16 sm:max-w-32 sm:max-h-28 w-full mix-blend-luminosity flex justify-center"
                />
              </div>
            </div>
          </section>
        </div>
    </section>
</template>

<script>
export default {

  data() {

    return {
      logos: [
        '/images/mitsibushi-partner.svg',
        '/images/rudd-partner.svg',
        '/images/bryant-partner.svg',
        '/images/trane-partner.svg',
        '/images/as-partner.svg',
        '/images/carrier-partner.svg',
        '/images/trane-special-partner.svg',
        '/images/bosch-partner.svg',
      ],
    }
  },
}
</script>
