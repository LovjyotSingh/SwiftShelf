import sys
import os

# Minimal PDF Generator in Pure Python Standard Library
class SimplePDF:
    def __init__(self, filename):
        self.filename = filename
        self.objects = []
        self.pages = []

    def build_pdf(self, title, content_sections):
        pdf_lines = []
        pdf_lines.append("%PDF-1.4")
        
        # Object 1: Catalog
        catalog = "<< /Type /Catalog /Pages 2 0 R >>"
        # Object 2: Pages
        # Object 3: Font
        font = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>"
        font_bold = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>"
        font_code = "<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>"

        # Construct pages text content
        # We will split text into pages cleanly
        pages_objs = []
        
        # Build story streams
        page_contents = []
        current_page_stream = []
        y = 780

        def start_new_page():
            nonlocal y, current_page_stream
            if current_page_stream:
                page_contents.append(current_page_stream)
            current_page_stream = []
            y = 780
            # Header
            current_page_stream.append("0.5 0.5 0.5 rg")
            current_page_stream.append("BT /F1 8 Tf 40 815 Td (SDE Masterclass Handbook: Redis, Docker & CI/CD Pipelines | Lovjyot Singh) Tj ET")
            current_page_stream.append("0.8 0.8 0.8 RG 0.5 w 40 805 m 555 805 l S")

        start_new_page()

        # Cover Banner
        current_page_stream.append("0.06 0.09 0.16 rg 40 730 515 55 re f")
        current_page_stream.append("0.22 0.74 0.97 rg BT /F2 20 Tf 55 760 Td (SDE MASTERCLASS HANDBOOK) Tj ET")
        current_page_stream.append("0.95 0.96 0.98 rg BT /F2 11 Tf 55 742 Td (Redis 0 to 100   |   Docker 0 to 100   |   CI/CD Pipelines 0 to 100) Tj ET")
        current_page_stream.append("0.58 0.64 0.72 rg BT /F1 8 Tf 55 733 Td (Production Architecture, Distributed Systems & Interview Blueprint   .   By Lovjyot Singh) Tj ET")
        y = 710

        for sec_title, items in content_sections:
            if y < 120:
                start_new_page()

            # Section Header Box
            current_page_stream.append("0.24 0.26 0.75 rg 40 " + str(y - 18) + " 515 22 re f")
            current_page_stream.append("1.0 1.0 1.0 rg BT /F2 11 Tf 48 " + str(y - 13) + " Td (" + sec_title.upper() + ") Tj ET")
            y -= 30

            for item_type, arg1, arg2 in items:
                if y < 80:
                    start_new_page()

                if item_type == 'sub':
                    current_page_stream.append("0.06 0.09 0.16 rg BT /F2 11 Tf 40 " + str(y) + " Td (" + arg1 + ") Tj ET")
                    y -= 16
                elif item_type == 'text':
                    # wrap text
                    lines = self.wrap_text(arg1, 95)
                    for l in lines:
                        if y < 60: start_new_page()
                        current_page_stream.append("0.2 0.25 0.33 rg BT /F1 9 Tf 40 " + str(y) + " Td (" + self.escape_pdf(l) + ") Tj ET")
                        y -= 12
                    y -= 4
                elif item_type == 'bullet':
                    lines = self.wrap_text(arg2, 85)
                    if y < 60: start_new_page()
                    current_page_stream.append("0.06 0.09 0.16 rg BT /F2 9.5 Tf 40 " + str(y) + " Td (- " + self.escape_pdf(arg1) + ":) Tj ET")
                    
                    # desc
                    if lines:
                        current_page_stream.append("0.2 0.25 0.33 rg BT /F1 9 Tf 130 " + str(y) + " Td (" + self.escape_pdf(lines[0]) + ") Tj ET")
                        y -= 12
                        for l in lines[1:]:
                            if y < 60: start_new_page()
                            current_page_stream.append("0.2 0.25 0.33 rg BT /F1 9 Tf 50 " + str(y) + " Td (" + self.escape_pdf(l) + ") Tj ET")
                            y -= 12
                    y -= 3
                elif item_type == 'code':
                    code_lines = arg1.strip().split('\n')
                    block_h = len(code_lines) * 11 + 10
                    if y - block_h < 50: start_new_page()
                    current_page_stream.append("0.95 0.96 0.98 rg 40 " + str(y - block_h) + " 515 " + str(block_h) + " re f")
                    current_page_stream.append("0.8 0.85 0.9 RG 0.5 w 40 " + str(y - block_h) + " 515 " + str(block_h) + " re S")
                    
                    cy = y - 12
                    for cl in code_lines:
                        current_page_stream.append("0.1 0.1 0.15 rg BT /F3 8 Tf 48 " + str(cy) + " Td (" + self.escape_pdf(cl) + ") Tj ET")
                        cy -= 11
                    y -= (block_h + 8)

        if current_page_stream:
            page_contents.append(current_page_stream)

        # Write PDF object streams
        objects = []
        # obj 1: catalog
        objects.append("<< /Type /Catalog /Pages 2 0 R >>")
        
        # obj 2: pages placeholder (will update)
        page_obj_ids = [str(4 + i * 2) for i in range(len(page_contents))]
        pages_dict = "<< /Type /Pages /Kids [" + " ".join([p + " 0 R" for p in page_obj_ids]) + "] /Count " + str(len(page_contents)) + " >>"
        objects.append(pages_dict)
        
        # obj 3: fonts
        font_res = "<< /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >> /F3 << /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >> >>"
        objects.append(font_res)

        for i, page_cmds in enumerate(page_contents):
            stream_str = "\n".join(page_cmds)
            stream_len = len(stream_str)
            
            # Content Stream Obj
            content_obj_id = len(objects) + 2
            content_obj = f"<< /Length {stream_len} >>\nstream\n{stream_str}\nendstream"
            objects.append(content_obj)
            
            # Page Obj
            page_obj_id = len(objects) + 2
            page_obj = f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font 3 0 R >> /Contents {content_obj_id - 1} 0 R >>"
            objects.append(page_obj)

        # Build PDF Binary Body & Cross Reference Table
        output = ["%PDF-1.4\n"]
        offsets = [0]
        
        for idx, obj in enumerate(objects, 1):
            offsets.append(sum(len(s.encode('latin1')) for s in output))
            output.append(f"{idx} 0 obj\n{obj}\nendobj\n\n")

        xref_offset = sum(len(s.encode('latin1')) for s in output)
        output.append(f"xref\n0 {len(objects) + 1}\n0000000000 65535 f \n")
        for off in offsets[1:]:
            output.append(f"{off:010d} 00000 n \n")

        output.append(f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref_offset}\n%%EOF\n")

        with open(self.filename, "wb") as f:
            f.write("".join(output).encode('latin1'))

        print(f"Successfully generated PDF: {self.filename}")

    def escape_pdf(self, s):
        return s.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')

    def wrap_text(self, text, max_chars=85):
        words = text.split()
        lines = []
        cur = ""
        for w in words:
            if len(cur) + len(w) + 1 <= max_chars:
                cur += (" " if cur else "") + w
            else:
                lines.append(cur)
                cur = w
        if cur:
            lines.append(cur)
        return lines

