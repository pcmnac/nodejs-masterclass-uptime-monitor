const fs = require('fs');
const path = require('path');

const lib = {};

lib.baseDir = path.join(__dirname, '/../.data');

lib.create = (dir, file, data, callback) => {
  fs.open(`${lib.baseDir}/${dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // convert data to json
      const stringData = JSON.stringify(data);

      // write to file and close it
      fs.writeFile(fileDescriptor, stringData, (err) => {
        if (!err) {
          fs.close(fileDescriptor, (err) => {
            if (!err) {
              callback(false);
            } else {
              callback(new Error(`Error closing new file: ${err.message}`));
            }
          });
        } else {
          callback(new Error(`Error writing to file: ${err.message}`));
        }
      });
    } else {
      callback(new Error(`Could not create the file: ${err.message}`));
    }
  });
};

lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.baseDir}/${dir}/${file}.json`, 'utf8', (err, data) => {
    callback(err, data);
  });
};

lib.update = (dir, file, data, callback) => {
  fs.open(`${lib.baseDir}/${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // convert data to json
      const stringData = JSON.stringify(data);

      // trucate file
      fs.ftruncate(fileDescriptor, (err) => {
        if (!err) {
          // write to file and close it
          fs.writeFile(fileDescriptor, stringData, (err) => {
            if (!err) {
              fs.close(fileDescriptor, (err) => {
                if (!err) {
                  callback(false);
                } else {
                  callback(new Error(`Error closing existing file: ${err.message}`));
                }
              });
            } else {
              callback(new Error(`Error writing to existing file: ${err.message}`));
            }
          });
        } else {
          callback(new Error(`Error truncating the file: ${err.message}`));
        }
      });
    } else {
      callback(new Error(`Could not open the file for update: ${err.message}`));
    }
  });
};

lib.delete = (dir, file, callback) => {
  // unlink
  fs.unlink(`${lib.baseDir}/${dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback(new Error(`Error deleting the file: ${e.message}`));
    }
  });
};

module.exports = lib;