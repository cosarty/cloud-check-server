/*
https://docs.nestjs.com/controllers#controllers
*/

import { Auth } from '@/common/role/auth.decorator';
import { ModelsEnum, PickModelType } from '@/models';
import { Controller, Get, Inject } from '@nestjs/common';
import { includes } from 'lodash';
import { Op, Sequelize } from 'sequelize';

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
    @Inject(ModelsEnum.ClassSchedule)
    private readonly department: PickModelType<ModelsEnum.Department>,
    @Inject(ModelsEnum.Course)
    @Inject(ModelsEnum.Department)
    private readonly classSchedule: PickModelType<ModelsEnum.ClassSchedule>,
  ) {}

  @Get('admin')
  @Auth(['super', 'admin'])
  async Admin() {
    // 整个系统的课程总数
    const course =await this.course.count();
    // 整个系统的版班级总数
    const classNum =await this.classModel.count();

    // 整个系统的系别总数
    const department =await this.department.count();

    // 整个系统的老师总数
    const teacherCount =await this.user.count({
      where: {
        auth: 'teacher',
      },
    });
    // 整个学生的老师总数
    const studentCount =await this.user.count({
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
}
