/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLBoolean as Boolean,
  GraphQLNonNull as NonNull,
  GraphQLList,
} from 'graphql';
import _ from 'lodash';
import AnswerType from './AnswerType';
import CourseType from './CourseType';
import UserLoginType from './UserLoginType';
import UserProfileType from './UserProfileType';
import UserClaimType from './UserClaimType';

const UserType = new ObjectType({
  name: 'UserType',
  fields: () => ({
    id: { type: new NonNull(ID) },
    email: { type: StringType },
    isAdmin: { type: Boolean },
    courses: {
      type: new GraphQLList(CourseType),
      resolve: user => user.getCourses(),
    },
    logins: {
      type: new NonNull(new GraphQLList(UserLoginType)),
      resolve: user => user.getLogins(),
    },
    claims: {
      type: new NonNull(new GraphQLList(UserClaimType)),
      resolve: user => user.getClaims(),
    },
    profile: {
      type: new NonNull(UserProfileType),
      resolve: user => user.getProfile(),
    },
    role: {
      type: StringType,
      resolve: user => _.get(user, 'UserCourse.role'),
    },
    answers: {
      type: new GraphQLList(AnswerType),
      resolve: user => {
        const where = {};
        const userCourse = user.UserCourse;
        if (userCourse) {
          where.courseId = userCourse.courseId;
        }
        return user.getAnswers({ where });
      },
    },
  }),
});

export default UserType;
