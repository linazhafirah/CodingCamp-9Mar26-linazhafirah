// Productivity Dashboard - Main Application
// Feature: productivity-dashboard

// ============================================================================
// Storage Utility Module
// ============================================================================

const StorageUtil = {
  // Debounce timers for batch storage operations
  _saveTasksTimer: null,
  _saveLinksTimer: null,

  /**
   * Check if Local Storage is available
   * @returns {boolean} True if Local Storage is available and functional
   */
  isAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * Load tasks from Local Storage
   * @returns {Array} Array of task objects, or empty array if none exist or on error
   */
  loadTasks() {
    try {
      const data = localStorage.getItem('tasks');
      if (!data) {
        return [];
      }
      const tasks = JSON.parse(data);
      if (!Array.isArray(tasks)) {
        throw new Error('Tasks data is not an array');
      }
      return tasks;
    } catch (e) {
      console.error('Failed to load tasks:', e);
      // Clear corrupted data
      try {
        localStorage.removeItem('tasks');
      } catch (removeError) {
        console.error('Failed to clear corrupted tasks:', removeError);
      }
      return [];
    }
  },

  /**
   * Save tasks to Local Storage
   * @param {Array} tasks - Array of task objects to save
   * @param {boolean} immediate - If true, save immediately without debouncing
   * @returns {boolean} True if save was successful, false otherwise
   */
  saveTasks(tasks, immediate = false) {
    // For immediate saves or if debouncing is not needed
    if (immediate) {
      return this._saveTasksImmediate(tasks);
    }

    // Debounce saves to improve performance (batch multiple rapid changes)
    clearTimeout(this._saveTasksTimer);
    this._saveTasksTimer = setTimeout(() => {
      this._saveTasksImmediate(tasks);
    }, 50); // 50ms debounce - well within 100ms requirement

    return true;
  },

  /**
   * Internal method to save tasks immediately
   * @param {Array} tasks - Array of task objects to save
   * @returns {boolean} True if save was successful, false otherwise
   */
  _saveTasksImmediate(tasks) {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
      return true;
    } catch (e) {
      console.error('Failed to save tasks:', e);
      return false;
    }
  },

  /**
   * Load quick links from Local Storage
   * @returns {Array} Array of quick link objects, or empty array if none exist or on error
   */
  loadQuickLinks() {
    try {
      const data = localStorage.getItem('quickLinks');
      if (!data) {
        return [];
      }
      const links = JSON.parse(data);
      if (!Array.isArray(links)) {
        throw new Error('Quick links data is not an array');
      }
      return links;
    } catch (e) {
      console.error('Failed to load quick links:', e);
      // Clear corrupted data
      try {
        localStorage.removeItem('quickLinks');
      } catch (removeError) {
        console.error('Failed to clear corrupted quick links:', removeError);
      }
      return [];
    }
  },

  /**
   * Save quick links to Local Storage
   * @param {Array} links - Array of quick link objects to save
   * @param {boolean} immediate - If true, save immediately without debouncing
   * @returns {boolean} True if save was successful, false otherwise
   */
  saveQuickLinks(links, immediate = false) {
    // For immediate saves or if debouncing is not needed
    if (immediate) {
      return this._saveQuickLinksImmediate(links);
    }

    // Debounce saves to improve performance (batch multiple rapid changes)
    clearTimeout(this._saveLinksTimer);
    this._saveLinksTimer = setTimeout(() => {
      this._saveQuickLinksImmediate(links);
    }, 50); // 50ms debounce - well within 100ms requirement

    return true;
  },

  /**
   * Internal method to save quick links immediately
   * @param {Array} links - Array of quick link objects to save
   * @returns {boolean} True if save was successful, false otherwise
   */
  _saveQuickLinksImmediate(links) {
    try {
      localStorage.setItem('quickLinks', JSON.stringify(links));
      return true;
    } catch (e) {
      console.error('Failed to save quick links:', e);
      return false;
    }
  }
};

// ============================================================================
// Greeting Widget Module
// ============================================================================

