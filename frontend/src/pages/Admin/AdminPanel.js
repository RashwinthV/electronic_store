import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaRegCircleUser } from 'react-icons/fa6';
import { Link, Outlet } from 'react-router-dom';

const AdminPanel = () => {
  const user = useSelector((state) => state?.user?.user);
    const [activeImage, setActiveImage] = useState("");
  
  useEffect(() => {
    if (user?.profilePic) {
      try {
        const imageUrl = user.profilePic;
        const url = new URL(imageUrl);
        const fileId = url.searchParams.get("id");
        
        setActiveImage(
          fileId
            ? `${process.env.REACT_APP_IMAGE_URL}/proxy-image?fileId=${fileId}`
            : imageUrl
        );
        
      } catch (error) {
        console.error("Invalid image URL:", error);
      }
    }
  }, [user]);

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col md:flex-row">

      {/* Sidebar - works on both mobile and desktop */}
      <aside className="bg-white w-full md:max-w-60 customShadow p-4">
        <div className="flex justify-center items-center flex-col mb-4">
          <div className="text-5xl cursor-pointer relative flex justify-center">
          {user?.profilePic ? (
               <img
               src={activeImage}
               className="w-20 h-20 rounded-full"
               alt={user?.name}
             />
            ) : (
              <FaRegCircleUser />
            )}
          </div>
          <p className="capitalize text-lg font-semibold">{user?.name}</p>
          <Link to={"Dashboard"} className="text-sm">{user?.role}</Link>
        </div>

        {/* Navigation */}
        <nav className="grid gap-2">
          <Link to={'all-users'} className="px-2 py-1 hover:bg-slate-100 rounded">
            All Users
          </Link>
          <Link to={'all-products'} className="px-2 py-1 hover:bg-slate-100 rounded">
            All Products
          </Link>
          <Link to={'orders'} className="px-2 py-1 hover:bg-slate-100 rounded">
            All orders
          </Link>
          <Link to={'inventory'} className="px-2 py-1 hover:bg-slate-100 rounded">
            Inventory
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="w-full p-4 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
