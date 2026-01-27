<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href || undefined"
    :target="target"
    :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
    :class="buttonClasses"
    @click="handleClick"
  >
    <slot>{{ text }}</slot>
  </component>
</template>

<script>
export default {
  emits: ['click'],
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value) =>
        ['primary', 'secondary', 'ghost', 'tertiary'].includes(value),
    },

    text: {
      type: String,
      default: '',
    },

    /** 🔹 NEW */
    href: {
      type: String,
      default: null,
    },

    /** 🔹 OPTIONAL */
    target: {
      type: String,
      default: '_self',
    },
  },

  computed: {
    buttonClasses() {
      const base =
        'rounded-full font-bold transition-all flex items-center justify-center gap-2'

      const variants = {
        primary:
          'bg-roofing-red text-white border-t-2 border-roofing-orange hover:bg-red-700 p-4',
        secondary:
          'bg-roofing-light-gray text-roofing-gray hover:bg-gray-300 px-4 py-2',
        ghost: 'hover:bg-gray-100',
        tertiary:
          'bg-roofing-gray/30 text-roofing-light-gray hover:bg-roofing-gray/80 px-4 py-2',
      }

      return `${base} ${variants[this.variant]}`
    },
  },

  methods: {
    handleClick(event) {
      // only emit click when NOT a link
      if (!this.href) {
        this.$emit('click', event)
      }
    },
  },
}
</script>
