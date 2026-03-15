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
      // Notify user about corrupted data
      if (typeof ErrorHandler !== 'undefined') {
        ErrorHandler.handleCorruptedData('tasks');
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
      // Notify user about save failure
      if (typeof ErrorHandler !== 'undefined') {
        ErrorHandler.handleStorageError(e, 'save tasks');
      }
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
      // Notify user about corrupted data
      if (typeof ErrorHandler !== 'undefined') {
        ErrorHandler.handleCorruptedData('quick links');
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
      // Notify user about save failure
      if (typeof ErrorHandler !== 'undefined') {
        ErrorHandler.handleStorageError(e, 'save quick links');
      }
      return false;
    }
  },

  /**
   * Load theme preference from Local Storage
   * @returns {string|null} Theme value ('light' or 'dark'), or null if not set
   */
  loadTheme() {
    try {
      const theme = localStorage.getItem('theme');
      return theme;
    } catch (e) {
      console.error('Failed to load theme:', e);
      return null;
    }
  },

  /**
   * Save theme preference to Local Storage
   * @param {string} theme - Theme value to save ('light' or 'dark')
   * @returns {boolean} True if save was successful, false otherwise
   */
  saveTheme(theme) {
    try {
      localStorage.setItem('theme', theme);
      return true;
    } catch (e) {
      console.error('Failed to save theme:', e);
      // Notify user about save failure
      if (typeof ErrorHandler !== 'undefined') {
        ErrorHandler.handleStorageError(e, 'save theme');
      }
      return false;
    }
  },

  /**
   * Load user name from Local Storage
   * @returns {string|null} User name value, or null if not set
   */
  loadUserName() {
    try {
      const userName = localStorage.getItem('userName');
      return userName;
    } catch (e) {
      console.error('Failed to load user name:', e);
      return null;
    }
  },

  /**
   * Save user name to Local Storage
   * @param {string} userName - User name value to save
   * @returns {boolean} True if save was successful, false otherwise
   */
  saveUserName(userName) {
    try {
      if (userName === null || userName === '') {
        localStorage.removeItem('userName');
      } else {
        localStorage.setItem('userName', userName);
      }
      return true;
    } catch (e) {
      console.error('Failed to save user name:', e);
      // Notify user about save failure
      if (typeof ErrorHandler !== 'undefined') {
        ErrorHandler.handleStorageError(e, 'save user name');
      }
      return false;
    }
  },

  /**
   * Load timer duration from Local Storage
   * @returns {number|null} Timer duration in minutes, or null if not set
   */
  loadTimerDuration() {
    try {
      const duration = localStorage.getItem('timerDuration');
      if (duration === null) {
        return null;
      }
      const parsed = parseInt(duration, 10);
      if (isNaN(parsed)) {
        return null;
      }
      return parsed;
    } catch (e) {
      console.error('Failed to load timer duration:', e);
      return null;
    }
  },

  /**
   * Save timer duration to Local Storage
   * @param {number} duration - Timer duration in minutes to save
   * @returns {boolean} True if save was successful, false otherwise
   */
  saveTimerDuration(duration) {
    try {
      localStorage.setItem('timerDuration', String(duration));
      return true;
    } catch (e) {
      console.error('Failed to save timer duration:', e);
      // Notify user about save failure
      if (typeof ErrorHandler !== 'undefined') {
        ErrorHandler.handleStorageError(e, 'save timer duration');
      }
      return false;
    }
  }
};

// ============================================================================
// Greeting Widget Module
// ============================================================================

