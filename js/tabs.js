//! A temp file until I fix that mess in main.js
const tabs = document.querySelectorAll('.tab');

tabs.forEach((tab) => {
  tab.addEventListener('click', function () {
    // Remove the hidden attribute from all panels
    document.querySelectorAll('.editor').forEach((panel) => {
      panel.hidden = true;
    });

    // Set aria-selected="false" for all tabs
    tabs.forEach((t) => t.setAttribute('aria-selected', 'false'));

    // Set the clicked tab as selected and show the associated panel
    this.setAttribute('aria-selected', 'true');
    const panelId = this.getAttribute('aria-controls');
    document.getElementById(panelId).hidden = false;
  });
});

// Initially activate the tab that is marked as selected
const initialSelectedTab = document.querySelector('.tab[aria-selected="true"]');
if (initialSelectedTab) {
  document.getElementById(
    initialSelectedTab.getAttribute('aria-controls')
  ).hidden = false;
}
