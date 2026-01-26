import { Link, useLocation } from "react-router-dom";
import { User, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import Modal from "./Modal";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

interface NavLink {
  title: string;
  path: string;
}

const NavigationBar = () => {
  const location = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock auth state
  
  const navLinks: NavLink[] = [
    { title: "Home", path: "/" },
    { title: "About", path: "/about" },
    { title: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Add logout logic here
    console.log('User logged out');
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
          <Link to="/" className="text-red-600 text-xl font-bold hover:text-red-700">
            <h1>Dessert Shop</h1>
          </Link>
          
          <div className="flex items-center gap-8">
            <ul className="flex gap-6">
              {navLinks.map((link) => (
                <li key={link.title}>
                  <Link 
                    to={link.path} 
                    className={`px-3 py-2 rounded-md font-medium transition-colors ${
                      isActive(link.path) 
                        ? 'text-red-600 bg-red-50' 
                        : 'text-gray-700 hover:text-red-600 hover:bg-gray-100'
                    }`}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Auth Section */}
            <div className="flex items-center">
              {isLoggedIn ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                    <User className="w-5 h-5" />
                    <span className="font-medium text-gray-700">John Doe</span>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <Link to="/profile" className="block px-4 py-3 text-gray-700 hover:bg-gray-100 font-medium">
                      Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-3 text-gray-700 hover:bg-gray-100 font-medium">
                      Orders
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 font-medium border-t border-gray-200">
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsLoginModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-100 rounded-md transition-colors font-medium"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </button>
                  <button 
                    onClick={() => setIsRegisterModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors font-medium"
                  >
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Sign In"
        size="md"
      >
        <LoginModal
          onClose={() => setIsLoginModalOpen(false)}
          onSwitchToRegister={() => {
            setIsLoginModalOpen(false);
            setIsRegisterModalOpen(true);
          }}
        />
      </Modal>

      {/* Register Modal */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title="Create Account"
        size="md"
      >
        <RegisterModal
          onClose={() => setIsRegisterModalOpen(false)}
          onSwitchToLogin={() => {
            setIsRegisterModalOpen(false);
            setIsLoginModalOpen(true);
          }}
        />
      </Modal>
    </>
  );
};

export default NavigationBar;
