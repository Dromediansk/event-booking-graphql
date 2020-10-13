import React, { useContext, useEffect, useRef, useState } from "react";
import EventList from "../components/Events/EventList/EventList";
import Modal from "../components/Modal/Modal";
import { AuthContext } from "../context/auth-context";
import Spinner from "../layout/Spinner";

const EventsPage = () => {
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const authContext = useContext(AuthContext);

  const titleElRef = useRef();
  const descriptionElRef = useRef();
  const priceElRef = useRef();
  const dateElRef = useRef();

  const startCreateEventHandler = () => {
    setCreatingEvent(true);
  };

  const modalCancelHandler = () => {
    setCreatingEvent(false);
    setSelectedEvent(null);
  };

  const modalConfirmHandler = () => {
    setCreatingEvent(false);
    const title = titleElRef.current.value;
    const description = descriptionElRef.current.value;
    const price = +priceElRef.current.value;
    const date = dateElRef.current.value;

    if (
      !title.trim().length ||
      !description.trim().length ||
      price <= 0 ||
      !date.trim().length
    ) {
      return;
    }

    const requestBody = {
      query: `
          mutation CreateEvent($title: String!, $desc: String!, $price: Float!, $date: String!) {
            createEvent(eventInput: {title: $title, description: $desc, price: $price, date: $date}) {
              _id
              title
              description
              date
              price
            }
          }
        `,
        variables: {
          title: title,
          desc: description,
          price: price,
          date: date
        }
    };

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authContext.token}`,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        const {
          _id,
          title,
          description,
          price,
          date,
        } = resData.data.createEvent;
        setEvents([
          ...events,
          {
            _id,
            title,
            description,
            price,
            date,
            creator: {
              _id: authContext.userId,
            },
          },
        ]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const requestBody = {
        query: `
          query {
            events {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `,
      };

      const response = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed!");
      }
      const responseJson = await response.json();
      setEvents(responseJson.data.events);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const showEventDetailHandler = (eventId) => {
    const eventChosen = events.find((ev) => ev._id === eventId);
    setSelectedEvent(eventChosen);
  };

  const bookEventHandler = async () => {
    try {
      if (!authContext.token) {
        setSelectedEvent(null);
        return;
      }
      const requestBody = {
        query: `
          mutation BookEvent($id: ID!) {
            bookEvent(eventId: $id) {
              _id
              createdAt
              updatedAt
            }
          }
        `,
        variables: {
          id: selectedEvent._id
        }
      };

      const response = await fetch("http://localhost:8000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authContext.token}`,
        },
      });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed!");
      }
      const responseJson = await response.json();
      console.log(responseJson);
      setSelectedEvent(null);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <>
      {creatingEvent && (
        <Modal
          title="Add Event"
          onCancel={modalCancelHandler}
          onConfirm={modalConfirmHandler}
          canCancel
          canConfirm
          confirmText="Confirm"
        >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" ref={titleElRef} />
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea row="4" id="description" ref={descriptionElRef} />
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" ref={priceElRef} />
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input type="datetime-local" id="date" ref={dateElRef} />
            </div>
          </form>
        </Modal>
      )}
      {selectedEvent && (
        <Modal
          title={selectedEvent.title}
          onCancel={modalCancelHandler}
          onConfirm={bookEventHandler}
          canCancel
          canConfirm
          confirmText={authContext.token ? "Book" : "Confirm"}
        >
          <h1>{selectedEvent.title}</h1>
          <h2>
            ${selectedEvent.price} -{" "}
            {new Date(selectedEvent.date).toLocaleDateString()}
          </h2>
          <p>{selectedEvent.description}</p>
        </Modal>
      )}
      {authContext.token && (
        <div className="events-control">
          <p>Share your own events!</p>
          <button className="btn" onClick={startCreateEventHandler}>
            Create Event
          </button>
        </div>
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        <EventList events={events} onViewDetail={showEventDetailHandler} />
      )}
    </>
  );
};

export default EventsPage;