const GreetingWidget = {
  intervalId: null,

  /**
   * Initialize the greeting widget
   */
  init() {
    this.render();
    // Update time every second
    this.intervalId = setInterval(() => this.render(), 1000);
  },

  /**
   * Format time in 12-hour format with AM/PM
   * @param {Date} date - Date object to format
   * @returns {string} Formatted time string (e.g., "2:30 PM")
   */
  formatTime(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    
    // Pad minutes with leading zero
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    
    return `${hours}:${minutesStr} ${ampm}`;
  },

  /**
   * Format date in human-readable format
   * @param {Date} date - Date object to format
   * @returns {string} Formatted date string (e.g., "Monday, January 15")
   */
  formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const dayNumber = date.getDate();
    
    return `${dayName}, ${monthName} ${dayNumber}`;
  },

  /**
   * Get greeting based on current hour
   * @param {number} hour - Hour in 24-hour format (0-23)
   * @returns {string} Time-based greeting
   */
  getGreeting(hour) {
    if (hour >= 5 && hour <= 11) {
      return 'Good morning';
    } else if (hour >= 12 && hour <= 16) {
      return 'Good afternoon';
    } else if (hour >= 17 && hour <= 20) {
      return 'Good evening';
    } else {
      return 'Good night';
    }
  },

  /**
   * Render greeting, time, and date to DOM
   * Optimized to only update changed elements
   */
  render() {
    const now = new Date();
    const hour = now.getHours();
    const greeting = this.getGreeting(hour);
    const time = this.formatTime(now);
    const date = this.formatDate(now);
    
    const greetingElement = document.getElementById('greeting');
    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');
    
    // Only update if content has changed (performance optimization)
    if (greetingElement && greetingElement.textContent !== greeting) {
      greetingElement.textContent = greeting;
    }
    
    if (timeElement && timeElement.textContent !== time) {
      timeElement.textContent = time;
    }
    
    if (dateElement && dateElement.textContent !== date) {
      dateElement.textContent = date;
    }
  }
};

// ============================================================================
// Focus Timer Widget Module
// ============================================================================

const FocusTimer = {
  // Timer state
  timeRemaining: 1500, // 25 minutes in seconds
  isRunning: false,
  intervalId: null,

  /**
   * Initialize the timer widget
   */
  init() {
    this.timeRemaining = 1500;
    this.isRunning = false;
    this.intervalId = null;
    this.render();
    this.attachEventHandlers();
  },

  /**
   * Start the countdown timer
   */
  start() {
    if (this.isRunning) {
      return; // Already running
    }

    if (this.timeRemaining <= 0) {
      return; // Timer at zero
    }

    this.isRunning = true;
    
    // Clear any existing interval
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }

    // Start countdown
    this.intervalId = setInterval(() => {
      this.tick();
    }, 1000);
  },

  /**
   * Stop/pause the countdown timer
   */
  stop() {
    if (!this.isRunning) {
      return; // Already stopped
    }

    this.isRunning = false;
    
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  },

  /**
   * Reset timer to 25 minutes
   */
  reset() {
    this.stop();
    this.timeRemaining = 1500;
    this.render();
  },

  /**
   * Countdown tick - called every second while running
   */
  tick() {
    if (this.timeRemaining > 0) {
      this.timeRemaining--;
      this.render();

      // Stop automatically at 00:00
      if (this.timeRemaining === 0) {
        this.stop();
      }
    }
  },

  /**
   * Format seconds as MM:SS
   * @param {number} seconds - Number of seconds to format
   * @returns {string} Formatted time string (e.g., "25:00", "03:45")
   */
  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    // Pad with leading zeros
    const minutesStr = String(minutes).padStart(2, '0');
    const secsStr = String(secs).padStart(2, '0');
    
    return `${minutesStr}:${secsStr}`;
  },

  /**
   * Render timer display
   * Optimized to only update when value changes
   */
  render() {
    const displayElement = document.getElementById('timer-display');
    if (displayElement) {
      const formattedTime = this.formatTime(this.timeRemaining);
      // Only update if content has changed (performance optimization)
      if (displayElement.textContent !== formattedTime) {
        displayElement.textContent = formattedTime;
      }
    }
  },

  /**
   * Attach event handlers to timer control buttons
   */
  attachEventHandlers() {
    const startButton = document.getElementById('timer-start');
    const stopButton = document.getElementById('timer-stop');
    const resetButton = document.getElementById('timer-reset');

    if (startButton) {
      startButton.addEventListener('click', () => this.start());
    }

    if (stopButton) {
      stopButton.addEventListener('click', () => this.stop());
    }

    if (resetButton) {
      resetButton.addEventListener('click', () => this.reset());
    }
  }
};

