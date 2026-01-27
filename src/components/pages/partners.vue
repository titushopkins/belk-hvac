<template>
    <section class="bg-roofing-cream py-16 px-0">
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
        '/images/home-advisor-screened.svg',
        '/images/preffered-contractor.svg',
        '/images/home-advisor-elite-service.svg',
        '/images/home-advisor-best-of.svg',
        '/images/accredited-business.svg',
        '/images/angelas-list.svg',
        '/images/angelas-list-super-service.svg',
        '/images/home-advisor-top-rated.svg',
        '/images/home-advisor-screened.svg',
'/images/Mueller.png',
        '/images/Mule-Hide-Certified-Vector-Logo.png',
        '/images/master-elite.png',
      ],
    }
  },
}
</script>
