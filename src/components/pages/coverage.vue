 <template>
     <section
       class="relative w-full bg-gray-900 overflow-hidden
              px-6 sm:px-10 lg:px-24
              py-20 md:py-32"
     >
       <!-- Background Decorative Icon -->
       <div
         class="absolute -top-2 sm:-top-10 right-0
                w-56 h-56 sm:w-96 sm:h-96 lg:w-[32rem] lg:h-[32rem]
                opacity-10 pointer-events-none select-none"
       >
         <img
           src="/images/icon-large-shield.svg"
           alt=""
           class="w-full h-full object-contain"
         />
       </div>

       <div class="relative max-w-7xl mx-auto">
         <!-- Title -->
         <div class="flex items-start justify-between gap-4">
           <h2
             class="font-lobster italic font-semibold
                    text-2xl sm:text-4xl
                    leading-tight text-white
                    max-w-xs sm:max-w-none"
           >
             We've got you covered.
           </h2>

           <img
             src="/images/icon-shield.svg"
             alt=""
             class="w-9 h-9 sm:w-12 sm:h-12 shrink-0 opacity-80 mt-1"
           />
         </div>

         <!-- Cards -->
         <div
           class="mt-10 grid grid-cols-1 md:grid-cols-3
                  gap-10 lg:gap-12"
         >
           <a
             v-for="cover in insurance"
             :key="cover.title"
             :href="cover.href"
             class="group block"
           >
             <div class="mx-auto w-full">
               <!-- Image -->
               <div class="rounded-xl overflow-hidden border">
                 <img
                   :src="cover.image"
                   :alt="cover.title"
                   class="w-full h-48 object-cover object-center"
                 />
               </div>

               <!-- Content -->
               <div class="mt-4 space-y-2">
                 <h3 class="text-base font-bold text-white">
                   {{ cover.title }}
                 </h3>

                 <p
                   class="text-xs sm:text-sm text-white/70
                          leading-5 sm:leading-6"
                 >
                   {{ cover.description }}
                 </p>

                 <span
                   class="inline-flex items-center justify-center rounded-full
                          bg-roofing-light-gray px-4 py-2
                          text-xs font-semibold text-roofing-gray
                          hover:bg-roofing-red hover:text-white transition"
                 >
                   Learn More
                 </span>
               </div>
             </div>
           </a>
         </div>
       </div>
     </section>
</template>

<script>
  export default {
    data() {
      return {
        insurance: [
          {
            title: 'We Offer Financing',
            description:
              'We offer flexible financing options to make your roofing project affordable and accessible.',
            image: '/images/coverage-3.png',
            href: '/financing',
          },
          {
            title: 'Warranty Coverage',
            description:
              'Enjoy peace and mind with our comprehensive warranty coverage on all roofing installations.',
            image: '/images/coverage-2.png',
            href: '/warranty',
          },
          {
            title: 'Bonded & Insureed',
            description:
              'We are fully bonded and insured, ensuring safety and reliability on every project.',
            image: '/images/coverage-1.png',
            href: '/warranty',
          },
        ],
      }
    },
  }
</script>
