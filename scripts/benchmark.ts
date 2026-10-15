const apps = Array.from({ length: 10000 }).map((_, i) => ({
  name: `App Name ${i}`,
  id: `app-id-${i}`
}));

const appSearch = "Name 500";

console.time("Before optimization");
for (let i = 0; i < 1000; i++) {
  apps.filter(app => !appSearch || app.name.toLowerCase().includes(appSearch.toLowerCase()) || app.id.toLowerCase().includes(appSearch.toLowerCase()));
}
console.timeEnd("Before optimization");

console.time("After optimization");
const searchLower = appSearch.toLowerCase();
for (let i = 0; i < 1000; i++) {
  apps.filter(app => !appSearch || app.name.toLowerCase().includes(searchLower) || app.id.toLowerCase().includes(searchLower));
}
console.timeEnd("After optimization");
