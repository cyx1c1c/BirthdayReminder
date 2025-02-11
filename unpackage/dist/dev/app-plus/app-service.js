if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$5 = {
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
        let today = /* @__PURE__ */ new Date();
        let birthDate = new Date(birthday);
        birthDate.setFullYear(today.getFullYear());
        if (birthDate < today) {
          birthDate.setFullYear(today.getFullYear() + 1);
        }
        let diffTime = birthDate - today;
        return Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
      },
      sortBirthdays() {
        this.birthdays.sort((a, b) => this.calculateDaysLeft(a.birthday) - this.calculateDaysLeft(b.birthday));
      },
      async addBirthday() {
        if (!this.name || !this.birthday)
          return;
        this.birthdays.push({
          name: this.name,
          birthday: this.birthday,
          remindDays: this.remindDays || 0
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
          formatAppLog("error", "at pages/addBirthday.vue:71", "存储失败", e);
        }
      },
      loadBirthdays() {
        const savedBirthdays = uni.getStorageSync("birthdays");
        this.birthdays = savedBirthdays ? JSON.parse(savedBirthdays) : [];
        this.sortBirthdays();
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.withDirectives(vue.createElementVNode(
        "input",
        {
          type: "text",
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.name = $event),
          placeholder: "姓名",
          required: ""
        },
        null,
        512
        /* NEED_PATCH */
      ), [
        [vue.vModelText, $data.name]
      ]),
      vue.createElementVNode("picker", {
        mode: "date",
        value: $data.birthday,
        onChange: _cache[1] || (_cache[1] = (...args) => $options.onDateChange && $options.onDateChange(...args))
      }, [
        vue.createElementVNode(
          "view",
          { class: "picker" },
          vue.toDisplayString($data.birthday || "选择生日"),
          1
          /* TEXT */
        )
      ], 40, ["value"]),
      vue.withDirectives(vue.createElementVNode(
        "input",
        {
          type: "number",
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.remindDays = $event),
          placeholder: "提前几天提醒"
        },
        null,
        512
        /* NEED_PATCH */
      ), [
        [
          vue.vModelText,
          $data.remindDays,
          void 0,
          { number: true }
        ]
      ]),
      vue.createElementVNode("button", {
        onClick: _cache[3] || (_cache[3] = (...args) => $options.addBirthday && $options.addBirthday(...args))
      }, "添加生日")
    ]);
  }
  const PagesAddBirthday = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-b67763f9"], ["__file", "D:/HBuilderX/HBuilderX/readme/app/BirthdayReminder/pages/addBirthday.vue"]]);
  const timezoneOffsets = {
    "伦敦（UTC+0）": 0,
    "巴黎（UTC+1）": 1,
    "柏林（UTC+1）": 1,
    "莫斯科（UTC+3）": 3,
    "新德里（UTC+5:30）": 5.5,
    "北京（UTC+8）": 8,
    "东京（UTC+9）": 9,
    "悉尼（UTC+10）": 10,
    "墨尔本（UTC+11）": 11,
    "洛杉矶（UTC-8）": -8,
    "纽约（UTC-5）": -5,
    "圣保罗（UTC-3）": -3
  };
  const timezones = Object.keys(timezoneOffsets);
  const _sfc_main$4 = {
    data() {
      return {
        birthdays: [],
        showEditPopup: false,
        editBirthday: {},
        editIndex: null
      };
    },
    onShow() {
      this.loadBirthdays();
    },
    methods: {
      loadBirthdays() {
        const savedBirthdays = uni.getStorageSync("birthdays");
        this.birthdays = savedBirthdays ? JSON.parse(savedBirthdays) : [];
      },
      deleteBirthday(index) {
        this.birthdays.splice(index, 1);
        this.saveBirthdays();
        this.loadBirthdays();
      },
      saveBirthdays() {
        uni.setStorageSync("birthdays", JSON.stringify(this.birthdays));
      },
      calculateDaysLeft(birthday) {
        let selectedTimezone = uni.getStorageSync("selectedTimezone");
        let timezoneOffset = timezoneOffsets[selectedTimezone] || 0;
        let now = /* @__PURE__ */ new Date();
        let utcNow = now.getTime() + now.getTimezoneOffset() * 6e4;
        let localNow = new Date(utcNow + timezoneOffset * 36e5);
        let birthDate = new Date(birthday);
        birthDate.setFullYear(localNow.getFullYear());
        let diffTime = birthDate - localNow;
        if (diffTime <= 0 && localNow.toDateString() === birthDate.toDateString()) {
          return 0;
        }
        if (diffTime < 0) {
          birthDate.setFullYear(localNow.getFullYear() + 1);
          diffTime = birthDate - localNow;
        }
        return Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
      },
      onDateChange(event) {
        this.editBirthday.birthday = event.detail.value;
      },
      openEditPopup(entry, index) {
        this.editBirthday = { ...entry };
        this.editIndex = index;
        this.showEditPopup = true;
      },
      closeEditPopup() {
        this.showEditPopup = false;
      },
      sortBirthdays() {
        this.birthdays.sort((a, b) => this.calculateDaysLeft(a.birthday) - this.calculateDaysLeft(b.birthday));
      },
      async changeBirthday() {
        if (!this.editBirthday.name || !this.editBirthday.birthday) {
          uni.showToast({ title: "信息不完整！", icon: "none" });
          return;
        }
        this.birthdays[this.editIndex] = { ...this.editBirthday };
        await this.sortBirthdays();
        await this.saveBirthdays();
        this.closeEditPopup();
        uni.showToast({ title: "修改成功！", icon: "success" });
      },
      saveChanges() {
        this.changeBirthday();
      },
      viewDetails(entry) {
        uni.navigateTo({
          url: "/pages/detail?name=" + entry.name + "&birthday=" + entry.birthday + "&remindDays=" + entry.remindDays + "&daysLeft=" + this.calculateDaysLeft(entry.birthday)
        });
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      $data.birthdays.length ? (vue.openBlock(), vue.createElementBlock("ul", { key: 0 }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.birthdays, (entry, index) => {
            return vue.openBlock(), vue.createElementBlock("li", { key: index }, [
              vue.createElementVNode(
                "strong",
                null,
                vue.toDisplayString(entry.name),
                1
                /* TEXT */
              ),
              vue.createTextVNode(
                " - " + vue.toDisplayString(entry.birthday) + " (剩余 " + vue.toDisplayString($options.calculateDaysLeft(entry.birthday)) + " 天) ",
                1
                /* TEXT */
              ),
              vue.createElementVNode("view", { class: "button-group" }, [
                vue.createElementVNode("button", {
                  onClick: ($event) => $options.viewDetails(entry),
                  id: "detail-button"
                }, "详情", 8, ["onClick"]),
                vue.createElementVNode("button", {
                  onClick: ($event) => $options.openEditPopup(entry, index),
                  id: "change-button"
                }, "修改", 8, ["onClick"]),
                vue.createElementVNode("button", {
                  onClick: ($event) => $options.deleteBirthday(index),
                  id: "delete-button"
                }, "删除", 8, ["onClick"])
              ])
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])) : (vue.openBlock(), vue.createElementBlock("view", { key: 1 }, "暂无生日记录")),
      vue.createCommentVNode(" 修改弹窗 "),
      $data.showEditPopup ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "popup-overlay"
      }, [
        vue.createElementVNode("view", { class: "popup" }, [
          vue.createElementVNode("h2", null, "修改生日信息"),
          vue.createElementVNode(
            "form",
            {
              onSubmit: _cache[5] || (_cache[5] = vue.withModifiers((...args) => $options.saveChanges && $options.saveChanges(...args), ["prevent"]))
            },
            [
              vue.createElementVNode("view", null, [
                vue.createElementVNode("label", { for: "name" }, "姓名:"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    id: "name",
                    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.editBirthday.name = $event),
                    placeholder: "请输入姓名",
                    required: ""
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.editBirthday.name]
                ])
              ]),
              vue.createElementVNode("view", null, [
                vue.createElementVNode("label", { for: "birthday" }, "生日:"),
                vue.createElementVNode("picker", {
                  mode: "date",
                  value: $data.editBirthday.birthday,
                  onChange: _cache[1] || (_cache[1] = (...args) => $options.onDateChange && $options.onDateChange(...args))
                }, [
                  vue.createElementVNode(
                    "view",
                    { class: "picker" },
                    vue.toDisplayString($data.editBirthday.birthday || "选择生日"),
                    1
                    /* TEXT */
                  )
                ], 40, ["value"])
              ]),
              vue.createElementVNode("view", null, [
                vue.createElementVNode("label", { for: "remindDays" }, "提前提醒天数:"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    id: "remindDays",
                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.editBirthday.remindDays = $event),
                    type: "number",
                    min: "1",
                    required: ""
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.editBirthday.remindDays]
                ])
              ]),
              vue.createElementVNode("view", { class: "buttons" }, [
                vue.createElementVNode("button", {
                  type: "submit",
                  onClick: _cache[3] || (_cache[3] = (...args) => $options.changeBirthday && $options.changeBirthday(...args)),
                  id: "save-button"
                }, "保存"),
                vue.createElementVNode("button", {
                  type: "button",
                  onClick: _cache[4] || (_cache[4] = (...args) => $options.closeEditPopup && $options.closeEditPopup(...args)),
                  id: "cancel-button"
                }, "取消")
              ])
            ],
            32
            /* NEED_HYDRATION */
          )
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesBirthdayList = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-33d95472"], ["__file", "D:/HBuilderX/HBuilderX/readme/app/BirthdayReminder/pages/birthdayList.vue"]]);
  const _sfc_main$3 = {
    components: {},
    data() {
      return {
        timezones,
        selectedIndex: null,
        selectedTimezone: ""
      };
    },
    mounted() {
      const storedTimezone = uni.getStorageSync("selectedTimezone");
      if (storedTimezone) {
        this.selectedTimezone = storedTimezone;
        this.selectedIndex = this.timezones.indexOf(storedTimezone);
      } else {
        this.setDeviceTimezone();
      }
    },
    methods: {
      setDeviceTimezone() {
        const offset = (/* @__PURE__ */ new Date()).getTimezoneOffset() / -60;
        const matchedTimezone = Object.keys(timezoneOffsets).find(
          (key) => timezoneOffsets[key] === offset
        );
        if (matchedTimezone) {
          this.selectedTimezone = matchedTimezone;
          this.selectedIndex = this.timezones.indexOf(matchedTimezone);
          uni.setStorageSync("selectedTimezone", matchedTimezone);
        }
      },
      onTimezoneChange(e) {
        this.selectedIndex = e.detail.value;
        this.selectedTimezone = this.timezones[this.selectedIndex];
        uni.setStorageSync("selectedTimezone", this.selectedTimezone);
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 时区选择器 "),
      vue.createElementVNode("picker", {
        mode: "selector",
        range: $data.timezones,
        value: $data.selectedIndex,
        onChange: _cache[0] || (_cache[0] = (...args) => $options.onTimezoneChange && $options.onTimezoneChange(...args))
      }, [
        vue.createElementVNode(
          "view",
          { class: "picker" },
          "选择时区: " + vue.toDisplayString($data.selectedTimezone || "请选择时区"),
          1
          /* TEXT */
        )
      ], 40, ["range", "value"])
    ]);
  }
  const PagesPersonalcenter = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-3de4f5a7"], ["__file", "D:/HBuilderX/HBuilderX/readme/app/BirthdayReminder/pages/personalcenter.vue"]]);
  const _sfc_main$2 = {
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
      this.startReminderCheck();
    },
    methods: {
      onDateChange(e) {
        this.birthday = e.detail.value;
      },
      addBirthday() {
        formatAppLog("log", "at pages/index/index.vue:41", "addBirthday 方法被调用");
        if (!this.name || !this.birthday || this.remindDays < 0) {
          formatAppLog("log", "at pages/index/index.vue:43", "输入信息不完整");
          uni.showToast({ title: "请填写正确的生日信息", icon: "none" });
          return;
        }
        formatAppLog("log", "at pages/index/index.vue:47", "生日信息通过验证");
        const newEntry = {
          name: this.name,
          birthday: this.birthday,
          remindDays: this.remindDays
        };
        this.birthdays.push(newEntry);
        formatAppLog("log", "at pages/index/index.vue:55", "新生日已加入数组", this.birthdays);
        this.saveBirthdays();
        this.name = "";
        this.birthday = "";
        this.remindDays = null;
        formatAppLog("log", "at pages/index/index.vue:61", "数据已清空");
      },
      saveBirthdays() {
        uni.setStorage({
          key: "birthdays",
          data: this.birthdays,
          success: () => formatAppLog("log", "at pages/index/index.vue:67", "生日数据已存入本地缓存"),
          fail: (e) => formatAppLog("error", "at pages/index/index.vue:68", "存储失败", e)
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
        const today = /* @__PURE__ */ new Date();
        const birthDate = new Date(birthday);
        birthDate.setFullYear(today.getFullYear());
        if (birthDate < today) {
          birthDate.setFullYear(today.getFullYear() + 1);
        }
        const timeDiff = birthDate.getTime() - today.getTime();
        return Math.ceil(timeDiff / (1e3 * 60 * 60 * 24));
      },
      sendNotification(name, daysLeft) {
        uni.showModal({
          title: "生日提醒",
          content: `${name} 的生日还有 ${daysLeft} 天！`,
          showCancel: false
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
        setInterval(this.checkReminders, 24 * 60 * 60 * 1e3);
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", { class: "container" }, [
      vue.createElementVNode("h1", null, "生日倒计时"),
      vue.createElementVNode(
        "form",
        {
          onSubmit: _cache[4] || (_cache[4] = vue.withModifiers((...args) => $options.addBirthday && $options.addBirthday(...args), ["prevent"]))
        },
        [
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "text",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.name = $event),
              placeholder: "姓名",
              required: ""
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.name]
          ]),
          vue.createElementVNode("picker", {
            mode: "date",
            value: $data.birthday,
            onChange: _cache[1] || (_cache[1] = (...args) => $options.onDateChange && $options.onDateChange(...args))
          }, [
            vue.createElementVNode(
              "view",
              { class: "picker" },
              vue.toDisplayString($data.birthday || "选择生日"),
              1
              /* TEXT */
            )
          ], 40, ["value"]),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "number",
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.remindDays = $event),
              placeholder: "提前几天提醒",
              required: ""
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [
              vue.vModelText,
              $data.remindDays,
              void 0,
              { number: true }
            ]
          ]),
          vue.createElementVNode("button", {
            type: "button",
            onClick: _cache[3] || (_cache[3] = (...args) => $options.addBirthday && $options.addBirthday(...args))
          }, "添加生日")
        ],
        32
        /* NEED_HYDRATION */
      ),
      vue.createElementVNode("ul", null, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.birthdays, (entry, index) => {
            return vue.openBlock(), vue.createElementBlock("li", { key: index }, [
              vue.createElementVNode(
                "strong",
                null,
                vue.toDisplayString(entry.name),
                1
                /* TEXT */
              ),
              vue.createTextVNode(
                " - " + vue.toDisplayString(entry.birthday) + " (剩余 " + vue.toDisplayString($options.calculateDaysLeft(entry.birthday)) + " 天) ",
                1
                /* TEXT */
              ),
              vue.createElementVNode("button", {
                onClick: ($event) => $options.deleteBirthday(index)
              }, "删除", 8, ["onClick"])
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-1cf27b2a"], ["__file", "D:/HBuilderX/HBuilderX/readme/app/BirthdayReminder/pages/index/index.vue"]]);
  const _sfc_main$1 = {
    data() {
      return {
        birthday: {
          name: "",
          birthday: "",
          remindDays: 0
        },
        daysLeft: 0,
        memo: ""
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
        this.memo = memos[this.birthday.name] || "";
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "header" }),
      vue.createElementVNode("view", { class: "info-container" }, [
        vue.createElementVNode("view", { class: "info-item" }, [
          vue.createElementVNode("strong", null, "姓名:"),
          vue.createElementVNode(
            "span",
            null,
            vue.toDisplayString($data.birthday.name),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "info-item" }, [
          vue.createElementVNode("strong", null, "生日:"),
          vue.createElementVNode(
            "span",
            null,
            vue.toDisplayString($data.birthday.birthday),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "info-item" }, [
          vue.createElementVNode("strong", null, "提前提醒天数:"),
          vue.createElementVNode(
            "span",
            null,
            vue.toDisplayString($data.birthday.remindDays) + " 天",
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "info-item" }, [
          vue.createElementVNode("strong", null, "倒计时天数:"),
          vue.createElementVNode(
            "span",
            null,
            vue.toDisplayString($data.daysLeft) + " 天",
            1
            /* TEXT */
          )
        ])
      ]),
      vue.createElementVNode("view", { class: "memo-container" }, [
        vue.createElementVNode("strong", null, "备忘录:"),
        vue.withDirectives(vue.createElementVNode(
          "textarea",
          {
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.memo = $event),
            class: "memo-textarea",
            placeholder: "添加备忘录..."
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vue.vModelText, $data.memo]
        ]),
        vue.createElementVNode("button", {
          onClick: _cache[1] || (_cache[1] = (...args) => $options.saveMemo && $options.saveMemo(...args)),
          class: "save-btn"
        }, "保存备忘录")
      ])
    ]);
  }
  const PagesDetail = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-dfbaac98"], ["__file", "D:/HBuilderX/HBuilderX/readme/app/BirthdayReminder/pages/detail.vue"]]);
  __definePage("pages/addBirthday", PagesAddBirthday);
  __definePage("pages/birthdayList", PagesBirthdayList);
  __definePage("pages/personalcenter", PagesPersonalcenter);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/detail", PagesDetail);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "D:/HBuilderX/HBuilderX/readme/app/BirthdayReminder/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
