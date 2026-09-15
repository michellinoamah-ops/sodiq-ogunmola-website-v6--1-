/* Static content for the site. Publications are also mirrored into Firestore
   by the admin panel once the "import starter list" action is used there;
   until then, this file is the single source of truth for public visitors. */

const SITE = {
  name: "Sodiq Ogunmola",
  suffix: "CFE, CISA",
  tagline: "Financial Reporting & Risk Research",
  email: "sodeeqogunmola@gmail.com",
  email2: "sogunmola@lamar.edu",
  phone: "+1 (409) 297-9305",
  linkedin: "https://www.linkedin.com/in/sodiq-ogunmola-olaleye",
  location: "Houston, Texas, USA"
};

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "publications", label: "Publications" },
  { id: "contact", label: "Contact" }
];

const SLIDESHOW_IMAGES = [
  { src: "assets/images/desk-agbada.jpg", caption: "At the desk, reviewing quarterly close reports" },
  { src: "assets/images/speaking-1.jpg", caption: "Leading a finance training session, Pan African Towers Limited" },
  { src: "assets/images/portrait-suit.jpg", caption: "Pan African Towers Limited, Lagos" },
  { src: "assets/images/speaking-2.jpg", caption: "Workshop session with the finance and project team" },
  { src: "assets/images/campus.jpg", caption: "Lamar University campus, Beaumont, Texas" }
];

