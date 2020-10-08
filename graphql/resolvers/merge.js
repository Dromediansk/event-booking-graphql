const Event = require("../../models/event");
const User = require("../../models/user");
const { dateToString } = require("../../helpers/date");

const fetchEventlistByIds = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((event) => {
      return {
        ...event._doc,
        date: dateToString(event._doc.date),
        creator: findUserById.bind(this, event.creator),
      };
    });
  } catch (err) {
    throw err;
  }
};

const findEventById = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return { ...event._doc, creator: findUserById.bind(this, event.creator) };
  } catch (err) {
    throw err;
  }
};

const findUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      createdEvents: fetchEventlistByIds.bind(this, user._doc.createdEvents),
    };
  } catch (err) {
    throw err;
  }
};

const transformEvent = (event) => {
  return {
    ...event._doc,
    date: dateToString(event._doc.date),
    creator: findUserById.bind(this, event._doc.creator),
  };
};

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    user: findUserById.bind(this, booking._doc.user),
    event: findEventById.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
