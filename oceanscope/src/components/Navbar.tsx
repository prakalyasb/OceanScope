import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Waves, Activity, Database, GitCompare, Lightbulb, Upload, Info } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: 'Home', icon: null },
    { path: '/explorer', label: 'Explorer', icon: Activity },
    { path: '/datasets', label: 'Datasets', icon: Database },
    { path: '/compare', label: 'Compare', icon: GitCompare },
    { path: '/insights', label: 'Insights', icon: Lightbulb },
    { path: '/upload', label: 'Upload', icon: Upload },
    { path: '/about', label: 'About', icon: Info },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navbarStyle = {
    background: isScrolled ? 'rgba(10, 22, 40, 0.9)' : 'transparent',
    backdropFilter: isScrolled ? 'blur(10px)' : 'none',
    borderBottom: isScrolled ? '1px solid rgba(0, 212, 255, 0.2)' : 'none',
    boxShadow: isScrolled ? '0 4px 16px rgba(0, 0, 0, 0.4)' : 'none'
  };

  return (
    <nav style={navbarStyle} className="navbar">
      <div className="container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <div className="logo-icon">
              <Waves className="logo-svg" />
              <div className="logo-glow" />
            </div>
            <span className="logo-text">OceanScope</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="nav-links">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                {item.icon && <item.icon className="nav-link-icon" />}
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <Link to="/explorer" className="cta-button">
            Launch Explorer
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-menu-button"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                {item.icon && <item.icon className="mobile-nav-link-icon" />}
                {item.label}
              </Link>
            ))}
            <Link
              to="/explorer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mobile-cta-button"
            >
              Launch Explorer
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;