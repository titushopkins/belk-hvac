<template>
    <div class="flex flex-col gap-5 w-[378.667px] flex-shrink-0">
        <div class="aspect-[378.67/240] rounded-2xl shadow-roofing overflow-hidden">
            <img 
                :src="image" 
                :alt="title"
                class="w-full h-full object-cover"
            />
        </div>
        <div class="flex flex-col gap-2">
            <h3 class="text-2xl font-semibold leading-[1.1]">{{ title }}</h3>
            <p class="text-base leading-[1.6] text-black">{{ description }}</p>
        </div>
        <roofing-button 
            variant="secondary" 
            text="Learn More"
            @click="$emit('learn-more')"
        />
    </div>
</template>

<script>
import RoofingButton from './roofing-button.vue'

export default {
    components: { RoofingButton },
    props: {
        image: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    }
}
</script>