const PUBLICATIONS = [
  {
    id: "ml-fraud-detection-us-finance",
    title: "Enhancing Risk Management and Fraud Detection in the U.S. Financial Industry through Machine Learning Algorithms",
    subtitle: "Applications, Challenges, and Future Directions",
    journal: "International Journal of Management Sciences and Business Research (IJMSBR)",
    year: "2025",
    type: "Research Paper",
    tags: ["Machine Learning", "Risk Management", "Fraud Detection"],
    summary: "Surveys machine learning applications used by institutions such as JPMorgan Chase, Mastercard and PayPal to reduce false positives and speed up fraud detection, and outlines the regulatory, bias and explainability challenges shaping the next generation of risk models.",
    abstract: "The U.S. financial industry faces unprecedented challenges from rapidly emerging risk factors and growing sophistication of fraud schemes. Conventional fraud management frameworks and much of the fraud detection toolkit have their limitations in addressing fast evolving and dynamic threats because they are often based on static rules and historical patterns. This article reviews machine learning applications, from anomaly detection models flagging unusual transactions to predictive analytics systems assessing credit and market risk, with case studies of systems developed and applied by institutions such as JPMorgan Chase, Mastercard, and PayPal. Challenges include regulatory requirements, data privacy concerns, algorithmic bias, high implementation costs, and the opacity of complex models. The article closes with future directions including explainable AI, federated learning, hybrid detection systems, and stronger governance frameworks.",
    authors: "Sodiq Ogunmola",
    file: "assets/docs/ml-fraud-detection-us-finance.pdf",
    link: "https://www.ijmsbr.com/publications-of-ijmsbr/article/2197/",
    image: "assets/images/speaking-1.jpg",
    order: 2
  },
  {
    id: "ai-financial-reporting-quality",
    title: "AI-Driven Financial Reporting Quality and Cost Optimization in Large Enterprises",
    subtitle: "",
    journal: "International Journal of Science, Architecture, Technology, and Environment (IJSATE)",
    year: "2024",
    type: "Research Paper",
    tags: ["Artificial Intelligence", "Financial Reporting", "Cost Optimization"],
    summary: "Maps how machine learning, NLP and intelligent automation improve the accuracy, consistency and timeliness of enterprise financial reporting, and quantifies back-office cost reductions of roughly 20 to 40 percent alongside the governance safeguards needed to sustain them.",
    abstract: "This research investigates artificial intelligence's role in enhancing the quality and cost effectiveness of financial reporting within large corporations. Reporting processes have become more complex and data heavy, allowing supporting technologies such as machine learning, natural language processing, predictive analysis and intelligent automation to become more prevalent, all in service of accuracy and operational efficiency. Through a systematic review of pertinent literature, regulatory documents and industry case evidence, the study finds that AI performs repetitive financial activities without intervention, diminishes human error, reinforces internal controls through better anomaly detection, and brings clarity and consistency into narrative disclosures. From a cost perspective, AI automation reduces back office processing costs, typically between 20 and 40 percent. Challenges remain around data governance, model validation difficulties and regulatory uncertainties. The study concludes that AI is capable of enhancing both financial reporting quality and cost efficiency within large enterprises when supported by a strong governance framework and a high quality data environment.",
    authors: "Sodiq Ogunmola and Taiwo Justice Olorunlana",
    file: "assets/docs/ai-financial-reporting-quality.pdf",
    link: "https://doi.org/10.63680/ijsate0124011.011",
    image: "assets/images/desk-agbada.jpg",
    order: 3
  },
  {
    id: "audit-technology-adoption",
    title: "Audit Technology Adoption and Its Influence on Detecting Financial Reporting Fraud and Misstatements",
    subtitle: "",
    journal: "International Journal of Science, Architecture, Technology, and Environment (IJSATE)",
    year: "2024",
    type: "Research Paper",
    tags: ["Audit Technology", "Fraud Detection", "CAATs"],
    summary: "Reviews how data analytics, machine learning, AI and computer-assisted audit techniques (CAATs) strengthen fraud and misstatement detection compared with traditional sampling-based audits, while weighing model opacity, data governance and the continued need for auditor judgment.",
    abstract: "The adoption of modern audit tools such as data analytics, machine learning, artificial intelligence and computer-assisted audit techniques (CAATs) have acted as game changers in detecting financial reporting fraud and misstatements. Traditional audit methods rely heavily on manual sampling and professional judgment, which is often insufficient for identifying complex or subtle fraudulent activity. This literature review synthesizes prior studies on audit technology adoption and its impact on detecting financial fraud, alongside efficacy, challenges and limitations, before turning to methodology for implementing these technologies in auditing practice. Findings indicate considerable improvement in fraud detection capability following adoption of audit technology, though auditors should remain mindful of technological reliance and complement it with human judgment, ethics and strong data governance.",
    authors: "Sodiq Ogunmola",
    file: "assets/docs/audit-technology-adoption.pdf",
    link: "https://doi.org/10.63680/ijsate032535.09",
    image: "assets/images/portrait-suit.jpg",
    order: 4
  },
  {
    id: "agile-governance-pfm",
    title: "Agile Governance Frameworks for Strengthening Public Financial Management in Emerging Economies",
    subtitle: "",
    journal: "International Journal of Science, Architecture, Technology, and Environment (IJSATE)",
    year: "2024",
    type: "Research Paper",
    tags: ["Public Financial Management", "Agile Governance", "Policy"],
    summary: "Examines how agile governance, iterative budgeting, cross-functional teams, regulatory sandboxes and real-time dashboards can modernize public financial management in Nigeria, Ghana, Kenya, India, the U.S. and U.K., and sets out a six-phase implementation roadmap for policymakers and PFM reform teams.",
    abstract: "Public Financial Management (PFM) systems in many emerging economies remain afflicted by bureaucratic rigidity, limited fiscal transparency, obsolete legacy systems, weak inter-agency coordination and slowness to respond to economic shocks. This article studies how agile governance frameworks, rooted in approachability, adaptable iterative cycles and collaborative data-informed structures, could strengthen PFM by enhancing fiscal responsiveness, improving budget execution efficiency, and promoting transparency and citizen engagement. It synthesizes literature from the OECD, IMF and World Bank and situates agile governance within Complexity Theory, Institutional Theory and Public Value Governance, with country illustrations from Nigeria, Ghana, Kenya, India, the U.S. and U.K. The article advances an Agile PFM Model and Digital PFM Architecture encompassing modular digital systems, interoperable data layers, regulatory sandboxes, rapid feedback loops, performance dashboards and cross-functional PFM teams, concluding with an implementation roadmap and risk mitigation considerations for policymakers, donors and PFM modernization teams.",
    authors: "Sodiq Ogunmola",
    file: "assets/docs/agile-governance-pfm.pdf",
    link: "https://doi.org/10.63680/ijsate0124009.09",
    image: "assets/images/campus.jpg",
    order: 5
  },
  {
    id: "data-analytics-audit-firms",
    title: "Data Analytics Adoption in Audit Firms: Policy, Capacity Building, and the Future of Accountability",
    subtitle: "",
    journal: "International Journal of Science, Architecture, Technology, and Environment (IJSATE)",
    year: "2024",
    type: "Research Paper",
    tags: ["Data Analytics", "Audit Firms", "Policy"],
    summary: "Looks at what determines whether audit firms successfully adopt data analytics: policy clarity, staff capacity building and firm-level accountability structures, and what that means for audit quality going forward.",
    abstract: "This paper examines the organizational and policy conditions that determine whether audit firms successfully adopt data analytics tools. It argues that adoption depends less on the sophistication of the technology itself and more on policy clarity, sustained staff capacity building, and firm-level accountability structures. The paper draws implications for regulators and professional bodies seeking to encourage responsible, effective analytics adoption across the audit profession.",
    authors: "Sodiq Ogunmola",
    file: null,
    link: "https://ijsate.com/v2i11p07/",
    image: "assets/images/speaking-2.jpg",
    order: 6
  },
  {
    id: "digital-transformation-public-audit",
    title: "Digital Transformation in Public Sector Auditing",
    subtitle: "A Pathway to Fiscal Transparency and Economic Growth: Comparative Insights from the U.S., Nigeria, Kenya, and Ghana",
    journal: "African Journal of Finance, Trade and Investment (AJFTI)",
    year: "2024",
    type: "Research Paper",
    tags: ["Public Sector Audit", "Digital Transformation"],
    summary: "Compares digital public-sector audit reforms across four countries and argues that pairing digital audit tools with capacity building and legal reform is what converts fiscal transparency gains into measurable economic growth.",
    abstract: "This comparative study examines digital transformation initiatives in public sector auditing across the United States, Nigeria, Kenya and Ghana. It finds that digital audit tools alone do not guarantee improved fiscal transparency or economic outcomes; rather, the pairing of technology with capacity building and legal reform is what converts transparency gains into measurable growth. The paper offers a comparative framework for public audit institutions considering digital modernization.",
    authors: "Sodiq Ogunmola",
    file: null,
    link: null,
    image: "assets/images/headshot.jpg",
    order: 7
  },
  {
    id: "cloud-security-emerging-threats",
    title: "The Future of Cloud Security: Addressing Emerging Threats",
    subtitle: "",
    journal: "International Journal of Science, Architecture, Technology, and Environment (IJSATE)",
    year: "2024",
    type: "Research Paper",
    tags: ["Cloud Security", "Risk"],
    summary: "Assesses emerging cloud-security threats facing organizations that store financial and operational data in the cloud, and the controls and monitoring practices needed to keep pace with them.",
    abstract: "As organizations increasingly store financial and operational data in the cloud, the threat landscape facing that data continues to evolve. This paper assesses emerging cloud security threats and the control frameworks and continuous monitoring practices organizations need to adopt to keep pace, with particular attention to the implications for financial data integrity and regulatory compliance.",
    authors: "Sodiq Ogunmola",
    file: null,
    link: "https://ijsate.com/v1i5p5",
    image: "assets/images/desk-agbada.jpg",
    order: 8
  },
  {
    id: "sme-technological-change-lagos",
    title: "Effect of Technological Change on Performance of SMEs in Lagos, Nigeria",
    subtitle: "",
    journal: "Fuoye Journal of Management Science",
    year: "2024",
    type: "Research Paper",
    tags: ["SMEs", "Technology Adoption"],
    summary: "Investigates how the adoption of new technology affects the operating performance of small and medium-sized enterprises in Lagos, Nigeria, with implications for SME policy support.",
    abstract: "This study investigates the relationship between technological change and operating performance among small and medium-sized enterprises (SMEs) in Lagos, Nigeria. Using survey data from SME operators, it finds a significant positive relationship between technology adoption and firm performance, and discusses implications for policy support aimed at accelerating SME digitalization.",
    authors: "Sodiq Ogunmola",
    file: null,
    link: "https://fjms.fuoye.edu.ng/index.php/public_html/article/view/42/31",
    image: "assets/images/portrait-suit.jpg",
    order: 9
  },
  {
    id: "csr-capital-market-performance",
    title: "Effects of Corporate Social Responsibility on Capital Market and Firm Performance",
    subtitle: "",
    journal: "British Journal of Multidisciplinary and Advanced Studies (BJMAS)",
    year: "2023",
    type: "Research Paper",
    tags: ["Corporate Social Responsibility", "Capital Markets", "Firm Performance"],
    summary: "Examines the relationship between corporate social responsibility and firm performance at Seplat Energy Plc, finding CSR donations have a positive but statistically insignificant effect on return on equity, return on assets, and share price over 2014 to 2020.",
    abstract: "This study examines the relationship between corporate social responsibility in the capital market and the firm performance of quoted companies in Nigeria, with Seplat Energy Plc as a case study. The study made use of an ex-post facto research design and adopted the annual reports of Seplat Energy Plc covering the period of 2014 to 2020. CSR was measured using the donations made by the company, while financial performance was measured using net profit margin, return on equity, and return on assets. Data were analysed using simple linear regression with the aid of SPSS version 25. It was discovered that CSR has a negative and insignificant effect on net profit margin, a positive but insignificant effect on return on equity, a positive but insignificant effect on return on assets, and a positive but insignificant effect on share price. It was recommended that Nigerian corporate organisations establish a social responsibility unit to ensure the organisation's responsiveness to social responsibility aligns with international best practice, and that government establish an agency to monitor corporate organisations' social responsibility and oversee CSR policy compliance.",
    authors: "Olorunnisola Abiola Olubukola and Sodiq Ogunmola",
    file: "assets/docs/csr-capital-market-performance.pdf",
    link: "https://doi.org/10.37745/bjmas.2022.0495",
    image: "assets/images/campus.jpg",
    order: 11
  },
  {
    id: "waste-management-kampala",
    title: "Waste Management and Environmental Sustainability in Kampala, Uganda",
    subtitle: "",
    journal: "American Journal of Humanities and Social Sciences Research (AJHSSR)",
    year: "2024",
    type: "Research Paper",
    tags: ["Waste Management", "Environmental Sustainability", "Public Policy"],
    summary: "A survey of 120 respondents in Kampala finds household waste and unpleasant fumes are the leading pollution sources, and that infrastructure, public awareness, and enforcement all correlate strongly with better waste management outcomes.",
    abstract: "This study investigates the relationship between waste management practices and environmental sustainability in Kampala, Uganda. Despite ongoing efforts by the private sector and other stakeholders, solid waste management systems in developing nations, including Kampala, continue to face significant challenges. The research employed a survey design, using simple random sampling with the sample size determined by the Taro Yamane formula, and both descriptive and inferential statistical methods were used for analysis. The findings revealed that household waste accounts for 40% of total waste, followed by unpleasant fumes at 30%, noxious liquids at 13%, and sewage at 17%. Key factors contributing to pollution include illegal dumping, waste disposal in rivers, inadequate drainage systems, and inefficient waste collection. The analysis indicated a strong relationship between infrastructural provisions, awareness, and enforcement control, with correlation coefficients of 0.829, 0.714, and 0.738 respectively. The study concluded that household waste and unpleasant fumes are the major pollution sources in the community, and that stricter enforcement measures, including fines, are necessary to mitigate non-compliance with waste management regulations.",
    authors: "Olorunnisola Abiola Olubukola, Aruwaji Akinola Michael, and Sodiq Ogunmola",
    file: "assets/docs/waste-management-kampala.pdf",
    link: "https://www.ajhssr.com",
    image: "assets/images/desk-agbada.jpg",
    order: 10
  },
  {
    id: "secure-devsecops-federal-cloud",
    title: "Advancing Secure DevSecOps Models to Strengthen Cyber Resilience of U.S. Government Cloud and Federal Information Systems",
    subtitle: "",
    journal: "International Journal of Science, Architecture, Technology, and Environment (IJSATE)",
    year: "2026",
    type: "Research Paper",
    tags: ["DevSecOps", "Cyber Resilience", "Federal Information Systems", "Zero Trust", "FedRAMP"],
    summary: "Synthesizes NIST, FedRAMP, GAO and CISA guidance to propose a socio-technical framework showing how automation, continuous authorization, supply-chain controls, workforce development and culture make Secure DevSecOps a pathway to stronger cyber resilience across federal government cloud systems.",
    abstract: "The rapid transition of U.S. federal systems to cloud infrastructures has introduced new opportunities while simultaneously increasing cybersecurity risks. Traditional, episodic security assessments and perimeter-focused defenses are ill-suited to cloud-native architectures and continuous delivery practices. Secure DevSecOps embedding security throughout development, deployment, and operations presents a pragmatic pathway to increase the cyber resilience of government cloud services and federal information systems. This article synthesizes secondary data from federal standards (NIST SP 800-series), federal programs (FedRAMP), oversight reports (GAO), cybersecurity agencies (CISA), and peer-reviewed literature to (1) characterize the current resilience gap, (2) review DevSecOps mechanisms and evidence for their effectiveness in cloud contexts, (3) present a theoretical framework that links systems engineering resilience to DevSecOps practices, and (4) propose policy and technical recommendations for advancing secure DevSecOps adoption across federal agencies. Findings emphasize automation (IaC & policy-as-code), continuous monitoring/authorization, supply-chain controls, workforce development, and organizational culture as core enablers of resilient federal cloud operations.",
    authors: "Taiwo Justice Olorunlana and Sodiq Ogunmola",
    file: "assets/docs/secure-devsecops-federal-cloud.pdf",
    link: "https://doi.org/10.63680/ijsate0126001.001",
    image: "assets/images/headshot.jpg",
    order: 1
  }
];
