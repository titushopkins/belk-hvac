<template>
  <section class="relative w-full overflow-hidden bg-belk-dark-gray py-20 md:py-32">
    <div class="pointer-events-none absolute -top-10 right-0 opacity-10 select-none">
      <img
        src="/images/icon-camera-large.svg"
        alt=""
        class="w-44 h-44 sm:w-96 sm:h-96 lg:w-[32rem] lg:h-[32rem] object-contain opacity-20"
      />
    </div>

    <div class="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-24">
      <div class="flex items-center justify-between gap-6">
        <h2 class="font-lobster font-semibold italic text-2xl sm:text-4xl leading-tight text-white">
          HVAC comfort solutions for every home.
        </h2>

        <div class="flex items-center justify-center rounded-2xl w-14 h-14">
          <img src="/images/icon-camera.svg" alt="" class="w-7 h-7 opacity-90" />
        </div>
      </div>

      <!-- WRAPPER (no overflow-hidden) so arrows can sit on the screen edge on mobile -->
      <div
        class="group mt-10 relative w-full h-[220px] sm:h-[450px] lg:h-[550px]"
        @touchstart.passive="onTouchStart"
        @touchmove.passive="onTouchMove"
        @touchend="onTouchEnd"
      >
        <!-- Slider box keeps rounding + overflow-hidden -->
        <div class="relative rounded-2xl overflow-hidden shadow-black/30 w-full h-full flex">
          <div
            class="flex transition-transform duration-300 ease-out"
            :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
          >
            <img
              v-for="(src, idx) in galleryImages"
              :key="`gallery-${idx}`"
              :src="src"
              alt="HVAC gallery"
              class="w-full shrink-0 h-full object-cover"
              draggable="false"
            />
          </div>

          <div class="absolute bottom-4 right-4 z-20">
            <div class="flex items-center gap-2 rounded-2xl bg-black/70 text-white px-3 h-7 text-xs font-semibold">
              <span>{{ String(currentIndex + 1).padStart(2, '0') }}</span>
              <span class="opacity-40">/</span>
              <span>{{ String(galleryImages.length).padStart(2, '0') }}</span>
            </div>
          </div>
        </div>

        <!-- LEFT ARROW (outside overflow-hidden, offset to screen edge on mobile) -->
        <div
          class="sm:bg-black w-20 h-12 sm:rounded-full absolute left-0 top-1/2 -translate-y-1/2 z-20
               -ml-12 sm:-ml-8
                flex items-center justify-center text-white
                sm:pointer-events-none
               sm:group-hover:opacity-100 sm:group-hover:pointer-events-auto
               transition-opacity duration-200"
        >
          <button
            type="button"
            class="w-10 h-10"
            @click="prevImage"
            aria-label="Previous image"
          >
            <img src="/images/arrow-left.svg" alt="" />
          </button>
        </div>

        <!-- RIGHT ARROW (outside overflow-hidden, offset to screen edge on mobile) -->
        <div
          class="sm:bg-black w-20 h-12 sm:rounded-full absolute right-0 top-1/2 -translate-y-1/2 z-20
               -mr-12 sm:-mr-8
                flex items-center justify-center text-white
                sm:pointer-events-none
               sm:group-hover:opacity-100 sm:group-hover:pointer-events-auto
               transition-opacity duration-200"
        >
          <button
            type="button"
            class="w-10 h-10"
            @click="nextImage"
            aria-label="Next image"
          >
            <img src="/images/arrow-right.svg" alt="" />
          </button>
        </div>
      </div>

      <div class="mt-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <p class="text-lg sm:text-2xl font-semibold leading-tight text-white max-w-2xl">
          Upgrade your comfort with <span class="font-lobster font-bold">Belk Heating & Cooling</span>—get started today!
        </p>

        <div class="flex items-center gap-2">
          <RoofingButton href="/gallery" class="px-4 py-3 bg-belk-cream-2 hover:bg-transparent hover:border-4 hover:border-belk-cream" variant="tertiary" text="View Our Work" />
          <RoofingButton href="/contact" class="px-4 py-3" variant="primary" text="Request a Free Estimate" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import RoofingButton from '../roofing-button.vue';

export default {
  props: {
    buttonText: { type: String, default: 'Request a Free Estimate' },
    buttonLink: { type: String, default: null },
  },
  components: { RoofingButton },
  data() {
    return {
      currentIndex: 0,
      galleryImages: [
        '/images/nick-back.jpg',
        '/images/belk-1.png',
        '/images/belk-2.png',
        // '/images/belk-3.png',
        // '/images/belk-4.png',
        '/images/nick-side.jpg',
        '/images/belk-5.png',
        '/images/belk-7.png',
        '/images/belk-8.png',
        '/images/belk-10.png',
        '/images/belk-11.png',
        '/images/belk-12.png',
        // '/images/belk-25.png',
        '/images/belk-17.png',
        '/images/belk-20.png',
        '/images/belk-24.png',
        '/images/noah-back.jpg',
        '/images/belk-26.png',
        '/images/belk-27.png',
        '/images/belk-29.png',
        '/images/belk-30.png',
        '/images/belk-31.png',
        '/images/belk-32.png',
        '/images/belk-33.png',
      ],

      touchStartX: 0,
      touchCurrentX: 0,
    }
  },

  methods: {
    handleButtonClick() {
      if (this.buttonLink && this.$router) {
        this.$router.push(this.buttonLink)
      }
    },
    nextImage() {
      this.currentIndex = (this.currentIndex + 1) % this.galleryImages.length
    },
    prevImage() {
      this.currentIndex =
        (this.currentIndex - 1 + this.galleryImages.length) % this.galleryImages.length
    },

    onTouchStart(e) {
      this.touchStartX = e.touches[0].clientX
      this.touchCurrentX = this.touchStartX
    },
    onTouchMove(e) {
      this.touchCurrentX = e.touches[0].clientX
    },
    onTouchEnd() {
      const delta = this.touchCurrentX - this.touchStartX
      const threshold = 50 // px

      if (delta > threshold) this.prevImage()
      if (delta < -threshold) this.nextImage()

      this.touchStartX = 0
      this.touchCurrentX = 0
    },
  },
}
</script>
