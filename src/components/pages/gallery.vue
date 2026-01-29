<template>
	<div class="w-full">
		<div class="w-full h-screen max-h-[60vh] bg-cover bg-center bg-belk-dark-gray">
			<div class="flex flex-col w-full justify-center h-full items-center text-center">
				<h2 class="text-white text-2xl sm:text-[32px] font-semibold relative z-10 font-lobster italic">Services Gallery</h2>
				<div class="flex w-full justify-center items-center text-center text-5xl sm:text-6xl font-semibold text-white">Check out our work!</div>
			</div>
		</div>

		<section class="px-0 w-full bg-gray-900">
			<div class="flex w-full justify-center items-center">
				<FilteredSearch />
			</div>
		</section>

		<section class="px-0 w-full">
          <div class="w-full">
            <div class="flex flex-col md:flex-row w-full justify-center px-8 py-12 sm:p-12">
              <div class="flex flex-col w-full gap-y-8">
                <div class="text-3xl font-semibold">Find out why your neighbors trust Belk Heating & Cooling LLC</div>

                <div class="text-base leading-6 space-y-4">
                  <div>
                    Belk Heating & Cooling is built on experience, integrity, and a commitment to keeping Texas homes comfortable year-round.
                  </div>

                  <div>
                    Our team brings years of hands-on experience in heating and air conditioning systems, from fast, reliable repairs to full system installations. We believe in doing every job with excellence, honesty, and care for the families we serve.
                  </div>

                  <div>
                    Belk Heating & Cooling has proudly served local communities for years, providing dependable HVAC services homeowners can rely on in every season.
                  </div>
                </div>

                <div class="flex flex-col sm:flex-row w-full justify-between items-start gap-6 sm:items-center p-6 bg-gray-100 rounded-xl">
                  <div class="text-xl md:text-2xl font-semibold">
                    Contact us now to schedule your HVAC service!
                  </div>

                  <div class="text-white text-base md:text-lg w-full max-w-[15rem]">
                    <a
                      href="/contact"
                      class="bg-belk-red p-3 sm:p-4 rounded-full font-semibold w-full shadow-sm shadow-belk-gray"
                    >
                      Request a Free Quote
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

		<section class="bg-belk-cream md:p-16 px-0">
			<div class="w-full">
				<div class="flex flex-col md:flex-row w-full justify-center p-12">
					<div class="flex flex-col md:flex-row w-full flex max-w-8xl justify-between gap-y-12 md:gap-y-none md:gap-x-12 text-center overflow-hidden w-full text-[#2c2824]">
						<div class="w-fit flex flex-col items-center gap-4">
							<img src="/images/settings-jay-lott.svg" alt="Partner logo" class="w-auto max-w-60 mix-blend-luminosity" />
							<div class="text-xl sm:text-3xl font-semibold">Professional</div>
							<div class="text-sm">We strive for high standards in a safe, clean work environment. We use only the highest quality installation materials and the best installation methods.</div>
						</div>
						<div class="w-fit flex flex-col items-center gap-y-4">
							<img src="/images/thumbs-up-jay-lott.svg" alt="Partner logo" class="w-auto max-w-60 mix-blend-luminosity" />
							<div class="text-xl sm:text-3xl font-semibold">Affordable</div>
							<div class="text-sm">We work hard to maintain competitive, reasonable prices for our customers. Don't pay thought the roof for our service!</div>
						</div>
						<div class="w-fit flex flex-col items-center gap-4">
							<img src="/images/calendar-jay-lott.svg" alt="Partner logo" class="w-auto max-w-60 mix-blend-luminosity" />
							<div class="text-xl sm:text-3xl font-semibold">Dependable</div>
							<div class="text-sm">We are committed to dependability. We keep our word and will not be satisfied until you are. We work hard to maintain our reputation with each job we perform.</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section class="w-full py-10">
      <div class="mx-auto">
        <div class="text-center font-semibold font-lobster text-3xl mb-8">Our awards</div>
        <div class="flex flex-wrap justify-center gap-8 p-4">
          <img
            v-for="(logo, index) in logos"
            :key="index"
            :src="logo"
            alt="Partner logo"
            class="max-w-[9rem] max-h-[5rem] w-auto"
          />
        </div>
      </div>
    </section>
	</div>
</template>

<script>
import FilteredSearch from './filtered-search.vue'

export default {
	components: { FilteredSearch },
	data() {
	  return {
		logos:
          [
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
             '/images/master-elite.png'
           ],
		}
	},
}
</script>
