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
  isAdmin: boolean,
  super: boolean,
  pic: String,
  departmentId: string, // 系管理员  判断是否存在departmentId 那就是系管理员

  /**
   * auth === admin 是系统管理员

   */
};

const auth_code = {
  expireTime: Date,
  email: String,
  captach: String,
  work: String,
};

// 系只能超级管理员来弄
const department = {
  departmentId: string,
  departmentName: String,
  userId: Strig, // 系管理员
};

// 课程信息表
const course = {
  courseId: String,
  courseName: String,
  picture: String,
  isDelete: Boolean,
  userId: String, // 课程创建者
  comment: String, // 注释信息
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
  scheduleId:String,
  classId: String,
  courseId: String,
  teacherId: String,
  starDate: Date,
  week: Number, // 持续几周
  schooltime: {}, // weekNum []
};

// 签到统计
const statInfo = {
  statId: String,
  scheduleId: String,
  useId: String,
  statTime: Date,
  tagetScope: Number, // 签到距离
  signOutTime: Date, //签退时间
  isDelete: Boolean,
};

// 签到任务
const singTask = {
  courseId: String,
  taskName: String,
  taskTime: Date,
  location: String, // 位置
  areaId: String, //位置id,
  singTime: Date, // 签到时间
  outTime: Date, // 签退时间
  sustain: Number, // 持续时间
  userId: String,
  integral: Number, // 签到分数
  assign: String, //  指派人
  period: String, // 周期  月m 日d 周w  定时任务周期
  isPeriod: Boolean, // 是否开启定时任务
};

// 区域采集
const area = {
  areaId: String,
  areaName: String,
  location: String,
};

const classTable = {
  clasName: String,
  classId: String,
  remarks: String,
  picture: String,
  code: Number,
  teacherId: String,
};
