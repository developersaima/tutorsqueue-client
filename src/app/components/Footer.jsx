export default function Footer() {
  return (
    <footer className="footer sm:footer-horizontal p-10 bg-base-200 text-base-content border-t border-base-300">
      <nav>
        <h6 className="footer-title text-primary opacity-100">Learning Services</h6>
        <a className="link link-hover">Medical Admission</a>
        <a className="link link-hover">Dental Coaching</a>
        <a className="link link-hover">Biomedical Science</a>
      </nav>
      <nav>
        <h6 className="footer-title">Contact</h6>
        <span className="text-sm">Email: info@mediqueue.com</span>
        <span className="text-sm">Phone: +880 1234-567890</span>
      </nav>
      <nav>
        <h6 className="footer-title">Social Links</h6>
        <div className="grid grid-flow-col gap-4">
          <a className="link link-hover font-bold">X (Twitter)</a>
          <a className="link link-hover font-bold">LinkedIn</a>
        </div>
      </nav>
      <aside className="w-full text-center sm:text-left mt-4 border-t border-base-300 pt-4 col-span-full">
        <p>© 2026 MediQueue. All rights reserved.</p>
      </aside>
    </footer>
  );
}