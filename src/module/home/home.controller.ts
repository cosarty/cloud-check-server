/*
https://docs.nestjs.com/controllers#controllers
*/

import { User } from '@/common/decorator/user.decorator';
import { Auth } from '@/common/role/auth.decorator';
import { ModelsEnum, PickModelType } from '@/models';
import { Controller, Get, Inject } from '@nestjs/common';
import { includes } from 'lodash';
import { Op, Sequelize } from 'sequelize';
import * as loadsh from 'lodash';
@Controller('home')
export class HomeController {
  constructor(
    @Inject(ModelsEnum.Class)
    private readonly classModel: PickModelType<ModelsEnum.Class>,
    @Inject(ModelsEnum.User)
    private readonly user: PickModelType<ModelsEnum.User>,
    @Inject(ModelsEnum.StatInfo)
    private readonly statInfo: PickModelType<ModelsEnum.StatInfo>,
    @Inject(ModelsEnum.SingTask)
    private readonly singTask: PickModelType<ModelsEnum.SingTask>,
    @Inject(ModelsEnum.Course)
    private readonly course: PickModelType<ModelsEnum.Course>,
    @Inject(ModelsEnum.Department)
    private readonly department: PickModelType<ModelsEnum.Department>,
    @Inject(ModelsEnum.TimingTask)
    private readonly timing: PickModelType<ModelsEnum.TimingTask>,

    @Inject(ModelsEnum.ClassSchedule)
    private readonly classSchedule: PickModelType<ModelsEnum.ClassSchedule>,
  ) {}

