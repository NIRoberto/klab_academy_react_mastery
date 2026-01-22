import { Link } from "react-router-dom";

interface NavLinks {
  title: string;
  path: string;
}

const NavigationBar = () => {
  const navLinks: NavLinks[] = [
    {
      title: "Home",
      path: "/",
    },
    {
      title: "About",
      path: "/about",
    },
    {
      title: "Products",
      path: "/products",
    },
    {
      title: "Contact",
      path: "/contact",
    },
  ];

  return (
    <div>
      <nav>
        <ul>
          {navLinks.map((link) => (
            <li key={link.title}>
              <Link to={link.path}>{link.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default NavigationBar;
