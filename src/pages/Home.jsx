import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { selectPosts, setPosts } from '../redux/postSlice';
import axios from "axios";
import Pagination from "../components/Pagination";
import Card from '../components/Card'

const Home = () => {
    const dispatch = useDispatch();
  const posts = useSelector(selectPosts);

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const [formData, setFormData] = useState("");

  const fetchPostData = () => {
    const url = formData === '' ? `https://dummyapi.io/data/v1/post?page=${page}&limit=${limit}` : `https://dummyapi.io/data/v1/tag/${formData}/post?page=${page}&limit=${limit}`

    axios.get(url, {
      headers: {
        "app-id": process.env.REACT_APP_ID
      },
    })
    .then((response) => {
      dispatch(setPosts(response.data.data));
      setTotal(response.data.total);
    })
    .catch((error) => {
      console.error("Error fetching Posts:", error);
    });
  };

  useEffect(() => {
    fetchPostData();
  }, [dispatch, page, limit, formData]);

  return (
    <>
        <input type="text" placeholder='filter by single tag' onChange={(e) => {setFormData(e.target.value); setPage(0); setLimit(10)}} className='bg-slate-100 border rounded-md px-2 text-gray-700 focus:outline-none focus:border-blue-400 mb-2' />
        <div className='w-full flex flex-wrap gap-2'>
            {posts.map((post) => (
                <Card key={post.id} post={post} />
            ))}
        </div>
        <Pagination setPage={setPage} setLimit={setLimit} total={total} limit={limit} page={page} />
    </>
  )
}

export default Home