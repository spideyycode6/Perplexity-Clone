import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

const Protect = ({children}) => {
    const {user} = useSelector((state) => state.auth);
    const {loading} = useSelector((state) => state.auth);
    if (loading) {
        return <div>Loading...</div>;
    }
    if (!user) {
        return <Navigate to="/login" />;
    }
  return (
    children
  )
}

export default Protect