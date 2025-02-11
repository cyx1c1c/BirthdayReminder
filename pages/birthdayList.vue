<template>
  <view class="container">
    <ul v-if="birthdays.length">
      <li v-for="(entry, index) in birthdays" :key="index">
        <strong>{{ entry.name }}</strong> - {{ entry.birthday }}
        (剩余 {{ calculateDaysLeft(entry.birthday) }} 天)
        <view class="button-group">
          <button @click="viewDetails(entry)" id="detail-button">详情</button>
          <button @click="openEditPopup(entry, index)" id="change-button">修改</button>
          <button @click="deleteBirthday(index)" id="delete-button">删除</button>
        </view>
      </li>
    </ul>
    <view v-else>暂无生日记录</view>

    <!-- 修改弹窗 -->
    <view v-if="showEditPopup" class="popup-overlay">
      <view class="popup">
        <h2>修改生日信息</h2>
        <form @submit.prevent="saveChanges">
          <view>
            <label for="name">姓名:</label>
            <input id="name" v-model="editBirthday.name" placeholder="请输入姓名" required />
          </view>
          <view>
            <label for="birthday">生日:</label>
            <picker mode="date" :value="editBirthday.birthday" @change="onDateChange">
              <view class="picker">{{ editBirthday.birthday || '选择生日' }}</view>
            </picker>
          </view>
          <view>
            <label for="remindDays">提前提醒天数:</label>
            <input id="remindDays" v-model="editBirthday.remindDays" type="number" min="1" required />
          </view>
          <view class="buttons">
            <button type="submit" @click="changeBirthday" id="save-button">保存</button>
            <button type="button" @click="closeEditPopup" id="cancel-button">取消</button>
          </view>
        </form>
      </view>
    </view>
  </view>
</template>

<script>
// 导入公共配置
import { timezoneOffsets, timezones } from '../utils/timezones';

export default {
  data() {
    return {
      birthdays: [],
      showEditPopup: false,
      editBirthday: {},
      editIndex: null,
    };
  },
  onShow() {
    this.loadBirthdays(); // 进入页面时加载最新数据
  },
  methods: {
    loadBirthdays() {
      const savedBirthdays = uni.getStorageSync("birthdays");
      this.birthdays = savedBirthdays ? JSON.parse(savedBirthdays) : [];
    },
    deleteBirthday(index) {
		this.birthdays.splice(index, 1);  // 删除指定索引的生日
        this.saveBirthdays();  // 立即存储最新数据`
        this.loadBirthdays();  // 重新加载数据，确保列表更新
    },
    saveBirthdays() {
      uni.setStorageSync("birthdays", JSON.stringify(this.birthdays));
    },
    calculateDaysLeft(birthday) {
      let selectedTimezone = uni.getStorageSync("selectedTimezone");
      let timezoneOffset = timezoneOffsets[selectedTimezone] || 0;
      
      let now = new Date();
      let utcNow = now.getTime() + now.getTimezoneOffset() * 60000;
      let localNow = new Date(utcNow + timezoneOffset * 3600000);
      
      let birthDate = new Date(birthday);
      birthDate.setFullYear(localNow.getFullYear());
    
      // 计算生日与当前时间的时间差
      let diffTime = birthDate - localNow;
    
      // 如果当天就是生日，返回 0 天
      if (diffTime <= 0 && localNow.toDateString() === birthDate.toDateString()) {
        return 0;
      }
    
      // 如果生日已过，则设定为下一年
      if (diffTime < 0) {
        birthDate.setFullYear(localNow.getFullYear() + 1);
        diffTime = birthDate - localNow;
      }
    
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },
    onDateChange(event) {
      this.editBirthday.birthday = event.detail.value; // 更新选择的生日日期
    },
    openEditPopup(entry, index) {
      this.editBirthday = { ...entry }; // 复制当前生日信息
      this.editIndex = index;
      this.showEditPopup = true; // 显示修改弹窗
    },
    closeEditPopup() {
      this.showEditPopup = false; // 关闭弹窗
    },
	sortBirthdays() {
	  this.birthdays.sort((a, b) => this.calculateDaysLeft(a.birthday) - this.calculateDaysLeft(b.birthday));
	},
	async changeBirthday() {
	  if (!this.editBirthday.name || !this.editBirthday.birthday) {
	    uni.showToast({ title: "信息不完整！", icon: "none" });
	    return;
	  }
	
	  // 更新选中的生日数据
	  this.birthdays[this.editIndex] = { ...this.editBirthday };
	
	  // 重新排序后存储数据
	  await this.sortBirthdays();
	  await this.saveBirthdays();
	
	  // 关闭弹窗
	  this.closeEditPopup();
	
	  // 显示成功提示
	  uni.showToast({ title: "修改成功！", icon: "success" });
	},
    saveChanges() {
      this.changeBirthday();
    },
    viewDetails(entry) {
      uni.navigateTo({
          url: '/pages/detail?name=' + entry.name + '&birthday=' + entry.birthday + '&remindDays=' + entry.remindDays + '&daysLeft=' + this.calculateDaysLeft(entry.birthday)
        });
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
button, .picker {
  margin: 10px 0;
  padding: 10px;
  font-size: 16px;
}
#detail-button,#save-button{
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  width: 30%; /* 控制按钮宽度 */
}
#detail-button:hover,#save-button:hover{
  background-color: #218838;
}
#change-button{
  background-color: #939393;
  color: white;
  border: none;
  cursor: pointer;
  width: 30%; /* 控制按钮宽度 */
}
#change-button:hover{
  background-color: #7A7A7A;
}
#delete-button,#cancel-button{
  background-color: #FF0000;
  color: white;
  border: none;
  cursor: pointer;
  width: 30%; /* 控制按钮宽度 */
}
#delete-button:hover,#cancel-button:hover{
  background-color: #BE0000;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.button-group {
  display: flex;
  justify-content: space-around; /* 水平排列按钮 */
}

.button-group button {
  width: 30%; /* 按钮宽度 */
  margin: 5px 0;
}

/* 弹窗样式 */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 80%;
  max-width: 500px;
}

.popup h2 {
  text-align: center;
}

.popup .buttons {
  display: flex;
  justify-content: space-between;
}

.popup button {
  width: 45%;
}
</style>
