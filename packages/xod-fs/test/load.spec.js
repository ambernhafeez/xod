import { expect } from 'chai';

import fs from 'fs';
import path from 'path';
import R from 'ramda';
import shell from 'shelljs';
import * as Loader from '../src/load';
import pack from '../src/pack';
import libsFixture from './fixtures/libs.json';
import unpacked from './fixtures/unpacked.json';
import xodball from './fixtures/xodball.json';

const tempDir = './fixtures/workspace';
const sortByPath = R.sortBy(R.prop('path'));

describe('Loader', () => {
  const workspace = path.resolve(__dirname, tempDir);
  const projectPath = 'awesome-project';

  it('getLocalProjects: should return an array of local projects in workspace', () =>
    Loader.getLocalProjects(workspace)
      .then((projects) => {
        expect(projects).to.have.lengthOf(1);
        expect(projects).to.deep.equal([
          {
            authors: [
              'Amperka team',
            ],
            description: '',
            license: '',
            name: 'awesome-project',
            libs: ['xod/core'],
            version: '42',
            path: path.resolve(workspace, projectPath),
          },
        ]);
      })
  );

  it('getProjects: should return an array of projects in workspace, including libs', () =>
    Loader.getProjects(workspace)
      .then((projects) => {
        expect(projects).to.have.lengthOf(4);
      })
  );

  it('getLocalProjects: should return an array of local projects in workspace', () =>
    Loader.getLocalProjects(workspace)
      .then((projects) => {
        expect(projects).to.have.lengthOf(1);
      })
  );

  it('loadProjectWithLibs: should return project with libs', () =>
    Loader.loadProjectWithLibs(projectPath, workspace)
      .then(({ project, libs }) => {
        expect(sortByPath(project)).to.deep.equal(sortByPath(unpacked));
        expect(libs).to.deep.equal(libsFixture);

        const packed = pack(project, libs);
        expect(packed).to.deep.equal(xodball);
      })
  );

  it('loadProjectWithoutLibs: should return project without libs', (done) => {
    const xodCore = path.resolve(workspace, './lib/xod/core');
    const xodCoreOwner = path.resolve(xodCore, '..');

    Loader.loadProjectWithoutLibs(xodCore)
      .then((project) => {
        const implsLoaded = shell
          .ls(`${xodCore}/*.{c,cpp,h,inl,js}`)
          .every((implPath) => {
            const { base, dir } = path.parse(implPath);
            const impl = fs.readFileSync(implPath).toString();
            const xodm = path.relative(xodCoreOwner, `${dir}/patch.xodm`);
            const patch = project.find(_ => _.path === xodm);
            if (!(patch && patch.impls)) return false;
            return patch.impls[base] === impl;
          });

        done(
          !implsLoaded && new Error('some implementations were not loaded')
        );
      });
  });
});
