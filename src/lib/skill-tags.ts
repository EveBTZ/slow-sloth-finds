export interface SkillTagEntry {
  tag: string;
  aliases: string[];
}

export const SKILL_TAG_ENTRIES: SkillTagEntry[] = [
  { tag: "Figma", aliases: ["figma"] },
  { tag: "UX Design", aliases: ["ux", "ux design", "experience utilisateur", "user experience"] },
  { tag: "UI Design", aliases: ["ui", "ui design", "interface utilisateur", "user interface"] },
  { tag: "Product Design", aliases: ["product design", "design produit"] },
  { tag: "Design System", aliases: ["design system", "design systems", "systeme de design", "système de design"] },
  { tag: "Prototyping", aliases: ["prototype", "prototypage", "prototyping"] },
  { tag: "Wireframing", aliases: ["wireframe", "wireframing", "zoning"] },
  { tag: "User Research", aliases: ["user research", "ux research", "recherche utilisateur", "entretiens utilisateurs"] },
  { tag: "Design Thinking", aliases: ["design thinking"] },
  { tag: "Branding", aliases: ["branding", "identite visuelle", "identité visuelle", "brand identity"] },
  { tag: "Graphic Design", aliases: ["graphisme", "graphic design", "creation graphique", "création graphique"] },
  { tag: "Motion Design", aliases: ["motion design", "motion", "animation"] },
  { tag: "Web Design", aliases: ["web design", "maquette web"] },
  { tag: "Accessibility", aliases: ["accessibilite", "accessibilité", "a11y", "wcag", "rgaa"] },
  { tag: "Adobe XD", aliases: ["adobe xd", "xd"] },
  { tag: "Photoshop", aliases: ["photoshop", "adobe photoshop"] },
  { tag: "Illustrator", aliases: ["illustrator", "adobe illustrator"] },
  { tag: "InDesign", aliases: ["indesign", "in design", "adobe indesign"] },
  { tag: "Canva", aliases: ["canva"] },

  { tag: "JavaScript", aliases: ["javascript", "js", "ecmascript"] },
  { tag: "TypeScript", aliases: ["typescript", "ts"] },
  { tag: "React", aliases: ["react", "reactjs", "react.js"] },
  { tag: "Next.js", aliases: ["next", "nextjs", "next.js"] },
  { tag: "Vue.js", aliases: ["vue", "vuejs", "vue.js", "nuxt", "nuxt.js"] },
  { tag: "Angular", aliases: ["angular"] },
  { tag: "Node.js", aliases: ["node", "nodejs", "node.js"] },
  { tag: "Express", aliases: ["express", "express.js"] },
  { tag: "NestJS", aliases: ["nestjs", "nest.js"] },
  { tag: "HTML", aliases: ["html", "html5"] },
  { tag: "CSS", aliases: ["css", "css3"] },
  { tag: "Tailwind CSS", aliases: ["tailwind", "tailwind css"] },
  { tag: "Sass", aliases: ["sass", "scss"] },
  { tag: "Python", aliases: ["python"] },
  { tag: "Django", aliases: ["django"] },
  { tag: "FastAPI", aliases: ["fastapi", "fast api"] },
  { tag: "PHP", aliases: ["php"] },
  { tag: "Laravel", aliases: ["laravel"] },
  { tag: "Symfony", aliases: ["symfony"] },
  { tag: "Java", aliases: ["java"] },
  { tag: "Spring Boot", aliases: ["spring boot", "spring"] },
  { tag: "C#", aliases: ["c#", "c sharp", "csharp"] },
  { tag: ".NET", aliases: [".net", "dotnet", "dot net"] },
  { tag: "C++", aliases: ["c++", "cpp"] },
  { tag: "Go", aliases: ["golang", "go"] },
  { tag: "Rust", aliases: ["rust"] },
  { tag: "SQL", aliases: ["sql"] },
  { tag: "PostgreSQL", aliases: ["postgresql", "postgres", "supabase"] },
  { tag: "MySQL", aliases: ["mysql"] },
  { tag: "MongoDB", aliases: ["mongodb", "mongo db"] },
  { tag: "REST API", aliases: ["api rest", "rest api", "restful"] },
  { tag: "GraphQL", aliases: ["graphql"] },
  { tag: "Docker", aliases: ["docker"] },
  { tag: "Kubernetes", aliases: ["kubernetes", "k8s"] },
  { tag: "CI/CD", aliases: ["ci/cd", "cicd", "ci cd", "integration continue", "déploiement continu"] },
  { tag: "Git", aliases: ["git"] },
  { tag: "GitHub", aliases: ["github", "github actions"] },
  { tag: "GitLab", aliases: ["gitlab", "gitlab ci"] },
  { tag: "DevOps", aliases: ["devops"] },
  { tag: "AWS", aliases: ["aws", "amazon web services"] },
  { tag: "Azure", aliases: ["azure", "microsoft azure"] },
  { tag: "Google Cloud", aliases: ["google cloud", "gcp"] },
  { tag: "Firebase", aliases: ["firebase"] },

  { tag: "Data Analysis", aliases: ["data analysis", "analyse de donnees", "analyse de données", "data analyst"] },
  { tag: "Data Visualization", aliases: ["data visualization", "dataviz", "visualisation de donnees", "visualisation de données"] },
  { tag: "Power BI", aliases: ["power bi", "powerbi"] },
  { tag: "Tableau", aliases: ["tableau"] },
  { tag: "Looker Studio", aliases: ["looker studio", "google data studio", "data studio"] },
  { tag: "Excel", aliases: ["excel", "microsoft excel"] },
  { tag: "Machine Learning", aliases: ["machine learning", "ml"] },
  { tag: "Deep Learning", aliases: ["deep learning"] },
  { tag: "NLP", aliases: ["nlp", "traitement du langage", "natural language processing"] },
  { tag: "LLM", aliases: ["llm", "large language model", "ia generative", "ia générative", "generative ai"] },
  { tag: "Prompt Engineering", aliases: ["prompt engineering", "prompt", "prompting"] },
  { tag: "MLOps", aliases: ["mlops"] },
  { tag: "Pandas", aliases: ["pandas"] },
  { tag: "NumPy", aliases: ["numpy"] },
  { tag: "R", aliases: ["langage r", "r language"] },
  { tag: "Analytics", aliases: ["analytics", "tracking", "kpi", "reporting"] },
  { tag: "A/B Testing", aliases: ["a/b testing", "ab testing", "test ab", "tests ab"] },

  { tag: "SEO", aliases: ["seo", "referencement naturel", "référencement naturel"] },
  { tag: "SEA", aliases: ["sea", "google ads", "paid search"] },
  { tag: "Meta Ads", aliases: ["meta ads", "facebook ads", "instagram ads"] },
  { tag: "Content Strategy", aliases: ["content strategy", "strategie de contenu", "stratégie de contenu"] },
  { tag: "Copywriting", aliases: ["copywriting", "conception redaction", "conception-rédaction", "redaction web", "rédaction web"] },
  { tag: "Email Marketing", aliases: ["email marketing", "newsletter", "mailing"] },
  { tag: "CRM", aliases: ["crm"] },
  { tag: "HubSpot", aliases: ["hubspot"] },
  { tag: "Salesforce", aliases: ["salesforce"] },
  { tag: "Growth Marketing", aliases: ["growth marketing", "growth hacking"] },
  { tag: "Social Media", aliases: ["social media", "reseaux sociaux", "réseaux sociaux", "community management"] },
  { tag: "E-commerce", aliases: ["e-commerce", "ecommerce", "e commerce"] },
  { tag: "Shopify", aliases: ["shopify"] },
  { tag: "WordPress", aliases: ["wordpress", "word press"] },
  { tag: "Webflow", aliases: ["webflow"] },
  { tag: "Notion", aliases: ["notion"] },
  { tag: "Airtable", aliases: ["airtable"] },
  { tag: "Jira", aliases: ["jira"] },
  { tag: "Confluence", aliases: ["confluence"] },
  { tag: "Asana", aliases: ["asana"] },
  { tag: "Trello", aliases: ["trello"] },
  { tag: "Project Management", aliases: ["project management", "gestion de projet", "pilotage projet", "chefferie de projet"] },
  { tag: "Product Management", aliases: ["product management", "product manager", "produit"] },
  { tag: "Agile", aliases: ["agile", "agilite", "agilité"] },
  { tag: "Scrum", aliases: ["scrum", "scrum master"] },
  { tag: "Kanban", aliases: ["kanban"] },
  { tag: "Lean", aliases: ["lean"] },
  { tag: "Change Management", aliases: ["change management", "conduite du changement"] },
  { tag: "Strategy", aliases: ["strategy", "strategie", "stratégie"] },
  { tag: "Consulting", aliases: ["consulting", "conseil", "consultant", "consultante"] },

  { tag: "French", aliases: ["francais", "français", "french"] },
  { tag: "English", aliases: ["anglais", "english"] },
  { tag: "Spanish", aliases: ["espagnol", "spanish"] },
  { tag: "German", aliases: ["allemand", "german"] },
  { tag: "Italian", aliases: ["italien", "italian"] },
  { tag: "SaaS", aliases: ["saas"] },
  { tag: "B2B", aliases: ["b2b"] },
  { tag: "B2C", aliases: ["b2c"] },
  { tag: "Fintech", aliases: ["fintech"] },
  { tag: "Healthtech", aliases: ["healthtech", "sante", "santé"] },
  { tag: "Edtech", aliases: ["edtech", "education", "éducation"] },
  { tag: "Retail", aliases: ["retail", "distribution"] },
  { tag: "Luxury", aliases: ["luxe", "luxury"] },
  { tag: "Real Estate", aliases: ["immobilier", "real estate"] },
  { tag: "HR", aliases: ["rh", "ressources humaines", "hr"] },
  { tag: "Legal", aliases: ["legal", "juridique"] },
  { tag: "Insurance", aliases: ["assurance", "insurance"] },
  { tag: "Banking", aliases: ["banque", "banking"] },
  { tag: "Public Sector", aliases: ["secteur public", "administration"] },
  { tag: "Industry", aliases: ["industrie", "industrial", "industry"] },
  { tag: "Energy", aliases: ["energie", "énergie", "energy"] },
  { tag: "Nonprofit", aliases: ["association", "ong", "ngo", "nonprofit", "non-profit"] },
];

