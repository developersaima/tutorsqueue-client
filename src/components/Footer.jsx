import { LuMail, LuPhone, LuLinkedin } from "react-icons/lu";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="footer sm:footer-horizontal p-10 bg-base-200 text-base-content border-t border-b border-base-300">
      <nav>
        <h6 className="footer-title text-primary opacity-100">Learning Services</h6>
        <a className="link link-hover">Medical Admission</a>
        <a className="link link-hover">Dental Coaching</a>
        <a className="link link-hover">Biomedical Science</a>
      </nav>
      
      <nav>
        <h6 className="footer-title">Contact</h6>
        <span className="flex items-center gap-2 text-sm">
          <LuMail className="w-4 h-4 text-primary" />
          info@mediqueue.com
        </span>
        <span className="flex items-center gap-2 text-sm">
          <LuPhone className="w-4 h-4 text-primary" />
          +880 1234-567890
        </span>
      </nav>
      
      <nav>
        <h6 className="footer-title">Social Links</h6>
        <div className="flex gap-4 text-xl">
          <a href="#" className="hover:text-primary transition-colors">
            <FaXTwitter />
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            <LuLinkedin />
          </a>
        </div>
      </nav>
      
      <aside className="w-full text-center sm:text-left mt-4 border-t border-base-300 pt-4 col-span-full">
        <p>© 2026 MediQueue. All rights reserved.</p>
      </aside>
    </footer>
  );
}