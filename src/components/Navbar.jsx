"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ThemeController from "./ThemeController";
import { signOut, useSession } from "../lib/auth-client";
import toast from "react-hot-toast";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;
  const pathname = usePathname();

  const handleSignout = async () => {
    await signOut();
    toast.success("Log out successful");
  };

  const getUserInitial = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const getNavLinkClass = (path) => {
    const isActive = pathname === path;
    return `rounded-xl transition-all duration-200 font-semibold ${
      isActive 
        ? "bg-primary/10 text-primary focus:bg-primary/15" 
        : "text-base-content/80 hover:text-primary hover:bg-base-200/50"
    }`;
  };

  const navLinks = (
    <>
      <li>
        <Link href="/" className={getNavLinkClass("/")}>
          Home
        </Link>
      </li>
      <li>
        <Link href="/tutors" className={getNavLinkClass("/tutors")}>
          Tutors
        </Link>
      </li>
      {user && (
        <>
          <li>
            <Link href="/tutors/add" className={getNavLinkClass("/tutors/add")}>
              Add Tutor
            </Link>
          </li>
          <li>
            <Link href="/my-tutors" className={getNavLinkClass("/my-tutors")}>
              My Tutors
            </Link>
          </li>
          <li>
            <Link href="/my-bookings" className={getNavLinkClass("/my-bookings")}>
              My Booked Sessions
            </Link>
          </li>
        </>
      )}
    </>
  );

  return (
    <div className="navbar bg-base-100/80 backdrop-blur-md border-b border-b-base-300/40 shadow-sm px-4 md:px-8 sticky top-0 z-[100] transition-all duration-300">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden p-1 mr-2 hover:bg-base-200 rounded-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-base-content/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100/95 backdrop-blur-md rounded-2xl z-[110] mt-3 w-56 p-2 shadow-xl border border-base-300/60 space-y-1 text-base-content">
            {navLinks}
          </ul>
        </div>
        
       <Link href="/" className="flex items-center gap-3 hover:opacity-95 transition-opacity group">
  <div className="relative w-10 h-10 flex items-center justify-center bg-base-100 border border-base-300/80 text-primary rounded-xl shadow-md overflow-hidden group-hover:shadow-primary/20 group-hover:border-primary/30 transition-all duration-300">
    <div className="absolute inset-0 bg-primary/5 opacity-100 group-hover:scale-110 transition-transform duration-300" />
    
    <svg
      className="w-6 h-6 relative z-10 transition-transform duration-300 group-hover:scale-105"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L2 6.5L12 11L22 6.5L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 8.3V13C6 15.5 8.7 17.5 12 17.5C12.7 17.5 13.4 17.4 14 17.1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      <circle
        cx="16.5"
        cy="16.5"
        r="3.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M19 19L22 22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
  <span className="text-xl font-black tracking-tight hidden sm:block">
    <span className="text-primary">Tutors</span>
    <span className="text-base-content font-bold">Queue</span>
  </span>
</Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1.5 text-sm">
          {navLinks}
        </ul>
      </div>

      <div className="navbar-end gap-3">
        <ThemeController />
        
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar ring-2 ring-primary/20 hover:ring-primary/50 transition-all duration-300">
              <div className="w-9 h-9 relative rounded-full overflow-hidden flex items-center justify-center bg-base-200">
                {user?.image ? (
                  <Image 
                    alt={user?.name || "User Avatar"}
                    src={user?.image} 
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold tracking-wider text-primary select-none">
                    {getUserInitial(user?.name)}
                  </span>
                )}
              </div>
            </div>
            
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100/95 backdrop-blur-md rounded-2xl z-[110] mt-3 w-60 p-2 shadow-xl border border-base-300/60 text-base-content overflow-hidden">
              <div className="px-4 py-3 border-b border-base-300/60 mb-1">
                <p className="font-bold text-sm text-base-content tracking-tight truncate">{user?.name}</p>
                <p className="text-xs text-base-content/60 truncate mt-0.5">{user?.email}</p>
              </div>
              <li>
                <button 
                  onClick={handleSignout}
                  className="mx-1 my-0.5 text-error hover:bg-error/10 hover:text-error rounded-xl font-medium transition-all"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link href="/login" className="btn btn-primary text-white btn-sm px-5 rounded-xl font-semibold shadow-md shadow-primary/20 normal-case transition-all duration-200">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}