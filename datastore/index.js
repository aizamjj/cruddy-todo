const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, newId) => {
    fs.writeFile(path.join(exports.dataDir, `${newId}.txt`), text, (err) => {
      if (err) {
        console.log('ERROR CREATING FILE');
      } else {
        callback(null, { id: newId, text: text });
      }
    });
  });
};

exports.readAll = (callback) => {
  // fs.readdir(exports.dataDir, (err, items) => {
  //   if (err) {
  //     console.log("ERROR READING DIRECTORY");
  //   } else {
  //     _.map(items, file => {
  //       let id = path.basename(file, '.txt');
  //       return fs.readFile(path.join(exports.dataDir, file), (err, data) => {
  //         if (err) {
  //           console.log("ERROR READING FILE");
  //         } else {
  //           callback(null, data);
  //         }
  //       })
  //     });
  //   }
  // });
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), 'utf8', (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), 'utf8', (err, oldText) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
        callback(null, { id, text: text });
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(path.join(exports.dataDir, `${id}.txt`), err => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
