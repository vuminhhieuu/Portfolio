import { useEffect, useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuItems = ["about", "portfolio", "experience", "contact"];
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth"
      });
    }
    setIsMenuOpen(false);
  };
  return <header className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 ${
    isScrolled ? "bg-gray-100 shadow-md py-2" : "bg-transparent py-4"
  }`}>
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <button key={'about'} onClick={() => scrollToSection('about')} className="text-xl font-bold text-blue-600">
            <span className="text-slate-800">Minh</span>Hieu
        </button>

        <nav className="hidden md:flex space-x-8">
          {menuItems.map(item => <button key={item} onClick={() => scrollToSection(item)} className="text-slate-700 hover:text-blue-600 transition-colors capitalize">
              {item}
            </button>)}
        </nav>
        <button className="md:hidden text-slate-700 hover:text-blue-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>
      {isMenuOpen && <div className="md:hidden bg-white shadow-lg absolute w-full">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {menuItems.map(item => <button key={item} onClick={() => scrollToSection(item)} className="text-slate-700 hover:text-blue-600 transition-colors text-left py-2 capitalize">
                {item}
              </button>)}
          </div>
        </div>}
    </header>;
}