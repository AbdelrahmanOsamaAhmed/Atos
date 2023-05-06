const { validationResult } = require("express-validator");
const Place = require("../models/place");
const User = require("../models/user");
const HttpError = require("../models/http-error");
const mongoose = require("mongoose");
const fs = require("fs");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  const place = await Place.findById(placeId);

  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided id.", 404)
    );
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  const userWithPlaces = await User.findById(userId).populate("places");

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(
      new HttpError("Could not find places for the provided user id.", 404)
    );
  }

  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, address, creator } = req.body;

  const createdPlace = new Place({
    title,
    description,
    address,
    creator,
    image: req.file.path,
  });
  const user = await User.findById(creator);
  if (!user) {
    return next(new HttpError("Could not find user by this id", 404));
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError("Failed, please try again.", 500));
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;
  const updatedPlace = await Place.findById(placeId);
  if (updatedPlace.creator.toString() !== req.userData.userId) {
    return next(new HttpError("U ARE NOT ALLOWED.", 401));
  }
  updatedPlace.title = title;
  updatedPlace.description = description;
  await updatedPlace.save();

  res.status(200).json({ place: updatedPlace.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  const place = await Place.findById(placeId).populate("creator");
  if (!place) {
    return next(new HttpError("Could not find place with id", 404));
  }
  if (place.creator.id !== req.userData.userId) {
    return next(new HttpError("U ARE NOT ALLOWED.", 401));
  }
  const imagePath = place.image;
  const sess = await mongoose.startSession();
  sess.startTransaction();
  await place.deleteOne({ session: sess });
  place.creator.places.pull(place);
  await place.creator.save({ session: sess });
  await sess.commitTransaction();
  fs.unlink(imagePath, (err) => console.log(err));
  res.status(200).json({ message: "Deleted place." });
};
const getAllPlaces = async (req, res, next) => {
  const foundPlaces = await Place.find();
  res.status(200).json(foundPlaces);
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
exports.getAllPlaces = getAllPlaces;
