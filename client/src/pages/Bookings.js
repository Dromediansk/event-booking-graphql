import React, { useContext, useEffect, useState } from "react";
import BookingList from "../components/Bookings/BookingList/BookingList";
import { AuthContext } from "../context/auth-context";
import Spinner from "../layout/Spinner";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const requestBody = {
          query: `
          query {
            bookings {
              _id
              createdAt
              event {
                _id
                title
                date
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
            Authorization: `Bearer ${authContext.token}`,
          },
        });
        if (response.status !== 200 && response.status !== 201) {
          throw new Error("Failed!");
        }
        const responseJson = await response.json();
        setBookings(responseJson.data.bookings);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [authContext.token]);

  const deleteBookingHandler = async (bookingId) => {
    try {
      setIsLoading(true);
      const requestBody = {
        query: `
          mutation {
            cancelBooking(bookingId: "${bookingId}") {
              _id
              title
            }
          }
        `,
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
      await response.json();
      const updatedBooking = bookings.filter(
        (booking) => booking._id !== bookingId
      );
      setBookings(updatedBooking);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <BookingList bookings={bookings} onDelete={deleteBookingHandler} />
      )}
    </>
  );
};

export default BookingsPage;
