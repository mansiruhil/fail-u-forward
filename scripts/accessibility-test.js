#!/usr/bin/env node

/**
 * Accessibility Testing Script for Fail U Forward
 * 
 * This script performs basic accessibility checks on the application.
 * Run with: node scripts/accessibility-test.js
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, checks) {
  if (!fs.existsSync(filePath)) {
    log(`❌ File not found: ${filePath}`, 'red');
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  let passed = 0;
  let total = checks.length;

  log(`\n📁 Checking: ${filePath}`, 'blue');

  checks.forEach(check => {
    const result = check.test(content);
    if (result) {
      log(`  ✅ ${check.name}`, 'green');
      passed++;
    } else {
      log(`  ❌ ${check.name}`, 'red');
      if (check.suggestion) {
        log(`     💡 ${check.suggestion}`, 'yellow');
      }
    }
  });

  log(`  📊 Score: ${passed}/${total} (${Math.round(passed/total*100)}%)`, passed === total ? 'green' : 'yellow');
  return passed === total;
}

// Define accessibility checks
const headerChecks = [
  {
    name: 'Has proper semantic header element',
    test: content => content.includes('role="banner"') || content.includes('<header'),
    suggestion: 'Add role="banner" or use <header> element'
  },
  {
    name: 'Navigation has proper ARIA labels',
    test: content => content.includes('aria-label') && content.includes('role="navigation"'),
    suggestion: 'Add aria-label and role="navigation" to navigation elements'
  },
  {
    name: 'Interactive elements have focus indicators',
    test: content => content.includes('focus:outline-none focus:ring-2') || content.includes('focus-visible:ring'),
    suggestion: 'Add focus:ring-2 classes to interactive elements'
  },
  {
    name: 'Images have aria-hidden or alt attributes',
    test: content => !content.includes('<img') || (content.includes('aria-hidden="true"') || content.includes('alt=')),
    suggestion: 'Add alt attributes to images or aria-hidden="true" for decorative images'
  },
  {
    name: 'Form inputs have proper labels',
    test: content => !content.includes('<input') || content.includes('htmlFor=') || content.includes('aria-label'),
    suggestion: 'Associate labels with form inputs using htmlFor or aria-label'
  }
];

const createPostChecks = [
  {
    name: 'Form has proper labels and descriptions',
    test: content => content.includes('htmlFor=') && content.includes('aria-describedby'),
    suggestion: 'Add proper labels and descriptions to form elements'
  },
  {
    name: 'Interactive buttons have ARIA labels',
    test: content => content.includes('aria-label') || content.includes('aria-describedby'),
    suggestion: 'Add aria-label or aria-describedby to buttons'
  },
  {
    name: 'File upload has proper accessibility',
    test: content => content.includes('aria-describedby') && content.includes('sr-only'),
    suggestion: 'Add screen reader descriptions for file upload'
  },
  {
    name: 'Loading states are announced',
    test: content => content.includes('sr-only') && (content.includes('Loading') || content.includes('Posting')),
    suggestion: 'Add screen reader announcements for loading states'
  },
  {
    name: 'Character limits are communicated',
    test: content => content.includes('maxLength'),
    suggestion: 'Add maxLength attributes to text inputs'
  }
];

const feedChecks = [
  {
    name: 'Has proper semantic structure',
    test: content => content.includes('role="main"') && content.includes('<main'),
    suggestion: 'Use semantic HTML elements like <main>, <section>, <article>'
  },
  {
    name: 'Lists use proper markup',
    test: content => content.includes('role="list"') || content.includes('<ul') || content.includes('<ol'),
    suggestion: 'Use proper list markup for post collections'
  },
  {
    name: 'Articles have proper headings',
    test: content => content.includes('<h1') || content.includes('<h2') || content.includes('<h3'),
    suggestion: 'Use proper heading hierarchy for content structure'
  },
  {
    name: 'Loading and error states are accessible',
    test: content => content.includes('role="status"') || content.includes('role="alert"'),
    suggestion: 'Add proper ARIA roles for status messages'
  },
  {
    name: 'Time elements are properly formatted',
    test: content => content.includes('dateTime=') || content.includes('<time'),
    suggestion: 'Use <time> elements with dateTime attributes for dates'
  }
];

const loginChecks = [
  {
    name: 'Form has proper validation',
    test: content => content.includes('aria-invalid') && content.includes('noValidate'),
    suggestion: 'Add aria-invalid and custom validation messages'
  },
  {
    name: 'Password visibility toggle is accessible',
    test: content => content.includes('aria-label') && content.includes('Show password'),
    suggestion: 'Add proper labels for password visibility toggle'
  },
  {
    name: 'Error messages are announced',
    test: content => content.includes('role="alert"') && content.includes('aria-live'),
    suggestion: 'Add role="alert" and aria-live to error messages'
  },
  {
    name: 'Social login buttons are descriptive',
    test: content => content.includes('Continue with') || content.includes('Sign in with'),
    suggestion: 'Make social login button text more descriptive'
  },
  {
    name: 'Form has proper autocomplete',
    test: content => content.includes('autoComplete='),
    suggestion: 'Add autoComplete attributes to form fields'
  }
];

// Run accessibility checks
function runAccessibilityTests() {
  log('🔍 Running Accessibility Tests for Fail U Forward', 'bold');
  log('=' .repeat(50), 'blue');

  const results = [];

  // Check each file
  results.push(checkFile('components/layout/header.tsx', headerChecks));
  results.push(checkFile('components/post/create-post.tsx', createPostChecks));
  results.push(checkFile('components/feed/feed.tsx', feedChecks));
  results.push(checkFile('app/login/page.tsx', loginChecks));

  // Check if accessibility CSS exists
  const accessibilityCssExists = fs.existsSync('app/accessibility.css');
  log(`\n📁 Checking: app/accessibility.css`, 'blue');
  if (accessibilityCssExists) {
    log(`  ✅ Accessibility CSS file exists`, 'green');
    results.push(true);
  } else {
    log(`  ❌ Accessibility CSS file missing`, 'red');
    log(`     💡 Create app/accessibility.css with focus indicators and accessibility styles`, 'yellow');
    results.push(false);
  }

  // Summary
  const passedTests = results.filter(Boolean).length;
  const totalTests = results.length;
  const percentage = Math.round(passedTests / totalTests * 100);

  log('\n' + '=' .repeat(50), 'blue');
  log('📊 ACCESSIBILITY TEST SUMMARY', 'bold');
  log(`Files passed: ${passedTests}/${totalTests}`, passedTests === totalTests ? 'green' : 'yellow');
  log(`Overall score: ${percentage}%`, percentage >= 90 ? 'green' : percentage >= 70 ? 'yellow' : 'red');

  if (percentage >= 90) {
    log('🎉 Excellent accessibility implementation!', 'green');
  } else if (percentage >= 70) {
    log('⚠️  Good progress, but some improvements needed', 'yellow');
  } else {
    log('🚨 Significant accessibility improvements required', 'red');
  }

  log('\n💡 Additional Recommendations:', 'blue');
  log('• Test with screen readers (NVDA, JAWS, VoiceOver)');
  log('• Run Lighthouse accessibility audit');
  log('• Test keyboard navigation thoroughly');
  log('• Verify color contrast ratios meet WCAG standards');
  log('• Test with users who have disabilities');

  return percentage >= 90;
}

// Run the tests
if (require.main === module) {
  const success = runAccessibilityTests();
  process.exit(success ? 0 : 1);
}

module.exports = { runAccessibilityTests };