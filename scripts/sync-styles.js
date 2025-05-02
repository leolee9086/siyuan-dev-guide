const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// --- Configuration ---
// Resolve paths relative to the script's location
const scriptDir = __dirname;
const devGuideRoot = path.resolve(scriptDir, '..'); // Root of siyuan-dev-guide
const siyuanAppDir = path.resolve(devGuideRoot, '../siyuan/app'); // Root of siyuan/app
const targetBaseCssFile = path.resolve(devGuideRoot, 'assets/style.css'); // Target BASE CSS file in dev guide
const sourceThemeCssFile = path.resolve(siyuanAppDir, 'appearance/themes/daylight/theme.css'); // Source theme CSS
const targetThemeDir = path.resolve(devGuideRoot, 'assets/themes'); // Target directory for themes
const targetThemeCssFile = path.resolve(targetThemeDir, 'daylight.css'); // Target theme CSS file in dev guide
const buildCommand = 'pnpm run build:desktop'; // Build command in siyuan/app
const buildOutputDir = path.join(siyuanAppDir, 'stage/build/desktop'); // Expected output dir for desktop build
// --- End Configuration ---

console.log(`[Sync Styles] Starting style sync...`);
console.log(`[Sync Styles] Development Guide Root: ${devGuideRoot}`);
console.log(`[Sync Styles] Siyuan App Directory: ${siyuanAppDir}`);
console.log(`[Sync Styles] Build Output Directory: ${buildOutputDir}`);
console.log(`[Sync Styles] Target Base CSS File: ${targetBaseCssFile}`);
console.log(`[Sync Styles] Source Theme CSS File: ${sourceThemeCssFile}`);
console.log(`[Sync Styles] Target Theme Directory: ${targetThemeDir}`);
console.log(`[Sync Styles] Target Theme CSS File: ${targetThemeCssFile}`);

try {
    // 1. Navigate to siyuan/app and install/build
    console.log(`[Sync Styles] Running build command in ${siyuanAppDir}...`);
    // Using execSync for simplicity, consider async exec for long builds if needed
    // Ensure pnpm is in the system PATH or adjust the command accordingly
    execSync(`pnpm install`, { cwd: siyuanAppDir, stdio: 'inherit' });
    console.log(`[Sync Styles] Dependencies installed/updated.`);
    execSync(buildCommand, { cwd: siyuanAppDir, stdio: 'inherit' });
    console.log(`[Sync Styles] Build command finished.`);

    // 2. Find the generated CSS file (e.g., base.xxxxxxxx.css)
    console.log(`[Sync Styles] Searching for CSS file in ${buildOutputDir}...`);
    let sourceCssFile = null;
    let sourceCssFileName = null;
    if (fs.existsSync(buildOutputDir)) {
        const files = fs.readdirSync(buildOutputDir);
        // Find the CSS file matching the pattern "base.[hash].css"
        sourceCssFileName = files.find(file => /^base\.[a-f0-9]+\.css$/.test(file));
        if (sourceCssFileName) {
            sourceCssFile = path.join(buildOutputDir, sourceCssFileName);
            console.log(`[Sync Styles] Found source CSS file: ${sourceCssFileName}`);
        } else {
            console.error(`[Sync Styles] Error: No CSS file matching 'base.[hash].css' found in ${buildOutputDir}.`);
            process.exit(1);
        }
    } else {
        console.error(`[Sync Styles] Error: Build output directory ${buildOutputDir} not found.`);
        process.exit(1);
    }

    // 3. Copy the BASE CSS file
    console.log(`[Sync Styles] Copying ${sourceCssFileName} to ${path.basename(targetBaseCssFile)}...`);
    fs.copyFileSync(sourceCssFile, targetBaseCssFile);
    console.log(`[Sync Styles] Base CSS copied.`);

    // 4. Copy the THEME CSS file
    if (fs.existsSync(sourceThemeCssFile)) {
        // Ensure target directory exists
        if (!fs.existsSync(targetThemeDir)) {
            console.log(`[Sync Styles] Creating theme directory: ${targetThemeDir}`);
            fs.mkdirSync(targetThemeDir, { recursive: true });
        }

        console.log(`[Sync Styles] Copying ${path.basename(sourceThemeCssFile)} to ${path.relative(devGuideRoot, targetThemeCssFile)}...`);
        fs.copyFileSync(sourceThemeCssFile, targetThemeCssFile);
        console.log(`[Sync Styles] Theme CSS copied.`);
    } else {
        console.error(`[Sync Styles] Error: Source theme file ${sourceThemeCssFile} not found.`);
        // Decide if this should be a fatal error or just a warning
        // For now, let's make it fatal as the theme is crucial
        process.exit(1);
    }

    console.log(`[Sync Styles] Style sync completed successfully!`);

} catch (error) {
    console.error(`[Sync Styles] Error during style sync:`, error);
    process.exit(1);
} 