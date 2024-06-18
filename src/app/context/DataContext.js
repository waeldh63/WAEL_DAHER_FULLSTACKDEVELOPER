// DataContext.js

import React, { createContext, useState, useEffect } from "react";
import { fetchUsers } from "../services/apiService";
export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchedUsers, setFetchedUsers] = useState([]);
  useEffect(() => {
    // THIS FUNCTION CALL THE API TO FETCH USER AND WE SAVE IT IN fetchedUsers
    const getUsers = async () => {
      try {
        const data = await fetchUsers();
        setFetchedUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (typeof window !== "undefined") {
      getUsers();
    }
  }, []);
  return (
    // HERE WE MAKES THE DATA AS CONTEXT PROVIDER TO ACCESS THE DATA IN ALL OUR PROJECT 
    // NOW WHENEVER WE NEED THE DATA WE JUST IMPORT IT FROM CONTEST AND WE DONT CALL THE API AGAIN
    <DataContext.Provider value={fetchedUsers}>{children}</DataContext.Provider>
  );
};
