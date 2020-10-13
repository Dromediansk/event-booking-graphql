import React, { useContext } from "react";
import { AuthContext } from "../../../../context/auth-context";

const EventItem = ({ event, onDetail }) => {
  const authContext = useContext(AuthContext);

  const userIsEventOwner = event.creator._id === authContext.userId;

  return (
    <li className="events__list-item">
      <div>
        <h1>{event.title}</h1>
        <h2>
          ${event.price} - {new Date(event.date).toLocaleDateString()}
        </h2>
      </div>
      <div>
        {userIsEventOwner ? (
          <p>Your the owner of this event</p>
        ) : (
          <button className="btn" onClick={() => onDetail(event._id)}>
            View Details
          </button>
        )}
      </div>
    </li>
  );
};

export default EventItem;
