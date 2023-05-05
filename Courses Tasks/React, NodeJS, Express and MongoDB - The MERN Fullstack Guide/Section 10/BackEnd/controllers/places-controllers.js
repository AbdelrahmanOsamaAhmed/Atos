const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");
const Place = require("../models/place");
const User = require("../models/user");
const HttpError = require("../models/http-error");
const mongoose = require("mongoose");

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
  console.log(req.body);
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
    image:
      "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8&w=1000&q=80",
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
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;
  const updatedPlace = await Place.findById(placeId);

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
  const sess = await mongoose.startSession();
  sess.startTransaction();
  await place.deleteOne({ session: sess });
  place.creator.places.pull(place);
  await place.creator.save({ session: sess });
  await sess.commitTransaction();

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
