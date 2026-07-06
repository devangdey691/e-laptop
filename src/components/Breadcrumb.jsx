import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav aria-label="Breadcrumb" className="w-full py-3.5 px-6 mb-6 bg-whitecustom/80 backdrop-blur-sm border-b border-light/20 flex items-center overflow-x-auto whitespace-nowrap scrollbar-none select-none">
      <ol className="flex items-center space-x-2 text-sm text-primary/60">
        <li className="flex items-center">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-primary/60 hover:text-secondary transition-colors font-medium"
          >
            <Home size={15} className="mt-[-2px]" />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center">
              <ChevronRight size={14} className="mx-1 text-primary/30" />
              {isLast ? (
                <span className="font-semibold text-primary" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.link}
                  onClick={item.onClick}
                  className="text-primary/60 hover:text-secondary transition-colors font-medium"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