// ============================================================================
// To-Do List Widget Module
// ============================================================================

const TodoWidget = {
  // In-memory task list
  tasks: [],

  /**
   * Initialize the to-do list widget
   * Loads tasks from Local Storage and prepares the widget for use
   */
  init() {
    // Load tasks from Local Storage
    this.tasks = StorageUtil.loadTasks();
    
    // Render tasks to display
    this.renderTasks();
    
    // Attach event handler for task form
    this.attachEventHandlers();
  },

  /**
   * Attach event handlers for task form
   */
  attachEventHandlers() {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');

    if (taskForm && taskInput) {
      taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const text = taskInput.value;
        const task = this.addTask(text);
        
        if (task) {
          // Clear input on successful add
          taskInput.value = '';
          // Re-render to show new task
          this.renderTasks();
        }
      });
    }
  },

  /**
   * Generate unique ID for a task using timestamp
   * @returns {string} Unique ID based on current timestamp
   */
  generateId() {
    return String(Date.now());
  },

  /**
   * Validate task text (must be non-empty after trimming)
   * @param {string} text - Task text to validate
   * @returns {boolean} True if text is valid, false otherwise
   */
  validateTaskText(text) {
    if (typeof text !== 'string') {
      return false;
    }
    return text.trim().length > 0;
  },

  /**
   * Create a new task object
   * @param {string} text - Task text
   * @returns {Object|null} Task object with id, text, completed, createdAt, or null if invalid
   */
  createTaskObject(text) {
    if (!this.validateTaskText(text)) {
      return null;
    }

    const trimmedText = text.trim();
    const now = Date.now();

    return {
      id: this.generateId(),
      text: trimmedText,
      completed: false,
      createdAt: now
    };
  },

  /**
   * Add a new task to the list
   * @param {string} text - Task text to add
   * @returns {Object|null} Created task object, or null if validation fails
   */
  addTask(text) {
    // Validate and create task object
    const task = this.createTaskObject(text);
    
    if (!task) {
      return null; // Validation failed
    }

    // Add to in-memory task list
    this.tasks.push(task);

    // Persist to Local Storage
    StorageUtil.saveTasks(this.tasks);

    return task;
  },

  /**
   * Edit an existing task's text
   * @param {string} id - ID of the task to edit
   * @param {string} newText - New text for the task
   * @returns {boolean} True if edit succeeded, false if task not found or validation failed
   */
  editTask(id, newText) {
    // Find the task by ID
    const task = this.tasks.find(t => t.id === id);
    
    if (!task) {
      return false; // Task not found
    }

    // Validate the new text
    if (!this.validateTaskText(newText)) {
      // Invalid text - preserve original
      return false;
    }

    // Update the task text (trimmed)
    task.text = newText.trim();

    // Persist changes to Local Storage
    StorageUtil.saveTasks(this.tasks);

    return true;
  },

  /**
   * Toggle task completion status
   * @param {string} id - ID of the task to toggle
   * @returns {boolean} True if toggle succeeded, false if task not found
   */
  toggleTask(id) {
    // Find the task by ID
    const task = this.tasks.find(t => t.id === id);
    
    if (!task) {
      return false; // Task not found
    }

    // Toggle the completion status
    task.completed = !task.completed;

    // Persist changes to Local Storage
    StorageUtil.saveTasks(this.tasks);

    return true;
  },

  /**
   * Delete a task from the list
   * @param {string} id - ID of the task to delete
   * @returns {boolean} True if deletion succeeded, false if task not found
   */
  deleteTask(id) {
    // Find the task index by ID
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
      return false; // Task not found
    }

    // Remove the task from the array
    this.tasks.splice(taskIndex, 1);

    // Persist changes to Local Storage
    StorageUtil.saveTasks(this.tasks);

    return true;
  },

  /**
   * Render all tasks to the DOM
   * Clears the task list container and re-renders all tasks
   * Optimized to minimize DOM manipulations
   */
  renderTasks() {
    const taskListElement = document.getElementById('task-list');
    
    if (!taskListElement) {
      return; // Container not found
    }

    // Use DocumentFragment for efficient batch DOM updates
    const fragment = document.createDocumentFragment();

    // Render each task into the fragment
    this.tasks.forEach(task => {
      const taskElement = this.renderTask(task);
      fragment.appendChild(taskElement);
    });

    // Single DOM update - clear and append all at once
    taskListElement.innerHTML = '';
    taskListElement.appendChild(fragment);
  },

  /**
   * Render a single task element
   * @param {Object} task - Task object to render
   * @returns {HTMLElement} List item element containing the task
   */
  renderTask(task) {
    // Create list item
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.taskId = task.id;

    // Apply completion styling if task is completed
    if (task.completed) {
      li.classList.add('task-completed');
    }

    // Create checkbox for completion toggle
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', 'Mark task as complete');
    
    // Checkbox event handler
    checkbox.addEventListener('change', () => {
      this.toggleTask(task.id);
      this.renderTasks(); // Re-render to update styling
    });

    // Create task text span
    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = task.text;

    // Create edit button
    const editButton = document.createElement('button');
    editButton.className = 'btn btn-small btn-edit';
    editButton.textContent = 'Edit';
    editButton.setAttribute('aria-label', `Edit task: ${task.text}`);
    
    // Edit button event handler
    editButton.addEventListener('click', () => {
      this.startEditMode(task.id, li);
    });

    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-small btn-delete';
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('aria-label', `Delete task: ${task.text}`);
    
    // Delete button event handler
    deleteButton.addEventListener('click', () => {
      this.deleteTask(task.id);
      this.renderTasks(); // Re-render to remove task
    });

    // Assemble the task element
    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    return li;
  },

  /**
   * Start edit mode for a task
   * @param {string} id - ID of the task to edit
   * @param {HTMLElement} taskElement - The task list item element
   */
  startEditMode(id, taskElement) {
    const task = this.tasks.find(t => t.id === id);
    
    if (!task) {
      return; // Task not found
    }

    // Find the text span
    const textSpan = taskElement.querySelector('.task-text');
    
    if (!textSpan) {
      return;
    }

    // Create input field
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'task-edit-input';
    input.value = task.text;
    input.setAttribute('aria-label', 'Edit task text');

    // Replace text span with input
    textSpan.replaceWith(input);
    input.focus();
    input.select();

    // Function to save edit
    const saveEdit = () => {
      const newText = input.value;
      this.editTask(id, newText);
      
      // Re-render to show updated text or revert
      this.renderTasks();
    };

    // Function to cancel edit
    const cancelEdit = () => {
      // Re-render to restore original display
      this.renderTasks();
    };

    // Save on Enter key
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveEdit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelEdit();
      }
    });

    // Save on blur (clicking outside)
    input.addEventListener('blur', saveEdit);
  }
};

