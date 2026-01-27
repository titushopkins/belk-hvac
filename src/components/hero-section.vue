<template>
  <div class="relative h-screen max-h-[700px] lg:max-h-[750px] xl:max-h-screen flex flex-col justify-end overflow-hidden">

    <!-- Background image layer -->
    <div class="absolute inset-0">
      <!-- Slide A -->
      <div
        class="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 will-change-transform"
        :class="[
          activeLayer === 0 ? 'opacity-100' : 'opacity-0',
          activeLayer === 0 && zoomOn ? 'scale-[1.08]' : 'scale-100'
        ]"
        :style="{
          backgroundImage: `url(${heroBackgrounds[layerAIndex]})`,
          transitionProperty: 'opacity, transform',
          transitionDuration: '1000ms, 5000ms',
          transitionTimingFunction: 'ease-in-out, linear'
        }"
      />

      <!-- Slide B -->
      <div
        class="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 will-change-transform"
        :class="[
          activeLayer === 1 ? 'opacity-100' : 'opacity-0',
          activeLayer === 1 && zoomOn ? 'scale-[1.08]' : 'scale-100'
        ]"
        :style="{
          backgroundImage: `url(${heroBackgrounds[layerBIndex]})`,
          transitionProperty: 'opacity, transform',
          transitionDuration: '1000ms, 5000ms',
          transitionTimingFunction: 'ease-in-out, linear'
        }"
      />

      <!-- Overlay ONLY on background image -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-20% via-black/30 to-transparent" />
    </div>

    <!-- Content layer -->
    <div class="relative z-10 w-full h-auto rounded-lg shadow-sm flex">
      <div class="flex w-full gap-2 pt-4 max-h-[600px]">

        <!-- Left content -->
        <div class="pl-6 sm:pl-12 xl:pl-20 space-y-8 xl:space-y-12 text-white flex flex-col h-[500px] md:h-full">
          <h1 class="text-3xl xs:text-4xl sm:text-5xl xl:text-7xl leading-tight font-semibold text-shadow-xl max-w-xs sm:max-w-lg md:max-w-none">
            The
            <span class="font-lobster font-semibold px-1 inline">trusted</span>
            HVAC Teechnician & Plumber
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
                <p class="text-base font-semibold">2025</p>
                <p class="text-sm">Founded</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right image -->
        <div class="flex w-full justify-end items-end max-h-[600px] absolute md:relative bottom-0">
          <img
            src="/images/belk-cartoon.svg"
            alt=""
            class="w-auto h-full xs:h-[500px] min-w-[150px] md:hidden rounded-tl-[80px]"
          />
          <img
            src="/images/belk-cartoon-full.svg"
            alt=""
            class="w-auto h-full xs:h-[500px] xl:h-[600px] min-w-[400px] xl:min-w-[590px] hidden md:block rounded-tl-[80px]"
          />
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import RoofingButton from './roofing-button.vue'

const props = defineProps({
  buttonText: {
    type: String,
    default: 'Request a Free Quote'
  },
  // Route path or URL to go to when the button is clicked
  buttonLink: {
    type: String,
    default: null
  }
})

// ✅ Put your 3 images or gifs here
const heroBackgrounds = [
  '/images/nick-back.jpg',
  '/images/nick-side.jpg',
  '/images/noah-back.jpg'
]

// We use TWO layers so we can crossfade while each one zooms (Ken Burns style)
const layerAIndex = ref(0)
const layerBIndex = ref(1)
const activeLayer = ref(0) // 0 = A visible, 1 = B visible
const zoomOn = ref(false)

let intervalId = null
let timeoutId = null

function nextIndex(i) {
  return (i + 1) % heroBackgrounds.length
}

async function startZoom() {
  // reset then trigger zoom so transition always fires
  zoomOn.value = false
  await nextTick()
  // small delay helps ensure browser registers the reset
  timeoutId = setTimeout(() => {
    zoomOn.value = true
  }, 30)
}

function advanceSlide() {
  const currentVisibleIndex = activeLayer.value === 0 ? layerAIndex.value : layerBIndex.value
  const upcomingIndex = nextIndex(currentVisibleIndex)

  if (activeLayer.value === 0) {
    // B becomes next
    layerBIndex.value = upcomingIndex
    activeLayer.value = 1
  } else {
    // A becomes next
    layerAIndex.value = upcomingIndex
    activeLayer.value = 0
  }

  startZoom()
}

onMounted(() => {
  // kick off initial zoom
  startZoom()

  // crossfade every 5s
  intervalId = setInterval(() => {
    advanceSlide()
  }, 5000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
  if (timeoutId) clearTimeout(timeoutId)
})

// kept so your component still has the same behavior available
function handleButtonClick() {
  // NOTE: In <script setup>, router isn't auto on `this`
  // If you actually use this method somewhere later, uncomment below:
  //
  // const router = useRouter()
  // if (props.buttonLink) router.push(props.buttonLink)
}
</script>
