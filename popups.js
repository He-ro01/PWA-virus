// Handle Close Buttons
document.querySelectorAll('.popup-closer').forEach(btn => {
    btn.addEventListener('click', () => {
      // Find the nearest popup-element container
      const popupElement = btn.closest('.popup-element');
      if (popupElement) popupElement.style.display = 'none';
  
      // Hide the container too
      popupContainer.style.display = 'none';
    });
  });