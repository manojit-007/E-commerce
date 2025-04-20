import React from 'react'

const CartItems = ({item,index}) => {
  return (
    <section
    key={index}
    className="flex items-center justify-between p-4 border-b border-gray-200"
  >
    <div className="flex items-center">
      <img
        src={item.image.imageUrl}
        alt={item.name}
        className="w-16 h-16 object-contain mr-4"
      />
      <div>
        <h2 className="text-lg font-semibold text-gray-700">{item.name}</h2>
        <p className="text-sm text-gray-500">Price: ${item.price}</p>
      </div>
    </div>
    <div className="flex items-center">
      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
        Remove
      </button>
    </div>
  </section>
  )
}

export default CartItems