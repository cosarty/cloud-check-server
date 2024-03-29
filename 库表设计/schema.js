const { stringify } = require('ts-jest');

//  数据库表
const user = {
  userId: String,
  userName: String,
  email: String,
  avtarUrl: String,
  isBan: Boolean,
  stuId: String,
  auth: String, //  admin student teacher super
  sex: Number, // 0 1
  password: String,
  account: String, // 学号
  device: String, // 设备
};

const auth_code = {
  expireTime: Date,
  email: String,
  captach: String,
  work: String,
};

// 课程信息表
const course = {
  courseId: String,
  courseName: String,
  picture: String,
  isDelete: Boolean,
  userId: String, // 课程创建者
  comment: String, // 注释信息
  code: String, // 邀请码
};

// 星期枚举
const weekNum = [
  'sunday',
  'monday',
  'tuesday ',
  'wednesday',
  'thursday ',
  'friday',
  'saturday',
];
// 班级课程表
const classSchedule = {
  classScheduleId: String,
  classId: String,
  courseId: String,
  starDate: Date,
  endDate: Date, // 结束时间
  schooltime: {}, // weekNum []
};

// 签到统计
const statInfo = {
  statId: String,
  classScheduleId: String,
  userId: String,
  statTime: Date,
  tagetScope: Number, // 签到距离
  signOutTime: Date, //签退时间
};

// 签到任务
const singTask = {
  classScheduleId: String,
  taskName: String,
  taskTime: Date,
  location: String, // 位置
  areaId: String, //位置id,
  singTime: Date, // 签到时间
  sustain: Number, // 持续时间
  userId: String,
  integral: Number, // 签到分数
};

// 定时任务
const timing = {
  taskName: String,
  classScheduleId: String,
  timingId: String,
  location: String, // 位置
  areaId: String, //位置id,
  sustain: Number, // 持续时间
  period: String, // 周期  月m 日d 周w  定时任务周期
  isPeriod: Boolean, // 是否开启定时任务
  integral: Number, // 签到分数
};

// 课程人员表  多对多  多主键
const coursePerson = {
  coursePersonId: String,
  userId: String,
  classScheduleId: String,
  count: Number,
  integral: String,
};

// 区域采集
const area = {
  areaId: String,
  areaName: String,
  location: String,
  userId: String,
};

const classTable = {
  clasName: String,
  classId: String,
  remarks: String,
  picture: String,
  code: Number,
  teacherId: String,
};
