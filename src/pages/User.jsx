import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUsers, selectUsers } from "../redux/userSlice";
import axios from "axios";
import Pagination from "../components/Pagination";

const User = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    picture: "",
  });

  const [showMessage, setShowMessage] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true); 
  const [messageText, setMessageText] = useState("");

  const showMessagePopup = (type, text) => {
    setIsSuccess(type);
    setMessageText(text);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  };

  const fetchUserData = () => {
    axios.get(`https://dummyapi.io/data/v1/user?page=${page}&limit=${limit}&created=1`, {
      headers: {
        "app-id": '62996cb2689bf0731cb00285'
      },
    })
    .then((response) => {
      dispatch(setUsers(response.data.data));
      setTotal(response.data.total);
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
      showMessagePopup(false, error.message);
    });
  };

  useEffect(() => {
    fetchUserData();
  }, [dispatch, page, limit]);

  const handleDeleteClick = (userId) => {
    setDeleteUserId(userId);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    axios
      .delete(`https://dummyapi.io/data/v1/user/${deleteUserId}`, {
        headers: {
          'app-id': '62996cb2689bf0731cb00285'
        },
      })
      .then((response) => {
        setShowDeleteConfirmation(false);
        setDeleteUserId(null);
        showMessagePopup(true, "Successfully deleted user");
        fetchUserData();
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
        showMessagePopup(false, error.message);
      });
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setDeleteUserId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCreateClick = () => {
    setFormData({
      title: "",
      firstName: "",
      lastName: "",
      email: "",
      picture: "",
    });
    setShowCreateModal(true);
  };

  const handleEditClick = (user) => {
    setFormData({
      id: user.id,
      title: user.title,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      picture: user.picture,
    });
    setShowEditModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const apiEndpoint = showCreateModal
      ? "https://dummyapi.io/data/v1/user/create"
      : `https://dummyapi.io/data/v1/user/${formData.id}`;

    axios
      .request({
        url: apiEndpoint,
        method: showCreateModal ? "post" : "put",
        data: formData,
        headers: {
          "app-id": '62996cb2689bf0731cb00285'
        },
      })
      .then((response) => {
        const action = showCreateModal ? "created" : "updated";
        const successMessage = `User ${action} successfully!`;
        showMessagePopup(true, successMessage);
        setShowCreateModal(false);
        setShowEditModal(false);
        fetchUserData();
      })
      .catch((error) => {
        console.error(`Error ${showCreateModal ? "creating" : "updating"} user:`, error);
        showMessagePopup(false, error.message);
      });
  };

  return (
    <>
      <button className="mb-3 px-5 rounded border capitalize" onClick={handleCreateClick}>create user</button>
      <table className="table-auto border-collapse mb-3">
        <thead>
            <tr className="capitalize">
                <td className="border py-1 px-3">name</td>
                <td className="border py-1 px-3">picture</td>
                <td className="border py-1 px-3">action</td>
            </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
                <td className="border py-1 px-3">{user.firstName} {user.lastName}</td>
                <td className="border py-1 px-3">
                  <img src={user.picture} alt={user.firstName} className="aspect-square w-10 object-cover rounded-full" />
                </td>
                <td className="border py-1 px-3">
                  <button className="capitalize py-1 px-3 rounded bg-yellow-500 me-2" onClick={() => handleEditClick(user)}>
                      edit
                  </button>
                  <button className="capitalize py-1 px-3 rounded bg-red-500" onClick={() => handleDeleteClick(user.id)}>delete</button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination setPage={setPage} setLimit={setLimit} total={total} limit={limit} page={page} />
      {showDeleteConfirmation && showDeleteConfirmation ? (
        <div className="absolute z-10 top-0 left-0 w-screen h-screen text-center bg-gray-300/90 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg text-black w-fit">
                <p>Are you sure you want to delete this data?</p>
                <div className="flex gap-6 justify-center items-center mt-6">
                    <button className="py-1 px-3 rounded bg-gray-100 text-black border" onClick={handleCancelDelete}>No</button>
                    <button className="py-1 px-3 rounded bg-red-500 text-white border" onClick={handleConfirmDelete}>Yes</button>
                </div>
            </div>
        </div>
      ) : null}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="absolute z-10 top-0 left-0 w-screen h-screen text-center bg-gray-300/90 flex justify-center items-center">
          <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded-lg text-gray-700 w-fit flex flex-col gap-2">
            {/* Form inputs go here */}
            <label className='capitalize' htmlFor="title">title</label>
            <select className="rounded border px-2 bg-slate-100 focus:bg-slate-50 focus:outline-none focus:border-blue-300" name="title" id="title" onChange={handleInputChange} defaultValue="placeholder">
              <option value="placeholder" disabled hidden>select title</option>
              <option value="mr">Mr.</option>
              <option value="mrs">Mrs.</option>
              <option value="miss">Miss</option>
            </select>
            <label className='capitalize' htmlFor="firstName">first name</label>
            <input placeholder="enter your first name" className="rounded border px-2 bg-slate-100 focus:bg-slate-50 focus:outline-none focus:border-blue-300" onChange={handleInputChange} name="firstName" id="firstName" type="text" />
            <label className='capitalize' htmlFor="lastName">last name</label>
            <input placeholder="enter your last name" className="rounded border px-2 bg-slate-100 focus:bg-slate-50 focus:outline-none focus:border-blue-300" onChange={handleInputChange} name="lastName" id="lastName" type="text" />
            <label className='capitalize' htmlFor="email">email</label>
            <input placeholder="enter your email" className="rounded border px-2 bg-slate-100 focus:bg-slate-50 focus:outline-none focus:border-blue-300" onChange={handleInputChange} name="email" id="email" type="email" />
            <label className='capitalize' htmlFor="picture">picture</label>
            <input placeholder="enter url only" className="rounded border px-2 bg-slate-100 focus:bg-slate-50 focus:outline-none focus:border-blue-300" onChange={handleInputChange} name="picture" id="picture" type="text" />

            <button className="rounded bg-blue-500 mt-3" type="submit">Submit</button>
            <button className="rounded bg-gray-300" type="button" onClick={() => setShowCreateModal(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="absolute z-10 top-0 left-0 w-screen h-screen text-center bg-gray-300/90 flex justify-center items-center">
          <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded-lg text-gray-700 w-fit flex flex-col gap-2">
            {/* Form inputs go here */}
            <label className='capitalize' htmlFor="title">title</label>
            <select className="rounded border px-2 bg-slate-100 focus:bg-slate-50 focus:outline-none focus:border-blue-300" name="title" id="title" onSelect={handleInputChange} defaultValue={formData.title}>
              <option value="mr">Mr.</option>
              <option value="mrs">Mrs.</option>
              <option value="miss">Miss</option>
            </select>
            <label className='capitalize' htmlFor="firstName">first name</label>
            <input className="rounded border px-2 bg-slate-100 focus:bg-slate-50 focus:outline-none focus:border-blue-300" defaultValue={formData.firstName} onChange={handleInputChange} name="firstName" id="firstName" type="text" />
            <label className='capitalize' htmlFor="lastName">last name</label>
            <input className="rounded border px-2 bg-slate-100 focus:bg-slate-50 focus:outline-none focus:border-blue-300" defaultValue={formData.lastName} onChange={handleInputChange} name="lastName" id="lastName" type="text" />
            <label className='capitalize' htmlFor="email">email</label>
            <input className="rounded border px-2 bg-slate-100 focus:bg-slate-50 focus:outline-none focus:border-blue-300" defaultValue={formData.email} onChange={handleInputChange} name="email" id="email" type="email" />
            <label className='capitalize' htmlFor="picture">picture</label>
            <input className="rounded border px-2 bg-slate-100 focus:bg-slate-50 focus:outline-none focus:border-blue-300" defaultValue={formData.picture} onChange={handleInputChange} name="picture" id="picture" type="text" />

            <button className="rounded bg-yellow-500 mt-3" type="submit">Update</button>
            <button className="rounded bg-gray-300" type="button" onClick={() => setShowEditModal(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Pop-up Message */}
      {showMessage && (
        <div className={`absolute top-3 right-3 z-20 ${isSuccess ? `text-green-500` : `text-red-500`} bg-white rounded p-4 flex items-start gap-4`}>
          {messageText}
          <button className={`aspect-square w-6 h-6 rounded-full text-white flex justify-center items-center ${isSuccess ? `bg-green-500` : `bg-red-500`}`} onClick={() => setShowMessage(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default User;
