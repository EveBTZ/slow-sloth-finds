export interface JobOption {
  value: string;
  label_fr: string;
  label_en: string;
  group: "design" | "tech" | "data" | "product" | "marketing" | "content" | "ops" | "other";
}

export const JOB_OPTIONS: JobOption[] = [
  // Design
  { value: "ux_designer", label_fr: "UX Designer", label_en: "UX Designer", group: "design" },
  { value: "ui_designer", label_fr: "UI Designer", label_en: "UI Designer", group: "design" },
  { value: "product_designer", label_fr: "Product Designer", label_en: "Product Designer", group: "design" },
  { value: "graphic_designer", label_fr: "Graphiste", label_en: "Graphic Designer", group: "design" },
  { value: "motion_designer", label_fr: "Motion Designer", label_en: "Motion Designer", group: "design" },
  { value: "brand_designer", label_fr: "Brand Designer", label_en: "Brand Designer", group: "design" },
  { value: "illustrator", label_fr: "Illustrateur·rice", label_en: "Illustrator", group: "design" },
  // Tech
  { value: "frontend_dev", label_fr: "Développeur·se Front-end", label_en: "Front-end Developer", group: "tech" },
  { value: "backend_dev", label_fr: "Développeur·se Back-end", label_en: "Back-end Developer", group: "tech" },
  { value: "fullstack_dev", label_fr: "Développeur·se Full-stack", label_en: "Full-stack Developer", group: "tech" },
  { value: "mobile_dev", label_fr: "Développeur·se Mobile", label_en: "Mobile Developer", group: "tech" },
  { value: "devops", label_fr: "DevOps / SRE", label_en: "DevOps / SRE", group: "tech" },
  { value: "qa_engineer", label_fr: "QA Engineer", label_en: "QA Engineer", group: "tech" },
  { value: "tech_lead", label_fr: "Tech Lead / CTO Fractional", label_en: "Tech Lead / Fractional CTO", group: "tech" },
  // Data & AI
  { value: "data_analyst", label_fr: "Data Analyst", label_en: "Data Analyst", group: "data" },
  { value: "data_scientist", label_fr: "Data Scientist", label_en: "Data Scientist", group: "data" },
  { value: "data_engineer", label_fr: "Data Engineer", label_en: "Data Engineer", group: "data" },
  { value: "ml_engineer", label_fr: "ML / AI Engineer", label_en: "ML / AI Engineer", group: "data" },
  // Product
  { value: "product_manager", label_fr: "Product Manager", label_en: "Product Manager", group: "product" },
  { value: "product_owner", label_fr: "Product Owner", label_en: "Product Owner", group: "product" },
  { value: "scrum_master", label_fr: "Scrum Master / Agile Coach", label_en: "Scrum Master / Agile Coach", group: "product" },
  { value: "project_manager", label_fr: "Chef·fe de projet", label_en: "Project Manager", group: "product" },
  // Marketing & Growth
  { value: "growth_marketer", label_fr: "Growth Marketer", label_en: "Growth Marketer", group: "marketing" },
  { value: "seo_consultant", label_fr: "Consultant·e SEO", label_en: "SEO Consultant", group: "marketing" },
  { value: "sea_consultant", label_fr: "Consultant·e SEA / Ads", label_en: "SEA / Ads Consultant", group: "marketing" },
  { value: "social_media_manager", label_fr: "Social Media Manager", label_en: "Social Media Manager", group: "marketing" },
  { value: "crm_consultant", label_fr: "Consultant·e CRM", label_en: "CRM Consultant", group: "marketing" },
  { value: "brand_strategist", label_fr: "Brand Strategist", label_en: "Brand Strategist", group: "marketing" },
  // Content
  { value: "copywriter", label_fr: "Copywriter / Concepteur·rice-rédacteur·rice", label_en: "Copywriter", group: "content" },
  { value: "content_writer", label_fr: "Rédacteur·rice web", label_en: "Content Writer", group: "content" },
  { value: "translator", label_fr: "Traducteur·rice", label_en: "Translator", group: "content" },
  { value: "video_editor", label_fr: "Monteur·se vidéo", label_en: "Video Editor", group: "content" },
  { value: "photographer", label_fr: "Photographe", label_en: "Photographer", group: "content" },
  // Ops / Business
  { value: "business_consultant", label_fr: "Consultant·e Business / Stratégie", label_en: "Business / Strategy Consultant", group: "ops" },
  { value: "ops_consultant", label_fr: "Consultant·e Ops", label_en: "Ops Consultant", group: "ops" },
  { value: "hr_consultant", label_fr: "Consultant·e RH", label_en: "HR Consultant", group: "ops" },
  { value: "finance_consultant", label_fr: "Consultant·e Finance / CFO Fractional", label_en: "Finance Consultant / Fractional CFO", group: "ops" },
  { value: "legal_consultant", label_fr: "Consultant·e Juridique", label_en: "Legal Consultant", group: "ops" },
  { value: "virtual_assistant", label_fr: "Assistant·e virtuel·le", label_en: "Virtual Assistant", group: "ops" },
  // Other
  { value: "other", label_fr: "Autre", label_en: "Other", group: "other" },
];

export function getJobLabel(value: string, lang: string): string {
  const job = JOB_OPTIONS.find((j) => j.value === value || j.label_fr === value || j.label_en === value);
  if (!job) return value;
  return lang.startsWith("fr") ? job.label_fr : job.label_en;
}
