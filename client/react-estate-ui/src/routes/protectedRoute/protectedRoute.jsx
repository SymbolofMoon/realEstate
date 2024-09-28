import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";

const ProtectedRoute = ({ element, allowedRoles }) => {
    const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/login" />;
  }

  return element;
};

export default ProtectedRoute;