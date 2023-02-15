import { User } from '@/models/users';
import { MyException } from '@/util/MyException';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';



@ValidatorConstraint()
export class EmailRegister  implements ValidatorConstraintInterface {
    async validate(value: string, args: ValidationArguments) {

    if(!value) return false
   const user =  await  User.findOne({where:{email:value}})
   if(user) throw new MyException({code:'403',error:'用户已注册'})
    return !user
    }
  
    defaultMessage(args: ValidationArguments) {
      return '用户已注册';
    }
    }