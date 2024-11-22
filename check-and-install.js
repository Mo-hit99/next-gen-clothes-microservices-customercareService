import { existsSync }  from 'fs'
import { execSync }  from 'child_process';

if (!existsSync('./node_modules')) {
    console.log('node_modules not found. Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
} else {
    console.log('node_modules already exists. Skipping npm install.');
}
