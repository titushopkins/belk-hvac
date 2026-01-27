<template>
    <div class="flex justify-between items-center bg-merlin-500/40 backdrop-blur-sm fixed top-0 left-0 w-full z-50">

        <div v-if="remainingEntries.length" class="w-full px-4 py-2 flex justify-between relative">
            <div>Syncing:</div>
            <div>{{ syncedEntries.length }}/{{ remainingEntries.length + syncedEntries.length }}</div>

            <div class="h-1 bg-red-500 absolute -bottom-1 left-0" :style="`width: ${progress}%;`" />
        </div>

    </div>
</template>

<script>
import Toggle from '../partials/toggle.vue'

export default {
	components: { Toggle },
    inject: ['store'],
    data() {
        return {
            remainingEntries: [],
            online: navigator.onLine,
            syncing: false,
            syncedEntries: [],
        }
    },
    beforeDestroy() {
        // clearInterval(this.onlineInterval)
    },
    async mounted() {

        let response = this.$mango.opportunities.sync()
        this.online = response.online
        this.syncing = response.syncing
        this.remainingEntries = response.remainingEntries
        this.syncedEntries = response.syncedEntries

    },
    computed: {
        progress() {
            return Math.round(this.syncedEntries.length / (this.remainingEntries.length+this.syncedEntries.length) * 100)
        }
    }
}
</script>

<style>

</style>
