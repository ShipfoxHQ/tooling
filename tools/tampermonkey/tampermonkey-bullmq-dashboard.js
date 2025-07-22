// ==UserScript==
// @name         Bull Dashboard Queue Separator with Custom Order and Starred Section
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Add visual separators between queue prefixes, customize prefix order, and create a starred section
// @author       jules.vautier@shipfox.io
// @match        https://bullmq.staging.shipfox.io/*
// @match        https://bullmq.shipfox.io/*
// @match        http://127.0.0.1:3000/bullmq/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

// Install: https://www.tampermonkey.net/
// Then allow userscript: https://www.tampermonkey.net/faq.php?locale=en#Q209

(() => {
  let isProcessing = false; // Prevent infinite loops

  // Default prefix order
  const DEFAULT_PREFIX_ORDER = {
    runner: 1,
    billing: 2,
  };

  // Load prefix order from storage
  function getPrefixOrder() {
    const stored = GM_getValue('prefixOrder', JSON.stringify(DEFAULT_PREFIX_ORDER));
    try {
      return JSON.parse(stored);
    } catch (e) {
      return DEFAULT_PREFIX_ORDER;
    }
  }

  // Save prefix order to storage
  function savePrefixOrder(order) {
    GM_setValue('prefixOrder', JSON.stringify(order));
  }

  // Load starred queues from storage
  function getStarredQueues() {
    const stored = GM_getValue('starredQueues', '[]');
    try {
      return JSON.parse(stored);
    } catch (e) {
      return [];
    }
  }

  // Save starred queues to storage
  function saveStarredQueues(queues) {
    GM_setValue('starredQueues', JSON.stringify(queues));
  }

  // Toggle star status for a queue
  function toggleStarQueue(queueName) {
    const starred = getStarredQueues();
    const index = starred.indexOf(queueName);
    if (index > -1) {
      starred.splice(index, 1);
    } else {
      starred.push(queueName);
    }
    saveStarredQueues(starred);
    addSeparators();
  }

  // Add or update star button on a queue card
  function ensureStarButton(queueCard, queueName, isStarred) {
    console.log('ensureStarButton', queueName, isStarred);
    let starButton = queueCard.querySelector('.queue-star');
    if (!starButton) {
      starButton = document.createElement('button');
      starButton.className = 'queue-star';
      starButton.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        color: ${isStarred ? '#ffd700' : 'rgba(255, 255, 255, 0.5)'};
        cursor: pointer;
        font-size: 20px;
        padding: 5px;
        margin: 0;
        transition: color 0.2s, opacity 0.2s;
        z-index: 10;
        opacity: 0;
      `;
      // Make the card relative positioned if it isn't already
      const cardDiv = queueCard.querySelector('.card-xqyZlH');
      if (cardDiv) {
        cardDiv.style.position = 'relative';
        cardDiv.appendChild(starButton);
      }
    }
    // Update star appearance and handler
    starButton.innerHTML = isStarred ? '★' : '☆';
    starButton.style.color = isStarred ? '#ffd700' : 'rgba(255, 255, 255, 0.5)';
    starButton.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleStarQueue(queueName);
    };
    // Add CSS hover rule if not already added
    if (!document.querySelector('#queue-star-hover-styles')) {
      const style = document.createElement('style');
      style.id = 'queue-star-hover-styles';
      style.textContent = `
        .card-xqyZlH:hover .queue-star {
          opacity: 1 !important;
        }
        .queue-star:focus {
          opacity: 1 !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Create or update starred section
  function createStarredSection(container, starredQueues, itemsWithNames) {
    // Remove existing starred section if any
    const existingStarredSection = document.querySelector('.starred-section-container');
    if (existingStarredSection) {
      existingStarredSection.remove();
    }

    // If no starred queues, just return
    if (starredQueues.length === 0) return;

    // Create starred section container
    const starredSectionContainer = document.createElement('div');
    starredSectionContainer.className = 'starred-section-container';
    starredSectionContainer.style.cssText = `
      margin-bottom: 16px;
      border-bottom: 2px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 8px;
    `;

    // No header for starred section as requested

    // Create starred list
    const starredList = document.createElement('ul');
    starredList.className = 'overview-zcxjH0 starred-list';
    // Copy any necessary styling from the original list
    const originalListStyles = window.getComputedStyle(container);
    starredList.style.cssText = `
      display: grid;
      grid-template-columns: ${originalListStyles.gridTemplateColumns};
      gap: ${originalListStyles.gap};
      padding: 0;
      margin: 0;
      list-style: none;
    `;

    // Clone starred items and add to the starred section
    for (const data of itemsWithNames) {
      if (data.isStarred) {
        // Clone the item to create a duplicate for the starred section
        const clonedItem = data.item.cloneNode(true);

        // Ensure the cloned item has star button
        const queueLink = clonedItem.querySelector('a.link-xZr7yB');
        if (queueLink) {
          const queueName = queueLink.textContent.trim();
          ensureStarButton(clonedItem, queueName, true);
        }

        starredList.appendChild(clonedItem);
      }
    }

    starredSectionContainer.appendChild(starredList);

    // Insert starred section before the main container
    container.parentNode.insertBefore(starredSectionContainer, container);
  }

  // Function to add separators and stars
  function addSeparators() {
    if (isProcessing) return;
    isProcessing = true;

    try {
      const container = document.querySelector('ul.overview-zcxjH0:not(.starred-list)');
      if (!container) {
        // Overview container not found
        return;
      }

      const prefixOrder = getPrefixOrder();
      const starredQueues = getStarredQueues();
      const items = Array.from(container.querySelectorAll('li:not(.queue-separator)'));
      if (items.length === 0) return;

      // Remove existing separators
      for (const sep of container.querySelectorAll('.queue-separator')) sep.remove();

      // Add or update star buttons to all queue cards
      for (const item of items) {
        const queueLink = item.querySelector('a.link-xZr7yB');
        if (queueLink) {
          const queueName = queueLink.textContent.trim();
          const isStarred = starredQueues.includes(queueName);
          ensureStarButton(item, queueName, isStarred);
        }
      }

      // Collect items with their metadata
      const itemsWithNames = [];
      for (const item of items) {
        if (item.classList.contains('queue-separator')) continue;
        const queueLink = item.querySelector('a.link-xZr7yB');
        if (queueLink) {
          const queueName = queueLink.textContent.trim();
          const prefix = queueName.split('.')[0];
          const orderValue = prefixOrder[prefix] || 999; // Default to end if not specified
          const isStarred = starredQueues.includes(queueName);
          itemsWithNames.push({
            item,
            queueName,
            prefix,
            orderValue,
            isStarred,
          });
        }
      }

      // Create starred section
      createStarredSection(container, starredQueues, itemsWithNames);

      // Sort by prefix order, then by prefix, then by queue name
      // No longer sorting by starred status - queues stay in original position
      itemsWithNames.sort((a, b) => {
        if (a.orderValue !== b.orderValue) {
          return a.orderValue - b.orderValue;
        }
        if (a.prefix !== b.prefix) {
          return a.prefix.localeCompare(b.prefix);
        }
        return a.queueName.localeCompare(b.queueName);
      });

      // Reorder items in DOM and add separators
      let lastPrefix = null;
      let lastOrderValue = null;
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      for (const data of itemsWithNames) {
        const {item, prefix, orderValue} = data;
        // Add separator if prefix or order changes
        if (
          (lastPrefix !== null && lastPrefix !== prefix) ||
          (lastOrderValue !== null && lastOrderValue !== orderValue)
        ) {
          const separator = document.createElement('li');
          separator.className = 'queue-separator';
          separator.style.cssText = `
            width: 100%;
            height: 2px;
            background-color: rgba(255, 255, 255, 0.1);
            grid-column: 1 / -1;
            margin: 0px 0 -16px;
            list-style: none;
            pointer-events: none;
          `;
          container.appendChild(separator);
        }
        container.appendChild(item);
        lastPrefix = prefix;
        lastOrderValue = orderValue;
      }
    } finally {
      isProcessing = false;
    }
  }

  // Create config panel
  function createConfigPanel() {
    // Remove existing panel if it exists
    const existingPanel = document.getElementById('queue-config-panel');
    if (existingPanel) existingPanel.remove();

    const panel = document.createElement('div');
    panel.id = 'queue-config-panel';
    panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: -350px;
            width: 300px;
            background: #2a2a2a;
            border: 1px solid #444;
            border-radius: 5px;
            padding: 15px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            z-index: 1000;
            transition: right 0.3s ease;
            max-height: 80vh;
            overflow-y: auto;
        `;

    // Add tab trigger
    const tab = document.createElement('div');
    tab.id = 'queue-config-tab';
    tab.textContent = 'Prefix Order';
    tab.style.cssText = `
            position: absolute;
            left: -120px;
            top: 0;
            background: #2a2a2a;
            padding: 8px 12px;
            border: 1px solid #444;
            border-right: none;
            border-radius: 5px 0 0 5px;
            cursor: pointer;
            writing-mode: horizontal-tb;
            white-space: nowrap;
            transform-origin: top left;
        `;

    tab.onclick = () => {
      const isOpen = panel.style.right === '0px';
      panel.style.right = isOpen ? '-350px' : '0px';
    };

    panel.appendChild(tab);

    // Add header
    const header = document.createElement('h3');
    header.textContent = 'Queue Prefix Order';
    header.style.cssText = `
            margin-top: 0;
            margin-bottom: 15px;
            border-bottom: 1px solid #444;
            padding-bottom: 8px;
        `;
    panel.appendChild(header);

    // Add description
    const desc = document.createElement('p');
    desc.textContent = 'Specify the order of queue prefixes. Lower numbers appear first.';
    desc.style.cssText = `
            margin-bottom: 15px;
            font-size: 14px;
            color: #ccc;
        `;
    panel.appendChild(desc);

    // Add prefix order editor
    const prefixOrder = getPrefixOrder();

    const editorContainer = document.createElement('div');
    editorContainer.style.cssText = `
            margin-bottom: 15px;
            max-height: 300px;
            overflow-y: auto;
        `;

    const addRow = () => {
      const row = document.createElement('div');
      row.style.cssText = `
                display: flex;
                margin-bottom: 8px;
            `;

      const prefixInput = document.createElement('input');
      prefixInput.type = 'text';
      prefixInput.placeholder = 'Prefix';
      prefixInput.style.cssText = `
                flex: 2;
                padding: 5px;
                border: 1px solid #444;
                background: #333;
                color: white;
                border-radius: 3px;
                margin-right: 5px;
            `;

      const orderInput = document.createElement('input');
      orderInput.type = 'number';
      orderInput.placeholder = 'Order';
      orderInput.min = '1';
      orderInput.style.cssText = `
                flex: 1;
                padding: 5px;
                border: 1px solid #444;
                background: #333;
                color: white;
                border-radius: 3px;
                margin-right: 5px;
            `;

      const removeButton = document.createElement('button');
      removeButton.textContent = '×';
      removeButton.style.cssText = `
                background: #d43;
                color: white;
                border: none;
                border-radius: 3px;
                width: 30px;
                cursor: pointer;
            `;
      removeButton.onclick = () => {
        row.remove();
      };

      row.appendChild(prefixInput);
      row.appendChild(orderInput);
      row.appendChild(removeButton);
      return row;
    };

    // Add existing prefixes
    for (const prefix in prefixOrder) {
      const row = addRow();
      const inputs = row.querySelectorAll('input');
      inputs[0].value = prefix;
      inputs[1].value = prefixOrder[prefix];
      editorContainer.appendChild(row);
    }

    // Add an empty row
    editorContainer.appendChild(addRow());
    panel.appendChild(editorContainer);

    // Add button to add a new row
    const addButton = document.createElement('button');
    addButton.textContent = '+ Add Prefix';
    addButton.style.cssText = `
            background: #375a7f;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 3px;
            cursor: pointer;
            margin-bottom: 15px;
            width: 100%;
        `;
    addButton.onclick = () => {
      editorContainer.appendChild(addRow());
    };
    panel.appendChild(addButton);

    // Add save button
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save & Apply';
    saveButton.style.cssText = `
            background: #28a745;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 3px;
            cursor: pointer;
            width: 100%;
        `;
    saveButton.onclick = () => {
      const newOrder = {};
      const rows = editorContainer.querySelectorAll('div');

      for (const row of rows) {
        const inputs = row.querySelectorAll('input');
        const prefix = inputs[0].value.trim();
        const order = Number.parseInt(inputs[1].value);

        if (prefix && !Number.isNaN(order)) {
          newOrder[prefix] = order;
        }
      }

      savePrefixOrder(newOrder);
      addSeparators();

      // Visual feedback
      saveButton.textContent = 'Saved!';
      saveButton.style.background = '#218838';
      setTimeout(() => {
        saveButton.textContent = 'Save & Apply';
        saveButton.style.background = '#28a745';
      }, 1500);
    };
    panel.appendChild(saveButton);

    document.body.appendChild(panel);
  }

  // Utility: debounce
  function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // Re-initialize enhancements if dashboard is present
  const reinitEnhancements = debounce(() => {
    if (document.querySelector('ul.overview-zcxjH0')) {
      createConfigPanel();
      addSeparators();
    }
  }, 100);

  // Patch history methods for SPA navigation
  function patchHistoryMethods() {
    const origPushState = history.pushState;
    const origReplaceState = history.replaceState;
    history.pushState = function (...args) {
      const ret = origPushState.apply(this, args);
      window.dispatchEvent(new Event('shipfox:historychange'));
      return ret;
    };
    history.replaceState = function (...args) {
      const ret = origReplaceState.apply(this, args);
      window.dispatchEvent(new Event('shipfox:historychange'));
      return ret;
    };
  }

  // Wait for the page to load and add features
  function init() {
    let attempts = 0;
    const maxAttempts = 100;

    const tryAddFeatures = setInterval(() => {
      attempts++;

      if (document.querySelector('ul.overview-zcxjH0')) {
        createConfigPanel();
        addSeparators();
        clearInterval(tryAddFeatures);

        // Also observe for dynamic content changes
        let observerTimeout;
        const observer = new MutationObserver((mutations) => {
          // Skip if we're processing or if mutations are from our own changes
          if (isProcessing) return;

          const shouldProcess = mutations.some((mutation) => {
            // Skip mutations from config panel
            if (mutation.target.closest('#queue-config-panel')) return false;

            // Check for relevant changes
            return (
              mutation.target.classList?.contains('overview-zcxjH0') ||
              mutation.target.closest('ul.overview-zcxjH0:not(.starred-list)')
            );
          });

          if (shouldProcess) {
            clearTimeout(observerTimeout);
          }
        });

        // Start observing
        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });

        // Listen for SPA navigation events
        window.addEventListener('popstate', reinitEnhancements);
        window.addEventListener('shipfox:historychange', reinitEnhancements);
        patchHistoryMethods();
      }

      if (attempts >= maxAttempts) {
        clearInterval(tryAddFeatures);
      }
    }, 100);
  }

  // Run initialization
  init();
})();
