import { Link, useLocation } from "react-router-dom";

interface NavLink {
  title: string;
  path: string;
}

const NavigationBar = () => {
  const location = useLocation();
  
  const navLinks: NavLink[] = [
    { title: "Home", path: "/" },
    { title: "About", path: "/about" },
    { title: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <h1>Dessert Shop</h1>
        </Link>
        
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.title}>
              <Link 
                to={link.path} 
                className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavigationBar;
