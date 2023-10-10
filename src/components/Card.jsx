import React from 'react'

const Card = ({post}) => {
  return (
    <div className='basis-1/6 grow shrink h-60 bg-white border rounded-md overflow-hidden flex flex-col gap-1'>
        <img src={post.image} alt="image" className='h-[50%] object-cover'/>
        <h1 className='mx-2 text-sm font-semibold'>{post.owner.firstName} {post.owner.lastName}</h1>
        <p className='mx-2 text-sm text-gray-800 line-clamp-2'>{post.text}</p>
        <div className='mx-2 flex-none text-sm line-clamp-2 text-gray-400 flex flex-wrap gap-1'>
            {post.tags.map((tag, index) => (
                <span key={index}>#{tag}</span>
            ))}
        </div>
    </div>
  )
}

export default Card