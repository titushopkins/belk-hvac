<template>
  <main class="w-full bg-gray-900">
    <!-- HERO -->
    <div class="relative w-full h-screen max-h-[60vh] bg-[url('/images/service-map-clean.png')] bg-cover bg-center">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div class="relative z-10 flex flex-col w-full h-full items-center justify-center text-center">
        <h2 class="text-white text-2xl sm:text-[32px] font-semibold font-lobster italic">
          Proudly Serving Central Texas
        </h2>

        <div class="text-white text-5xl sm:text-6xl font-semibold pt-4">
          HVAC Service Areas
        </div>
      </div>
    </div>

    <!-- BODY -->
    <section class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-14">
      <!-- Service Area Intro -->
      <div class="space-y-6">
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-300">
          Local Heating & Cooling Experts—Right Where You Live
        </h2>

        <p>
          Belk Heating & Cooling is based right here in Central Texas, delivering fast response times, honest diagnostics, and dependable HVAC
          service you can trust year-round.
        </p>

        <p class="font-semibold">
          If you’re in any of the cities below, you’re in our service zone:
        </p>

        <ul class="space-y-3 list-disc ml-12">
          <li class="flex gap-3">
            <span class="mt-2 h-2 w-2 rounded-full bg-belk-teal shrink-0"></span>
            <p><span class="font-semibold">AC repair & replacement</span> for Texas heat</p>
          </li>
          <li class="flex gap-3">
            <span class="mt-2 h-2 w-2 rounded-full bg-belk-teal shrink-0"></span>
            <p><span class="font-semibold">Heating system service</span> including furnaces and heat pumps</p>
          </li>
          <li class="flex gap-3">
            <span class="mt-2 h-2 w-2 rounded-full bg-belk-teal shrink-0"></span>
            <p><span class="font-semibold">Maintenance & tune-ups</span> to keep systems running efficiently</p>
          </li>
        </ul>

        <p>
          Not sure if you’re in range? Give us a call—if you’re nearby, we’ll do our best to get you taken care of.
        </p>
      </div>

      <!-- City Calling Cards -->
      <div class="space-y-6">
        <!-- <h2 class="text-2xl sm:text-3xl font-bold text-gray-300">
          Cities We Service
        </h2> -->
         <div class="rounded-b-2xl bg-gradient-to-b from-transparent to-gray-800 shadow-lg p-10 sm:p-14 text-white/90">
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-300 pb-8">
          Cities We Service
        </h2>
            <div class="text-sm text-gray-500 pb-2">
          *Cities within the red is our service area.
        </div>
          <img class="w-full rounded-xl" src="/images/service-map.png" />
        </div>


        <p>
          Here’s a quick “calling card” for each area we serve. These highlight common HVAC needs in each community.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Burnet -->
          <div class="card">
            <h3>Burnet</h3>
            <div class="font-semibold text-gray-300">Fast local HVAC service for homes and small businesses.</div>
            <p class="">Common calls: AC repairs • system replacements • summer tune-ups</p>
          </div>

          <!-- Marble Falls -->
          <div class="card">
            <h3>Marble Falls</h3>
            <div class="font-semibold text-gray-300">Keeping homes cool in summer and warm in winter with reliable service.</div>
            <p class="">Common calls: AC not cooling • heat pump issues • maintenance plans</p>
          </div>

          <!-- Austin -->
          <div class="card">
            <h3>Austin</h3>
            <div class="font-semibold text-gray-300">Professional diagnostics and energy-efficient HVAC upgrades.</div>
            <p class="">Common calls: system replacements • thermostat upgrades • airflow issues</p>
          </div>

          <!-- Horseshoe Bay -->
          <div class="card">
            <h3>Horseshoe Bay</h3>
            <div class="font-semibold text-gray-300">Lake-area HVAC service built for high heat and humidity.</div>
            <p class="">Common calls: AC tune-ups • capacitor failures • duct issues</p>
          </div>

          <!-- Cedar Park -->
          <div class="card">
            <h3>Cedar Park</h3>
            <div class="font-semibold text-gray-300">Quick, dependable HVAC repairs with clear communication.</div>
            <p class="">Common calls: refrigerant leaks • blower motor issues • maintenance</p>
          </div>

          <!-- Leander -->
          <div class="card">
            <h3>Leander</h3>
            <div class="font-semibold text-gray-300">Full-service heating and cooling for growing neighborhoods.</div>
            <p class="">Common calls: new system installs • AC repairs • zoning issues</p>
          </div>

          <!-- Liberty Hill -->
          <div class="card">
            <h3>Liberty Hill</h3>
            <div class="font-semibold text-gray-300">Rural and new-build HVAC service you can count on.</div>
            <p class="">Common calls: heat pump installs • ductwork • emergency AC repair</p>
          </div>

          <!-- Bertram -->
          <div class="card">
            <h3>Bertram</h3>
            <div class="font-semibold text-gray-300">Small-town service with big-time HVAC reliability.</div>
            <p class="">Common calls: no-cool calls • thermostat problems • maintenance</p>
          </div>

          <!-- Lampasas -->
          <div class="card">
            <h3>Lampasas</h3>
            <div class="font-semibold text-gray-300">Dependable heating and cooling solutions for every season.</div>
            <p class="">Common calls: furnace repairs • AC replacements • airflow balancing</p>
          </div>

          <!-- Granite Shoals -->
          <div class="card">
            <h3>Granite Shoals</h3>
            <div class="font-semibold text-gray-300">HVAC service for lake homes and full-time residents alike.</div>
            <p class="">Common calls: AC repairs • duct sealing • maintenance plans</p>
          </div>

          <!-- Meadowlakes -->
          <div class="card">
            <h3>Meadowlakes</h3>
            <div class="font-semibold text-gray-300">Comfort-focused HVAC care with detailed system checks.</div>
            <p class="">Common calls: tune-ups • indoor air quality • filter system upgrades</p>
          </div>

          <!-- Georgetown -->
          <div class="card">
            <h3>Georgetown</h3>
            <div class="font-semibold text-gray-300">Efficient scheduling and honest HVAC recommendations.</div>
            <p class="">Common calls: AC not keeping up • system replacements • maintenance</p>
          </div>

          <!-- Round Rock -->
          <div class="card">
            <h3>Round Rock</h3>
            <div class="font-semibold text-gray-300">Reliable heating and cooling service with quick turnaround.</div>
            <p class="">Common calls: emergency AC repair • thermostat issues • airflow fixes</p>
          </div>

          <!-- Harker Heights -->
          <div class="card">
            <h3>Harker Heights</h3>
            <div class="font-semibold text-gray-300">From diagnostics to installs—comfort you can depend on.</div>
            <p class="">Common calls: AC repair • heating repair • full system replacements</p>
          </div>

          <!-- Killeen -->
          <div class="card">
            <h3>Killeen</h3>
            <div class="font-semibold text-gray-300">Fast response for cooling and heating issues year-round.</div>
            <p class="">Common calls: no-cool emergencies • capacitor failures • tune-ups</p>
          </div>

          <!-- Fort Hood -->
          <div class="card">
            <h3>Fort Hood</h3>
            <div class="font-semibold text-gray-300">HVAC service availability for nearby military housing and neighborhoods.</div>
            <p class="">Common calls: AC repair • maintenance • system diagnostics</p>
          </div>
        </div>
      </div>

      <!-- Service Promise -->
      <div class="space-y-6">
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-300">
          What You Can Expect When You Call Belk Heating & Cooling
        </h2>

        <ul class="space-y-3 list-disc ml-12">
          <li class="flex gap-3">
            <span class="mt-2 h-2 w-2 rounded-full bg-belk-teal shrink-0"></span>
            <p><span class="">Fast scheduling</span> and reliable arrival windows</p>
          </li>
          <li class="flex gap-3">
            <span class="mt-2 h-2 w-2 rounded-full bg-belk-teal shrink-0"></span>
            <p><span class="">Honest diagnostics</span> with clear repair options</p>
          </li>
          <li class="flex gap-3">
            <span class="mt-2 h-2 w-2 rounded-full bg-belk-teal shrink-0"></span>
            <p><span class="">Long-lasting solutions</span> focused on comfort and efficiency</p>
          </li>
        </ul>

        <p>
          Whether your AC quits in the Texas heat or your heater won’t start on a cold morning, Belk Heating & Cooling is ready to restore your
          comfort quickly and professionally.
        </p>
      </div>
    </section>
  </main>
</template>

<style scoped>
p,
li {
  @apply leading-7 text-gray-500;
}

.card {
  @apply rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 space-y-3 text-gray-300;
}

.card h3 {
  @apply text-xl text-belk-teal font-bold;
}
</style>
