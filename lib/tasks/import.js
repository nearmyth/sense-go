'use strict';

const path = require('path');
const gUtil = require('gulp-util');
const fs = require('fs-extra');
const mkdirp = require('mkdirp');
const tildify = require('tildify');

function ImportTasks(gulp, plugins, config /* , taskUtils */) {

  function doImport(taskConfig, done) {

    if (taskConfig.importDef && taskConfig.importDef.enabled && taskConfig.importDef.files) {

      taskConfig.importDef.files.forEach(function (fileDef) {
        // Todo: Add a glob, support copying multiple files without defining each and every one.
        const src = path.resolve(fileDef[0]);
        const isDir = fs.lstatSync(fileDef[0]).isDirectory();
        // eslint-disable-next-line no-negated-condition
        const dest = path.resolve(path.join(fileDef[1], (!isDir) ? path.basename(fileDef[0]) : ''));
        gUtil.log(taskConfig.taskName, 'copy from ' + gUtil.colors.blue(tildify(fileDef[0])) + ' to ' + gUtil.colors.blue(tildify(fileDef[1])));
        mkdirp.sync(path.resolve(path.join(fileDef[1])));
        // Todo: Errorhandling completely missing here
        fs.copySync(src, dest);
      });
      return done();
    }
    gUtil.log(taskConfig.taskName, gUtil.colors.green('Nothing to import'));
    return done();

  }

  gulp.task('import:fromLocal', function (done) {
    return doImport({
      taskName: 'import:fromLocal',
      importDef: config.import.fromLocal
    }, done);
  });

}

module.exports = ImportTasks;
