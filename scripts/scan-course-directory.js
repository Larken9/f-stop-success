/**
 * Course Directory Scanner
 * 
 * This script scans your course directory and shows what content would be imported
 * Run this first to preview the structure before importing
 * 
 * Usage: npm run import:scan
 */

const fs = require('fs');
const path = require('path');
const config = require('./import-config');

// Helper function to extract number from filename/foldername
function extractNumber(name) {
  const match = name.match(/(\d+)/);
  return match ? parseInt(match[1]) : null;
}

// Get file size in a readable format
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const bytes = stats.size;
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  } catch (error) {
    return 'Unknown';
  }
}

// Preview file content
function previewFileContent(filePath, maxLines = 5) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').slice(0, maxLines);
    return lines.join('\n') + (content.split('\n').length > maxLines ? '\n...' : '');
  } catch (error) {
    return 'Could not read file';
  }
}

// Main scanning function
async function scanCourseDirectory() {
  const coursePath = config.COURSE_PATH || path.join(config.DOCUMENTS_PATH, config.COURSE_FOLDER_NAME);
  
  console.log('🔍 COURSE CONTENT SCANNER');
  console.log('========================');
  console.log('📁 Scanning directory:', coursePath);
  console.log();
  
  if (!fs.existsSync(coursePath)) {
    console.error('❌ Course directory not found!');
    console.log('💡 Expected location:', coursePath);
    console.log('💡 Please check the COURSE_FOLDER_NAME in import-config.js');
    console.log();
    
    // Try to find similar folders
    const documentsItems = fs.readdirSync(config.DOCUMENTS_PATH, { withFileTypes: true });
    const folders = documentsItems.filter(item => item.isDirectory()).map(item => item.name);
    const possibleMatches = folders.filter(name => 
      name.toLowerCase().includes('fstop') || 
      name.toLowerCase().includes('success') ||
      name.toLowerCase().includes('course')
    );
    
    if (possibleMatches.length > 0) {
      console.log('🤔 Did you mean one of these folders?');
      possibleMatches.forEach(folder => console.log(`   📂 ${folder}`));
    }
    
    return;
  }
  
  const structure = {
    courses: [],
    modules: [],
    lessons: [],
    otherFiles: []
  };
  
  let totalFiles = 0;
  let totalSize = 0;
  
  // Scan for course structure
  const items = fs.readdirSync(coursePath, { withFileTypes: true });
  
  console.log('📊 OVERVIEW');
  console.log('-----------');
  
  for (const item of items) {
    if (item.isDirectory()) {
      const modulePath = path.join(coursePath, item.name);
      const moduleNumber = extractNumber(item.name);
      
      console.log(`📂 Module: ${item.name} (Module #${moduleNumber || '?'})`);
      
      structure.modules.push({
        title: item.name,
        folderName: item.name,
        moduleNumber: moduleNumber || structure.modules.length + 1,
        path: modulePath
      });
      
      // Scan for lessons in this module
      const lessonFiles = fs.readdirSync(modulePath, { withFileTypes: true });
      let lessonCount = 0;
      
      for (const lessonFile of lessonFiles) {
        if (lessonFile.isFile()) {
          const ext = path.extname(lessonFile.name);
          const lessonPath = path.join(modulePath, lessonFile.name);
          const size = getFileSize(lessonPath);
          totalFiles++;
          
          if (config.SUPPORTED_EXTENSIONS.includes(ext)) {
            const lessonNumber = extractNumber(lessonFile.name);
            lessonCount++;
            
            console.log(`   📄 Lesson: ${lessonFile.name} (${size}) ✅`);
            
            structure.lessons.push({
              title: lessonFile.name.replace(/\.(txt|md|docx)$/, ''),
              fileName: lessonFile.name,
              lessonNumber: lessonNumber || structure.lessons.length + 1,
              moduleFolderName: item.name,
              path: lessonPath,
              size: size
            });
          } else {
            console.log(`   📄 ${lessonFile.name} (${size}) ⚠️  Unsupported format`);
            structure.otherFiles.push({
              name: lessonFile.name,
              path: lessonPath,
              size: size,
              type: 'unsupported'
            });
          }
        }
      }
      
      console.log(`   📊 ${lessonCount} importable lessons found`);
      console.log();
      
    } else if (item.isFile()) {
      const filePath = path.join(coursePath, item.name);
      const size = getFileSize(filePath);
      const ext = path.extname(item.name);
      totalFiles++;
      
      if (config.SUPPORTED_EXTENSIONS.includes(ext)) {
        console.log(`📄 Course-level file: ${item.name} (${size}) ✅`);
      } else {
        console.log(`📄 Other file: ${item.name} (${size}) ⚠️`);
        structure.otherFiles.push({
          name: item.name,
          path: filePath,
          size: size,
          type: 'other'
        });
      }
    }
  }
  
  // Summary
  console.log('📈 IMPORT SUMMARY');
  console.log('------------------');
  console.log(`📂 Modules found: ${structure.modules.length}`);
  console.log(`📖 Lessons found: ${structure.lessons.length}`);
  console.log(`📄 Total files: ${totalFiles}`);
  console.log(`⚠️  Unsupported files: ${structure.otherFiles.length}`);
  console.log();
  
  if (structure.lessons.length === 0) {
    console.log('❌ No importable lessons found!');
    console.log('💡 Make sure your lesson files have these extensions: ' + config.SUPPORTED_EXTENSIONS.join(', '));
    return;
  }
  
  // Detailed preview
  console.log('📋 DETAILED PREVIEW');
  console.log('--------------------');
  
  structure.modules.forEach((module, moduleIndex) => {
    console.log(`\n${moduleIndex + 1}. MODULE: ${module.title}`);
    console.log(`   🔢 Module Number: ${module.moduleNumber}`);
    console.log(`   📁 Folder: ${module.folderName}`);
    
    const moduleLessons = structure.lessons.filter(lesson => 
      lesson.moduleFolderName === module.folderName
    );
    
    moduleLessons.forEach((lesson, lessonIndex) => {
      console.log(`   ${lessonIndex + 1}.${lesson.lessonNumber} ${lesson.title}`);
      console.log(`      📄 File: ${lesson.fileName} (${lesson.size})`);
      
      // Show content preview for first lesson
      if (moduleIndex === 0 && lessonIndex === 0) {
        console.log(`      👁️  Content preview:`);
        const preview = previewFileContent(lesson.path);
        console.log(`      ${preview.replace(/\n/g, '\n      ')}`);
      }
    });
  });
  
  if (structure.otherFiles.length > 0) {
    console.log('\n⚠️  UNSUPPORTED FILES');
    console.log('----------------------');
    structure.otherFiles.forEach(file => {
      console.log(`📄 ${file.name} (${file.size}) - ${file.type}`);
    });
    console.log('\n💡 These files will be skipped during import');
  }
  
  console.log('\n🚀 NEXT STEPS');
  console.log('---------------');
  console.log('1. Review the structure above');
  console.log('2. Make sure all lesson files are in supported formats (.txt, .md)');
  console.log('3. Add your Sanity API token to .env.local: SANITY_API_TOKEN=your_token');
  console.log('4. Run the import: npm run import:course');
  console.log('\n💡 Get your Sanity API token from: https://sanity.io/manage');
  
  return structure;
}

// Run the scanner
if (require.main === module) {
  scanCourseDirectory();
}

module.exports = { scanCourseDirectory };