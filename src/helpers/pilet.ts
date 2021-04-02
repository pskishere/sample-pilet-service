import { dirname, basename } from 'path';
import { formatAuthor } from './author';
import { untar } from './untar';
import { computeHash, computeIntegrity } from './hash';
import { PiletMetadata, PackageData, PackageFiles, Pilet } from '../types';

const packageRoot = 'package/';
const extractRequireRef = /^\/\/\s*@pilet\s+v:1\s*\(([A-Za-z0-9\_\:\-]+)\)/;
let iter = 1;

function getPackageJson(files: PackageFiles): PackageData {
  const fileName = `${packageRoot}package.json`;
  const fileContent = files[fileName];
  // const content = fileContent.toString('utf8');
  const content = fileContent;
  return JSON.parse(content);
}

function getContent(path: string, files: PackageFiles) {
  const content = path && files[path];
  return content;
  // return content && content.toString('utf8');
}

function getPiletMainPath(data: PackageData, files: PackageFiles) {
  const paths = [
    data.main,
    `dist/${data.main}`,
    `${data.main}/index.js`,
    `dist/${data.main}/index.js`,
    'index.js',
    'dist/index.js',
  ];
  return paths.map(filePath => `${packageRoot}${filePath}`).filter(filePath => !!files[filePath])[0];
}

export function extractPiletMetadata(
  data: PackageData,
  main: string,
  file: string,
  files: PackageFiles,
  rootUrl: string,
): PiletMetadata {
  const name = data.name;
  const version = data.preview ? `${data.version}-pre.${iter++}` : data.version;
  const [, requireRef] = extractRequireRef.exec(main || '') || ([] as const);
  const author = formatAuthor(data.author);
  const license = {
    type: data.license || 'ISC',
    text: getContent(`${packageRoot}LICENSE`, files) || '',
  };

  if (requireRef) {
    return {
      name,
      version,
      requireRef,
      description: data.description,
      custom: data.custom,
      author,
      integrity: computeIntegrity(main),
      link: `${rootUrl}/files/${name}/${version}/${file}`,
      type: 'v1',
      license,
    };
  } else {
    return {
      name,
      version,
      description: data.description,
      custom: data.custom,
      author,
      hash: computeHash(main),
      link: `${rootUrl}/files/${name}/${version}/${file}`,
      type: 'v0',
      license,
    };
  }
}

export function getPiletDefinition(stream: NodeJS.ReadableStream, rootUrl: string): Promise<Pilet> {
  return untar(stream).then(files => {
    const data = getPackageJson(files);
    const path = getPiletMainPath(data, files);
    const root = dirname(path);
    const file = basename(path);
    const main = getContent(path, files);
    const meta = extractPiletMetadata(data, main, file, files, rootUrl);
    return {
      meta,
      root,
      files,
    };
  });
}
