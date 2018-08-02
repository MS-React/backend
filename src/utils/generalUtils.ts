import { Request } from 'express';
import * as multer from 'multer';
import constants from '../config/constants';

const parseDatabaseArguments = (args: Array<string>): typeof constants['SQL'] => {
  const localDbConfig = constants.SQL;
  args.filter(element => element.substring(0, 2) === 'db')
    .forEach(dbparam => {
      let [key, value] = dbparam.split('=');
      localDbConfig[key.slice(2)] = value;
    });

  return localDbConfig;
};

export const safeParse = (str: string, fallback: any = undefined) => {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

export const isId = (key: string): boolean => key === 'id' || key === '_id' || /Id$/.test(key);

export const cleanQuery = (
  query: string | any = '',
  customFormatter?: (key: string, value: any) => any
): { [key: string]: any } => {
  if (typeof query !== 'string') return query instanceof Object ? query : {};

  const defaultFormatter = (key: string, value: any) => {
    if (isId(key)) return value;
    value = safeParse(value, value);
    if (typeof value === 'string') return new RegExp(value, 'i');
    return value;
  };

  const parsedQuery = safeParse(query, {});

  return Object.keys(parsedQuery)
    .map(key => [key, parsedQuery[key]])
    .reduce((fullQuery, queryChunk) => {
      const key: string = queryChunk[0];
      const value: any = (customFormatter || defaultFormatter)(key, queryChunk[1]);

      if (key && value !== undefined) fullQuery[key] = value;

      return fullQuery;
    }, {});
};

export const parseMultiPartRequest = async (request: Request): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    multer().any()(request, undefined, async (error) => {
      if (error) reject(error);
      resolve();
    });
  });
};

export const getDatabaseConfig = (): typeof constants['SQL'] => {
  let { SQL: config } = constants;

  if (process.env.NODE_ENV === 'local') {
    config = parseDatabaseArguments(process.argv);
  }

  return config;
};
