import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { cn } from "../../lib/utils";
import { ScrollArea } from "../../components/ui/ScrollArea";
import { menuItems } from "../../lib/menuItems";
import { useAuth } from "../../hooks/useAuth";
import { useChatData } from "../../hooks/useChatData";

const Menu = ({ open }) => {
  const { currentUser } = useSelector((state) => state.user);
  const role = currentUser?.role;
  const { logout } = useAuth();
  const { handleMessageSubmit } = useChatData();

  const filteredMenuItems = menuItems.map((section) => ({
    ...section,
    items: section.items.filter((item) => item.visible.includes(role)),
  }));

  const handleLogout = async () => {
    await logout();
  };

  const handleHelpDesk = async () => {
    await handleMessageSubmit(); 
  };

  return (
    <div
      className={cn(
        "fixed h-[calc(100vh-64px)] lg:top-1 top-16 left-0 lg:w-44",
        open ? "w-full" : "w-12 md:w-16"
      )}
    >
      <ScrollArea className="h-full pt-4 px-2">
        {filteredMenuItems.map((section) => (
          <div className="flex flex-col gap-2 px-3" key={section.title}>
            <span className="hidden lg:block font-poppins text-gray-600 font-light my-3">
              {section.title}
            </span>
            {section.items.map((item, index) => {
              // Logout special handling
              if (item.href === "logout") {
                return (
                  <button
                    key={index}
                    onClick={handleLogout}
                    className={cn(
                      "flex items-center cursor-pointer gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight text-sm w-full",
                      open ? "justify-start" : "justify-center lg:justify-start"
                    )}
                  >
                    <img
                      src={item.icon}
                      alt=""
                      className="min-h-5 h-5 min-w-5 w-5"
                    />
                    <span className={cn(!open && "hidden lg:block")}>
                      {item.label}
                    </span>
                  </button>
                );
              }

              // Help Desk special handling
              if (item.href === "admin-messages") {
                return (
                  <button
                    key={index}
                    onClick={handleHelpDesk}
                    className={cn(
                      "flex items-center cursor-pointer gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight text-sm w-full",
                      open ? "justify-start" : "justify-center lg:justify-start"
                    )}
                  >
                    <img
                      src={item.icon}
                      alt=""
                      className="min-h-5 h-5 min-w-5 w-5"
                    />
                    <span className={cn(!open && "hidden lg:block")}>
                      {item.label}
                    </span>
                  </button>
                );
              }

              // Default menu item
              return (
                <Link
                  to={`/${role}/${item.href}`}
                  key={index}
                  className={cn(
                    "flex items-center gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight text-sm",
                    open ? "justify-start" : "justify-center lg:justify-start"
                  )}
                >
                  <img
                    src={item.icon}
                    alt=""
                    className="min-h-5 h-5 min-w-5 w-5"
                  />
                  <span className={cn(!open && "hidden lg:block")}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

export default Menu;
