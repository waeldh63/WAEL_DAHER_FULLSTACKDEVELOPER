// pages/CreatingPosts.js
import { useEffect, useState, useContext } from "react";
import { DataContext } from "../context/DataContext";
import {
  creatingPosts,
  fetchPosts,
  fetchFiltredPosts,
} from "../services/apiService";
import EditPostModal from "./EditPostModal";
const CreatingPosts = () => {
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchedUsers = useContext(DataContext);
  const [fetchedPosts, setFetchedPosts] = useState([]);
  const [postIdToEdit, setpostIdToEdit] = useState(1);
  const [openEditPostModal, setopenEditPostModal] = useState(false);
  const [successAlertshow, setsuccessAlertshow] = useState(false);

  const [formData, setFormData] = useState({
    title: null,
    body: null,
    userId: null,
  });

  const [postDataToEdit, setpostDataToEdit] = useState({
    title: null,
    body: null,
    userId: null,
  });
  
  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error}</p>;
  
  
  // THIS FUNCTION FILTER THE POSTS ON USERID 
  const getFiltredPosts = async (userId) => {
    try {
      const data = await fetchFiltredPosts(userId);
      setFetchedPosts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  // THI FUNCTION FETCH THE POSTS 
  const getPosts = async () => {
    try {
      const data = await fetchPosts();
      setFetchedPosts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (typeof window !== "undefined") {
      getPosts();
    }
  }, []);


  const handleDropDownChange = (e) => {
    const selectedUserId = e.target.value;
    setFormData({ ...formData, userId: selectedUserId });
  };

  const handleFilterDropDownChange = (e) => {
    if (e.target.value != "") {
      getFiltredPosts(e.target.value);
    } else {
      const searchPostInput = document.getElementById("searchPostInput");
      if (searchPostInput == "") {
        getPosts();
      } else {
        searchPostsByTitle(searchPostInput.value);
      }
    }
  };
  const handleSubmitFormCreatePost = async () => {
    event.preventDefault();
    try {
      const data = await creatingPosts(formData);
      setsuccessAlertshow(true);
      // here we reset the input 
      const titleInputReset = document.getElementById("validationCustom01");
      const bodyInputReset = document.getElementById("validationCustom02");
      titleInputReset.value = "";
      bodyInputReset.value = "";
      // here we show THE ALERT FOR 3S
      setTimeout(() => {
        setsuccessAlertshow(false);
      }, 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deletePostById = (id) => {
    // Find the index of the post with the given id
    const indexToDelete = fetchedPosts.findIndex((post) => post.id === id);

    if (indexToDelete !== -1) {
      // Remove the post from the array
      const updatedPosts = [...fetchedPosts];
      updatedPosts.splice(indexToDelete, 1);
      setFetchedPosts(updatedPosts);
      console.log(`Post with id ${id} deleted successfully.`);
    } else {
      console.log(`Post with id ${id} not found.`);
    }
  };

  const searchPostsByTitle = (query) => {
    if (query != "") {
      // Convert the query to lower case for case-insensitive search
      const lowerCaseQuery = query.toLowerCase();
      // Filter posts that include the query string in their title
      const updatedPosts = fetchedPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(lowerCaseQuery) ||
          post.body.toLowerCase().includes(lowerCaseQuery)
      );
      setFetchedPosts(updatedPosts);
    } else {
      //HERE WE MAKES SURE THAT IF THE USER ARE STILL USING FILTER DATA IF YES WE  DISPLAY THE DATA FILTRED IF NO WE DISPLAY ALL THE POST
      const checkFilter = document.getElementById("filterDropdown");
      if (checkFilter.value === "") {
        getPosts();
      } else {
        getFiltredPosts(checkFilter.value);
      }
    }
  };
  const handleOpenEditPostModal = (postId) => {
    setopenEditPostModal(true);
    setpostIdToEdit(postId);
    setpostDataToEdit({
      ...postDataToEdit,
      title: fetchedPosts.find((post) => post.id === postId)?.title,
      body: fetchedPosts.find((post) => post.id === postId)?.body,
      userId: fetchedPosts.find((post) => post.id === postId)?.userId,
    });
  };

  return (
    <div class="dropdown">
      {successAlertshow && (
        <div
          class="alert alert-success"
          style={{ position: "fixed", top: 50, zIndex: 9999, right: 25 }}
          role="alert"
        >
          post created successfully
        </div>
      )}

      {openEditPostModal && (
        <EditPostModal
          idToEdit={postIdToEdit}
          dataToEdit={postDataToEdit}
          openModalTrigger={openEditPostModal}
          closeModal={() => setopenEditPostModal(false)}
        />
      )}
      <form
        class="row g-3 needs-validation border-bottom border-black mt-2 pb-2 border-4  rounded-1  mb-4"
        novalidate
        onSubmit={handleSubmitFormCreatePost}
      >
        <h1>Create Post </h1>
        <div class="col-md-4">
          <label for="validationCustom01" class="form-label">
            Title
          </label>
          <input
            type="text"
            class="form-control"
            id="validationCustom01"
            required
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>

        <div class="col-md-4">
          <label for="validationCustom02" class="form-label">
            Body
          </label>
          <input
            type="text"
            class="form-control"
            id="validationCustom02"
            required
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          />
        </div>

        <div class="col-md-3">
          <label for="validationCustom04" class="form-label">
            User
          </label>
          <div className="btn-group">
            <select
              className="form-select"
              id="validationCustom05"
              value={formData.userId}
              onChange={handleDropDownChange}
              required
            >
              <option selected disabled value="">
                Choose...
              </option>
              {fetchedUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div class="col-12">
          <button class="btn btn-primary" type="submit">
            Submit form
          </button>
        </div>
      </form>

      <div class="row g-3 ">
        <div class="col-md-3 m-3">
          <label class="form-label  m-1">Filter By User</label>
          <div className="btn-group">
            <select
              id="filterDropdown"
              className="form-select m-1"
              onChange={handleFilterDropDownChange}
            >
              <option selected value="">
                All
              </option>
              {fetchedUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div class="col-md-3 m-3">
          <label class="form-label  m-1">Search By title and body</label>
          <div className="btn-group">
            <input
              id="searchPostInput"
              class="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              onChange={(event) => searchPostsByTitle(event.target.value)}
            />
          </div>
        </div>
      </div>

      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">title</th>
            <th scope="col">body</th>
            <th scope="col">username</th>
          </tr>
        </thead>
        <tbody>
          {fetchedPosts.map((post) => (
            <tr key={post.id}>
              <th scope="row">{post.id}</th>
              <td>
                {post.title.length > 25
                  ? `${post.title.slice(0, 25)} ...`
                  : post.title}
              </td>
              <td>
                {post.body.length > 50
                  ? `${post.body.slice(0, 50)} ...`
                  : post.body}
              </td>
              <td>
                {fetchedUsers.find((user) => user.id === post.userId)?.username}
              </td>
              <td>
                {" "}
                <button
                  type="button"
                  class="btn btn-primary"
                  onClick={() => handleOpenEditPostModal(post.id)}
                >
                  Edit
                </button>
              </td>
              <td>
                <button
                  class="btn btn-danger"
                  onClick={() => deletePostById(post.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CreatingPosts;
