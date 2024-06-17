<template>
  <n-modal v-model:show="store.isPreviewShow" preset="card" title="预览" style="width: 100%" size="huge">
    <div id="mars3dContainer" class="mars3d-container" />
  </n-modal>
</template>

<script setup lang="ts">
import { NModal } from 'naive-ui'
import { onMounted } from 'vue';
import * as mars3d from "mars3d";
import { useStore } from '@/stores/model';

const store = useStore()
const mapOptions: any = {
  scene: {
    center: {
      lat: 33,
      lng: 115,
      alt: 500,
      heading: 0,
      pitch: 0
    },
    showSun: false,
    showMoon: false,
    showSkyBox: false,
    showSkyAtmosphere: false,
    fog: false,
    backgroundColor: "rgba(0,0,0,0)",
    orderIndependentTranslucency: false,
    contextOptions: {
      webgl: {
        alpha: true
      }
    }, // 允许透明
    globe: {
      show: false, // 不显示地球
      showGroundAtmosphere: false,
      enableLighting: false
    },
    clock: {
      currentTime: "2023-11-01 12:00:00" // 固定光照时间
    },
    cameraController: {
      zoomFactor: 1.5,
      minimumZoomDistance: 0.1,
      maximumZoomDistance: 200000,
      enableCollisionDetection: false // 允许进入地下
    }
  },
  control: {
    baseLayerPicker: false,
    sceneModePicker: false,
    locationBar: {
      fps: false,
      template: "<div />"
    }
  }
}

// Mounted
onMounted(() => {
  const map = new mars3d.Map("mars3dContainer", mapOptions);  // terrain等高线
  const terrain = new mars3d.layer.TerrainLayer({
    url: "http://data.mars3d.cn/terrain",
    show: true
  })
  map.addLayer(terrain)
  map.scene.globe.depthTestAgainstTerrain = true
  // 辅助图层
  for (const layer of store.assetsLayerList) {
    const l = new mars3d.layer.GeoJsonLayer({
      url: layer.url,
      clustering: {
        clampToGround: true
      },
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    map.addLayer(l)
  }

  // 预览图层
  const modelLayer = new mars3d.layer.TilesetLayer({
    url: store.preview_address,
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    },
    maximumScreenSpaceError: 1,
    flyTo: true
  })

  map.addLayer(modelLayer)
  modelLayer.flyTo()
})
</script>