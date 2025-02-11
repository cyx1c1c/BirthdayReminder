<template>
  <div class="container">
    <h1>生日倒计时</h1>
    <form @submit.prevent="addBirthday">
      <input type="text" v-model="name" placeholder="姓名" required />
      <picker mode="date" :value="birthday" @change="onDateChange">
        <view class="picker">{{ birthday || '选择生日' }}</view>
      </picker>
      <input type="number" v-model.number="remindDays" placeholder="提前几天提醒" required />
      <button type="button" @click="addBirthday">添加生日</button>
    </form>
    <ul>
      <li v-for="(entry, index) in birthdays" :key="index">
        <strong>{{ entry.name }}</strong> - {{ entry.birthday }}
        (剩余 {{ calculateDaysLeft(entry.birthday) }} 天)
        <button @click="deleteBirthday(index)">删除</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      birthday: "",
      remindDays: null,
      birthdays: [],
    };
  },
  mounted() {
    this.loadBirthdays();
    this.startReminderCheck();
  },
  methods: {
    onDateChange(e) {
      this.birthday = e.detail.value;
    },
    addBirthday() {
      console.log("addBirthday 方法被调用");
      if (!this.name || !this.birthday || this.remindDays < 0) {
        console.log("输入信息不完整");
        uni.showToast({ title: "请填写正确的生日信息", icon: "none" });
        return;
      }
      console.log("生日信息通过验证");
    
      const newEntry = {
        name: this.name,
        birthday: this.birthday,
        remindDays: this.remindDays,
      };
      this.birthdays.push(newEntry);
      console.log("新生日已加入数组", this.birthdays);
    
      this.saveBirthdays();
      this.name = "";
      this.birthday = "";
      this.remindDays = null;
      console.log("数据已清空");
    },
    saveBirthdays() {
      uni.setStorage({
        key: "birthdays",
        data: this.birthdays,
        success: () => console.log("生日数据已存入本地缓存"),
        fail: (e) => console.error("存储失败", e)
      });
    },
    loadBirthdays() {
      const savedBirthdays = uni.getStorageSync("birthdays");
      this.birthdays = savedBirthdays ? JSON.parse(savedBirthdays) : [];
    },
    deleteBirthday(index) {
      this.birthdays.splice(index, 1);
      this.saveBirthdays();
    },
    calculateDaysLeft(birthday) {
      const today = new Date();
      const birthDate = new Date(birthday);
      birthDate.setFullYear(today.getFullYear());
      if (birthDate < today) {
        birthDate.setFullYear(today.getFullYear() + 1);
      }
      const timeDiff = birthDate.getTime() - today.getTime();
      return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    },
    sendNotification(name, daysLeft) {
      uni.showModal({
        title: "生日提醒",
        content: `${name} 的生日还有 ${daysLeft} 天！`,
        showCancel: false,
      });
    },
    checkReminders() {
      this.birthdays.forEach((entry) => {
        const daysLeft = this.calculateDaysLeft(entry.birthday);
        if (daysLeft === entry.remindDays) {
          this.sendNotification(entry.name, daysLeft);
        }
      });
    },
    startReminderCheck() {
      setInterval(this.checkReminders, 24 * 60 * 60 * 1000);
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
h1 {
  text-align: center;
}
form {
  display: flex;
  flex-direction: column;
}
input, button, .picker {
  margin: 10px 0;
  padding: 10px;
  font-size: 16px;
}
button {
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background-color: #218838;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
</style>
