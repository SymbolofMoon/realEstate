// src/components/RatingModal.js

import React, { useState } from "react";
import { addRating } from "../../slice/singlepostSlice";
import "./ratingmodal.scss"; // Import SCSS file for styling
import { useSelector, useDispatch } from 'react-redux';

const RatingModal = ({ isOpen, onClose, postId }) => {
  const [rating, setRating] = useState("");
//   const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleRating = async (event) => {
    event.preventDefault();

    // Validate the rating
    if (rating < 1 || rating > 10 || isNaN(rating)) {
      setError("Please enter a rating between 1 and 10.");
      return;
    }

    try {
       const response =  await dispatch(addRating({postId: postId, rating: rating})).unwrap();
        setRating(""); // Clear the form 
        alert("Thank you for your rating!");
        onClose();
      } catch (error) { 
        console.log(error);
        alert("There was an error submitting your rating. Please try again.");
      }

    // Send rating data to server (example using fetch, adjust the URL as needed)
    // const response = await fetch("/submit-rating", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     rating,
    //     comment,
    //   }),
    // });

    // if (response.ok) {
    //   alert("Thank you for your rating!");
    //   setRating(""); // Clear the form
    //   setComment(""); 
    //   onClose(); // Close the modal
    // } else {
    //   alert("There was an error submitting your rating. Please try again.");
    // }
  };

  // Don't render the modal if it's not open
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
      <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Submit your Rating</h2>
        
        <form onSubmit={handleRating}>
          <div className="form-group">
            <label htmlFor="rating">Rate this Post (1-10):</label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={rating}
              min="1"
              max="10"
              onChange={(e) => setRating(e.target.value)}
              required
            />
          </div>
          {/* <div className="form-group">
            <label htmlFor="comment">Optional Comment:</label>
            <textarea
              id="comment"
              name="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              cols="50"
            />
          </div> */}
          {error && <div className="error">{error}</div>}
          <button type="submit" className="submit-btn">
            Submit Rating
          </button>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;