export const SKILL_REFERENCE_TAGS = SKILL_TAG_ENTRIES.map((entry) => entry.tag);

function normalizeForSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, " ")
    .toLowerCase()
    .replace(/[^a-z0-9#+./-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isBoundary(char: string | undefined) {
  return !char || !/[a-z0-9#+]/.test(char);
}

function includesAlias(haystack: string, alias: string) {
  const needle = normalizeForSearch(alias);
  if (!needle) return false;

  let index = haystack.indexOf(needle);
  while (index !== -1) {
    const before = haystack[index - 1];
    const after = haystack[index + needle.length];
    if (isBoundary(before) && isBoundary(after)) return true;
    index = haystack.indexOf(needle, index + 1);
  }
  return false;
}

export function normalizeTagKey(tag: string) {
  return normalizeForSearch(tag).replace(/[^a-z0-9]+/g, "");
}

export function mergeSkillTags(tags: string[], limit = 30) {
  const seen = new Set<string>();
  const merged: string[] = [];

  for (const rawTag of tags) {
    const tag = rawTag.trim();
    if (!tag || tag.length > 40) continue;
    const key = normalizeTagKey(tag);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    merged.push(tag);
    if (merged.length >= limit) break;
  }

  return merged;
}

export function extractKnownSkillTags(text: string, limit = 24) {
  const normalizedText = normalizeForSearch(text);
  if (!normalizedText) return [];

  return mergeSkillTags(
    SKILL_TAG_ENTRIES.filter((entry) =>
      [entry.tag, ...entry.aliases].some((alias) => includesAlias(normalizedText, alias))
    ).map((entry) => entry.tag),
    limit
  );
}