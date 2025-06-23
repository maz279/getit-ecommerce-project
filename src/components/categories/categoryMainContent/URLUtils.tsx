
export const getActualSubSubcategory = (selectedSubSubcategory?: string | null) => {
  // Get the actual subcategory name from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const subsubcategoryFromUrl = urlParams.get('subsubcategory');
  
  // Use URL parameter or fallback to selectedSubSubcategory
  return subsubcategoryFromUrl || selectedSubSubcategory;
};