# Build Data
sections = [
    ("Section 1: Redis 0 to 100 (In-Memory Distributed Mastery)", [
        ("sub", "1. Core Fundamentals & High-Speed Architecture", ""),
        ("text", "Redis (Remote Dictionary Server) is an open-source, in-memory key-value store delivering sub-millisecond latency at 100,000+ QPS.", ""),
        ("bullet", "RAM Latency vs Disk", "RAM access (~100ns) is 1,000x faster than NVMe SSDs (~100,000ns). Redis stores datasets directly in RAM."),
        ("bullet", "Single-Threaded Core", "Command execution runs on a single-threaded loop, eliminating context switching, race conditions, and mutex overhead."),
        ("bullet", "Non-Blocking I/O", "Uses Linux epoll / macOS kqueue Reactor event loops to process thousands of socket connections without blocking."),
        ("bullet", "Redis 6.0+ I/O Threads", "Network payload reading/writing is offloaded to background threads while execution core stays single-threaded."),

        ("sub", "2. Data Structures & C Implementations", ""),
        ("bullet", "Strings", "Binary safe up to 512MB. Implemented via SDS (Simple Dynamic String). Commands: SET, GET, INCRBY, SETNX."),
        ("bullet", "Hashes", "Field-value objects. Implemented via listpack or hashtable. Ideal for user profiles & structured objects."),
        ("bullet", "Lists", "Doubly-linked quicklist. Commands: LPUSH, RPOP, BRPOP (blocking queue for job processing)."),
        ("bullet", "Sets", "Unordered unique strings. Implemented via intset or hashtable. Commands: SADD, SINTER, SUNION."),
        ("bullet", "Sorted Sets (ZSet)", "Ranked score-element pairs implemented via SkipList + HashTable O(log N). Used for leaderboards & rate limiters."),
        ("bullet", "HyperLogLog", "Probabilistic cardinality estimator counting billions of items with 0.81% error rate in 12KB RAM (PFADD, PFCOUNT)."),

        ("sub", "3. Concurrency, Locks & Lua Scripting", ""),
        ("text", "To execute multi-command atomic transactions without network roundtrips, Redis supports Lua scripts via EVAL.", ""),
        ("bullet", "SwiftShelf 2-Phase Lock", "Deducts stock and creates a 10-minute lock key in a single atomic Lua script to guarantee 0% overselling during flash sales."),
        ("code", "-- Atomic Lua Script Example\nlocal current = tonumber(redis.call('GET', KEYS[1]))\nif current and current >= tonumber(ARGV[1]) then\n    redis.call('DECRBY', KEYS[1], ARGV[1])\n    redis.call('SET', KEYS[2], ARGV[2], 'PX', ARGV[3])\n    return 1 -- Success\nelse\n    return 0 -- Out of Stock\nend", ""),
        ("bullet", "Eviction Policies", "allkeys-lru (Least Recently Used), allkeys-lfu (Least Frequently Used), volatile-ttl, and noeviction (returns error on full RAM)."),

        ("sub", "4. Persistence, Replication & Clustering", ""),
        ("bullet", "RDB (Redis DB Snapshot)", "Point-in-time binary snapshots (dump.rdb) via fork() child process. Fast startup, potential minor data loss on crash."),
        ("bullet", "AOF (Append-Only File)", "Logs every write operation to appendonly.aof with fsync everysec policy. Sub-1s data loss."),
        ("bullet", "Redis Cluster (Sharding)", "Distributes datasets across 16,384 Hash Slots calculated via CRC16(key) % 16384 across master nodes."),

        ("sub", "5. System Design Interview Patterns & Pitfalls", ""),
        ("bullet", "Cache Stampede", "When a hot key expires, thousands hit DB simultaneously. Fix: Mutex lock or XFetch early expiration."),
        ("bullet", "Cache Penetration", "Non-existent key queries bypass cache to DB. Fix: Cache null values (SET key '-1' EX 300) or Bloom Filters."),
        ("bullet", "Cache Breakdown", "A hot key expires. Fix: Set no TTL or update key asynchronously in background.")
    ]),

    ("Section 2: Docker 0 to 100 (Containerization & Runtime Architecture)", [
        ("sub", "1. Containerization vs Virtualization", ""),
        ("text", "Virtual Machines emulate hardware with Hypervisors and guest OS per VM. Containers share the Host OS Kernel, launching in milliseconds with lightweight RAM usage.", ""),
        ("bullet", "Linux Namespaces", "Provides process isolation: PID (processes), NET (network interfaces), MNT (mount points), IPC (inter-process communication)."),
        ("bullet", "Linux Control Groups", "Enforces resource limits and metering: restricts CPU, Memory, Disk I/O per container."),

        ("sub", "2. Docker Engine Architecture", ""),
        ("bullet", "Components", "Docker CLI -> Docker REST API -> Docker Daemon (dockerd) -> containerd -> runc (OCI runtime)."),
        ("bullet", "Union File Systems", "Container images consist of read-only stacked layers. Container instances write to a Copy-on-Write (CoW) top layer."),

        ("sub", "3. Dockerfile Best Practices & Multi-Stage Builds", ""),
        ("text", "Multi-stage builds separate build tools from final runtime images to minimize security attack vectors and image size (from 1GB down to 50MB).", ""),
        ("code", "# Multi-Stage Dockerfile Example\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:20-alpine AS runner\nWORKDIR /app\nUSER node\nCOPY --from=builder /app/dist ./dist\nCOPY --from=builder /app/package*.json ./\nRUN npm ci --only=production\nEXPOSE 3000\nCMD [\"node\", \"dist/index.js\"]", ""),
        ("bullet", "Layer Caching", "Order Dockerfile directives from least to most frequently changed (COPY package.json before COPY .)."),
        ("bullet", "Security Hardening", "Never run container as root. Use USER node or USER 1001, run security scans (Trivy), and use .dockerignore."),

        ("sub", "4. Docker Networking & Volumes", ""),
        ("bullet", "Bridge Network", "Default isolated network driver for containers running on the same single host."),
        ("bullet", "Host Network", "Removes network isolation between container and host for maximum performance."),
        ("bullet", "Volumes vs Bind Mounts", "Volumes are managed by Docker in /var/lib/docker/volumes (best for production). Bind mounts map exact host paths.")
    ]),

    ("Section 3: CI/CD Pipelines 0 to 100 (Automated Deployment & DevOps)", [
        ("sub", "1. Core Concepts: CI vs CD vs CD", ""),
        ("bullet", "Continuous Integration", "Automated code compilation, linting, unit testing, and static analysis triggered on every git push or pull request."),
        ("bullet", "Continuous Delivery", "Automates build artifacts (Docker images tagged with Git SHA to registry) & staging deployment; manual approval for prod."),
        ("bullet", "Continuous Deployment", "Fully automated pipeline passing all tests and pushing code directly to production without manual intervention."),

        ("sub", "2. Complete Production Pipeline Lifecycle", ""),
        ("text", "Git Push -> Lint & Type Check -> Run Unit Tests -> Build OCI Image -> Security Vulnerability Scan -> Push to Registry -> Deploy -> Smoke Test -> Auto Rollback on Failure.", ""),

        ("sub", "3. Enterprise Deployment Strategies", ""),
        ("bullet", "Blue-Green Deployment", "Two identical production environments (Blue=Active, Green=Idle). Traffic switched instantaneously at Load Balancer level. 0 downtime, instant rollback."),
        ("bullet", "Canary Deployment", "Routes 5%-10% of live traffic to the new version. Monitors error rates & metrics before scaling to 100%."),
        ("bullet", "Rolling Update", "Sequentially replaces old instances with new instances batch-by-batch across the cluster."),

        ("sub", "4. GitHub Actions Production Workflow", ""),
        ("code", "name: Production CI/CD Pipeline\non:\n  push:\n    branches: [ main ]\njobs:\n  build-test-deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with: { node-version: '20', cache: 'npm' }\n      - run: npm ci\n      - run: npm run test:unit\n      - uses: docker/build-push-action@v5\n        with:\n          push: true\n          tags: ghcr.io/lovjyotsingh/swiftshelf:${{ github.sha }}", ""),

        ("sub", "5. Pipeline Security & Best Practices", ""),
        ("bullet", "Least Privilege Access", "Scope GitHub Actions tokens (permissions: contents: read, packages: write)."),
        ("bullet", "Secret Masking", "Never hardcode credentials; inject secrets at runtime via environment variables."),
        ("bullet", "Ephemeral Runners", "Use disposable, isolated runner instances for build environments to prevent cross-contamination.")
    ])
]

output_path = r"c:\Users\JASSIMRAT\Documents\GitHub\OfferForge-AI\SDE_Masterclass_Redis_Docker_CICD.pdf"
pdf = SimplePDF(output_path)
pdf.build_pdf("SDE Masterclass Handbook", sections)
