/**
 * Course Content Import Script for Sanity CMS
 * 
 * This script automatically imports course content from your Documents folder into Sanity.
 * It parses structured content and creates courses, modules, and lessons.
 * 
 * Usage: node scripts/import-course-content.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');
const config = require('./import-config');
require('dotenv').config({ path: '.env.local' });

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01'
});

// Course path configuration
const COURSE_PATH = config.COURSE_PATH || path.join(config.DOCUMENTS_PATH, config.COURSE_FOLDER_NAME);

// Helper function to convert text to slug
function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

// Helper function to convert plain text to Sanity block content
function textToBlocks(text) {
  if (!text) return [];
  
  return text.split('\n\n').map(paragraph => ({
    _type: 'block',
    _key: Math.random().toString(36).substr(2, 9),
    style: 'normal',
    markDefs: [],
    children: [{
      _type: 'span',
      _key: Math.random().toString(36).substr(2, 9),
      text: paragraph.trim(),
      marks: []
    }]
  }));
}

// Parse lesson content based on configured section headers
function parseLessonContent(content) {
  const sections = {};
  let currentSection = null;
  let currentContent = '';
  
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim().toLowerCase();
    let foundSection = null;
    
    // Check for section headers using config
    for (const [sectionKey, headers] of Object.entries(config.SECTION_HEADERS)) {
      if (headers.some(header => trimmedLine.includes(header.toLowerCase()))) {
        foundSection = sectionKey;
        break;
      }
    }
    
    if (foundSection) {
      // Save previous section
      if (currentSection) sections[currentSection] = currentContent.trim();
      currentSection = foundSection;
      currentContent = '';
    } else {
      currentContent += line + '\n';
    }
  }
  
  // Add the last section
  if (currentSection) sections[currentSection] = currentContent.trim();
  
  if (config.DEBUG.verbose) {
    console.log('📋 Parsed sections:', Object.keys(sections));
  }
  
  return sections;
}

// Read and parse files from the course directory
async function scanCourseDirectory() {
  console.log('📁 Scanning course directory:', COURSE_PATH);
  
  if (!fs.existsSync(COURSE_PATH)) {
    console.error('❌ Course directory not found:', COURSE_PATH);
    console.log('💡 Please make sure your course folder is named correctly in Documents');
    return null;
  }
  
  const structure = {
    courses: [],
    modules: [],
    lessons: []
  };
  
  // Scan for course structure
  const items = fs.readdirSync(COURSE_PATH, { withFileTypes: true });
  
  for (const item of items) {
    if (item.isDirectory()) {
      const modulePath = path.join(COURSE_PATH, item.name);
      console.log(`📂 Found module: ${item.name}`);
      
      // Parse module info
      const moduleNumber = extractNumber(item.name);
      structure.modules.push({
        title: item.name,
        folderName: item.name,
        moduleNumber: moduleNumber || structure.modules.length + 1,
        path: modulePath
      });
      
      // Scan for lessons in this module
      const lessonFiles = fs.readdirSync(modulePath, { withFileTypes: true });
      
      for (const lessonFile of lessonFiles) {
        const fileExt = path.extname(lessonFile.name);
        if (lessonFile.isFile() && config.SUPPORTED_EXTENSIONS.includes(fileExt)) {
          
          const lessonPath = path.join(modulePath, lessonFile.name);
          const lessonNumber = extractNumber(lessonFile.name);
          
          console.log(`  📄 Found lesson: ${lessonFile.name}`);
          
          structure.lessons.push({
            title: lessonFile.name.replace(/\.(txt|md|docx)$/, ''),
            fileName: lessonFile.name,
            lessonNumber: lessonNumber || structure.lessons.length + 1,
            moduleFolderName: item.name,
            path: lessonPath
          });
        }
      }
    } else if (item.isFile() && 
               (item.name.endsWith('.txt') || 
                item.name.endsWith('.md'))) {
      // Course-level file
      console.log(`📄 Found course file: ${item.name}`);
    }
  }
  
  return structure;
}

// Extract number from filename/foldername
function extractNumber(name) {
  const match = name.match(/(\d+)/);
  return match ? parseInt(match[1]) : null;
}

// Read file content
function readFileContent(filePath) {
  try {
    const ext = path.extname(filePath);
    if (ext === '.txt' || ext === '.md') {
      return fs.readFileSync(filePath, 'utf8');
    }
    // For .docx files, you'd need a library like mammoth
    console.warn(`⚠️ Unsupported file type: ${ext}. Please convert to .txt or .md`);
    return null;
  } catch (error) {
    console.error(`❌ Error reading file ${filePath}:`, error.message);
    return null;
  }
}

// Create or find instructor
async function ensureInstructor() {
  const instructors = await client.fetch('*[_type == "author"]');
  
  if (instructors.length > 0) {
    console.log('👨‍🏫 Using existing instructor:', instructors[0].name);
    return instructors[0];
  }
  
  console.log('👨‍🏫 Creating default instructor...');
  const instructor = await client.create({
    _type: 'author',
    name: 'Kelly Gauthier',
    slug: { current: 'kelly-gauthier' },
    bio: 'Photography and Business Expert',
    image: null
  });
  
  return instructor;
}

// Create course document
async function createCourse(instructor) {
  console.log('🎓 Creating course document...');
  
  const course = await client.create({
    _type: 'course',
    title: 'F-STOP to Success',
    slug: { current: 'fstop-to-success' },
    description: 'Complete photography business course',
    instructor: { _type: 'reference', _ref: instructor._id },
    price: 297,
    difficulty: 'intermediate',
    category: 'photography',
    publishedAt: new Date().toISOString()
  });
  
  console.log('✅ Course created:', course.title);
  return course;
}

// Create module documents
async function createModules(structure, course) {
  console.log('📚 Creating modules...');
  const createdModules = [];
  
  for (const moduleData of structure.modules) {
    console.log(`  Creating module: ${moduleData.title}`);
    
    const module = await client.create({
      _type: 'module',
      title: moduleData.title,
      slug: { current: createSlug(moduleData.title) },
      course: { _type: 'reference', _ref: course._id },
      moduleNumber: moduleData.moduleNumber,
      description: `Module ${moduleData.moduleNumber} of the F-STOP to Success course`,
      estimatedDuration: 3,
      isPublished: true
    });
    
    createdModules.push({
      ...module,
      folderName: moduleData.folderName
    });
  }
  
  console.log(`✅ Created ${createdModules.length} modules`);
  return createdModules;
}

// Create lesson documents
async function createLessons(structure, course, modules) {
  console.log('📖 Creating lessons...');
  let createdCount = 0;
  
  for (const lessonData of structure.lessons) {
    console.log(`  Creating lesson: ${lessonData.title}`);
    
    // Find the corresponding module
    const module = modules.find(m => m.folderName === lessonData.moduleFolderName);
    if (!module) {
      console.warn(`⚠️ No module found for lesson: ${lessonData.title}`);
      continue;
    }
    
    // Read lesson content
    const content = readFileContent(lessonData.path);
    if (!content) {
      console.warn(`⚠️ Could not read content for: ${lessonData.title}`);
      continue;
    }
    
    // Parse the content into sections
    const sections = parseLessonContent(content);
    
    const lesson = await client.create({
      _type: 'lesson',
      title: lessonData.title,
      slug: { current: createSlug(lessonData.title) },
      module: { _type: 'reference', _ref: module._id },
      course: { _type: 'reference', _ref: course._id },
      lessonNumber: lessonData.lessonNumber,
      estimatedDuration: 30,
      difficulty: 'intermediate',
      introduction: textToBlocks(sections.introduction || ''),
      whatYoullCover: textToBlocks(sections.whatYoullCover || ''),
      mainTeachingPoints: textToBlocks(sections.mainTeachingPoints || ''),
      reviewAndOutcome: textToBlocks(sections.reviewAndOutcome || ''),
      nextSteps: textToBlocks(sections.nextSteps || ''),
      actionTask: sections.actionTask ? {
        title: 'Course Action Task',
        instructions: textToBlocks(sections.actionTask),
        estimatedTime: 15,
        isPersonalTask: true
      } : null,
      isPublished: true,
      publishedAt: new Date().toISOString()
    });
    
    createdCount++;
  }
  
  console.log(`✅ Created ${createdCount} lessons`);
}

// Main import function
async function importCourseContent() {
  console.log('🚀 Starting course content import...');
  
  try {
    // Check Sanity connection
    await client.fetch('count(*[_type == "course"])');
    console.log('✅ Connected to Sanity');
    
    // Scan course directory
    const structure = await scanCourseDirectory();
    if (!structure) return;
    
    console.log(`📊 Found: ${structure.modules.length} modules, ${structure.lessons.length} lessons`);
    
    // Create instructor
    const instructor = await ensureInstructor();
    
    // Create course
    const course = await createCourse(instructor);
    
    // Create modules
    const modules = await createModules(structure, course);
    
    // Create lessons
    await createLessons(structure, course, modules);
    
    console.log('🎉 Import completed successfully!');
    console.log('🔗 Check your Sanity Studio to see the imported content');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    
    if (error.message.includes('token')) {
      console.log('💡 Make sure to add SANITY_API_TOKEN to your .env.local file');
      console.log('   Get your token from: https://sanity.io/manage');
    }
  }
}

// Check if required environment variables are set
function checkEnvironment() {
  const required = [
    'NEXT_PUBLIC_SANITY_PROJECT_ID',
    'NEXT_PUBLIC_SANITY_DATASET',
    'SANITY_API_TOKEN'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.log('💡 Add these to your .env.local file');
    return false;
  }
  
  return true;
}

// Run the import
if (require.main === module) {
  if (checkEnvironment()) {
    importCourseContent();
  }
}

module.exports = { importCourseContent, scanCourseDirectory };