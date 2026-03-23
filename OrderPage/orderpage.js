// Navigation function
function navigateTo(pageId) {
  // Hide all pages
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    page.classList.remove('active');
  });
  
  // Show the requested page
  const targetPage = document.getElementById(pageId + '-page');
  if (targetPage) {
    targetPage.classList.add('active');
    // Scroll to top when navigating
    window.scrollTo(0, 0);
  }
}

// Initialize - show order list page by default
document.addEventListener('DOMContentLoaded', function() {
  navigateTo('order-list');
});
