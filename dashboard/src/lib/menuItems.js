export const menuItems =   [
  {
    title: "MENU",
    items: [
      {
        icon: "/images/home.png",
        label: "Home",
        href: "dashboard",
        visible: ["admin", "seller"],
      },
      {
        icon: "/images/brand2.png",
        label: "Brands",
        href: "brands",
        visible: ["admin"],
      },
      {
        icon: "/images/student.png",
        label: "Customers",
        href: "customers",
        visible: ["admin"],
      },
      {
        icon: "/images/Products.png",
        label: "products",
        href: "products",
        visible: ["admin","seller"],
      },
     
      {
        icon: "/images/add-product2.png",
        label: "Add Product",
        href: "add-product",
        visible: ["admin","seller"],
      },
      
      {
        icon: "/images/checkout4.png",
        label: "Orders",
        href: "orders",
        visible: ["admin","seller"],
      },
      {
        icon: "/images/banner.png",
        label: "Banners",
        href: "banner",
        visible: ["admin"],
      },
      {
        icon: "/images/category.png",
        label: "category",
        href: "category",
        visible: ["admin"],
      },
     
      {
        icon: "/images/message.png",
        label: "Seller Messages",
        href: "seller-messages",
        visible: ["admin", "seller"],
      },
      {
        icon: "/images/chat.png",
        label: "Customer Messages",
        href: "customer-messages",
        visible: ["admin", "seller"],
      },
       {
        icon: "/images/help-desk2.png",
        label: "Help Desk",
        href: "admin-messages",
        visible: ["seller"],
      },
       {
        icon: "/images/calendar.png",
        label: "Events",
        href: "events",
        visible: ["admin", "seller"],
      },
      {
        icon: "/images/speaker.png",
        label: "Announcements",
        href: "announcements",
        visible: ["admin", "seller"],
      },
      {
        icon: "/images/profile.png",
        label: "Profile",
        href: "profile",
        visible: ["admin", "seller"],
      },
      {
        icon: "/images/brand.png",
        label: "Brand-Details",
        href: "details",
        visible: ["seller"],
      },
      {
        icon: "/images/logout.png",
        label: "Logout",
        href: "logout",
        visible: ["admin", "seller"],
      },
      
    ],
  },
];