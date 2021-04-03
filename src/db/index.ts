import { Pilet } from '../types';
const redis = require('redis');
const BSON = require('bson');
const client = redis.createClient({
  host: process.env.REDIS_HOST || '0.0.0.0',
  port: process.env.REDIS_PORT || 6379,
  url: process.env.REDIS_URL || null,
  return_buffers: true,
});

// let piletData: Record<string, Record<string, Pilet>> = {};

export async function getPilets(): Promise<Array<Pilet>> {
  return new Promise((resolve: any, reject) => {
    client.keys('*', async function(err: any, replies: any) {
      const names = replies.toString('utf-8').split(',');

      let namesPromise: any = [];

      names.forEach((element: any) => {
        namesPromise.push(
          new Promise(resolve => {
            client.get(element, function(err: any, reply: any) {
              const pilet = BSON.deserialize(reply);
              Object.keys(pilet).forEach((version: string) => {
                resolve(pilet[version]);
              });
            });
          }),
        );
      });

      return Promise.all(namesPromise).then(promises => {
        resolve(promises);
      });
    });
  });
}

export async function getPilet(name: string, version: string): Promise<Pilet | undefined> {
  return new Promise((resolve: any, reject) => {
    client.get(name, function(err: any, reply: any) {
      const pilet = BSON.deserialize(reply);
      Object.keys(pilet).forEach((version: string) => {
        resolve(pilet[version]);
      });
    });
  }).then((res: any) => {
    return res;
  });
}

export async function setPilet(pilet: Pilet) {
  const meta = pilet.meta;
  const current = BSON.serialize({
    ...{},
    [meta.version]: pilet,
  });

  client.set(meta.name, current, function(err: any, res: any) {
    if (!err) {
      console.log(`${meta.name} was uploaded successfully !`);
    } else {
      console.log(`${meta.name} failed to upload !`);
    }
  });
}
