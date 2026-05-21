import { LuMail, LuPhone, LuLinkedin, LuMapPin } from "react-icons/lu";
import { FaXTwitter, FaFacebook, FaInstagram } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-base-100 border-t border-base-200">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-primary">MediQueue</h2>
          <p className="text-sm text-base-content/60 leading-relaxed">
            Connecting students with expert tutors for medical and science excellence. Learn anytime, anywhere.
          </p>
        </div>

        
        <div>
          <h6 className="font-bold text-base-content mb-6">Expert Subjects</h6>
          <ul className="space-y-3 text-sm text-base-content/70">
            <li className="hover:text-primary cursor-pointer transition">Medical Admission</li>
            <li className="hover:text-primary cursor-pointer transition">Biology & Chemistry</li>
            <li className="hover:text-primary cursor-pointer transition">Biomedical Science</li>
            <li className="hover:text-primary cursor-pointer transition">Physics for Medics</li>
          </ul>
        </div>

        
        <div className="space-y-4">
          <h6 className="font-bold text-base-content mb-2">Get in Touch</h6>
          <div className="flex items-center gap-3 text-sm text-base-content/70">
            <LuMail className="text-primary" /> info@mediqueue.com
          </div>
          <div className="flex items-center gap-3 text-sm text-base-content/70">
            <LuPhone className="text-primary" /> +880 1234-567890
          </div>
          <div className="flex items-center gap-3 text-sm text-base-content/70">
            <LuMapPin className="text-primary" /> Dhaka, Bangladesh
          </div>
        </div>

        
        <div>
          <h6 className="font-bold text-base-content mb-6">Follow Us</h6>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
              <FaFacebook />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
              <FaXTwitter />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      
      <div className="max-w-7xl mx-auto px-6 py-8 border-t border-base-200 text-center md:text-left text-sm text-base-content/50">
        <p>© 2026 MediQueue Learning Platform. All rights reserved.</p>
      </div>
    </footer>
  );
}