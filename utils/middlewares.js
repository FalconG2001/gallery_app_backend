const catchAsync = require("./catchAsync");

exports.getAll = (req, res, next) => {
  req.query = {
    limit: 10,
  };
  next();
};

exports.uploadMul = (req, res, next) => {
  if (req.file) {
    req.body.image = `data:${
      req.file.mimetype
    };base64,${req.file.buffer.toString("base64")}`;
  }
  if (req.body.tags) {
    req.body.tags = req.body.tags.split(",");
  }
  next();
};

exports.uploadAuthentication = (req, res, next) => {
  req.body.uploadedBy = req.user._id;
  next();
};

exports.likeMiddleware = (Model, mdlName) =>
  catchAsync(async (req, res, next) => {
    if (mdlName === "img") {
      if (req.user.imageLikes.includes(req.params.id)) {
        await Model.findByIdAndUpdate(req.user._id, {
          $pull: { imageLikes: req.params.id },
        });
        req.body.likes = 0;
      } else {
        await Model.findByIdAndUpdate(req.user._id, {
          $push: { imageLikes: req.params.id },
        });
        req.body.likes = 1;
      }
    } else {
      if (req.user.commentLikes.includes(req.params.id)) {
        await Model.findByIdAndUpdate(req.user._id, {
          $pull: { commentLikes: req.params.id },
        });
        req.body.likes = 0;
      } else {
        await Model.findByIdAndUpdate(req.user._id, {
          $push: { commentLikes: req.params.id },
        });
        req.body.likes = 1;
      }
    }

    next();
  });

const modelAttrs = ["tags"];

exports.updateModelMiddleware = (Model) =>
  catchAsync(async (req, res, next) => {
    let newObj = {};
    for (const [key, value] of Object.entries(req.body)) {
      if (modelAttrs.includes(key)) {
        let existingData = await Model.findById(req.params.id).select(key);
        if (key === tags) {
        }
        for (let val of value) {
          if (existingData[key].includes(val)) {
            existingData[key] = existingData[key].filter((tag) => tag !== val);
          } else {
            existingData[key].push(val);
          }
        }
        newObj[key] = existingData[key];
      } else {
        newObj[key] = value;
      }
    }

    req.body = newObj;
    next();
  });
