import Link from "next/link";
import React from "react";

const CtItem = [
  {
    name: "Products 1",
    img: "https://demo-milano.myshopify.com/cdn/shop/files/main_clt3.webp?v=1745943972&width=360",
    link: "/",
  },
  {
    name: "Products 2",
    img: "https://demo-milano.myshopify.com/cdn/shop/files/main_clt3.webp?v=1745943972&width=360",
    link: "/",
  },
  {
    name: "Products 3",
    img: "https://demo-milano.myshopify.com/cdn/shop/files/main_clt3.webp?v=1745943972&width=360",
    link: "/",
  },
];

const CategoryCard = ({ name, img, link }) => (
  <div className="bg-white shadow-lg w-[300px] flex flex-col items-center p-4 rounded-2xl mx-auto">
    <img
      className="w-[260px] h-[180px] object-cover rounded-xl mb-4"
      src={img}
      alt={name}
    />
    <div className="text-center mb-4 font-semibold text-lg">{name}</div>
    <Link
      href={link}
      className="bg-red-500 text-white px-6 py-2 rounded-full font-medium hover:bg-red-600 transition"
    >
      View Category
    </Link>
  </div>
);

const Category = () => (
  <div className="px-8 py-8 mx-auto">
    <div className="flex flex-col justify-center items-center mb-8">
      <h1 className="text-3xl p-2 font-semibold">Shop By Category</h1>
      <p>
        Express your style with our standout collection—fashion meets
        sophistication.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
      {CtItem.map((item, idx) => (
        <CategoryCard key={idx} {...item} />
      ))}
    </div>
  </div>
);

export default Category;
