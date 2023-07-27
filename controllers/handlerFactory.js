const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findOneAndDelete({ _id: req.params.id });
    const count = await Model.count();

    if (!doc) {
      return next(new AppError("No document Found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      total: count,
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let doc;
    if (req.body.likes !== undefined) {
      if (req.body.likes === 1) {
        doc = await Model.findOneAndUpdate(
          { _id: req.params.id },
          { $inc: { likes: 1 } },
          {
            new: true,
            runValidators: true,
          }
        ).exec();
      } else if (req.body.likes === 0) {
        doc = await Model.findOneAndUpdate(
          { _id: req.params.id },
          { $inc: { likes: -1 } },
          {
            new: true,
            runValidators: true,
          }
        ).exec();
      }
    } else {
      doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    if (!doc) {
      return next(new AppError("No document Found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: doc,
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError("No document Found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

exports.getAll = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let filter = { ...req.body.filter };
    let project = { ...req.body.project };

    let tempQuery = Model.find(filter, project);
    if (popOptions) tempQuery = tempQuery.populate(popOptions);

    const totalCount = await Model.count();

    // console.log(req.query, req.body);

    const features = new APIFeatures(tempQuery, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;

    res.status(200).json({
      status: "success",
      results: doc.length,
      total: totalCount,
      data: doc,
    });
  });

exports.getCount = (Model) =>
  catchAsync(async (req, res, next) => {
    const count = await Model.count();

    res.status(200).json({
      status: "success",
      count,
    });
  });
