#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = join(__dirname, '../src/data/scholarships.json');

const {
  INPUT_NAME,
  INPUT_ORGANIZATION,
  INPUT_AMOUNT,
  INPUT_DEADLINE,
  INPUT_APPLY_URL,
  INPUT_CATEGORY,
  INPUT_REGION,
  INPUT_DESCRIPTION,
  INPUT_SUBMITTER_NAME,
  INPUT_SUBMITTER_EMAIL,
} = process.env;

const required = { INPUT_NAME, INPUT_ORGANIZATION, INPUT_AMOUNT, INPUT_DEADLINE, INPUT_APPLY_URL, INPUT_CATEGORY, INPUT_REGION, INPUT_DESCRIPTION };
for (const [key, val] of Object.entries(required)) {
  if (!val?.trim()) { console.error(`Missing required input: ${key}`); process.exit(1); }
}

const timestamp = Date.now();
const amountNum = parseInt(INPUT_AMOUNT.replace(/[$,]/g, ''), 10);
const amountStr = '$' + amountNum.toLocaleString('en-CA');

const entry = {
  id: `submission-${timestamp}`,
  title: INPUT_NAME.trim(),
  organization: INPUT_ORGANIZATION.trim(),
  amount: amountStr,
  deadline: INPUT_DEADLINE.trim(),
  applyUrl: INPUT_APPLY_URL.trim(),
  category: INPUT_CATEGORY.trim(),
  region: INPUT_REGION.trim(),
  description: INPUT_DESCRIPTION.trim(),
  active: false,
  pendingReview: true,
  ...(INPUT_SUBMITTER_NAME?.trim() && { submitter_name: INPUT_SUBMITTER_NAME.trim() }),
  ...(INPUT_SUBMITTER_EMAIL?.trim() && { submitter_email: INPUT_SUBMITTER_EMAIL.trim() }),
};

const scholarships = JSON.parse(readFileSync(filePath, 'utf8'));
scholarships.push(entry);
writeFileSync(filePath, JSON.stringify(scholarships, null, 2) + '\n', 'utf8');

console.log(`Added submission: ${entry.id}`);
console.log('ENTRY_JSON=' + JSON.stringify(entry));
