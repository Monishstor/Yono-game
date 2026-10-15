const NUM_APPS = 5000;
const NUM_ISSUES = 20000;

interface App { id: string; name: string; }
interface Issue { id: string; appId: string; }

const apps: App[] = Array.from({ length: NUM_APPS }, (_, i) => ({ id: `app-${i}`, name: `App ${i}` }));
const issues: Issue[] = Array.from({ length: NUM_ISSUES }, (_, i) => ({ id: `issue-${i}`, appId: `app-${Math.floor(Math.random() * NUM_APPS)}` }));

console.log(`Benchmarking with ${NUM_APPS} apps and ${NUM_ISSUES} issues`);

// Approach 1: Filter inside loop (Current)
const start1 = performance.now();
let totalIssues1 = 0;
for (const app of apps) {
  const appIssues = issues.filter(i => i.appId === app.id);
  totalIssues1 += appIssues.length;
}
const end1 = performance.now();
const time1 = end1 - start1;
console.log(`Current O(N*M): ${time1.toFixed(2)}ms`);

// Approach 2: Map (Optimized)
const start2 = performance.now();
let totalIssues2 = 0;
const issuesByAppId = new Map<string, Issue[]>();
for (const issue of issues) {
  if (!issuesByAppId.has(issue.appId)) {
    issuesByAppId.set(issue.appId, []);
  }
  issuesByAppId.get(issue.appId)!.push(issue);
}
for (const app of apps) {
  const appIssues = issuesByAppId.get(app.id) || [];
  totalIssues2 += appIssues.length;
}
const end2 = performance.now();
const time2 = end2 - start2;
console.log(`Optimized O(N+M): ${time2.toFixed(2)}ms`);
console.log(`Speedup: ${(time1 / time2).toFixed(2)}x`);
