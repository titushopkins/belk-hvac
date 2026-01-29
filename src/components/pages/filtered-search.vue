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
        { url: '/images/nick-side.jpg' },
        { url: '/images/nick-back.jpg' },
        { url: '/images/noah-back.jpg' },
        { url: '/images/frame-4-large.png' },
        { url: '/images/frame-5.png' },
        { url: '/images/frame-6.png' },
        { url: '/images/frame-7.png' },
        { url: '/images/frame-2-large.png' },
        { url: '/images/frame-3.png' },
        { url: '/images/frame-4-small.png' },
        { url: '/images/gallery-image-13.jpg' },
        { url: '/images/coverage-warranty.jpg' },
        { url: '/images/coverage-insured.jpg' },
      ],
    }
  },
}
</script>
