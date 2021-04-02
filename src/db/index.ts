import { Pilet } from '../types';
const redis = require('redis');
const BSON = require('bson');
const client = redis.createClient({
  url: process.env.REDIS_URL || null,
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  db: process.env.REDIS_DB || null,
  return_buffers: true,
});

// let piletData: Record<string, Record<string, Pilet>> = {};

export async function getPilets(): Promise<Array<Pilet>> {
  let pilets: Array<Pilet> = [];

  return new Promise((resolve: any, reject) => {
    client.keys('*', async function(err: any, replies: any) {
      const name = replies.toString('utf-8');
      new Promise((resolve: any, reject) => {
        client.get(name, async function(err: any, reply: any) {
          const pilet = BSON.deserialize(reply);
          Object.keys(pilet).forEach((version: string) => {
            pilets.push(pilet[version]);
            resolve(pilets);
          });
        });
      }).then(res => {
        resolve(res);
      });
    });
  }).then((res: any) => {
    return res;
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
