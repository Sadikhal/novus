import { Link } from "react-router-dom";
import { social } from "../../lib/data";

const footerLinks = {
  shopping: [
    { label: "Fashion", to: "/products?category=fashion" },
    { label: "Watches", to: "/products?category=watches" },
    { label: "Perfumes", to: "/products?category=perfumes" },
    { label: "Shoes", to: "/products?category=shoes" },
    { label: "Beauty", to: "/products?category=beauty" },
    { label: "Bags", to: "/products?category=bags" },
  ],
  policies: [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Profile", to: "/dashboard/profile" },
    { label: "Chat", to: "/dashboard/chat" },
    { label: "Orders", to: "/dashboard/my-orders" },
    { label: "Terms of Use", to: "/terms" },
    { label: "Privacy Policy", to: "/privacy" },
  ],
};

const address = {
  mail: `Novus Internet Private Limited
Buildings Alyssa, Begonia & Clove Embassy Tech Village
Outer Ring Road, Bengaluru, 560103, Karnataka, India`,
  registered: `Novus Internet Private Limited
Buildings Alyssa, Begonia & Clove Embassy Tech Village
Outer Ring Road, Bengaluru, 560103, Karnataka, India`,
  cin: "U511676PTOCTOPLKHDHB65",
  telephone: "044-645614700 / 044-67415800",
};

const Section = ({ title, children }) => (
  <div className="px-2">
    <div className="text-[#282c3f] font-assistant font-bold text-[12px] uppercase whitespace-nowrap">
      {title}
    </div>
    <div className="mt-5 flex flex-col gap-5">{children}</div>
  </div>
);

const Footer = () => {
  return (
    <footer className="cards h-full w-full py-5 bg-novusHome">
      <div className="px-20 flex lg:flex-row gap-12 flex-col">
        <div className="flex lg:gap-8 justify-between">
          {/* Shopping Links */}
          <Section title="Online Shopping">
            {footerLinks.shopping.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="text-[#41424a] leading-normal text-[15px] cursor-pointer capitalize font-assistant hover:text-[#282c3f] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </Section>

          {/* Policies */}
          <Section title="Customer Policies">
            {footerLinks.policies.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="text-[#41424a] leading-normal text-[15px] cursor-pointer capitalize font-assistant hover:text-[#282c3f] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </Section>
        </div>

        {/* Addresses */}
        <div className="flex flex-col lg:flex-row gap-10">
          <Section title="Mail Us:">
            <p className="text-[#696b79] leading-normal text-[15px] font-assistant capitalize whitespace-pre-line">
              {address.mail}
            </p>
          </Section>

          <Section title="Registered Office Address:">
            <p className="text-[#696b79] leading-normal text-[15px] font-assistant capitalize whitespace-pre-line">
              {address.registered}
            </p>
            <p className="text-[#696b79] leading-normal text-[15px] font-assistant uppercase">
              CIN: {address.cin}
            </p>
            <p className="text-[#696b79] leading-normal text-[15px] font-assistant uppercase">
              Telephone: {address.telephone}
            </p>
          </Section>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-2 text-center py-5">
        <div className="divider"></div>

        <Link to = "/" className="flex justify-center">
          <img
            src="/novus9.png"
            alt="Novus logo"
            className="w-24 h-24 bg-transparent object-contain"
          />
        </Link>

        <p className="px-4 sm:px-1 text-slate-900 text-[14px] leading-relaxed font-poppins">
          © 1995-2024 Novus Inc. All Rights Reserved. Accessibility, User
          Agreement, Privacy, Payments Terms of Use, Cookies, CA Privacy Notice,
          Your Privacy Choices and AdChoice
        </p>

        {/* Social */}
        <div className="flex flex-row gap-2 pt-4 items-center justify-center">
          {social.map((item) => (
            <Link to={item.href} key={item.name} aria-label={item.name}>
              <button className="btn border-none bg-[#2aa488] rounded-full hover:bg-[#1a924c] transition-colors">
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-[18px] h-[22px] object-contain cursor-pointer"
                />
              </button>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
