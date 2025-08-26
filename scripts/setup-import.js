/**
 * Import Setup Helper
 * 
 * This script helps you configure the course import system
 * 
 * Usage: node scripts/setup-import.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const os = require('os');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function findCourseFolder() {
  const documentsPath = path.join(os.homedir(), 'Documents');
  console.log('🔍 Looking for course folders in:', documentsPath);
  
  try {
    const items = fs.readdirSync(documentsPath, { withFileTypes: true });
    const folders = items.filter(item => item.isDirectory()).map(item => item.name);
    
    const possibleCourses = folders.filter(name => 
      name.toLowerCase().includes('fstop') || 
      name.toLowerCase().includes('f-stop') ||
      name.toLowerCase().includes('success') ||
      name.toLowerCase().includes('course') ||
      name.toLowerCase().includes('photography')
    );
    
    if (possibleCourses.length > 0) {
      console.log('\n📂 Found these potential course folders:');
      possibleCourses.forEach((folder, index) => {
        console.log(`${index + 1}. ${folder}`);
      });
      console.log(`${possibleCourses.length + 1}. Other (specify custom path)`);
      console.log(`${possibleCourses.length + 2}. Skip folder detection`);
      
      const choice = await question('\nWhich folder contains your course content? (Enter number): ');
      const choiceNum = parseInt(choice);
      
      if (choiceNum >= 1 && choiceNum <= possibleCourses.length) {
        return possibleCourses[choiceNum - 1];
      } else if (choiceNum === possibleCourses.length + 1) {
        const customPath = await question('Enter full path to your course folder: ');
        return customPath;
      }
    } else {
      console.log('\n❌ No obvious course folders found in Documents');
      const hasFolder = await question('\nDo you have a course folder elsewhere? (y/n): ');
      
      if (hasFolder.toLowerCase().startsWith('y')) {
        const customPath = await question('Enter full path to your course folder: ');
        return customPath;
      }
    }
  } catch (error) {
    console.error('Error scanning Documents folder:', error.message);
  }
  
  return null;
}

async function checkSanityToken() {
  const envPath = path.join(process.cwd(), '.env.local');
  let hasToken = false;
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    hasToken = envContent.includes('SANITY_API_TOKEN');
  }
  
  if (!hasToken) {
    console.log('\n🔑 SANITY API TOKEN SETUP');
    console.log('------------------------');
    console.log('You need a Sanity API token to import content.');
    console.log('1. Go to: https://sanity.io/manage');
    console.log('2. Select your project');
    console.log('3. Go to Settings → API → Tokens');
    console.log('4. Create new token with Editor permissions');
    console.log('5. Copy the token');
    
    const token = await question('\nPaste your Sanity API token here: ');
    
    if (token && token.trim()) {
      const tokenLine = `\nSANITY_API_TOKEN=${token.trim()}\n`;
      fs.appendFileSync(envPath, tokenLine);
      console.log('✅ Token added to .env.local');
      return true;
    } else {
      console.log('❌ No token provided');
      return false;
    }
  } else {
    console.log('✅ Sanity API token found in .env.local');
    return true;
  }
}

async function updateConfig(folderPath) {
  const configPath = path.join(process.cwd(), 'scripts', 'import-config.js');
  
  if (!fs.existsSync(configPath)) {
    console.log('❌ Config file not found:', configPath);
    return false;
  }
  
  let configContent = fs.readFileSync(configPath, 'utf8');
  
  if (path.isAbsolute(folderPath)) {
    // Use absolute path
    const escapedPath = folderPath.replace(/\\/g, '\\\\');
    configContent = configContent.replace(
      /COURSE_FOLDER_NAME: '[^']*'/,
      `COURSE_FOLDER_NAME: 'Custom Path'`
    );
    configContent = configContent.replace(
      /\/\/ COURSE_PATH: .*/,
      `COURSE_PATH: '${escapedPath}',`
    );
  } else {
    // Use folder name in Documents
    configContent = configContent.replace(
      /COURSE_FOLDER_NAME: '[^']*'/,
      `COURSE_FOLDER_NAME: '${folderPath}'`
    );
  }
  
  fs.writeFileSync(configPath, configContent);
  console.log('✅ Config updated');
  return true;
}

async function checkFolderStructure(folderPath) {
  const fullPath = path.isAbsolute(folderPath) ? 
    folderPath : 
    path.join(os.homedir(), 'Documents', folderPath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ Folder not found: ${fullPath}`);
    return false;
  }
  
  console.log(`\n📁 Checking folder structure: ${fullPath}`);
  
  const items = fs.readdirSync(fullPath, { withFileTypes: true });
  const folders = items.filter(item => item.isDirectory());
  const files = items.filter(item => item.isFile());
  
  console.log(`📂 Found ${folders.length} folders (potential modules)`);
  console.log(`📄 Found ${files.length} files`);
  
  if (folders.length === 0) {
    console.log('⚠️  No module folders found. Make sure your content is organized in folders.');
    return false;
  }
  
  // Check first folder for lessons
  const firstFolder = folders[0];
  const firstFolderPath = path.join(fullPath, firstFolder.name);
  const lessonFiles = fs.readdirSync(firstFolderPath, { withFileTypes: true })
    .filter(item => item.isFile() && (
      item.name.endsWith('.txt') || 
      item.name.endsWith('.md')
    ));
  
  console.log(`📖 Sample module "${firstFolder.name}" has ${lessonFiles.length} lesson files`);
  
  if (lessonFiles.length === 0) {
    console.log('⚠️  No .txt or .md lesson files found. Convert your lessons to text format.');
    return false;
  }
  
  console.log('✅ Folder structure looks good!');
  return true;
}

async function main() {
  console.log('🚀 COURSE IMPORT SETUP');
  console.log('======================');
  console.log('This wizard will help you set up the course import system.\n');
  
  try {
    // Step 1: Find course folder
    console.log('📂 STEP 1: LOCATE COURSE FOLDER');
    console.log('--------------------------------');
    
    const folderPath = await findCourseFolder();
    
    if (!folderPath) {
      console.log('\n❌ Setup cancelled. No course folder specified.');
      rl.close();
      return;
    }
    
    // Step 2: Check folder structure
    console.log('\n📋 STEP 2: VERIFY FOLDER STRUCTURE');
    console.log('----------------------------------');
    
    const structureOk = await checkFolderStructure(folderPath);
    
    if (!structureOk) {
      console.log('\n⚠️  Folder structure needs work. Please organize your content and try again.');
      rl.close();
      return;
    }
    
    // Step 3: Update config
    console.log('\n⚙️  STEP 3: UPDATE CONFIGURATION');
    console.log('-------------------------------');
    
    await updateConfig(folderPath);
    
    // Step 4: Setup Sanity token
    console.log('\n🔐 STEP 4: CONFIGURE SANITY ACCESS');
    console.log('----------------------------------');
    
    const tokenOk = await checkSanityToken();
    
    if (!tokenOk) {
      console.log('\n❌ Setup incomplete. Sanity API token required.');
      rl.close();
      return;
    }
    
    // Final steps
    console.log('\n🎉 SETUP COMPLETE!');
    console.log('==================');
    console.log('Your course import system is now configured.');
    console.log('\nNext steps:');
    console.log('1. Preview your content: npm run import:scan');
    console.log('2. Import your content: npm run import:course');
    console.log('3. Check Sanity Studio to see your imported content');
    console.log('\n💡 Need help? Check COURSE_IMPORT_GUIDE.md');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
  }
  
  rl.close();
}

if (require.main === module) {
  main();
}