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
    <div className="phone-card" onClick={() => onClick && onClick(phone)}>
      <img
        src={`/api/phone/image/name/${encodeURIComponent(phone.brand)}.jpeg`}
        alt={phone.title}
        className="phone-image"
      />
      <h4>{phone.title}</h4>
      {phone.stock !== undefined && <p>Stock: {phone.stock}</p>}
      <p>Price: ${phone.price}</p>
      <p>Seller: {sellerName}</p>
      {phone.reviews?.length >= 2 && <p>Avg Rating: {avgRating}</p>}
    </div>
  );
};

export default PhoneCard;
