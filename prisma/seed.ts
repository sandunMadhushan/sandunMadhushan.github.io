import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/** Local hero / about portrait — `public/Sandun Madhushan.png` */
const LOCAL_PORTRAIT = "/sandun-madhushan.png";

const IMG = {
  hero: LOCAL_PORTRAIT,
  mealbridge:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAQEOCl1ZgIWhki0Y7mXXJa-p2WKKeV6y2aNlqgMOSZdrdZ_Ahyje4gwJQLcYSyFipJ6WGSebgoUv2jUwF2MV43NinnhENMf7sVSNDKe1zOxt03O4ividPUf-WMgi2w_PkVViPpoLEobay8401Xui19Yfyx0I7uWpD6--ca7gC5ZFZ5cQwovQkAHZmSkYl0-qPOwAUSEpo-MjaUv66jv-A6GrtXcq33zX2L_QkKQne582spd4JfWlna9HvO_DrK13CoHdNYqvduLQ",
  edoc: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEqnT1FxKu3BrmGXFfaLItwJoQhmTDd4uZTv9cVKLLZZlsRDiL3kv19zynTYB53ENkCT9qoDqb-GggYr8lGDJDbK26Ee1bZmlzminEdPbZK88G3IxORvBvkQR83qf3DURmwI34Vz5ByqY-CmBQ5AiVAl57N3qjYivxwqExaHvNPF7tNvuapyMjfC2vWhlRU5vOrcu_Bxgs3GOWdWfj8K-CqEvOJt1ncQTKZxdBbh8HaXuBmAxvwY8wNeIeHSCfzL_9lylOLpoCmA",
  organizer:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC6dON6nn7WmLwbWPjYgEr-8QBLbRU58CSnlRxr_Yk0tCcaKSWGwgE4y80MtAbR6P_wzZkdYoui1SwNS9yAnbK85Q5VybrYsIEj6gf29SweKOAg3WHKbBgt6H-wf7yOWNmimo_BhMGK6qtj2J5ZDRLrbhzvDdHqCRm6PNqK3CCatF__KunmuhtGdBBgp_3M0__aCqMZzthcZYAfC16X1DG5R2SGtxqoIFfqSgqQyYbBiyr2VX6h3fM3M4xCGENkH57J1kvDUnzyuQ",
  lms: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9yWiIFRhrcS9FgN8yqrYhFmJVitn2qeHX7CpWmhhJFLIJjAB20HgmbsKQ2Jj8OPBHKSHjtl4fWyksAmVlJUmjWJXr3P3dJqWXEioYslyCUPFr4dtMkFAkx3ZHzTrvMowyLwLsLjThOa41mDW_W5VmK6FpKN689DDRr5Mia1eXwFb6IpO9iy50rgqyhzpv_6Tmz-_nEKafGOQ5ozWQ-7dpCGWxpt7KYCc5ztRYLnQVvADZPqGDNEmhKO4LM42N_5z3SNjOlbRFpA",
  resume:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDoQGRkvg8psSAzlua0GWaCoFGil67qginc8oTm0XNy92_tqLKz9o3Y11CugYmMEZcbXsnIkkXlrbW0LPKX8t3DIjLXUmw8Cx-DMx3b5kyal0mQgcWmTlu6AF0K6K4jlck960jXo6K0wfNmDl4guIPXcE5ylJlfXwTj-A27Qynh58m9ln1ZRPEzUS7C8Ima9pLYXq-Z7IUH2K3k-RitMf4Wc17BlROXOhPDAdx5i_P7ml2A0FIbWfz5jAv0Mmc-1uI-3Of_fF3yKQ",
  cv: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGLmsjbYht9a6drGvR6b2GznGi-c0Sy6_kWxo87C6I0Db1Iw7MwxK4ECJYgk9RcSlHdqGQCSyhXZOwX8SoiWOSRf798rAjkoVtQ-Jgrvqy4WF1ncrAJgioA0zgpTCp6QsvMNxRPW__G-wXMPsMzt9NRmnbynQtkrEA6K08VhL0MZiB09bRVe-E804zSvUQg3ycp1LeHsHBm6cyecSTWX-r3OWg-repwA-ipfDa2B1n6JtVb3uys6IYIJZXA8hNOE665AdeWGpEEw",
  feat1:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDzqf1mb7XGaWXOtdRO_BqHP7AVaS6YUmNa2kygNYs7XDuJtQrByPrS1hvPveLhtciqYHjaB9xGuT2qH7bGce-SN-ewBZDuc48NfQ46PywmfXLW2_d25xOC6oIhUU3SKCLNFc7lz5D1L9qMjKhlile5bcWdHiR4jgHwOl-SMits5JwAx3iGEMYG-V0-AWQkS6AzxALS-rqoOVjSGCfrYm_p1UoopfLWUzzVMy2N6PMSY9mJwz5T5pQRTNlKUlaUXbZNHgS_bt8YsQ",
  feat2:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDu7hfXFMF4jPAbSX4Ax5hCJsxKnzZcHhBB_osU4ZM89ipTpc0ypyZshAvzLlqA1hvs0WiFnTxzhAnmHaLh2ZEL6s7He_hWc6K0pzgJeSN_KkZiHIDiBqdARxLS9h9vn0nUVvhISE2FKSyR1sQDXE77m4wUIT9jzp54Sz37cWcjStzGdetlmtKdG9XVTcdMsvhFzHSsq3eDwzQbCpqtGY2klwJKRWSSy4kq_PHox0MysZ1D8d48mB0Okg6rjmR_FPbLM3oJ5PAHjg",
  feat3:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDacPgnBOiRxKH633iFKn7tOznTRTLfvWcvDeXJKXn6Eb9QUzBIQqLcC7u78-I3rdW_c5gqw23vO8TF7ay8P8ycvAeRKHkBV0wzrGIncsjdRI1i_iPGvXX3_n-lDHQCyFFoBpbA_ztOUFtrMw_W7Ab28s2Y-ZyTE9LD9lsxb0BHt5mA5yzZbc06A64YFUM1AgehYGYbHk-Dg8VqskOBIcCPywSakjrjdDWHVCkMK_3rUbuBZ_VSHp7XIZMI3pItBxzDbMqMpdPvJw",
  detailHero:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAO__-qyf-_hN3VnS1tX3vaUTBLoHvsWDsD8D3nYGJFY8DuaGSQAQWlkaxj7T88vzqXe6mpHReNtVMkBJGogcGxldPsr0MKkiaAlpI_BkIW7dpOqNXe7YbdonJq0jwBU1eDZlUEGP0a8dXf53_1MF-NPUHYyRlPL-DCbOhO6XH8oqnr3Gs3FlUjvCjDtJtKqUM2XPH0pxqTawYGs6M9JrDhHQDdXZLgbX7m0f0wWFE6XJ89ii51dSEYZXvHkHlUFJNxaSgjMB4xUQ",
};

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@portfolio.local";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "changeme123";
  const hash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.deleteMany();
  await prisma.message.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.about.deleteMany();

  await prisma.user.create({
    data: { email: adminEmail, password: hash },
  });

  await prisma.about.create({
    data: {
      content:
        "Software Engineering undergraduate and full-stack developer focused on building modern, scalable web applications using React, TypeScript, and Node.js. Passionate about solving real-world problems and creating meaningful digital experiences.",
      stats: {
        projects: 6,
        technologies: 10,
        experience: "2+ years",
        heroTagline:
          "Full-Stack Developer building modern, scalable web applications with editorial precision.",
        profileImage: IMG.hero,
        aboutHeadline: "Crafting digital landscapes with surgical precision.",
        aboutIntro: [
          "I am a digital architect specializing in the intersection of high-performance engineering and editorial aesthetics. My work is driven by the philosophy that code is an artifact—a functional gallery piece that should be as robust as it is beautiful.",
          "With a foundation in Computer Science and a passion for minimalist design systems, I help brands bridge the gap between technical complexity and intuitive user experiences. I don't just build websites; I curate digital environments.",
        ],
        aboutPortrait: LOCAL_PORTRAIT,
        statCards: [
          { value: "6+", label: "Projects Orchestrated", icon: "terminal" },
          { value: "10", label: "Technologies Mastered", icon: "verified" },
          { value: "2+", label: "Years of Experience", icon: "history_edu" },
        ],
        timeline: [
          {
            period: "2016 — 2020",
            title: "Academic Foundation",
            body: "BSc in Computer Science with a focus on Software Engineering and Human-Computer Interaction.",
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuAp1nxC1tIu2AV7q7cxCQcE7UsMsP0zP1EIL8Qq0wrG4Jdh-ZIriSl-Qk84uTu6CZ6ZxAZt0n3AhaOnHY4tvqT9DG_VdrwU2W0Vm62UNZBzU1ngpwZmufPNg0RXAySaqhU8jmwO5JzzfMaEBnLPriWsOf_q4LC4mFCuzQ_qU0kf31IbbHKRm6qQaZUQFYDVovg6zHRT5Swdeq1jXWH0ykPIPWveekNZUYZf1qpy2fcA-kl4gJY1og2uFdRCO7jjW-qmHV4cN4L6ww",
            align: "left",
          },
          {
            period: "2020 — 2022",
            title: "The Catalyst Era",
            body: "Led full-stack delivery for client platforms, defined reusable UI patterns, and shipped production systems end to end.",
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuBMKPUEhVJe16VBicoCj5SCk_fokfy1m7INGtBPvzopux_Nft5f9ir38RtyUjgtUy7y0LY-k46CBp47O50TXtrq-LOVekt5XElUlwWC8jbOuYmAB4KYx--1F1Zf6gev0JAw25eX43O-nSawPL39iymZIBZ2PlYk3k76UuM3OqmoZ0-hucWUB3Ic-lsd318pEZ4X18sDKsZhpFkrfecItrIAjJyPiZL3qOERNZirl9LQ_ygNVYg3_cXe0KGLXKA9Taj92u7lJlwkTA",
            align: "right",
          },
          {
            period: "Present Day",
            title: "Continuous Curating",
            body: "Exploring AI-assisted workflows, performance-first architectures, and design systems that scale.",
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuDumqlr7MRNvZtvIXiU-STqxfpp56heX8ciuuuyroPRI5ghAn-R2nTJBjWK2bXp5QZk31w8t0yAyDhyAUU3lX_cLkNdQ1oT7UrgSMEiBuclA5uyWfVsPrFpNcTsDsTL7yKflAOzhwUtE7pw88s87LqYsTZliyNz4P-M-ZuKoZcgkKKdcN_szFuiZ_8ORkuF9JM30OJo2SFu6E_10r8cYfyo_uK520QkWjDrbBN124V62-s_hLQKziL8YdI1cx_-Zu0tbNo-VmCzcw",
            align: "left",
          },
        ],
        skillArtifacts: [
          { name: "TypeScript", icon: "code" },
          { name: "Tailwind", icon: "layers" },
          { name: "PostgreSQL", icon: "database" },
          { name: "Node.js", icon: "token" },
          { name: "Figma", icon: "brush" },
        ],
        homeAboutHeadline: "Crafting code like architecture.",
        homeAboutBody:
          "I am a Full-Stack Developer based in Colombo, obsessed with the intersection of clean code and editorial design. I transform complex requirements into intuitive, high-performance digital artifacts.",
        homeStats: [
          { value: "6+", label: "Projects Delivered" },
          { value: "10+", label: "Tech Stack" },
          { value: "2+", label: "Years Experience" },
        ],
        ctaSpecialization:
          "Developing LLM-powered interfaces and RAG pipelines for modern enterprise applications.",
      },
    },
  });

  const skills = [
    {
      name: "React",
      category: "Frontend",
      proficiency: 95,
      icon: "javascript",
      description: "Component-driven UI engineering.",
    },
    {
      name: "Next.js",
      category: "Frontend",
      proficiency: 92,
      icon: "layers",
      description: "App Router, SSR, and edge-ready deployments.",
    },
    {
      name: "Tailwind CSS",
      category: "Frontend",
      proficiency: 98,
      icon: "palette",
      description: "Utility-first styling at scale.",
    },
    {
      name: "TypeScript",
      category: "Languages",
      proficiency: 90,
      icon: "variable",
      description: "Typed JavaScript for safer systems.",
    },
    {
      name: "JavaScript",
      category: "Languages",
      proficiency: 92,
      icon: "javascript",
      description: "Modern ES modules and async flows.",
    },
    {
      name: "Node.js",
      category: "Backend",
      proficiency: 88,
      icon: "api",
      description: "High-concurrency APIs and services.",
    },
    {
      name: "Express",
      category: "Backend",
      proficiency: 85,
      icon: "terminal",
      description: "Lean HTTP layers and middleware.",
    },
    {
      name: "MongoDB",
      category: "Database",
      proficiency: 82,
      icon: "data_object",
      description: "Document modeling and indexing.",
    },
    {
      name: "PostgreSQL",
      category: "Database",
      proficiency: 88,
      icon: "database",
      description: "Relational data with strong integrity.",
    },
    {
      name: "Git",
      category: "Tools",
      proficiency: 95,
      icon: "commit",
      description: "Branching, reviews, and release hygiene.",
    },
    {
      name: "GitHub",
      category: "Tools",
      proficiency: 93,
      icon: "deployed_code",
      description: "CI/CD and collaboration workflows.",
    },
  ];

  for (const s of skills) {
    await prisma.skill.create({ data: s });
  }

  const projects = [
    {
      title: "MealBridge Sri Lanka",
      slug: "mealbridge",
      description:
        "A food donation platform connecting donors with people in need.",
      content:
        "MealBridge coordinates surplus food from donors and routes it to communities efficiently. The platform emphasizes trust, traceability, and real-time visibility for coordinators.",
      technologies: ["React", "Node.js", "MongoDB"],
      images: [IMG.mealbridge, IMG.detailHero, IMG.feat1, IMG.feat2],
      githubLink: "https://github.com",
      liveLink: "https://example.com",
      featured: true,
      category: "Web",
      cardIcon: "restaurant",
      features: ["Donation system", "User authentication", "Real-time updates"],
      challenges: [
        {
          title: "Logistics coordination",
          description:
            "Matching donors to recipients across regions without delays required careful state modeling.",
        },
        {
          title: "Trust & safety",
          description:
            "Verifying listings and preventing abuse while keeping onboarding friction low.",
        },
      ],
      results: [
        { label: "Donations routed", value: "10k+" },
        { label: "Avg. response", value: "< 2h" },
        { label: "Uptime", value: "99.9%" },
      ],
    },
    {
      title: "E-Doc Medical App",
      slug: "e-doc",
      description:
        "A digital medical platform for managing patient interactions.",
      content:
        "E-Doc streamlines appointments, records, and remote consultations with a clinician-first workflow and patient-friendly interfaces.",
      technologies: ["React", "Node.js"],
      images: [IMG.edoc, IMG.feat3],
      githubLink: "https://github.com",
      liveLink: null,
      featured: false,
      category: "Mobile",
      cardIcon: "smartphone",
      features: ["Appointment system", "Patient records"],
      challenges: [
        {
          title: "Compliance",
          description:
            "Balancing rapid iteration with data handling requirements.",
        },
      ],
      results: [
        { label: "Clinics onboarded", value: "12" },
        { label: "Appts / mo", value: "3k" },
      ],
    },
    {
      title: "Personal Organizer System",
      slug: "organizer",
      description:
        "A productivity system to manage tasks and daily activities.",
      content:
        "A structured organizer for tasks, habits, and daily planning with reminders and lightweight analytics.",
      technologies: ["JavaScript", "PHP", "MySQL"],
      images: [IMG.organizer],
      githubLink: null,
      liveLink: null,
      featured: false,
      category: "Web",
      cardIcon: "calendar_month",
      features: ["Task boards", "Daily planner", "Habit tracking"],
      challenges: [
        {
          title: "Cross-device sync",
          description: "Keeping tasks consistent across browsers and sessions.",
        },
      ],
      results: [{ label: "Tasks tracked", value: "50k+" }],
    },
    {
      title: "LMS Activity Monitor",
      slug: "lms-monitor",
      description: "Tracks student engagement and activity in LMS platforms.",
      content:
        "Instrumentation and dashboards that surface engagement signals for educators and administrators.",
      technologies: ["Node.js", "PostgreSQL"],
      images: [IMG.lms],
      githubLink: "https://github.com",
      liveLink: null,
      featured: false,
      category: "Web",
      cardIcon: "analytics",
      features: ["Engagement metrics", "Course analytics", "Exports"],
      challenges: [
        {
          title: "Signal quality",
          description:
            "Separating meaningful activity from noise in large cohorts.",
        },
      ],
      results: [{ label: "Events / day", value: "1M+" }],
    },
    {
      title: "AI Resume Analyzer",
      slug: "ai-resume",
      description: "Analyzes resumes using AI and provides feedback.",
      content:
        "Upload a resume, extract skills and gaps, and receive actionable suggestions powered by modern LLM tooling.",
      technologies: ["TypeScript", "Next.js", "OpenAI API"],
      images: [IMG.resume],
      githubLink: "https://github.com",
      liveLink: "https://example.com",
      featured: false,
      category: "AI",
      cardIcon: "psychology",
      features: ["Skill extraction", "Scoring", "Rewrite hints"],
      challenges: [
        {
          title: "Latency vs. quality",
          description:
            "Streaming partial results while preserving evaluation consistency.",
        },
      ],
      results: [{ label: "Resumes reviewed", value: "8k+" }],
    },
    {
      title: "CV Builder",
      slug: "cv-builder",
      description: "Tool to generate professional CVs dynamically.",
      content:
        "Template-driven CV generation with export to PDF and theme switching for consistent branding.",
      technologies: ["TypeScript", "React"],
      images: [IMG.cv],
      githubLink: "https://github.com",
      liveLink: null,
      featured: false,
      category: "Web",
      cardIcon: "description",
      features: ["Themes", "PDF export", "Live preview"],
      challenges: [
        {
          title: "Print fidelity",
          description: "Matching web preview to exported PDF layouts.",
        },
      ],
      results: [{ label: "CVs generated", value: "15k+" }],
    },
  ];

  for (const p of projects) {
    await prisma.project.create({
      data: {
        title: p.title,
        slug: p.slug,
        description: p.description,
        content: p.content,
        technologies: p.technologies,
        images: p.images,
        githubLink: p.githubLink,
        liveLink: p.liveLink,
        featured: p.featured,
        category: p.category,
        cardIcon: p.cardIcon,
        features: p.features,
        challenges: p.challenges,
        results: p.results,
      },
    });
  }

  console.log(
    "Seed complete. Admin:",
    adminEmail,
    "| password from ADMIN_PASSWORD or default changeme123",
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
