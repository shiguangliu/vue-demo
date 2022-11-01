<template>
  <el-row :gutter="40" class="panel-group">
    <el-col v-for="(reward) in resultData" :key="reward.id" :xs="12" :sm="12" :lg="8" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper">
          <el-image
            v-if="reward.imageThumbnailUrl !== null && reward.imageThumbnailUrl !== undefined && reward.imageThumbnailUrl !== ''"
            v-imgAlart
            :src="$TH.FILE_URLS.static_url + reward.imageThumbnailUrl"
            style="height: 30px;width: 40px"
            :onerror="nopicture"
            :fit="'contain'"
            class="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            {{ reward.itemTypeName }} :
            <span v-if="reward.itemType !==30 && reward.itemType !==31"> {{ reward.itemName }} </span>
            <span v-if="reward.rewardQuantity>=0" class="card-panel-num"> +{{ reward.rewardQuantity }} </span>
            <span v-if="reward.rewardQuantity<0" class="card-panel-num"> {{ reward.rewardQuantity }} </span>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex'
import defaultImage from '@/assets/img/no-pic.jpg'

export default {
  props: {
    resultData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    ...mapGetters([
      'theme',
      'dataPermits',
      'userid'
    ]),
    nopicture() {
      return (
        'this.src="' +
        this.$TH.FILE_URLS.publicPath + defaultImage + '";this.onerror = null;'
      )
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    currentClass(index) {
      return 'card-panel-icon ' + index
    },
    currentDivClass(index) {
      return 'card-panel-icon-wrapper icon-' + index
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 40px;
    // cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    // box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    .card-panel-icon-wrapper {
      float: left;
      margin: 2px 0 0 0px;
      padding: 2px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: left;
      font-weight: bold;
      // margin: 10px;
      margin-left: 1px;
      margin-top: 15px;

      .card-panel-text {
        // line-height: 20px;
        color: rgba(3, 3, 3, 0.45);
        font-size: 12px;
        margin-bottom: 3px;
      }

      .card-panel-num {
        font-size: 12px;
        color: #d13535
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