  @Get('admin')
  @Auth(['super', 'admin'])
  async Admin() {
    // 整个系统的课程总数
    const course = await this.course.count();
    // 整个系统的版班级总数
    const classNum = await this.classModel.count();

    // 整个系统的系别总数
    const department = await this.department.count();

    // 整个系统的老师总数
    const teacherCount = await this.user.count({
      where: {
        auth: 'teacher',
      },
    });
    // 整个学生的老师总数
    const studentCount = await this.user.count({
      where: {
        auth: 'student',
      },
    });

    // 签到率=已签到次数/ 签到数*学生数

    // 整个系统的学生签到排行
    // 计算考勤率
    const userInfo = await this.user.findAll({
      where: {
        auth: 'student',
        classId: {
          [Op.ne]: null,
        },
      },
      include: [
        {
          association: 'class',
          include: [
            { association: 'studnets' },
            {
              association: 'classSchedule',
              include: [
                {
                  association: 'singTask',
                },
              ],
            },
          ],
        },
        {
          association: 'statInfo',
        },
      ],
    });

    const studentRatio = userInfo
      .reduce((pre, nxt) => {
        const task = nxt.class.classSchedule.reduce(
          (p, x) => p + x.singTask.length,
          0,
        );
        return [
          ...pre,
          {
            name: nxt.userName,
            comment: nxt.account,
            ratio:
              nxt.statInfo.filter((s) => s.type === 1).length / (task ?? 0),
          },
        ];
      }, [])
      .sort((a, b) => b.ratio - a.ratio)
      .slice(0, 6);

    // 老师的受欢迎程度
    // 按签到率取前十个
    const teacherInfo = await this.user.findAll({
      where: {
        auth: 'teacher',
      },
      include: [
        {
          association: 'course',
          include: [
            {
              required: true,
              association: 'classSchedule',
              include: [
                {
                  association: 'class',
                  include: [{ association: 'studnets' }],
                },
                {
                  association: 'singTask',
                  include: [
                    {
                      association: 'students',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    const teacherRatio = teacherInfo
      .map((pre) => {
        const { singNum, stuNum } = pre.course.reduce(
          (p, co) => {
            const { singNum, stuNum } = co.classSchedule.reduce(
              (s, cl) => {
                // 班级人数
                const classNum = cl.class.studnets.length;
                // 总签到次数
                const singNum = cl.singTask.length * classNum;
                // 学生签到的次数
                const stuNum = cl.singTask.reduce((d, si) => {
                  return d + si.students.filter((st) => st.type === 1).length;
                }, 0);
                s['singNum'] = s['singNum'] + singNum;
                s['stuNum'] = s['stuNum'] + stuNum;

                return s;
              },
              { singNum: 0, stuNum: 0 },
            );
            p['singNum'] = p['singNum'] + singNum;
            p['stuNum'] = p['stuNum'] + stuNum;
            return p;
          },
          { singNum: 0, stuNum: 0 },
        );

        return {
          name: pre.userName,
          comment: pre.account,
          ratio: stuNum / (singNum ?? 0),
        };
      })
      .sort((a, b) => b.ratio - a.ratio)
      .slice(0, 6);

    // 课程的受欢迎程度
    // 签到率=已签到次数/ 签到数*学生数
    const schduleInfo = await this.course.findAll({
      include: [
        { association: 'user' },
        {
          required: true,
          association: 'classSchedule',
          include: [
            {
              association: 'class',
              include: [{ association: 'studnets' }],
            },
            {
              association: 'singTask',
              include: [
                {
                  association: 'students',
                },
              ],
            },
          ],
        },
      ],
    });

    const schduleRatio = schduleInfo
      .map((p) => {
        const { singNum, stuNum } = p.classSchedule.reduce(
          (s, cl) => {
            // 班级人数
            const classNum = cl.class.studnets.length;
            // 总签到次数
            const singNum = cl.singTask.length * classNum;
            // 学生签到的次数
            const stuNum = cl.singTask.reduce((d, si) => {
              return d + si.students.filter((st) => st.type === 1).length;
            }, 0);
            s['singNum'] = s['singNum'] + singNum;
            s['stuNum'] = s['stuNum'] + stuNum;

            return s;
          },
          { singNum: 0, stuNum: 0 },
        );
        return {
          name: p.courseName,
          comment: p.user.userName,
          ratio: stuNum / (singNum ?? 0),
        };
      })
      .sort((a, b) => b.ratio - a.ratio)
      .slice(0, 6);

    return {
      course,
      classNum,
      department,
      teacherCount,
      studentCount,
      studentRatio,
      schduleRatio,
      teacherRatio,
    };
  }

  @Get('teacher')
  @Auth(['teacher'])
  async teacher(@User() user) {
    // 课程数
    const course = await this.course.count({ where: { userId: user.userId } });

    // 授课班级数

    const classNum = await this.classModel.count({
      include: [
        {
          required: true,
          association: 'course',
          where: {
            userId: user.userId,
          },
        },
      ],
    });

    // 定时任务数
    const singTaskNum = await this.singTask.count({
      where: {
        userId: user.userId,
        isEnd: false,
      },
    });

    // 轮询任务数
    const timingNum = await this.timing.count({
      where: {
        userId: user.userId,
        isEnd: false,
      },
    });
    // 课程排行榜

    // 课程的受欢迎程度
    // 签到率=已签到次数/ 签到数*学生数
    const schduleInfo = await this.course.findAll({
      where: {
        userId: user.userId,
      },
      include: [
        {
          association: 'user',
        },
        {
          required: true,
          association: 'classSchedule',
          include: [
            {
              association: 'class',
              include: [{ association: 'studnets' }],
            },
            {
              association: 'singTask',
              include: [
                {
                  association: 'students',
                },
              ],
            },
          ],
        },
      ],
    });

    const schduleRatio = schduleInfo
      .map((p) => {
        const { singNum, stuNum } = p.classSchedule.reduce(
          (s, cl) => {
            // 班级人数
            const classNum = cl.class.studnets.length;
            // 总签到次数
            const singNum = cl.singTask.length * classNum;
            // 学生签到的次数
            const stuNum = cl.singTask.reduce((d, si) => {
              return d + si.students.filter((st) => st.type === 1).length;
            }, 0);
            s['singNum'] = s['singNum'] + singNum;
            s['stuNum'] = s['stuNum'] + stuNum;

            return s;
          },
          { singNum: 0, stuNum: 0 },
        );
        return {
          name: p.courseName,
          comment: p.user.userName,
          ratio: stuNum / (singNum ?? 0),
        };
      })
      .sort((a, b) => b.ratio - a.ratio)
      .slice(0, 6);

    // 课程签到图

    // const sc = await this.user.count({
    //   where: {
    //     classId,
    //   },
    // });

    const info = await this.classSchedule.findAll({
      where: {
        isEnd: false,
      },
      include: [
        {
          association: 'class',
          include: [
            {
              association: 'studnets',
            },
          ],
        },
        {
          association: 'course',
          where: {
            userId: user.userId,
          },
        },
        {
          association: 'singTask',
          include: [
            {
              association: 'students',
              required: false,
            },
          ],
        },
      ],
    });

    const cpi = info.map((i) => {
      return i.singTask.reduce(
        (pre: any, nxt) => {
          pre[2] +=
            i.class.studnets.length -
            nxt.students.filter((s) => s.type !== undefined && s.type !== null)
              .length;
          pre[0] +=
            i.class.studnets.length -
            nxt.students.filter((s) => s.type === 0).length;
          pre[1] +=
            i.class.studnets.length -
            nxt.students.filter((s) => s.type === 1).length;

          return pre;
        },
        [0, 0, 0],
      );
    });

    const statInfo = {
      value: loadsh.zip(...cpi),
      name: info.map((i) => i.course.courseName + `(${i.class.className})`),
    };

    return {
      course,
      classNum,
      singTaskNum,
      timingNum,
      schduleRatio,
      statInfo,
    };
  }

  @Get('student')
  @Auth(['student'])
  async Stuudent(@User() user) {
    //  总签到数

    const singPass = await this.statInfo.count({
      where: { userId: user.userId, type: 1 },
    });
    // 缺勤数
    let singDuty = 0;

    if (user.classId) {
      const all = await this.statInfo.count({ where: { userId: user.userId } });
      const classTask = await this.classSchedule.findAll({
        where: {
          classId: user.classId,
        },
        include: {
          association: 'singTask',
        },
      });
      const duty = classTask.reduce((pre, nxt) => pre + nxt.singTask.length, 0);
      singDuty = duty - all;
    }

    // 迟到数
    const singLate = await this.statInfo.count({
      where: { userId: user.userId, type: 0 },
    });

    // 课程数
    const schduleNum = await this.classSchedule.count({
      where: { classId: user.classId, isEnd: false },
    });

    return { singPass, singLate, singDuty, schduleNum };
  }
}
