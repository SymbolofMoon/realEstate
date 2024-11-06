// src/components/RatingModal.js

import React, { useState } from "react";
import "./sharingmodal.scss"; // Import SCSS file for styling
import {EmailShareButton, EmailIcon, WhatsappShareButton, WhatsappIcon, FacebookIcon, FacebookShareButton } from "react-share";
import baseURL from "../../lib/baseURL";

const SharingModal = ({ isOpen, onClose, postId }) => {

    if (!isOpen) return null;
    const shareURL = baseURL.WebsiteURL+`/${postId}`;
    const title = "Check Out this amazing property";
    const message = `Hey, check out this great post:`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareURL)
          .then(() => {
            alert('Link copied to clipboard!');
          })
          .catch((err) => {
            alert('Failed to copy the link. Please try again.');
            console.error('Error copying the link:', err);
          });
      };
    

  return (
    <div className="modal-overlay">
      <div className="modal-content">
      <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Share the Post</h2>
        <hr />
        <br></br>
        <span>Share on Social Media</span>
        <div className="socialmedia">
        
            <div className="feature">
                <EmailShareButton url={shareURL} subject={title} body={message} >
                    <EmailIcon size={32} round />
                    <p>Email</p>
                </EmailShareButton>
            </div>
            <div className="feature">
                <WhatsappShareButton url={shareURL} title={title} r>
                    <WhatsappIcon size={32} round />
                    <p>WhatsApp</p>
                </WhatsappShareButton>
            
            </div>
            <div className="feature">
                <FacebookShareButton url={shareURL} title={title} hashtag="newproperty">
                    <FacebookIcon size={32} round />
                    <p>FaceBook</p>
                </FacebookShareButton>
            
            </div>
        </div>
        <hr />

        <button onClick={handleCopyLink}>Copy Link</button>
      </div>
    </div>
  );
};

export default SharingModal;
