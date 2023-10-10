import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { selectPosts, setPosts } from '../redux/postSlice';
import { selectUsers, setUsers } from "../redux/userSlice";
import axios from "axios";
import Pagination from "../components/Pagination";

const Post = () => {
  const dispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const users = useSelector(selectUsers);

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deletePostId, setDeletePostId] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    owner: {},
    text: "",
    image: "",
    likes: 0,
    tags: [],
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

  const fetchPostData = () => {
    axios.get(`https://dummyapi.io/data/v1/post?page=${page}&limit=${limit}&created=1`, {
      headers: {
        "app-id": "62996cb2689bf0731cb00285"
      },
    })
    .then((response) => {
      dispatch(setPosts(response.data.data));
      setTotal(response.data.total);
    })
    .catch((error) => {
      console.error("Error fetching Posts:", error);
      showMessagePopup(false, error.message);
    });
  };

  const fetchUserData = () => {
    axios.get(`https://dummyapi.io/data/v1/user?created=1`, {
      headers: {
        "app-id": "62996cb2689bf0731cb00285"
      },
    })
    .then((response) => {
      dispatch(setUsers(response.data.data));
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
      showMessagePopup(false, error.message);
    });
  };

  useEffect(() => {
    fetchPostData();
    fetchUserData();
  }, [dispatch, page, limit]);

  const handleDeleteClick = (postId) => {
    setDeletePostId(postId);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    axios
      .delete(`https://dummyapi.io/data/v1/post/${deletePostId}`, {
        headers: {
          'app-id': '62996cb2689bf0731cb00285',
        },
      })
      .then((response) => {
        setShowDeleteConfirmation(false);
        setDeletePostId(null);
        showMessagePopup(true, "Successfully deleted post");
        fetchPostData();
      })
      .catch((error) => {
        console.error('Error deleting post:', error);
        showMessagePopup(false, error.message);
      });
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setDeletePostId(null);
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
      id: null,
      owner: {},
      text: "",
      image: "",
      likes: 0,
      tags: [],
    });
    setShowCreateModal(true);
  };

  const handleEditClick = (post) => {
    setFormData({
      id: post.id,
      owner: post.owner,
      text: post.text,
      image: post.image,
      likes: post.likes,
      tags: post.tags,
    });
    setShowEditModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const apiEndpoint = showCreateModal
      ? "https://dummyapi.io/data/v1/post/create"
      : `https://dummyapi.io/data/v1/post/${formData.id}`;

    axios
      .request({
        url: apiEndpoint,
        method: showCreateModal ? "post" : "put",
        data: formData,
        headers: {
          "app-id": "62996cb2689bf0731cb00285",
        },
      })
      .then((response) => {
        const action = showCreateModal ? "created" : "updated";
        const successMessage = `Post ${action} successfully!`;
        showMessagePopup(true, successMessage);
        setShowCreateModal(false);
        setShowEditModal(false);
        fetchPostData();
      })
      .catch((error) => {
        console.error(`Error ${showCreateModal ? "creating" : "updating"} user:`, error);
        showMessagePopup(false, error.message);
      });
  };
  return (
    <>
      <button className="capitalize mb-3 px-5 rounded border" onClick={handleCreateClick}>create user</button>
      <table className="table-auto border-collapse mb-3">
        <thead>
            <tr className='capitalize'>
              <td className="border py-1 px-3">text</td>
              <td className="border py-1 px-3">tags</td>
              <td className="border py-1 px-3">image</td>
              <td className="border py-1 px-3">user</td>
              <td className="border py-1 px-3">action</td>
            </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td className="border py-1 px-3">{post.text}</td>
              <td className="border py-1 px-3">
                {post.tags.map((tag, index) => (
                  <span key={index} className='px-2 ms-1 bg-gray-300 rounded'>{tag}</span>
                ))}
              </td>
              <td className="border py-1 px-3">
                <img src={post.image} alt="image" className="aspect-square w-10 object-cover rounded-full" />
              </td>
              <td className="border py-1 px-3">{post.owner.firstName} {post.owner.lastName}</td>
              <td className="border py-1 px-3">
                <button className="capitalize py-1 px-3 rounded bg-yellow-500 me-2" onClick={() => handleEditClick(post)}>
                    edit
                </button>
                <button className="capitalize py-1 px-3 rounded bg-red-500" onClick={() => handleDeleteClick(post.id)}>delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination setPage={setPage} setLimit={setLimit} total={total} limit={limit} page={page} />
      {showDeleteConfirmation && (
        <div className="absolute z-10 top-0 left-0 w-screen h-screen text-center bg-gray-300/90 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg text-black w-fit">
                <p>Are you sure you want to delete this data?</p>
                <div className="flex gap-6 justify-center items-center mt-6">
                    <button className="py-1 px-3 rounded bg-gray-100 text-black border" onClick={handleCancelDelete}>No</button>
                    <button className="py-1 px-3 rounded bg-red-500 text-white border" onClick={handleConfirmDelete}>Yes</button>
                </div>
            </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="absolute z-10 top-0 left-0 w-screen h-screen text-center bg-gray-300/90 flex justify-center items-center">
          <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded-lg text-gray-700 w-fit flex flex-col gap-2">
            {/* Form inputs go here */}
            <label className='capitalize' htmlFor="owner">owner</label>
            <select className="capitalize rounded border px-2 bg-slate-100 focus:bg-slate-50 focus:outline-none focus:border-blue-300" name="owner" id="owner" onChange={handleInputChange} defaultValue="placeholder">
              <option value="placeholder" disabled hidden>select owner</option>
              {users.map(user=> (
                <option value={user}>{user.firstName} {user.lastName}</option>
              ))}
              {/* <option value="mr">Mr.</option>
              <option value="mrs">Mrs.</option>
              <option value="miss">Miss</option> */}
            </select>
            <label className='capitalize' htmlFor="text">text</label>
            <input placeholder="enter your text" className="rounded border px-2 bg-slate-100 focus:bg-slate-50 focus:outline-none focus:border-blue-300" onChange={handleInputChange} name="text" id="text" type="text" />
            <label className='capitalize' htmlFor="image">image</label>
            <input placeholder="enter url only" className="rounded border px-2 bg-slate-100 focus:bg-slate-50 focus:outline-none focus:border-blue-300" onChange={handleInputChange} name="image" id="image" type="text" />
            <label className='capitalize' htmlFor="likes">likes</label>
            <input placeholder="enter your likes" className="rounded border px-2 bg-slate-100 focus:bg-slate-50 focus:outline-none focus:border-blue-300" onChange={handleInputChange} name="likes" id="likes" type="number" />
            <label className='capitalize' htmlFor="tags">tags</label>
            <input placeholder="enter tags" className="rounded border px-2 bg-slate-100 focus:bg-slate-50 focus:outline-none focus:border-blue-300" onChange={handleInputChange} name="tags" id="tags" type="text" />

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
            <label className='capitalize' htmlFor="owner">owner</label>
            <select className="rounded border px-2 bg-slate-100 focus:bg-slate-50 focus:outline-none focus:border-blue-300" name="owner" id="owner" onSelect={handleInputChange} defaultValue={formData.owner}>
              {users.map(user=> (
                <option value={user}>{user.firstName} {user.lastName}</option>
              ))}
              {/* <option value="mr">Mr.</option>
              <option value="mrs">Mrs.</option>
              <option value="miss">Miss</option> */}
            </select>
            <label className='capitalize' htmlFor="text">text</label>
            <input className="rounded border px-2 bg-slate-100 focus:bg-slate-50 focus:outline-none focus:border-blue-300" defaultValue={formData.text} onChange={handleInputChange} name="text" id="text" type="text" />
            <label className='capitalize' htmlFor="image">image</label>
            <input className="rounded border px-2 bg-slate-100 focus:bg-slate-50 focus:outline-none focus:border-blue-300" defaultValue={formData.image} onChange={handleInputChange} name="image" id="image" type="text" />
            <label className='capitalize' htmlFor="likes">likes</label>
            <input className="rounded border px-2 bg-slate-100 focus:bg-slate-50 focus:outline-none focus:border-blue-300" defaultValue={formData.likes} onChange={handleInputChange} name="likes" id="likes" type="number" />
            <label className='capitalize' htmlFor="tags">tags</label>
            <input className="rounded border px-2 bg-slate-100 focus:bg-slate-50 focus:outline-none focus:border-blue-300" defaultValue={formData.tags} onChange={handleInputChange} name="tags" id="tags" type="text" />

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
  )
}

export default Post