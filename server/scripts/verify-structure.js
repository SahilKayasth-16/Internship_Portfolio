const fs = require('fs');
const path = require('path');

const SERVER_ROOT = path.resolve(__dirname, '..');

const REQUIRED_FILES = [
  'server.js',
  'app.js',
  'config/env.js',
  'config/db.js',
  'config/cors.js',
  'controllers/healthController.js',
  'routes/index.js',
  'routes/healthRoutes.js',
  'middleware/errorHandler.js',
  'middleware/rateLimiters.js',
  'utils/ApiError.js',
  'utils/asyncHandler.js',
  'utils/slugify.js',
  'models/User.js',
  'models/About.js',
  'models/Skill.js',
  'models/Project.js',
  'models/Blog.js',
  'models/Experience.js',
  'models/Testimonial.js',
  'models/Service.js',
  'models/Message.js',
  'models/Media.js',
  'models/index.js',
  'scripts/verify-structure.js',
];

// Words assembled dynamically to avoid self-flagging during text inspection
const FORBIDDEN_WORDS = [
  'TO' + 'DO',
  'FIX' + 'ME',
  'implement' + ' ' + 'later',
  'place' + 'holder',
];

async function runVerification() {
  const failures = [];

  console.log('='.repeat(70));
  console.log('STEP 1: Checking Part 1 file tree existence, size >= 200 bytes, forbidden words');
  console.log('='.repeat(70));
  console.log(
    'Path'.padEnd(35) + ' | ' + 'Bytes'.padStart(8) + ' | ' + 'Status'
  );
  console.log('-'.repeat(70));

  for (const relPath of REQUIRED_FILES) {
    const fullPath = path.join(SERVER_ROOT, relPath);
    if (!fs.existsSync(fullPath)) {
      failures.push(`File missing: ${relPath}`);
      console.log(relPath.padEnd(35) + ' | ' + '0'.padStart(8) + ' | FAIL (missing)');
      continue;
    }

    const stats = fs.statSync(fullPath);
    const content = fs.readFileSync(fullPath, 'utf8');
    let hasForbidden = false;
    let forbiddenMatched = '';

    for (const word of FORBIDDEN_WORDS) {
      if (content.includes(word)) {
        hasForbidden = true;
        forbiddenMatched = word;
        break;
      }
    }

    if (stats.size < 200) {
      failures.push(`File too small (< 200 bytes): ${relPath} (${stats.size} bytes)`);
      console.log(
        relPath.padEnd(35) +
          ' | ' +
          String(stats.size).padStart(8) +
          ' | FAIL (too small)'
      );
    } else if (hasForbidden) {
      failures.push(
        `Forbidden word detected in ${relPath}: "${forbiddenMatched}"`
      );
      console.log(
        relPath.padEnd(35) +
          ' | ' +
          String(stats.size).padStart(8) +
          ' | FAIL (forbidden word)'
      );
    } else {
      console.log(
        relPath.padEnd(35) +
          ' | ' +
          String(stats.size).padStart(8) +
          ' | OK'
      );
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('STEP 2: Checking server.js constraints');
  console.log('='.repeat(70));
  const serverPath = path.join(SERVER_ROOT, 'server.js');
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  const serverLines = serverContent.split('\n');

  console.log(`server.js line count: ${serverLines.length}`);
  if (serverLines.length >= 50) {
    failures.push(`server.js must be under 50 lines (got ${serverLines.length})`);
  }

  const disallowedPatterns = [
    'mongoose.model(',
    'app.get(',
    'new mongoose.Schema',
    'cors(',
  ];

  for (const pattern of disallowedPatterns) {
    if (serverContent.includes(pattern)) {
      failures.push(`server.js contains disallowed pattern: "${pattern}"`);
    } else {
      console.log(`Disallowed pattern check passed: "${pattern}" not found.`);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('STEP 3: Checking models export through models/index.js');
  console.log('='.repeat(70));
  const models = require('../models');
  const modelKeys = Object.keys(models);
  console.log(`Found ${modelKeys.length} models: ${modelKeys.join(', ')}`);
  if (modelKeys.length !== 10) {
    failures.push(`models/index.js must export exactly 10 models (got ${modelKeys.length})`);
  }

  console.log('\n' + '='.repeat(70));
  console.log('STEP 4: Testing model validations without database connection');
  console.log('='.repeat(70));

  // 4a. Project slug generation
  try {
    const project = new models.Project({ title: 'Test Project' });
    await project.validate();
    if (project.slug === 'test-project') {
      console.log(`Project slug generation: OK (slug: "${project.slug}")`);
    } else {
      failures.push(`Project slug mismatch: expected "test-project", got "${project.slug}"`);
    }
  } catch (err) {
    failures.push(`Project validation threw error: ${err.message}`);
  }

  // 4b. Blog slug and readTime generation
  try {
    const wordList = [];
    for (let i = 0; i < 400; i++) {
      wordList.push('word' + i);
    }
    const blog = new models.Blog({
      title: 'Sample Tech Article',
      content: wordList.join(' '),
    });
    await blog.validate();
    const slugExpected = 'sample-tech-article';
    if (blog.slug === slugExpected && blog.readTime === 2) {
      console.log(
        `Blog slug and readTime: OK (slug: "${blog.slug}", readTime: ${blog.readTime})`
      );
    } else {
      failures.push(
        `Blog validation mismatch: slug="${blog.slug}", readTime=${blog.readTime}`
      );
    }
  } catch (err) {
    failures.push(`Blog validation threw error: ${err.message}`);
  }

  // 4c. User invalid email validationSync error
  try {
    const user = new models.User({
      name: 'Invalid Email User',
      email: 'not-an-email',
      password: 'validPassword123',
    });
    const syncErr = user.validateSync();
    if (syncErr && syncErr.errors && syncErr.errors.email) {
      console.log('User invalid email check: OK (reported validation error on email)');
    } else {
      failures.push('User did not report validation error on invalid email');
    }
  } catch (err) {
    failures.push(`User validateSync failed unexpectedly: ${err.message}`);
  }

  // 4d. Skill with only name validates
  try {
    const skill = new models.Skill({ name: 'Node.js' });
    const skillErr = skill.validateSync();
    if (!skillErr) {
      console.log('Skill with only name check: OK (validated cleanly without errors)');
    } else {
      failures.push(`Skill with only name validation failed: ${skillErr.message}`);
    }
  } catch (err) {
    failures.push(`Skill validation threw error: ${err.message}`);
  }

  console.log('\n' + '='.repeat(70));
  console.log('VERIFICATION SUMMARY');
  console.log('='.repeat(70));

  if (failures.length === 0) {
    console.log('ALL VERIFICATION CHECKS PASSED SUCCESSFULLY (0 failures).');
    process.exit(0);
  } else {
    console.error(`VERIFICATION FAILED (${failures.length} errors found):`);
    for (const failure of failures) {
      console.error(` - [FAIL] ${failure}`);
    }
    process.exit(1);
  }
}

runVerification().catch((err) => {
  console.error('Unhandled verification error:', err);
  process.exit(1);
});

