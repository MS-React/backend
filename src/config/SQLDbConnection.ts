import * as Sequelize from 'sequelize';

import constants from './constants';
import { parseDatabaseArguments } from '../utils/generalUtils';
import { Logger } from './Logger';
import { ProvideSingleton } from '../ioc';

@ProvideSingleton(SQLDbConnection)
export class SQLDbConnection {
  public db: Sequelize.Sequelize;

  constructor() {
    Logger.log(`connecting to ${constants.environment} SQL`);
    let { SQL: config } = constants;

    if (process.env.NODE_ENV === 'local') {
      const { db } = parseDatabaseArguments(process.argv);

      if (Object.keys(db).length > 0) {
        config = db;
      }
    }

    this.db = new Sequelize(config.db, config.username, config.password, {
      port: config.port,
      host: config.host,
      dialect: config.dialect,
      logging: (l) => Logger.verbose(l),
      operatorsAliases: Sequelize.Op as any,
      define: { charset: 'utf8', collate: 'utf8_general_ci' }
    });
  }
}
