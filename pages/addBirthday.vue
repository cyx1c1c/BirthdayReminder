<template>
  <view class="container">
    <input type="text" v-model="name" placeholder="姓名" required />
    <picker mode="date" :value="birthday" @change="onDateChange">
      <view class="picker">{{ birthday || '选择生日' }}</view>
    </picker>
    <input type="number" v-model.number="remindDays" placeholder="提前几天提醒" />
    <button @click="addBirthday">添加生日</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      birthday: "",
      remindDays: null,
      birthdays: []
    };
  },
  mounted() {
    this.loadBirthdays();
  },
  methods: {
    onDateChange(e) {
      this.birthday = e.detail.value;
    },
    
    calculateDaysLeft(birthday) {
      let today = new Date();
      let birthDate = new Date(birthday);

      birthDate.setFullYear(today.getFullYear());
      if (birthDate < today) {
        birthDate.setFullYear(today.getFullYear() + 1);
      }

      let diffTime = birthDate - today;
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },

    sortBirthdays() {
      this.birthdays.sort((a, b) => this.calculateDaysLeft(a.birthday) - this.calculateDaysLeft(b.birthday));
    },

    async addBirthday() {
	
      if (!this.name || !this.birthday) return;
      
      this.birthdays.push({
        name: this.name,
        birthday: this.birthday,
        remindDays: this.remindDays || 0,
      });

      await this.sortBirthdays();
      await this.saveBirthdays();
	  
	  uni.showToast({ title: "添加成功！", icon: "success" });

      this.name = "";
      this.birthday = "";
      this.remindDays = null;
    },

    async saveBirthdays() {
      try {
        await uni.setStorageSync("birthdays", JSON.stringify(this.birthdays));
      } catch (e) {
        console.error("存储失败", e);
      }
    },

    loadBirthdays() {
      const savedBirthdays = uni.getStorageSync("birthdays");
      this.birthdays = savedBirthdays ? JSON.parse(savedBirthdays) : [];
      this.sortBirthdays();
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0px 50px 50px 50px auto;
  padding: 20px;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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
</style>
