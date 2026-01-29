<template>
  <div class="flex w-full justify-center items-center p-6 pt-0">
    <div class="w-full max-w-6xl xl:max-w-8xl space-y-6">

      <!-- Gallery Results (same layout as before) -->
      <div class="w-full max-w-[1040px] min-h-[600px] m-auto">
        <SearchFilters :photos="photos" />
      </div>
    </div>
  </div>
</template>

<script>
import SearchFilters from './search-filters.vue'

export default {
  components: { SearchFilters },
  data() {
    return {
      // ✅ Put ANY images you want here
      // These must exist in /public/images/
      photos: [
        { url: '/images/nick-back.jpg' },
        { url: '/images/belk-1.png' },
        { url: '/images/belk-2.png' },
        { url: '/images/belk-3.png' },
        { url: '/images/belk-4.png' },
        { url: '/images/nick-side.jpg' },
        { url: '/images/belk-5.png' },
        { url: '/images/belk-7.png' },
        // { url: '/images/belk-8.png' },
        { url: '/images/belk-8.png' },
        { url: '/images/belk-10.png' },
        { url: '/images/belk-11.png' },
        { url: '/images/belk-12.png' },
        { url: '/images/belk-25.png' },
        // { url: '/images/belk-14.png' },
        // { url: '/images/belk-15.png' },
        // { url: '/images/belk-16.png' },
        { url: '/images/belk-17.png' },
        { url: '/images/belk-20.png' },
        // { url: '/images/belk-21.png' },
        // { url: '/images/belk-22.png' },
        // { url: '/images/belk-23.png' },
        { url: '/images/belk-24.png' },
        { url: '/images/noah-back.jpg' },
        { url: '/images/belk-26.png' },
        { url: '/images/belk-27.png' },
        { url: '/images/belk-29.png' },
        { url: '/images/belk-30.png' },
        { url: '/images/belk-31.png' },
        { url: '/images/belk-32.png' },
        { url: '/images/belk-33.png' },
      ],
    }
  },
}
</script>
