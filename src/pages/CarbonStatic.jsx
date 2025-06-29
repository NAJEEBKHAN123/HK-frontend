const CarbonStatic = () => {
  return (
    <div className="bg-gray-700 p-4 rounded-lg max-w-xs">
      <h3 className="text-white font-semibold mb-2">Site CO₂ Footprint</h3>
      <p className="text-green-400 text-2xl font-bold">
        0.12g <span className=" text-2xl">of CO₂/View</span>
      </p>
      <p className="text-gray-900 bg-white rounded-md p-1  text-sm font-semibold mt-2">
        Cleaner than 92% of pages tested
      </p>
      <a 
        href="https://websiteemissions.com" 
        target="_blank"
        rel="noopener"
        className="text-blue-400 hover:underline text-xs mt-1 block"
      >
        Learn how we calculate this
      </a>
    </div>
  );
};

export default CarbonStatic;