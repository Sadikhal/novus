
import React from 'react';
import './styled/social.css';
import { FaInstagram, FaFacebook, FaTwitter, FaWhatsapp, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SocialIcons = ({ productName }) => {
  const currentUrl = window.location.href;

  const socialLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=Check out this product: ${encodeURIComponent(productName)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this product: ${productName} - ${currentUrl}`)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    instagram: '#' // Instagram doesn't allow direct URL sharing like others
  };

  return (
    <div className='body'>
      <div className="wrapper">
      <Link to={socialLinks.whatsapp} className="icon"><i className="fa-brands fa-whatsapp"><FaWhatsapp/></i></Link>
      <Link to={socialLinks.facebook} className="icon"><i className="fa-brands fa-facebook"><FaFacebook /></i></Link>
         <Link to={socialLinks.instagram} className="icon"><i className="fa-brands fa-instagram"><FaInstagram/></i></Link>
        <Link to={socialLinks.linkedin} className="icon"><i className="fa-brands fa-linkedin-in"><FaLinkedin/></i></Link>
              
              {/* <a href="#" class="icon"><i class="fa-brands fa-x-twitter"><FaTwitter/></i></a> */}
              
      </div>
    </div>
  );
};

export default SocialIcons;
