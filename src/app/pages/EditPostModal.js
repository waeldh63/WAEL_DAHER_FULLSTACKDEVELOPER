import React, { useEffect, useRef, useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { DataContext } from "../context/DataContext";
import { udpatePosts } from "../services/apiService";
const EditPostModal = ({
  idToEdit,
  dataToEdit,
  openModalTrigger,
  closeModal,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchedUsers = useContext(DataContext);
  const [showModal, setShowModal] = useState(false);
  const [successAlertshow, setsuccessAlertshow] = useState(false);

  const [postDataToEdit, setpostDataToEdit] = useState({
    title: null,
    body: null,
    userId: null,
  });
  const modalRef = useRef(null);
  let modalInstance = useRef(null); // Ref to hold modal instance
  const updatePost = async () => {
    try {
      const data = await udpatePosts(idToEdit, postDataToEdit);
      setsuccessAlertshow(true);
      setTimeout(() => {
        setsuccessAlertshow(false);
        handleCloseModal();
      }, 1000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);
    closeModal();
  };
  const handleEditPostDropDownChangeUser = (e) => {
    const selectedUserId = e.target.value;
    setpostDataToEdit({ ...postDataToEdit, userId: selectedUserId });
  };

  useEffect(() => {
    if (typeof window !== "undefined" && showModal) {
      const bootstrap = require("bootstrap/dist/js/bootstrap.bundle.min.js");

      const modalElement = modalRef.current;
      modalInstance.current = new bootstrap.Modal(modalElement, {
        backdrop: false, // Prevents backdrop from closing modal on click
        keyboard: true, // Prevents modal from closing on escape key
      });

      // Show the modal
      modalInstance.current.show();

      // Cleanup function to hide the modal when the component is unmounted or showModal becomes false
      return () => {
        modalInstance.current.hide();
      };
    }
  }, [showModal]);
  useEffect(() => {
    setShowModal(openModalTrigger);
  }, [openModalTrigger]);

  useEffect(() => {
    setpostDataToEdit({
      ...postDataToEdit,
      title: dataToEdit.title,
      body: dataToEdit.body,
      userId: dataToEdit.userId,
    });
  }, [idToEdit]);
  return (
    <div
      ref={modalRef}
      className="modal fade"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      {successAlertshow && (
        <div
          class="alert alert-success w-25"
          style={{ position: "fixed", top: 100, zIndex: 9999, right: 220 }}
          role="alert"
        >
          post Updated successfully
        </div>
      )}
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Modal title
            </h5>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-12">
                <label class="form-label">title</label>
                <input
                  type="text"
                  class="form-control"
                  value={postDataToEdit.title}
                  onChange={(e) =>
                    setpostDataToEdit({
                      ...postDataToEdit,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              <div class="col-md-12">
                <label class="form-label">body</label>
                <textarea
                  type="text"
                  class="form-control "
                  style={{ height: "150px" }}
                  value={postDataToEdit.body}
                  onChange={(e) =>
                    setpostDataToEdit({
                      ...postDataToEdit,
                      body: e.target.value,
                    })
                  }
                />
              </div>

              <div class="col-md-6 ">
                <label class="form-label">User</label>
                <div className="btn-group">
                  <select
                    className="form-select"
                    id="validationCustom05"
                    onChange={handleEditPostDropDownChangeUser}
                  >
                    {fetchedUsers.map((user) => (
                      <option
                        key={user.id}
                        value={user.id}
                        selected={
                          postDataToEdit.userId === user.id ? true : false
                        }
                      >
                        {user.username}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseModal}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => updatePost()}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;
