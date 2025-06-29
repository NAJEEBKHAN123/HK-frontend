// components/Map.jsx
import { MapPin } from 'lucide-react';
import { useState } from 'react';

const Map = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={`mt-4 rounded-lg overflow-hidden shadow-sm transition-all duration-300 ${
        isExpanded 
          ? 'fixed inset-0 z-50 bg-white p-4' 
          : 'relative cursor-pointer h-[250px]'
      }`}
      onClick={() => !isExpanded && setIsExpanded(true)}
    >
      {isExpanded && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(false);
          }}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
        >
          ✕
        </button>
      )}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.856353614574!2d114.1715823154435!3d22.29855034934166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x340400c7a3b41e3d%3A0x7e9a9a8f0a1a1a1a!2sHankow%20Centre%2C%205-15%20Hankow%20Rd%2C%20Tsim%20Sha%20Tsui%2C%20Hong%20Kong!5e0!3m2!1sen!2shk!4v1623861258628!5m2!1sen!2shk"
        width="100%"
        height={isExpanded ? "100%" : "100%"}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        title="Hankow Centre Office Location"
      />
    </div>
  );
};

export default Map