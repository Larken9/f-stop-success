/**
 * Import Configuration
 * 
 * Customize these settings to match your course structure
 */

const path = require('path');
const os = require('os');

module.exports = {
  // Course directory settings
  DOCUMENTS_PATH: path.join(os.homedir(), 'Documents'),
  COURSE_FOLDER_NAME: 'Custom Path', // Change this to match your folder name
  
  // Alternative course paths (uncomment and modify if needed)
  COURSE_PATH: 'D:\\KellySiteRebuild\\fstop-to-success\\src\\app\\assets\\documents\\F-STOP to Success Course',
  // COURSE_PATH: '/Users/username/Desktop/Course Materials',
  
  // File type preferences
  SUPPORTED_EXTENSIONS: ['.txt', '.md', '.docx'],
  
  // Content parsing settings
  SECTION_HEADERS: {
    introduction: ['introduction', 'welcome', 'intro'],
    whatYoullCover: ['what you\'ll cover', 'why it\'s important', 'overview'],
    mainTeachingPoints: ['main teaching', 'main points', 'content', 'teaching points'],
    reviewAndOutcome: ['review', 'outcome', 'summary', 'recap'],
    nextSteps: ['next steps', 'what\'s next', 'moving forward'],
    actionTask: ['action task', 'homework', 'assignment', 'practice']
  },
  
  // Course metadata
  COURSE_DEFAULTS: {
    title: 'F-STOP to Success',
    slug: 'fstop-to-success',
    description: 'Complete photography business course',
    price: 297,
    difficulty: 'intermediate',
    category: 'photography'
  },
  
  // Instructor information
  INSTRUCTOR_DEFAULTS: {
    name: 'Kelly Gauthier',
    slug: 'kelly-gauthier',
    bio: 'Photography and Business Expert'
  },
  
  // Import settings
  IMPORT_OPTIONS: {
    // Skip existing content (set to false to update existing)
    skipExisting: true,
    
    // Automatically publish imported content
    autoPublish: true,
    
    // Default lesson duration in minutes
    defaultLessonDuration: 30,
    
    // Default module duration in hours
    defaultModuleDuration: 3,
    
    // Batch size for imports (to avoid rate limits)
    batchSize: 10
  },
  
  // Debugging options
  DEBUG: {
    // Show detailed parsing information
    verbose: false,
    
    // Save parsed content to files for inspection
    saveParseResults: false,
    
    // Dry run (don't actually create documents)
    dryRun: false
  }
};