import React from "react";
import EventItem from "./EventItem/EventItem";

const EventList = ({ events, onViewDetail }) => (
  <ul className="events__list">
    {events.map((event) => (
      <EventItem key={event._id} event={event} onDetail={onViewDetail} />
    ))}
  </ul>
);

export default EventList;