// ============================================================================
// Quick Links Widget Module
// ============================================================================

const QuickLinksWidget = {
  // In-memory links list
  links: [],

  /**
   * Generate unique ID for a link using timestamp
   * @returns {string} Unique ID based on current timestamp
   */
  generateId() {
    return String(Date.now());
  },

  /**
   * Validate URL format (must start with http:// or https://)
   * @param {string} url - URL to validate
   * @returns {boolean} True if URL is valid, false otherwise
   */
  validateUrl(url) {
    if (typeof url !== 'string') {
      return false;
    }
    return /^https?:\/\/.+/.test(url);
  },

  /**
   * Create a new quick link object
   * @param {string} label - Display label for the link
   * @param {string} url - URL for the link
   * @returns {Object|null} Link object with id, label, url, or null if invalid
   */
  createLinkObject(label, url) {
    // Validate URL
    if (!this.validateUrl(url)) {
      return null;
    }

    // Validate label (must be non-empty after trimming)
    if (typeof label !== 'string' || label.trim().length === 0) {
      return null;
    }

    return {
      id: this.generateId(),
      label: label.trim(),
      url: url.trim()
    };
  },

  /**
   * Initialize the quick links widget
   * Loads links from Local Storage and prepares the widget for use
   */
  init() {
    // Load links from Local Storage
    this.links = StorageUtil.loadQuickLinks();
    
    // Render links to display
    this.renderLinks();
    
    // Attach event handlers
    this.attachEventHandlers();
  },

  /**
   * Attach event handlers for quick link form
   */
  attachEventHandlers() {
    const linkForm = document.getElementById('link-form');
    const labelInput = document.getElementById('link-label');
    const urlInput = document.getElementById('link-url');
    const errorElement = document.getElementById('link-error');

    if (linkForm && labelInput && urlInput) {
      linkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const label = labelInput.value;
        const url = urlInput.value;
        
        // Clear any previous error message
        if (errorElement) {
          errorElement.textContent = '';
          errorElement.style.display = 'none';
        }
        
        // Validate URL
        if (!this.validateUrl(url)) {
          // Display error message for invalid URL
          if (errorElement) {
            errorElement.textContent = 'URL must start with http:// or https://';
            errorElement.style.display = 'block';
          }
          return;
        }
        
        // Attempt to add the link
        const link = this.addLink(label, url);
        
        if (link) {
          // Clear inputs on successful add
          labelInput.value = '';
          urlInput.value = '';
          
          // Re-render to show new link
          this.renderLinks();
        }
      });

      // Clear error message when user modifies URL input
      if (urlInput && errorElement) {
        urlInput.addEventListener('input', () => {
          if (errorElement.style.display === 'block') {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
          }
        });
      }
    }
  },

  /**
   * Add a new quick link to the list
   * @param {string} label - Display label for the link
   * @param {string} url - URL for the link
   * @returns {Object|null} Created link object, or null if validation fails
   */
  addLink(label, url) {
    // Validate and create link object
    const link = this.createLinkObject(label, url);
    
    if (!link) {
      return null; // Validation failed
    }

    // Add to in-memory links list
    this.links.push(link);

    // Persist to Local Storage
    StorageUtil.saveQuickLinks(this.links);

    return link;
  },

  /**
   * Delete a link from the list
   * @param {string} id - ID of the link to delete
   * @returns {boolean} True if deletion succeeded, false if link not found
   */
  deleteLink(id) {
    // Find the link index by ID
    const linkIndex = this.links.findIndex(l => l.id === id);
    
    if (linkIndex === -1) {
      return false; // Link not found
    }

    // Remove the link from the array
    this.links.splice(linkIndex, 1);

    // Persist changes to Local Storage
    StorageUtil.saveQuickLinks(this.links);

    return true;
  },

  /**
   * Open a URL in a new browser tab
   * @param {string} url - URL to open
   */
  openLink(url) {
    window.open(url, '_blank');
  },

  /**
   * Render all links to the DOM
   * Clears the links container and re-renders all links
   * Optimized to minimize DOM manipulations
   */
  renderLinks() {
    const linksContainer = document.getElementById('links-container');
    
    if (!linksContainer) {
      return; // Container not found
    }

    // Use DocumentFragment for efficient batch DOM updates
    const fragment = document.createDocumentFragment();

    // Render each link into the fragment
    this.links.forEach(link => {
      const linkElement = this.renderLink(link);
      fragment.appendChild(linkElement);
    });

    // Single DOM update - clear and append all at once
    linksContainer.innerHTML = '';
    linksContainer.appendChild(fragment);
  },

  /**
   * Render a single link element
   * @param {Object} link - Link object to render
   * @returns {HTMLElement} Div element containing the link button and delete button
   */
  renderLink(link) {
    // Create container div
    const div = document.createElement('div');
    div.className = 'link-item';
    div.dataset.linkId = link.id;

    // Create link button
    const linkButton = document.createElement('button');
    linkButton.className = 'btn btn-link';
    linkButton.textContent = link.label;
    linkButton.setAttribute('aria-label', `Open ${link.label}`);
    
    // Link button click handler - opens URL in new tab
    linkButton.addEventListener('click', () => {
      this.openLink(link.url);
    });

    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-small btn-delete';
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('aria-label', `Delete link: ${link.label}`);
    
    // Delete button event handler
    deleteButton.addEventListener('click', () => {
      this.deleteLink(link.id);
      this.renderLinks(); // Re-render to remove link
    });

    // Assemble the link element
    div.appendChild(linkButton);
    div.appendChild(deleteButton);

    return div;
  }
};

