import React from 'react'

function legalNotices() {
 return (
    <div className="prose dark:prose-invert max-w-none">
      <h1>Legal Notices</h1>
      
      <h2>I - SITE EDITOR</h2>
      <p>This website, accessible from the URL address https://creer-societe-hong-kong.fr/ (hereinafter the Website) is published by:</p>
      
      <h3>CSHK</h3>
      <ul>
        <li>Hong Kong</li>
        <li>+33</li>
        <li>contact@creer-societe-hong-kong.fr</li>
        <li>NIF: 78164472-000-05-25-0</li>
      </ul>
      
      {/* Add all other sections from your document */}
      
      <p className="text-sm text-gray-500 mt-8">
        Last updated: May 16, 2025
      </p>
    </div>
  );
}

export default legalNotices