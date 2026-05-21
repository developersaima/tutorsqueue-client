"use client";
import Link from "next/link";
import Image from "next/image";
import ThemeController from "./ThemeController";

export default function Navbar() {
  const user = null;

  return (
    <div className="navbar bg-base-100 shadow-sm px-4 md:px-8 sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden p-1 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow border border-base-200">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/tutors">Tutors</Link></li>
            {user && (
              <>
                <li><Link href="/tutors/add">Add Tutor</Link></li>
                <li><Link href="/my-tutors">My Tutors</Link></li>
                <li><Link href="/my-bookings">My Booked Sessions</Link></li>
              </>
            )}
          </ul>
        </div>
        <Link href="/" className="text-xl font-bold text-primary tracking-wide">
          MediQueue
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1 font-medium">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/tutors">Tutors</Link></li>
          {user && (
            <>
              <li><Link href="/tutors/add">Add Tutor</Link></li>
              <li><Link href="/my-tutors">My Tutors</Link></li>
              <li><Link href="/my-bookings">My Booked Sessions</Link></li>
            </>
          )}
        </ul>
      </div>

      <div className="navbar-end gap-4">
        <ThemeController />
        
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border border-base-300">
              <div className="w-9 h-9 relative rounded-full overflow-hidden">
                <Image 
                  alt="User Profile" 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb" 
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow-md border border-base-200">
              <li><Link href="/profile">Profile Dashboard</Link></li>
              <li><button onClick={() => console.log("Logout")}>Logout</button></li>
            </ul>
          </div>
        ) : (
          <Link href="/login" className="btn btn-primary btn-sm px-4">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}