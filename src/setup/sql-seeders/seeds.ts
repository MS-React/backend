import * as Sequelize from 'sequelize';
import * as faker from 'faker';
import { IUserModel } from '../../models';

const DEFAULT_USERS_SEED_COUNT = 20;
const DEFAULT_USERS_SEED_PREFIX = 'seed_';

function generateRandomUsers(length: number = DEFAULT_USERS_SEED_COUNT): Array<IUserModel> {
  return Array.from({ length }, () => ({
    _id: faker.random.uuid(),
    email: `${DEFAULT_USERS_SEED_PREFIX}${faker.internet.email()}`,
    name: faker.name.findName(),
    phone: faker.phone.phoneNumberFormat(),
    skypeId: faker.internet.userName(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  }));
}

export default {
  up: async (queryInterface: Sequelize.QueryInterface) => {
    return queryInterface.bulkInsert('users', generateRandomUsers(), {});
  },

  down: async (queryInterface: Sequelize.QueryInterface) => {
    return queryInterface.bulkDelete('users', {
      email: { [Sequelize.Op.regexp]: `^${DEFAULT_USERS_SEED_PREFIX}` }
    }, {});
  }
};
