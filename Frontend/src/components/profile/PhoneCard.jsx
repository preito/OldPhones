import React from 'react';

const PhoneCard = ({ phone, onClick }) => {
  const avgRating =
    phone.reviews?.length > 0
      ? (
          phone.reviews.reduce((s, r) => s + r.rating, 0) / phone.reviews.length
        ).toFixed(1)
      : 'N/A';

  const sellerName = phone.seller
    ? `${phone.seller.firstname} ${phone.seller.lastname || ''}`
    : 'Unknown Seller';

  return (
    <div
      onClick={() => onClick && onClick(phone)}
      className="bg-slate-700 text-white rounded-xl shadow-md p-4 cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:border hover:border-blue-400 w-full max-w-xs mx-auto"
    >
      <img
        src={`/api/phone/image/name/${encodeURIComponent(phone.brand)}.jpeg`}
        alt={phone.title}
        className="w-full h-40 object-contain rounded mb-3 bg-white"
      />
      <h4 className="text-lg font-semibold mb-1 truncate">{phone.title}</h4>

      {phone.stock !== undefined && (
        <p className="text-sm text-zinc-200">Stock: {phone.stock}</p>
      )}

      <p className="text-sm text-zinc-200">Price: ${phone.price}</p>
      <p className="text-sm text-zinc-200">Seller: {sellerName}</p>

      {phone.reviews?.length >= 2 && (
        <p className="text-sm text-blue-300">Avg Rating: {avgRating}</p>
      )}
    </div>
  );
};

export default PhoneCard;