const GreetingWidget = {
  intervalId: null,
  userName: null,

  /**
   * Initialize the greeting widget
   */
  init() {
    // Load user name from storage
    this.userName = StorageUtil.loadUserName();
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
   * Optimized to only update changed elements using requestAnimationFrame
   */
  render() {
    const now = new Date();
    const hour = now.getHours();
    const baseGreeting = this.getGreeting(hour);
    // Append user name if set
    const greeting = this.userName ? `${baseGreeting}, ${this.userName}` : baseGreeting;
    const time = this.formatTime(now);
    const date = this.formatDate(now);
    
    const greetingElement = document.getElementById('greeting');
    const timeElement = document.getElementById('time');
    const dateElement = document.getElementById('date');
    
    // Batch DOM updates using requestAnimationFrame for optimal performance
    requestAnimationFrame(() => {
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
    });
  },

  /**
   * Update user name and re-render greeting
   * @param {string|null} newUserName - New user name to set, or null to clear
   */
  setUserName(newUserName) {
    this.userName = newUserName;
    StorageUtil.saveUserName(newUserName);
    this.render();
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
  customDuration: 25, // Default 25 minutes

  /**
   * Initialize the timer widget
   */
  init() {
    // Load custom duration from storage (default to 25 minutes)
    const savedDuration = StorageUtil.loadTimerDuration();
    this.customDuration = savedDuration !== null ? savedDuration : 25;
    
    // Set initial time remaining based on custom duration
    this.timeRemaining = this.customDuration * 60;
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
   * Reset timer to custom duration
   */
  reset() {
    this.stop();
    this.timeRemaining = this.customDuration * 60;
    this.render();
  },

  /**
   * Set custom timer duration
   * @param {number} minutes - Duration in minutes (1-120)
   * @returns {boolean} True if duration was set successfully, false if invalid
   */
  setDuration(minutes) {
    // Validate range (1-120 minutes)
    if (typeof minutes !== 'number' || minutes < 1 || minutes > 120) {
      return false;
    }

    // Update custom duration
    this.customDuration = minutes;

    // Save to storage
    StorageUtil.saveTimerDuration(minutes);

    // Reset timer to new duration
    this.reset();

    return true;
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
   * Optimized to only update when value changes and use requestAnimationFrame
   */
  render() {
    const displayElement = document.getElementById('timer-display');
    if (displayElement) {
      const formattedTime = this.formatTime(this.timeRemaining);
      // Only update if content has changed (performance optimization)
      if (displayElement.textContent !== formattedTime) {
        // Use requestAnimationFrame for smooth, optimized updates
        requestAnimationFrame(() => {
          displayElement.textContent = formattedTime;
        });
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
      startButton.addEventListener('click', () => {
        // Performance monitoring: Measure timer start time
        PerformanceMonitor.measureAction('Start Timer', () => {
          this.start();
        });
      });
    }

    if (stopButton) {
      stopButton.addEventListener('click', () => {
        // Performance monitoring: Measure timer stop time
        PerformanceMonitor.measureAction('Stop Timer', () => {
          this.stop();
        });
      });
    }

    if (resetButton) {
      resetButton.addEventListener('click', () => {
        // Performance monitoring: Measure timer reset time
        PerformanceMonitor.measureAction('Reset Timer', () => {
          this.reset();
        });
      });
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
    
    // Ensure all tasks have an order property
    this.tasks.forEach((task, index) => {
      if (typeof task.order !== 'number') {
        task.order = index;
      }
    });

    // Sort tasks by order
    this.tasks.sort((a, b) => a.order - b.order);
    
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
        
        // Performance monitoring: Measure task addition time
        PerformanceMonitor.measureAction('Add Task', () => {
          const text = taskInput.value;
          const task = this.addTask(text);
          
          if (task) {
            // Clear input on successful add
            taskInput.value = '';
            // Re-render to show new task
            this.renderTasks();
          }
        });
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
   * Check if a task with the same text already exists (case-insensitive, trimmed)
   * @param {string} text - Task text to check
   * @returns {boolean} True if duplicate exists, false otherwise
   */
  isDuplicateTask(text) {
    if (typeof text !== 'string') {
      return false;
    }

    const normalizedText = text.trim().toLowerCase();
    
    return this.tasks.some(task => 
      task.text.trim().toLowerCase() === normalizedText
    );
  },

  /**
   * Create a new task object
   * @param {string} text - Task text
   * @returns {Object|null} Task object with id, text, completed, createdAt, order, or null if invalid
   */
  createTaskObject(text) {
    if (!this.validateTaskText(text)) {
      return null;
    }

    const trimmedText = text.trim();
    const now = Date.now();

    // Calculate order - new tasks go to the end
    const maxOrder = this.tasks.length > 0 
      ? Math.max(...this.tasks.map(t => t.order || 0))
      : -1;

    return {
      id: this.generateId(),
      text: trimmedText,
      completed: false,
      createdAt: now,
      order: maxOrder + 1
    };
  },

  /**
   * Add a new task to the list
   * @param {string} text - Task text to add
   * @returns {Object|null} Created task object, or null if validation fails or duplicate detected
   */
  addTask(text) {
    // Validate task text first
    if (!this.validateTaskText(text)) {
      return null; // Validation failed
    }

    // Check for duplicate task before creating the task object
    if (this.isDuplicateTask(text)) {
      // Display error message when duplicate detected
      ErrorHandler.showNotification('This task already exists in your list', 'error', 3000);
      return null; // Do not create duplicate task
    }

    // Create task object (validation already passed)
    const task = this.createTaskObject(text);
    
    if (!task) {
      return null; // Should not happen since we already validated, but safety check
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
   * Move a task up in the list order
   * @param {string} id - ID of the task to move up
   * @returns {boolean} True if move succeeded, false if task not found or already at top
   */
  moveTaskUp(id) {
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1 || taskIndex === 0) {
      return false; // Task not found or already at top
    }

    // Swap with previous task
    const temp = this.tasks[taskIndex];
    this.tasks[taskIndex] = this.tasks[taskIndex - 1];
    this.tasks[taskIndex - 1] = temp;

    // Update order values
    this.tasks[taskIndex].order = taskIndex;
    this.tasks[taskIndex - 1].order = taskIndex - 1;

    // Persist changes to Local Storage
    StorageUtil.saveTasks(this.tasks);

    return true;
  },

  /**
   * Move a task down in the list order
   * @param {string} id - ID of the task to move down
   * @returns {boolean} True if move succeeded, false if task not found or already at bottom
   */
  moveTaskDown(id) {
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1 || taskIndex === this.tasks.length - 1) {
      return false; // Task not found or already at bottom
    }

    // Swap with next task
    const temp = this.tasks[taskIndex];
    this.tasks[taskIndex] = this.tasks[taskIndex + 1];
    this.tasks[taskIndex + 1] = temp;

    // Update order values
    this.tasks[taskIndex].order = taskIndex;
    this.tasks[taskIndex + 1].order = taskIndex + 1;

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

    // Performance optimization: Use requestAnimationFrame for smooth rendering
    requestAnimationFrame(() => {
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
    });
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
      // Performance monitoring: Measure task toggle time
      PerformanceMonitor.measureAction('Toggle Task', () => {
        this.toggleTask(task.id);
        this.renderTasks(); // Re-render to update styling
      });
    });

    // Create task text span
    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = task.text;

    // Create reorder buttons container
    const reorderButtons = document.createElement('div');
    reorderButtons.className = 'task-reorder-buttons';

    // Create up button
    const upButton = document.createElement('button');
    upButton.className = 'btn btn-small btn-reorder';
    upButton.textContent = '↑';
    upButton.setAttribute('aria-label', `Move task up: ${task.text}`);
    
    // Disable up button if task is first
    const taskIndex = this.tasks.findIndex(t => t.id === task.id);
    if (taskIndex === 0) {
      upButton.disabled = true;
      upButton.classList.add('btn-disabled');
    }
    
    // Up button event handler
    upButton.addEventListener('click', () => {
      PerformanceMonitor.measureAction('Move Task Up', () => {
        this.moveTaskUp(task.id);
        this.renderTasks();
      });
    });

    // Create down button
    const downButton = document.createElement('button');
    downButton.className = 'btn btn-small btn-reorder';
    downButton.textContent = '↓';
    downButton.setAttribute('aria-label', `Move task down: ${task.text}`);
    
    // Disable down button if task is last
    if (taskIndex === this.tasks.length - 1) {
      downButton.disabled = true;
      downButton.classList.add('btn-disabled');
    }
    
    // Down button event handler
    downButton.addEventListener('click', () => {
      PerformanceMonitor.measureAction('Move Task Down', () => {
        this.moveTaskDown(task.id);
        this.renderTasks();
      });
    });

    // Add buttons to reorder container
    reorderButtons.appendChild(upButton);
    reorderButtons.appendChild(downButton);

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
      // Performance monitoring: Measure task deletion time
      PerformanceMonitor.measureAction('Delete Task', () => {
        this.deleteTask(task.id);
        this.renderTasks(); // Re-render to remove task
      });
    });

    // Assemble the task element
    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(reorderButtons);
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
      // Performance monitoring: Measure task edit time
      PerformanceMonitor.measureAction('Edit Task', () => {
        const newText = input.value;
        this.editTask(id, newText);
        
        // Re-render to show updated text or revert
        this.renderTasks();
      });
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
        
        // Performance monitoring: Measure link addition time
        PerformanceMonitor.measureAction('Add Quick Link', () => {
          const label = labelInput.value;
          const url = urlInput.value;
          
          // Clear any previous error message
          if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
          }
          
          // Validate URL
          if (!this.validateUrl(url)) {
            // Log error to console
            console.error('Invalid URL provided:', url);
            
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
    try {
      const newWindow = window.open(url, '_blank');
      
      // Check if popup was blocked
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        console.warn('Popup blocked for URL:', url);
        if (typeof ErrorHandler !== 'undefined') {
          ErrorHandler.showNotification('Popup blocked. Please allow popups for this site.', 'error');
        }
      }
    } catch (e) {
      console.error('Failed to open link:', url, e);
      if (typeof ErrorHandler !== 'undefined') {
        ErrorHandler.showNotification('Failed to open link.', 'error');
      }
    }
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

    // Performance optimization: Use requestAnimationFrame for smooth rendering
    requestAnimationFrame(() => {
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
    });
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
      // Performance monitoring: Measure link deletion time
      PerformanceMonitor.measureAction('Delete Quick Link', () => {
        this.deleteLink(link.id);
        this.renderLinks(); // Re-render to remove link
      });
    });

    // Assemble the link element
    div.appendChild(linkButton);
    div.appendChild(deleteButton);

    return div;
  }
};

// ============================================================================
// Performance Monitoring Utility
// ============================================================================

const PerformanceMonitor = {
  // Track action timings
  actionTimings: [],
  
  /**
   * Measure the time taken for an action
   * @param {string} actionName - Name of the action being measured
   * @param {Function} action - Function to execute and measure
   * @returns {*} Result of the action function
   */
  measureAction(actionName, action) {
    const startTime = performance.now();
    const result = action();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Log timing
    this.actionTimings.push({ action: actionName, duration, timestamp: Date.now() });
    
    // Warn if action exceeds 100ms threshold (Requirement 13.2)
    if (duration > 100) {
      console.warn(`Action "${actionName}" took ${duration.toFixed(2)}ms (exceeds 100ms target)`);
    } else {
      console.log(`Action "${actionName}" completed in ${duration.toFixed(2)}ms`);
    }
    
    return result;
  },
  
  /**
   * Get performance statistics
   * @returns {Object} Performance statistics
   */
  getStats() {
    if (this.actionTimings.length === 0) {
      return { count: 0, average: 0, max: 0, min: 0 };
    }
    
    const durations = this.actionTimings.map(t => t.duration);
    const sum = durations.reduce((a, b) => a + b, 0);
    const average = sum / durations.length;
    const max = Math.max(...durations);
    const min = Math.min(...durations);
    
    return {
      count: this.actionTimings.length,
      average: average.toFixed(2),
      max: max.toFixed(2),
      min: min.toFixed(2)
    };
  },
  
  /**
   * Clear performance data
   */
  clear() {
    this.actionTimings = [];
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
// Theme Widget Module
// ============================================================================

const ThemeWidget = {
  currentTheme: 'light',
  toggleButton: null,
  themeIcon: null,

  /**
   * Initialize theme widget
   * Load saved theme and set up toggle button
   */
  init() {
    // Get DOM elements
    this.toggleButton = document.getElementById('theme-toggle');
    this.themeIcon = this.toggleButton?.querySelector('.theme-icon');

    if (!this.toggleButton || !this.themeIcon) {
      console.error('Theme toggle button or icon not found');
      return;
    }

    // Load saved theme from storage
    const savedTheme = StorageUtil.loadTheme();
    
    // Apply saved theme or default to light
    if (savedTheme === 'dark') {
      this.currentTheme = 'dark';
      this.applyTheme('dark');
    } else {
      this.currentTheme = 'light';
      this.applyTheme('light');
    }

    // Set up event listener for toggle button
    this.toggleButton.addEventListener('click', () => this.toggleTheme());
  },

  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
    
    // Save to storage
    const saved = StorageUtil.saveTheme(newTheme);
    
    if (!saved) {
      console.warn('Failed to save theme preference');
    }
  },

  /**
   * Apply theme to the page
   * @param {string} theme - Theme to apply ('light' or 'dark')
   */
  applyTheme(theme) {
    this.currentTheme = theme;
    
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      this.themeIcon.textContent = '☀️';
    } else {
      document.body.classList.remove('dark-theme');
      this.themeIcon.textContent = '🌙';
    }
  }
};

// ============================================================================
// Settings Widget Module
// ============================================================================

const SettingsWidget = {
  modal: null,
  settingsButton: null,
  userNameInput: null,
  settingsForm: null,
  clearNameButton: null,
  cancelButton: null,
  modalClose: null,

  /**
   * Initialize settings widget
   */
  init() {
    // Get DOM elements
    this.modal = document.getElementById('settings-modal');
    this.settingsButton = document.getElementById('settings-button');
    this.userNameInput = document.getElementById('user-name-input');
    this.settingsForm = document.getElementById('settings-form');
    this.clearNameButton = document.getElementById('clear-name-button');
    this.cancelButton = document.getElementById('cancel-button');
    this.modalClose = document.getElementById('modal-close');

    if (!this.modal || !this.settingsButton) {
      console.error('Settings modal or button not found');
      return;
    }

    // Set up event listeners
    this.attachEventHandlers();
  },

  /**
   * Attach event handlers for settings UI
   */
  attachEventHandlers() {
    // Open modal when settings button is clicked
    if (this.settingsButton) {
      this.settingsButton.addEventListener('click', () => this.openModal());
    }

    // Close modal when close button is clicked
    if (this.modalClose) {
      this.modalClose.addEventListener('click', () => this.closeModal());
    }

    // Close modal when cancel button is clicked
    if (this.cancelButton) {
      this.cancelButton.addEventListener('click', () => this.closeModal());
    }

    // Close modal when clicking outside the modal content
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.closeModal();
        }
      });
    }

    // Handle form submission
    if (this.settingsForm) {
      this.settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveSettings();
      });
    }

    // Handle clear name button
    if (this.clearNameButton) {
      this.clearNameButton.addEventListener('click', () => {
        this.clearUserName();
      });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.style.display === 'flex') {
        this.closeModal();
      }
    });
  },

  /**
   * Open the settings modal
   */
  openModal() {
    if (!this.modal) return;

    // Load current user name into input
    const currentUserName = StorageUtil.loadUserName();
    if (this.userNameInput) {
      this.userNameInput.value = currentUserName || '';
    }

    // Show modal
    this.modal.style.display = 'flex';

    // Focus on input
    if (this.userNameInput) {
      setTimeout(() => this.userNameInput.focus(), 100);
    }
  },

  /**
   * Close the settings modal
   */
  closeModal() {
    if (!this.modal) return;
    this.modal.style.display = 'none';
  },

  /**
   * Save settings from the form
   */
  saveSettings() {
    if (!this.userNameInput) return;

    const userName = this.userNameInput.value.trim();

    // Save user name (empty string will clear it)
    GreetingWidget.setUserName(userName || null);

    // Show success notification
    ErrorHandler.showNotification('Settings saved successfully!', 'success', 2000);

    // Close modal
    this.closeModal();
  },

  /**
   * Clear the user name
   */
  clearUserName() {
    // Clear the input field
    if (this.userNameInput) {
      this.userNameInput.value = '';
    }

    // Clear from storage and greeting
    GreetingWidget.setUserName(null);

    // Show notification
    ErrorHandler.showNotification('Name cleared successfully!', 'success', 2000);

    // Close modal
    this.closeModal();
  }
};

