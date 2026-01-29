<template>
    <div class="w-full">
        <div class="relative w-full h-screen max-h-[60vh] overflow-hidden">
      <!-- Background image -->
      <div
        class="absolute inset-0 bg-[url('/images/belk-26.png')] bg-cover bg-center blur-sm scale-105"
      ></div>

      <!-- Dark overlay -->
      <div class="absolute inset-0 bg-black/50"></div>

      <!-- Content -->
      <div class="relative z-10 flex flex-col w-full justify-center h-full items-center text-center px-4">
        <h2 class="text-white text-2xl sm:text-[32px] font-lobster font-semibold italic">
          About Belk Heating &amp; Cooling
        </h2>
        <div class="flex w-full justify-center items-center text-center text-5xl sm:text-6xl font-semibold text-white">
          Serving the Hill Country for 10+ Years
        </div>
      </div>
    </div>

    <section class="flex w-full justify-center items-center bg-gray-900 md:p-16 px-0">
      <div class="w-full max-w-8xl">
        <div class="flex flex-col md:flex-row w-full justify-center px-8 py-12 sm:p-12">
          <div class="flex flex-col w-full gap-y-8">
            <div class="text-3xl font-semibold text-white">
              Our Story
            </div>

            <div class="text-base text-white leading-6 space-y-4">
              <div>
                Belk Heating &amp; Cooling was built on a simple mission: <span class="font-semibold">serve our neighbors with honest work, clear communication, and quality craftsmanship</span>.
                What started as a local, hands-on HVAC company has grown through one thing above all—<span class="font-semibold">doing the job right and treating people the right way</span>.
              </div>

              <div>
                Our owner, <span class="font-semibold">Noah Hopkins</span>, has <span class="font-semibold">over 10 years of HVAC experience</span> and has spent his career working on
                everything from <span class="font-semibold">AC repairs and system replacements</span> to <span class="font-semibold">heating diagnostics, airflow issues, and indoor comfort upgrades</span>.
                He believes customers deserve straight answers, fair pricing, and work they can trust.
              </div>

              <div>
                We’ve earned a reputation for dependable service across the <span class="font-semibold">Texas Hill Country</span> because we don’t cut corners.
                Whether it’s a simple tune-up or a full system install, we focus on what matters most:
                <span class="font-semibold">comfort, safety, efficiency, and long-term reliability</span>.
              </div>

              <div>
                Belk Heating &amp; Cooling is proud to serve families and businesses throughout the area with a practical approach:
                <span class="font-semibold">show up on time, diagnose accurately, explain options clearly, and deliver quality work</span>.
                When you call us, you’re not getting a sales pitch—you’re getting a team that cares about doing it right.
              </div>

              <div>
                Today, we continue to grow while keeping the same foundation:
                <span class="font-semibold">honesty, craftsmanship, and treating every customer like family</span>.
              </div>
            </div>

            <div class="flex flex-col sm:flex-row w-full justify-between items-start gap-6 sm:items-center p-6 bg-gray-100 rounded-xl">
              <div class="text-xl md:text-2xl font-semibold">
                Contact us now to schedule HVAC service in the Hill Country!
              </div>
              <div class="text-white text-base md:text-lg w-full max-w-[15rem]">
                <a
                  href="/contact"
                  class="bg-belk-red p-3 sm:p-4 rounded-full font-semibold w-full shadow-sm shadow-belk-gray"
                >
                  Request Service
                </a>
              </div>
            </div>

            <div class="flex w-full justify-start overflow-hidden sm:overflow-auto">
              <img class="w-full flex min-w-[82vh]" src="/images/gray-line-flames.svg" />
            </div>

            <div class="text-3xl font-semibold text-white">
              Built for Texas Heat (and Hill Country Winters)
            </div>

            <div class="text-base text-white leading-6 space-y-4">
              <div>
                In the Hill Country, your HVAC system has to handle <span class="font-semibold">extreme summer heat</span>, sudden cold snaps, humidity swings, and constant run-time.
                That’s why we focus on solutions that actually work here—proper sizing, airflow, duct performance, and equipment that’s built to last.
              </div>

              <div>
                From <span class="font-semibold">AC repairs</span> and <span class="font-semibold">system replacements</span> to <span class="font-semibold">heating service</span> and
                <span class="font-semibold">preventative maintenance</span>, our goal is to help you get reliable comfort without surprise breakdowns.
              </div>

              <div>
                We also take the time to explain what we’re seeing and what your options are—so you can make the best decision for your home, your budget,
                and your long-term comfort.
              </div>
            </div>

            <div class="text-3xl font-semibold text-white">
              What This Means for Our Customers
            </div>

            <div class="text-base leading-6 space-y-4 text-white">
              <div>
                <span class="font-semibold">For our customers, it means you get a local HVAC team you can actually rely on.</span>
              </div>

              <div>
                We’re not here for one quick job—we’re here to become the company you call for the next repair, the next tune-up, and the next system when it’s time.
                That’s why we focus on <span class="font-semibold">honesty, quality workmanship, and clear communication</span> every step of the way.
              </div>

              <div>
                You can expect:
              </div>

              <ul class="space-y-3 list-disc ml-12">
                <li class="flex gap-3 text-white/80">
                  <span class="mt-2 h-2 w-2 rounded-full bg-belk-teal shrink-0"></span>
                  <span class="font-semibold">Accurate diagnostics and straightforward recommendations</span>
                </li>
                <li class="flex gap-3 text-white/80">
                  <span class="mt-2 h-2 w-2 rounded-full bg-belk-teal shrink-0"></span>
                  <span class="font-semibold">Repairs and installs done right—no shortcuts</span>
                </li>
                <li class="flex gap-3 text-white/80">
                  <span class="mt-2 h-2 w-2 rounded-full bg-belk-teal shrink-0"></span>
                  <span class="font-semibold">A local team that answers the phone and shows up</span>
                </li>
                <li class="flex gap-3 text-white/80">
                  <span class="mt-2 h-2 w-2 rounded-full bg-belk-teal shrink-0"></span>
                  <span class="font-semibold">Service focused on comfort, efficiency, and long-term reliability</span>
                </li>
              </ul>

              <div>
                Most importantly, we’re committed to doing what we’ve always done—
                <span class="font-semibold">taking care of our customers and standing behind our work</span>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Partner Logos Section -->
    <section class="bg-belk-cream md:p-16 px-0">
      <div class="w-full">
        <div class="flex flex-col md:flex-row w-full justify-center p-12">
          <div class="flex flex-col md:flex-row w-full flex max-w-8xl justify-between gap-y-12 md:gap-y-none md:gap-x-12 text-center overflow-hidden w-full text-[#2c2824]">
            <div class="w-fit flex flex-col items-center gap-4">
              <img src="/images/settings-jay-lott.svg" alt="Partner logo" class="w-auto max-w-60 mix-blend-luminosity" />
              <div class="text-xl sm:text-3xl font-semibold">Professional</div>
              <div class="text-sm">
                We work with high standards in a safe, clean environment. We use quality parts and proven installation methods for reliable results.
              </div>
            </div>
            <div class="w-fit flex flex-col items-center gap-y-4">
              <img src="/images/thumbs-up-jay-lott.svg" alt="Partner logo" class="w-auto max-w-60 mix-blend-luminosity" />
              <div class="text-xl sm:text-3xl font-semibold">Affordable</div>
              <div class="text-sm">
                We maintain competitive, reasonable pricing and provide clear options—so you can choose what fits your home and budget.
              </div>
            </div>
            <div class="w-fit flex flex-col items-center gap-4">
              <img src="/images/calendar-jay-lott.svg" alt="Partner logo" class="w-auto max-w-60 mix-blend-luminosity" />
              <div class="text-xl sm:text-3xl font-semibold">Dependable</div>
              <div class="text-sm">
                We keep our word and stand behind our work. From the first call to the final test, we’re committed to getting it right.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="w-full py-10">
      <div class="mx-auto">
        <div class="text-center font-semibold font-lobster text-3xl mb-8">Our trusted brands</div>
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
import HeroSection from '../hero-section.vue'
import ServiceCard from '../service-card.vue'
import RoofingButton from '../roofing-button.vue'
import ReviewCard from '../review-card.vue'
import ServicesDropdown from './services-dropdown.vue'

export default {
  components: {
    HeroSection,
    ServiceCard,
    RoofingButton,
    ReviewCard,
    ServicesDropdown,
  },
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

<style scoped>
p,
li {
  @apply leading-7 text-white;
}
</style>
