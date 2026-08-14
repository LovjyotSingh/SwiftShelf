const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

console.log('Generating SDE Masterclass PDF...');

const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4',
});

const pageWidth = doc.internal.pageSize.getWidth();
const pageHeight = doc.internal.pageSize.getHeight();
const margin = 15;
const contentWidth = pageWidth - margin * 2;
let cursorY = margin;

function checkPageBreak(neededHeight = 15) {
  if (cursorY + neededHeight > pageHeight - margin) {
    doc.addPage();
    cursorY = margin;
    // Header line on new pages
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(margin, 10, pageWidth - margin, 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('SDE Masterclass: Redis, Docker & CI/CD Pipelines | Lovjyot Singh', margin, 8);
    cursorY = 16;
  }
}

// COVER / HEADER
doc.setFillColor(15, 23, 42); // Dark slate
doc.rect(0, 0, pageWidth, 45, 'F');

doc.setFont('helvetica', 'bold');
doc.setFontSize(22);
doc.setTextColor(56, 189, 248); // Cyan accent
doc.text('SDE MASTERCLASS HANDBOOK', margin, 20);

doc.setFontSize(13);
doc.setTextColor(241, 245, 249); // Slate white
doc.text('Redis 0 to 100  |  Docker 0 to 100  |  CI/CD Pipelines 0 to 100', margin, 30);

doc.setFontSize(9);
doc.setTextColor(148, 163, 184);
doc.text('Production Architecture, Distributed Systems & Interview Blueprint  •  By Lovjyot Singh', margin, 38);

cursorY = 55;

function addSectionHeader(title, color = [99, 102, 241]) {
  checkPageBreak(20);
  doc.setFillColor(color[0], color[1], color[2]);
  doc.rect(margin, cursorY, contentWidth, 9, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(title.toUpperCase(), margin + 4, cursorY + 6.5);
  cursorY += 14;
}

function addSubHeader(title) {
  checkPageBreak(12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(title, margin, cursorY);
  cursorY += 6;
}

function addBodyParagraph(text) {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const lines = doc.splitTextToSize(text, contentWidth);
  for (let i = 0; i < lines.length; i++) {
    checkPageBreak(6);
    doc.text(lines[i], margin, cursorY);
    cursorY += 5;
  }
  cursorY += 2;
}

function addBulletPoint(title, description) {
  checkPageBreak(10);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`• ${title}: `, margin, cursorY);
  
  const titleWidth = doc.getTextWidth(`• ${title}: `);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  
  const descLines = doc.splitTextToSize(description, contentWidth - titleWidth);
  if (descLines.length > 0) {
    doc.text(descLines[0], margin + titleWidth, cursorY);
    cursorY += 5;
    for (let i = 1; i < descLines.length; i++) {
      checkPageBreak(6);
      doc.text(descLines[i], margin + 4, cursorY);
      cursorY += 5;
    }
  }
  cursorY += 1.5;
}

function addCodeBlock(codeText) {
  checkPageBreak(25);
  const lines = codeText.trim().split('\n');
  const blockHeight = lines.length * 4.5 + 6;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, cursorY, contentWidth, blockHeight, 'DF');
  
  doc.setFont('courier', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  let codeY = cursorY + 5;
  for (let line of lines) {
    doc.text(line, margin + 4, codeY);
    codeY += 4.5;
  }
  cursorY += blockHeight + 4;
}

// SECTION 1: REDIS 0 TO 100
addSectionHeader('SECTION 1: REDIS 0 TO 100 (IN-MEMORY DISTRIBUTED MASTERY)', [14, 165, 233]);

addSubHeader('1. Core Fundamentals & High-Speed Architecture');
addBodyParagraph('Redis (Remote Dictionary Server) is an open-source, in-memory, key-value data structure store delivering sub-millisecond latency at 100,000+ QPS.');
addBulletPoint('RAM Latency vs Disk', 'RAM access (~100ns) is 1,000x faster than NVMe SSDs (~100,000ns). Redis stores all active dataset objects directly in RAM.');
addBulletPoint('Single-Threaded Execution Core', 'Command execution runs on a single-threaded loop, eliminating context switching, race conditions, and thread locking overhead.');
addBulletPoint('Non-Blocking I/O Multiplexing', 'Uses Linux epoll / macOS kqueue Reactor event loops to process thousands of concurrent client socket connections without blocking.');
addBulletPoint('Redis 6.0+ I/O Threads', 'Socket payload reading and writing is offloaded to background threads while command execution remains 100% single-threaded.');

addSubHeader('2. Data Structures & C Implementations');
addBulletPoint('Strings', 'Binary safe up to 512MB. Implemented via SDS (Simple Dynamic String). Commands: SET, GET, INCRBY, SETNX.');
addBulletPoint('Hashes', 'Field-value objects. Implemented via listpack or hashtable. Ideal for user profiles & structured objects.');
addBulletPoint('Lists', 'Doubly-linked quicklist. Commands: LPUSH, RPOP, BRPOP (blocking queue for job processing).');
addBulletPoint('Sets', 'Unordered unique strings. Implemented via intset or hashtable. Commands: SADD, SINTER, SUNION.');
addBulletPoint('Sorted Sets (ZSet)', 'Ranked score-element pairs implemented via SkipList + HashTable (O(log N) operations). Used for leaderboards & rate limiters.');
addBulletPoint('HyperLogLog', 'Probabilistic cardinality estimator counting billions of unique items with 0.81% error rate in only 12KB RAM (PFADD, PFCOUNT).');

addSubHeader('3. Concurrency, Locks & Lua Scripting');
addBodyParagraph('To execute multi-command atomic transactions without network roundtrips, Redis supports Lua scripts via EVAL.');
addBulletPoint('SwiftShelf 2-Phase Concurrency Lock', 'Deducts inventory and creates a temporary 10-minute lock key in a single atomic Lua script to guarantee 0% overselling during flash sales.');
addCodeBlock(
`-- Atomic Lua Script Example
local current = tonumber(redis.call('GET', KEYS[1]))
if current and current >= tonumber(ARGV[1]) then
    redis.call('DECRBY', KEYS[1], ARGV[1])
    redis.call('SET', KEYS[2], ARGV[2], 'PX', ARGV[3])
    return 1 -- Success
else
    return 0 -- Out of Stock
end`
);
addBulletPoint('Eviction Policies', 'allkeys-lru (Least Recently Used), allkeys-lfu (Least Frequently Used), volatile-ttl, and noeviction (returns error on full RAM).');

addSubHeader('4. Persistence, Replication & Clustering');
addBulletPoint('RDB (Redis DB Snapshot)', 'Point-in-time binary snapshots (dump.rdb) via fork() child process. Fast startup, potential minor data loss on crash.');
addBulletPoint('AOF (Append-Only File)', 'Logs every write operation to appendonly.aof with fsync everysec policy. Zero/sub-1s data loss.');
addBulletPoint('Redis Cluster (Sharding)', 'Distributes datasets across 16,384 Hash Slots calculated via CRC16(key) % 16384 across master nodes.');

addSubHeader('5. System Design Interview Patterns & Pitfalls');
addBulletPoint('Cache Stampede (Thundering Herd)', 'When a hot key expires, thousands of requests hit DB simultaneously. Fix: Mutex lock or XFetch early expiration.');
addBulletPoint('Cache Penetration', 'Non-existent key queries bypass cache to DB. Fix: Cache null values (SET key "-1" EX 300) or use Bloom Filters.');
addBulletPoint('Cache Breakdown', 'A single hot key expires. Fix: Set no TTL or update key asynchronously in background.');

// SECTION 2: DOCKER 0 TO 100
addSectionHeader('SECTION 2: DOCKER 0 TO 100 (CONTAINERIZATION & RUNTIME ARCHITECTURE)', [99, 102, 241]);

addSubHeader('1. Containerization vs Virtualization');
addBodyParagraph('Virtual Machines emulate complete hardware with a Hypervisor and guest OS per VM. Containers share the Host OS Kernel, launching in milliseconds with lightweight RAM consumption.');
addBulletPoint('Linux Namespaces', 'Provides process isolation: PID (processes), NET (network interfaces), MNT (mount points), IPC (inter-process communication).');
addBulletPoint('Linux Control Groups (cgroups)', 'Enforces resource limits and metering: restricts CPU, Memory, Disk I/O per container.');

addSubHeader('2. Docker Engine Architecture');
addBulletPoint('Components', 'Docker CLI -> Docker REST API -> Docker Daemon (dockerd) -> containerd -> runc (OCI runtime).');
addBulletPoint('Union File Systems (Overlay2)', 'Container images consist of read-only stacked layers. Container instances write to a thin Copy-on-Write (CoW) top layer.');

addSubHeader('3. Dockerfile Best Practices & Multi-Stage Builds');
addBodyParagraph('Multi-stage builds separate compile-time build tools from final runtime images to minimize security attack vectors and image size (e.g. from 1GB down to 50MB).');
addCodeBlock(
`# Multi-Stage Dockerfile Example
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
USER node
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["node", "dist/index.js"]`
);
addBulletPoint('Layer Caching Optimization', 'Order Dockerfile directives from least to most frequently changed (COPY package.json before COPY .).');
addBulletPoint('Security Hardening', 'Never run container as root. Use USER node or USER 1001, run security scans (Trivy), and use .dockerignore.');

addSubHeader('4. Docker Networking & Volumes');
addBulletPoint('Bridge Network', 'Default isolated network driver for containers running on the same single host.');
addBulletPoint('Host Network', 'Removes network isolation between container and host for maximum performance.');
addBulletPoint('Volumes vs Bind Mounts', 'Volumes are managed by Docker in /var/lib/docker/volumes (best for production persistence). Bind mounts map exact host paths.');

addSubHeader('5. Docker Compose Multi-Container Orchestration');
addBodyParagraph('Docker Compose defines multi-container applications (Node.js API + Redis + MongoDB) in a single declarative docker-compose.yml file.');

// SECTION 3: CI/CD PIPELINES 0 TO 100
addSectionHeader('SECTION 3: CI/CD PIPELINES 0 TO 100 (AUTOMATED DEPLOYMENT & DEVOPS)', [16, 185, 129]);

addSubHeader('1. Core Concepts: CI vs CD vs CD');
addBulletPoint('Continuous Integration (CI)', 'Automated code compilation, linting, unit testing, and static analysis triggered on every git push or pull request.');
addBulletPoint('Continuous Delivery (CD)', 'Automates build artifacts (Docker images tagged with Git SHA to registry) & staging deployment; manual approval for prod.');
addBulletPoint('Continuous Deployment (CD)', 'Fully automated pipeline passing all tests and pushing code directly to production without manual intervention.');

addSubHeader('2. Complete Production Pipeline Lifecycle');
addBodyParagraph('Git Push -> Lint & Type Check -> Run Unit Tests -> Build OCI Image -> Security Vulnerability Scan -> Push to Registry (ECR/GHCR) -> Deploy -> Smoke Test -> Auto Rollback on Failure.');

addSubHeader('3. Enterprise Deployment Strategies');
addBulletPoint('Blue-Green Deployment', 'Two identical production environments (Blue=Active, Green=Idle). Traffic switched instantaneously at Load Balancer level. 0 downtime, instant rollback.');
addBulletPoint('Canary Deployment', 'Routes 5%-10% of live traffic to the new version. Monitors error rates & metrics before scaling to 100%.');
addBulletPoint('Rolling Update', 'Sequentially replaces old instances with new instances batch-by-batch across the cluster.');

addSubHeader('4. GitHub Actions Production Workflow');
addCodeBlock(
`name: Production CI/CD Pipeline
on:
  push:
    branches: [ main ]
jobs:
  build-test-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run test:unit
      - uses: docker/build-push-action@v5
        with:
          push: true
          tags: ghcr.io/lovjyotsingh/swiftshelf:\${{ github.sha }}`
);

addSubHeader('5. Pipeline Security & Best Practices');
addBulletPoint('Least Privilege Access', 'Scope GitHub Actions tokens (permissions: contents: read, packages: write).');
addBulletPoint('Secret Masking', 'Never hardcode credentials; inject secrets at runtime via environment variables.');
addBulletPoint('Ephemeral Runners', 'Use disposable, isolated runner instances for build environments to prevent cross-contamination.');

// Output paths
const targetPath1 = path.join(__dirname, '..', 'SDE_Masterclass_Redis_Docker_CICD.pdf');
const targetPath2 = path.join(__dirname, 'scratch', 'SDE_Masterclass_Redis_Docker_CICD.pdf');

const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
fs.writeFileSync(targetPath1, pdfBuffer);
try {
  fs.mkdirSync(path.join(__dirname, 'scratch'), { recursive: true });
  fs.writeFileSync(targetPath2, pdfBuffer);
} catch (e) {}

console.log('PDF Generation Complete!');
console.log(`Saved PDF to: ${targetPath1}`);