// ============================================================================
// Timer Settings Widget Module
// ============================================================================

const TimerSettingsWidget = {
  modal: null,
  settingsButton: null,
  durationInput: null,
  settingsForm: null,
  cancelButton: null,
  modalClose: null,
  errorElement: null,

  /**
   * Initialize timer settings widget
   */
  init() {
    // Get DOM elements
    this.modal = document.getElementById('timer-settings-modal');
    this.settingsButton = document.getElementById('timer-settings-button');
    this.durationInput = document.getElementById('timer-duration-input');
    this.settingsForm = document.getElementById('timer-settings-form');
    this.cancelButton = document.getElementById('timer-cancel-button');
    this.modalClose = document.getElementById('timer-modal-close');
    this.errorElement = document.getElementById('timer-duration-error');

    if (!this.modal || !this.settingsButton) {
      console.error('Timer settings modal or button not found');
      return;
    }

    // Set up event listeners
    this.attachEventHandlers();
  },

  /**
   * Attach event handlers for timer settings UI
   */
  attachEventHandlers() {
    // Open modal when settings button is clicked
    if (this.settingsButton) {
      this.settingsButton.addEventListener('click', () => this.openModal());
    }

    // Close modal when close button is clicked
    if (this.modalClose) {
      this.modalClose.addEventListener('click', () => this.closeModal());
    }

    // Close modal when cancel button is clicked
    if (this.cancelButton) {
      this.cancelButton.addEventListener('click', () => this.closeModal());
    }

    // Close modal when clicking outside the modal content
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.closeModal();
        }
      });
    }

    // Handle form submission
    if (this.settingsForm) {
      this.settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveSettings();
      });
    }

    // Clear error when user types
    if (this.durationInput && this.errorElement) {
      this.durationInput.addEventListener('input', () => {
        this.errorElement.style.display = 'none';
        this.errorElement.textContent = '';
      });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.style.display === 'flex') {
        this.closeModal();
      }
    });
  },

  /**
   * Open the timer settings modal
   */
  openModal() {
    if (!this.modal) return;

    // Load current timer duration into input
    const currentDuration = FocusTimer.customDuration;
    if (this.durationInput) {
      this.durationInput.value = currentDuration;
    }

    // Clear any previous error
    if (this.errorElement) {
      this.errorElement.style.display = 'none';
      this.errorElement.textContent = '';
    }

    // Show modal
    this.modal.style.display = 'flex';

    // Focus on input
    if (this.durationInput) {
      setTimeout(() => {
        this.durationInput.focus();
        this.durationInput.select();
      }, 100);
    }
  },

  /**
   * Close the timer settings modal
   */
  closeModal() {
    if (!this.modal) return;
    this.modal.style.display = 'none';
  },

  /**
   * Save timer settings from the form
   */
  saveSettings() {
    if (!this.durationInput) return;

    const durationValue = this.durationInput.value.trim();
    const duration = parseInt(durationValue, 10);

    // Validate duration
    if (isNaN(duration) || duration < 1 || duration > 120) {
      // Show error message
      if (this.errorElement) {
        this.errorElement.textContent = 'Please enter a value between 1 and 120 minutes';
        this.errorElement.style.display = 'block';
      }
      return;
    }

    // Set the new duration
    const success = FocusTimer.setDuration(duration);

    if (success) {
      // Show success notification
      ErrorHandler.showNotification(`Timer duration set to ${duration} minutes!`, 'success', 2000);

      // Close modal
      this.closeModal();
    } else {
      // Show error message
      if (this.errorElement) {
        this.errorElement.textContent = 'Failed to set timer duration';
        this.errorElement.style.display = 'block';
      }
    }
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
      
      // Show notification as well
      ErrorHandler.showNotification(
        'Data persistence is unavailable. Your changes will not be saved.',
        'error',
        5000
      );
    }

    // Initialize all widgets
    ThemeWidget.init();
    GreetingWidget.init();
    FocusTimer.init();
    TodoWidget.init();
    QuickLinksWidget.init();
    SettingsWidget.init();
    TimerSettingsWidget.init();

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
