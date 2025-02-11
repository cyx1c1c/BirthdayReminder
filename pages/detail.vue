<template>
  <view class="container">
    <view class="header">

    </view>

    <view class="info-container">
      <view class="info-item">
        <strong>姓名:</strong>
        <span>{{ birthday.name }}</span>
      </view>
      <view class="info-item">
        <strong>生日:</strong>
        <span>{{ birthday.birthday }}</span>
      </view>
      <view class="info-item">
        <strong>提前提醒天数:</strong>
        <span>{{ birthday.remindDays }} 天</span>
      </view>
      <view class="info-item">
        <strong>倒计时天数:</strong>
        <span>{{ daysLeft }} 天</span>
      </view>
    </view>

    <view class="memo-container">
      <strong>备忘录:</strong>
      <textarea v-model="memo" class="memo-textarea" placeholder="添加备忘录..."></textarea>
      <button @click="saveMemo" class="save-btn">保存备忘录</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      birthday: {
        name: '',
        birthday: '',
        remindDays: 0
      },
      daysLeft: 0,
      memo: ''
    };
  },
  onLoad(options) {
    this.birthday.name = options.name;
    this.birthday.birthday = options.birthday;
    this.birthday.remindDays = options.remindDays;
    this.daysLeft = options.daysLeft;
    this.loadMemo();
  },
  methods: {
    saveMemo() {
      const memos = uni.getStorageSync("memos") || {};
      memos[this.birthday.name] = this.memo;
      uni.setStorageSync("memos", memos);
    },
    loadMemo() {
      const memos = uni.getStorageSync("memos") || {};
      this.memo = memos[this.birthday.name] || '';
    }
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
  background: #fff;
}

.header {
  text-align: center;
  margin-bottom: 0px;
}

.info-container {
  margin-bottom: 30px;
}

.info-item {
  margin: 10px 0;
  font-size: 16px;
}

.info-item strong {
  font-weight: bold;
}

.info-item span {
  color: #555;
}

.memo-container {
  margin-top: 20px;
}

.memo-textarea {
  width: 100%;
  height: 120px;
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  resize: none;
}

.save-btn {
  width: 100%;
  padding: 12px;
  background-color: #28a745;
  color: white;
  border: none;
  font-size: 16px;
  border-radius: 8px;
  margin-top: 15px;
}

.save-btn:hover {
  background-color: #218838;
}
</style>