// ============================================================================
// Error Handling and Notifications
// ============================================================================

const ErrorHandler = {
  /**
   * Display a temporary notification message
   * @param {string} message - Message to display
   * @param {string} type - Type of notification ('error' or 'info')
   * @param {number} duration - Duration in milliseconds (default: 3000)
   */
  showNotification(message, type = 'error', duration = 3000) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    
    if (!notification) {
      notification = document.createElement('div');
      notification.id = 'notification';
      notification.className = 'notification';
      document.body.appendChild(notification);
    }

    // Set message and type
    notification.textContent = message;
    notification.className = `notification notification-${type}`;
    notification.style.display = 'block';

    // Auto-hide after duration
    setTimeout(() => {
      notification.style.display = 'none';
    }, duration);
  },

  /**
   * Handle storage errors
   * @param {Error} error - Error object
   * @param {string} operation - Operation that failed
   */
  handleStorageError(error, operation) {
    console.error(`Storage error during ${operation}:`, error);
    this.showNotification(`Failed to ${operation}. Your changes may not be saved.`, 'error');
  },

  /**
   * Handle corrupted data
   * @param {string} dataType - Type of data that was corrupted
   */
  handleCorruptedData(dataType) {
    console.error(`Corrupted ${dataType} data detected. Clearing and starting fresh.`);
    this.showNotification(`Previous ${dataType} data could not be loaded. Starting fresh.`, 'info');
  }
};

// ============================================================================
// Application Initialization
// ============================================================================

/**
 * Initialize the application
 * Ensures all widgets are initialized and error handling is set up
 */
function initApp() {
  try {
    // Performance tracking
    const startTime = performance.now();

    // Check Local Storage availability
    const storageAvailable = StorageUtil.isAvailable();
    
    if (!storageAvailable) {
      const errorElement = document.getElementById('storage-error');
      if (errorElement) {
        errorElement.style.display = 'block';
      }
      console.error('Local Storage is not available. Data persistence is disabled.');
    }

    // Initialize all widgets
    GreetingWidget.init();
    FocusTimer.init();
    TodoWidget.init();
    QuickLinksWidget.init();

    // Log initialization time for performance monitoring
    const endTime = performance.now();
    const initTime = endTime - startTime;
    console.log(`Dashboard initialized in ${initTime.toFixed(2)}ms`);

    // Warn if initialization took too long (should be < 500ms)
    if (initTime > 500) {
      console.warn(`Initialization took ${initTime.toFixed(2)}ms, which exceeds the 500ms target.`);
    }

  } catch (error) {
    console.error('Failed to initialize application:', error);
    ErrorHandler.showNotification('Failed to initialize dashboard. Please refresh the page.', 'error', 5000);
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
