<template>
  <div class="w-full">
    <HeroSection />
    <Partners />
    <Experts />
    <Solutions />
    <Reviews />
    <!-- <HeatMap /> -->
    <Coverage />
  </div>
</template>

<script>
import HeroSection from '../hero-section.vue'
import ServiceCard from '../service-card.vue'
import ReviewCard from '../review-card.vue'
import RoofingButton from '../roofing-button.vue'
import Reviews from './reviews.vue'
import Coverage from './coverage.vue'
import Solutions from './solutions.vue'
import Experts from './experts.vue'
import Partners from './partners.vue'
// import HeatMap from './heat-map.vue'

export default {

  components: {
    HeroSection,
    ServiceCard,
    RoofingButton,
    ReviewCard,
    Reviews,
    Coverage,
    Solutions,
    Experts,
    Partners,
  },
}
</script>
