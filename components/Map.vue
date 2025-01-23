<template>
  <div class="w-full h-full">
    <LMap
        ref="map"
        :zoom="zoom"
        :center="[latitude, longitude]"
        :use-global-leaflet="false"
    >
      <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
          layer-type="base"
          name="OpenStreetMap"
      />
      <LMarker :lat-lng="[latitude, longitude]">
        <LPopup>Location</LPopup>
      </LMarker>
    </LMap>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  }
})

const zoom = ref(15) // Increased zoom level for better visibility of the marker
</script>
