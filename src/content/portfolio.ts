/**
 * Everything visitors read lives in this file.
 * Add, edit, or remove entries here — sections render from this data.
 *
 * Skills and contact platforms use an `icon` name. Known names are drawn in
 * `src/components/icons.tsx`. Any other name falls back to a simple leaf,
 * so a new skill can be added before its icon exists.
 *
 * Project `image` is a path in `public/` or a full URL.
 * Set `href` when a project should open a link.
 * Replace `contact.recipient` with the inbox that should receive the form.
 */

export type SkillItem = {
  id: string
  name: string
  icon: string
}

export type SkillGroup = {
  id: string
  title: string
  items: SkillItem[]
}

export type ExperienceItem = {
  id: string
  role: string
  org: string
  period: string
  summary: string
  avatar: string
}

export type ProjectItem = {
  id: string
  title: string
  description: string
  image: string
  href?: string
}

export type ContactField = {
  id: string
  label: string
  type: "email" | "text" | "textarea"
  autoComplete: string
}

export type ContactPlatform = {
  id: string
  name: string
  icon: string
  href: string
}

export const portfolio = {
  hero: ["Senior Full Stack AI Engineer", "that builds beautiful things"],
  invitation: "Let's create beautiful things together!",
  about: {
    heading: "About Me",
    paragraphs: [
      "Full-Stack & AI Engineer with 8+ years across financial technology, enterprise SaaS, and AI-driven risk and compliance products. Combines application architecture and hands-on product engineering with practical LLM and agentic-AI integration, connecting complex backend workflows to clear, auditable user experiences. Known for taking ownership of defined product areas, improving reliability and delivery quality, and translating demanding business processes into maintainable software with measurable operational value.",
    ],
  },
  skills: {
    heading: "Skills",
    groups: [
      {
        id: "languages",
        title: "Languages & Application Platforms",
        items: [
          { id: "python", name: "Python", icon: "python" },
          { id: "cpp", name: "C++", icon: "cpp" },
          { id: "csharp", name: "C#", icon: "csharp" },
          { id: "dotnet", name: ".NET", icon: "dotnet" },
          { id: "java", name: "Java", icon: "java" },
          { id: "go", name: "Go", icon: "go" },
          { id: "node", name: "Node.js", icon: "node" },
          { id: "typescript", name: "TypeScript", icon: "typescript" },
          { id: "php", name: "PHP", icon: "php" },
          { id: "django", name: "Django", icon: "django" },
          { id: "react", name: "React", icon: "react" },
          { id: "fastapi", name: "FastAPI", icon: "fastapi" },
          { id: "rest", name: "REST APIs", icon: "rest" },
          { id: "android", name: "Android Development", icon: "android" },
          { id: "rust", name: "Rust", icon: "rust" },
        ],
      },
      {
        id: "cloud",
        title: "Cloud, Data & DevOps",
        items: [
          { id: "aws", name: "AWS", icon: "aws" },
          { id: "docker", name: "Docker", icon: "docker" },
          { id: "kubernetes", name: "Kubernetes", icon: "kubernetes" },
          { id: "terraform", name: "Terraform", icon: "terraform" },
          { id: "helm", name: "Helm", icon: "helm" },
          { id: "cicd", name: "CI/CD", icon: "cicd" },
          { id: "linux", name: "Linux", icon: "linux" },
          { id: "git", name: "Git", icon: "git" },
          { id: "postgres", name: "PostgreSQL", icon: "postgres" },
          { id: "mongodb", name: "MongoDB", icon: "mongodb" },
          { id: "redis", name: "Redis", icon: "redis" },
          { id: "kafka", name: "Apache Kafka", icon: "kafka" },
          { id: "sql", name: "SQL", icon: "sql" },
        ],
      },
      {
        id: "ai",
        title: "AI & Agents",
        items: [
          { id: "llm", name: "LLMs", icon: "llm" },
          { id: "generative-ai", name: "Generative AI", icon: "generative-ai" },
          { id: "openai", name: "OpenAI API", icon: "openai" },
          { id: "agentic-ai", name: "Agentic AI", icon: "agentic-ai" },
          { id: "conversational-ai", name: "Conversational AI", icon: "conversational-ai" },
          { id: "claude", name: "Anthropic Claude", icon: "claude" },
          { id: "langchain", name: "LangChain", icon: "langchain" },
          { id: "langgraph", name: "LangGraph", icon: "langgraph" },
          { id: "llamaindex", name: "LlamaIndex", icon: "llamaindex" },
          { id: "rag", name: "RAG", icon: "rag" },
          { id: "mcp", name: "MCP", icon: "mcp" },
          { id: "pytorch", name: "PyTorch", icon: "pytorch" },
          { id: "vector-db", name: "Vector Databases", icon: "vector-db" },
          { id: "pinecone", name: "Pinecone", icon: "pinecone" },
        ],
      },
    ] satisfies SkillGroup[],
  },
  experience: {
    heading: "Experience",
    items: [
      {
        id: "riskfront",
        role: "Full-Stack & AI Engineer",
        org: "RiskFront AI",
        avatar: "/experience/riskfront.svg",
        period: "March 2025 — October 2026 · Remote, Poland",
        summary:
          "Developed an enterprise Agentic AI Risk & Compliance Platform (AIROS), integrating LLMs, RAG pipelines, and autonomous agent workflows. Built scalable backend services, AI-powered document processing, evidence extraction, and compliance review features using Python, Java, FastAPI, LangChain, LangGraph, and cloud technologies.",
      },
      {
        id: "google",
        role: "Full-Stack Engineer / Senior Full-Stack Engineer",
        org: "Google",
        avatar: "/experience/google.svg",
        period: "April 2022 — February 2025 · Remote",
        summary:
          "Contributed to Google Bard and Gemini, developing conversational and multimodal AI application experiences. Built responsive frontend interfaces, integrated backend APIs, implemented Android application features, and optimized real-time AI interactions using React, TypeScript, Python, Java, Go, and Android technologies.",
      },
      {
        id: "lanex",
        role: "Full-Stack Engineer",
        org: "LANEX Corporation",
        avatar: "/experience/lanex.svg",
        period: "March 2020 — March 2022 · Remote, Philippines",
        summary:
          "Developed and modernized enterprise web applications, migrating legacy systems into scalable React, PHP/Lumen, and PostgreSQL architectures. Implemented responsive interfaces, REST APIs, database integrations, and reusable application components while collaborating with distributed engineering and design teams.",
      },
      {
        id: "iexcel",
        role: "Front-End Engineer",
        org: "iExcel Technologies",
        avatar: "/experience/iexcel.svg",
        period: "January 2018 — February 2020 · Hong Kong",
        summary:
          "Developed financial planning and regulatory reporting applications, including interactive financial calculators and automated reporting interfaces. Built reusable React and TypeScript components, integrated REST APIs, and collaborated with backend teams using C#, .NET, Python, Django, and SQL.",
      },
    ] satisfies ExperienceItem[],
  },
  projects: {
    heading: "Projects",
    items: [
      {
        id: "agentic-risks",
        title: "Enterprise-Wide Agentic AI Risk Control Framework",
        description:
          "An enterprise AI governance and risk management framework for identifying, assessing, and mitigating risks from autonomous AI agents. It covers security controls, governance policies, human oversight, and compliance guidance aligned with ISO 42001, the NIST AI RMF, and the EU AI Act.",
        image: "/projects/agentic.svg",
        href: "https://agenticrisks.com/agentic-ai-risk-controls/",
      },
      {
        id: "gemini",
        title: "Google Gemini – AI Assistant",
        description:
          "A multimodal artificial intelligence assistant developed by Google that helps users perform tasks through natural-language conversations. It supports text generation, coding, image and video understanding, research, content creation, and complex problem-solving.",
        image: "/projects/gemini.svg",
        href: "https://en.wikipedia.org/wiki/Google_Gemini",
      },
      {
        id: "lanex",
        title: "LANEX – Web & Mobile Application Development",
        description:
          "A custom software development service for scalable web applications, native mobile apps, and cross-platform solutions. It covers the full lifecycle: UI/UX design, frontend and backend development, API integration, cloud deployment, and ongoing maintenance.",
        image: "/projects/lanex.svg",
        href: "https://lanexcorp.com/software-development-services/web-and-mobile-app-development",
      },
      {
        id: "veriplan",
        title: "VeriPlan – Personal Financial Planning Software",
        description:
          "A personal financial and retirement planning application built around Microsoft Excel. It forecasts lifetime income, expenses, taxes, investments, debts, and retirement savings, and includes portfolio analysis, calculators, projections, and scenario comparison.",
        image: "/projects/veriplan.svg",
        href: "https://www.theskilledinvestor.com/VeriPlan/",
      },
      {
        id: "canva-ai",
        title: "Canva AI – AI-Powered Creative Design Platform",
        description:
          "An AI-powered visual content platform for generating and editing presentations, graphics, images, videos, documents, and marketing materials from text or voice prompts. It combines generative AI, design automation, brand customization, and conversational editing.",
        image: "/projects/canva.svg",
        href: "https://www.canva.com/canva-ai/",
      },
      {
        id: "deviation",
        title: "Deviation Game – AI-Powered Drawing Party Game",
        description:
          "A cooperative party game for 2–6 players. Draw objects or concepts that other people can recognize but an image-recognition AI cannot, and explore the gap between human perception and artificial intelligence.",
        image: "/projects/deviation.svg",
        href: "https://deviationgame.com/",
      },
    ] satisfies ProjectItem[],
  },
  contact: {
    heading: "Contact me",
    recipient: "you@example.com",
    sendLabel: "Send",
    sentNote: "Thank you. Your message is ready in your mail app.",
    fields: [
      { id: "email", label: "Your email", type: "email", autoComplete: "email" },
      { id: "name", label: "Your full name", type: "text", autoComplete: "name" },
      { id: "message", label: "Your message", type: "textarea", autoComplete: "off" },
    ] satisfies ContactField[],
    platforms: [
      { id: "email", name: "Email", icon: "email", href: "mailto:you@example.com" },
      { id: "whatsapp", name: "WhatsApp", icon: "whatsapp", href: "https://wa.me/15550000000" },
      { id: "linkedin", name: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/in/your-profile" },
      { id: "github", name: "GitHub", icon: "github", href: "https://github.com/your-handle" },
    ] satisfies ContactPlatform[],
  },
}
