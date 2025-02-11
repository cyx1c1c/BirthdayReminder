<template>
  <view class="container">
    <!-- 时区选择器 -->
    <picker mode="selector" :range="timezones" :value="selectedIndex" @change="onTimezoneChange">
      <view class="picker">选择时区: {{ selectedTimezone || '请选择时区' }}</view>
    </picker>
  </view>
</template>

<script>
import { timezones, timezoneOffsets } from '../utils/timezones'; // 确保路径正确

export default {
  components: {

  },
  data() {
    return {
      timezones,
      selectedIndex: null,
      selectedTimezone: ''
    };
  },
  mounted() {
    const storedTimezone = uni.getStorageSync('selectedTimezone');
    if (storedTimezone) {
      this.selectedTimezone = storedTimezone;
      this.selectedIndex = this.timezones.indexOf(storedTimezone);
    } else {
      this.setDeviceTimezone();
    }
  },
  methods: {
    setDeviceTimezone() {
      const offset = new Date().getTimezoneOffset() / -60;
      const matchedTimezone = Object.keys(timezoneOffsets).find(
        key => timezoneOffsets[key] === offset
      );
      if (matchedTimezone) {
        this.selectedTimezone = matchedTimezone;
        this.selectedIndex = this.timezones.indexOf(matchedTimezone);
        uni.setStorageSync('selectedTimezone', matchedTimezone);
      }
    },
    onTimezoneChange(e) {
      this.selectedIndex = e.detail.value;
      this.selectedTimezone = this.timezones[this.selectedIndex];
      uni.setStorageSync('selectedTimezone', this.selectedTimezone);
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
  text-align: center;
}

.picker {
  margin-top: 10px;
  font-size: 16px;
}
</style>