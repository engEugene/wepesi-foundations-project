import React from "react";
import { contactContent } from "../data/content";
//import instagramIcon from "/src/images/placeholder.png";
//import linkedinIcon from "/src/images/placeholder.png";
//import xIcon from "/src/images/placeholder.png";

const Footer: React.FC = () => {
  const { socials } = contactContent;

  return (
    <footer className="bg-green-700 text-white py-8 mt-10">
      <div className="container mx-auto text-center space-y-4">
        <h3 className="text-lg font-semibold">VolunteerConnect</h3>
        <p className="text-sm text-green-100">
          Empowering students to create change, one action at a time.
        </p>

        <div className="flex justify-center gap-6 mt-4">
          <a
            href={socials.instagram}
            target="_blank"
            rel="noreferrer"
            className="hover:opacity-80"
          >
            {/* <img src={instagramIcon} alt="Instagram" className="w-5 h-5" /> */}
          </a>
          <a
            href={socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="hover:opacity-80"
          >
            {/* <img src={linkedinIcon} alt="LinkedIn" className="w-5 h-5" /> */}
          </a>
          <a
            href={socials.x}
            target="_blank"
            rel="noreferrer"
            className="hover:opacity-80"
          >
            {/* <img src={xIcon} alt="X" className="w-5 h-5" /> */}
          </a>
        </div>

        <p className="text-xs text-green-200">
          © {new Date().getFullYear()} VolunteerConnect. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
