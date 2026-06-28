import React from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Handshake,
  MessageSquareText,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  WalletCards,
} from "lucide-react";
import "./styles.css";

const projects = [
  {
    title: "Launch a 30-day social content calendar",
    business: "Northline Fitness Studio",
    pay: "$420 fixed",
    hours: "8 hrs/week",
    skills: ["Canva", "Writing", "Instagram"],
    match: 94,
  },
  {
    title: "Automate inventory spreadsheet reporting",
    business: "The Green Pantry",
    pay: "$520 fixed",
    hours: "10 hrs/week",
    skills: ["Sheets", "Data", "AI"],
    match: 89,
  },
  {
    title: "Film and edit event recap videos",
    business: "Harbor Youth Arts",
    pay: "$480 fixed",
    hours: "7 hrs/week",
    skills: ["Video", "Storytelling", "Editing"],
    match: 86,
  },
];

const steps = [
  ["Scope", "Businesses choose a 4-week project template or create a custom brief."],
  ["Match", "AI ranks verified students by skill fit, availability, interests, and growth goals."],
  ["Deliver", "Weekly milestones, mentor notes, and payment approvals keep work moving."],
  ["Prove", "Students submit portfolio evidence and receive a verified performance review."],
];

const metrics = [
  ["4 weeks", "fixed project duration"],
  ["5-15", "hours per week"],
  ["92%", "pilot completion target"],
  ["3x", "faster than intern hiring"],
];

const audiences = [
  {
    icon: GraduationCap,
    title: "Students",
    copy: "Build a resume before college with paid projects, badges, references, and portfolio proof.",
    points: ["Verified reviews", "AI interview prep", "Skill gap roadmap"],
  },
  {
    icon: Building2,
    title: "Small Businesses",
    copy: "Turn practical tasks into affordable, mentored projects without a long hiring process.",
    points: ["Project templates", "Payroll support", "Rehire pipeline"],
  },
  {
    icon: ClipboardList,
    title: "Schools",
    copy: "Verify students, recommend opportunities, track progress, and report placement outcomes.",
    points: ["Credit reporting", "Partner dashboards", "Grant-ready data"],
  },
];

function App() {
  return (
    <main>
      <nav className="nav">
        <a className="brand" href="#top" aria-label="SkillBridge home">
          <span className="brand-mark">S</span>
          <span>SkillBridge</span>
        </a>
        <div className="nav-links" aria-label="Primary navigation">
          <a href="#projects">Projects</a>
          <a href="#platform">Platform</a>
          <a href="#impact">Impact</a>
          <a href="#pricing">Pricing</a>
        </div>
        <a className="nav-cta" href="#demo">
          <span>Request pilot</span>
          <ArrowRight size={16} aria-hidden="true" />
        </a>
      </nav>

      <section id="top" className="hero">
        <div className="hero-media" aria-hidden="true">
          <img src="/skillbridge-hero.png" alt="" />
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">Paid micro-apprenticeships for ages 14-18</p>
          <h1>Real Work. Real Experience. Real Future.</h1>
          <p className="hero-copy">
            SkillBridge connects high school students with 4-week paid projects at local small
            businesses, backed by AI matching, school verification, mentor tools, and portfolio
            outcomes.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#projects">
              <Search size={18} aria-hidden="true" />
              Browse live projects
            </a>
            <a className="secondary-button" href="#platform">
              <Play size={18} aria-hidden="true" />
              See how it works
            </a>
          </div>
        </div>
      </section>

      <section className="metrics" aria-label="Platform metrics">
        {metrics.map(([value, label]) => (
          <div className="metric" key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section id="projects" className="section project-section">
        <div className="section-heading">
          <p className="eyebrow dark">Marketplace preview</p>
          <h2>Teen-friendly projects with adult-level clarity.</h2>
          <p>
            Every listing includes pay, estimated hours, deliverables, skills, mentor ownership,
            and a final portfolio submission.
          </p>
        </div>

        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.title}>
              <div className="card-topline">
                <span>{project.match}% AI match</span>
                <BadgeCheck size={18} aria-hidden="true" />
              </div>
              <h3>{project.title}</h3>
              <p>{project.business}</p>
              <div className="project-meta">
                <span>
                  <WalletCards size={16} aria-hidden="true" />
                  {project.pay}
                </span>
                <span>
                  <CalendarCheck size={16} aria-hidden="true" />
                  {project.hours}
                </span>
              </div>
              <div className="skill-row">
                {project.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="platform" className="section platform-section">
        <div className="workflow">
          <div className="section-heading compact">
            <p className="eyebrow dark">Operating system</p>
            <h2>From project brief to verified portfolio in four weeks.</h2>
          </div>
          <div className="steps">
            {steps.map(([title, copy], index) => (
              <div className="step" key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <p>Business dashboard</p>
              <h3>Project health</h3>
            </div>
            <Sparkles size={22} aria-hidden="true" />
          </div>
          <div className="progress-stack">
            <Progress label="Milestones approved" value="75%" />
            <Progress label="Portfolio evidence" value="58%" />
            <Progress label="Mentor feedback" value="86%" />
          </div>
          <div className="insight">
            <MessageSquareText size={20} aria-hidden="true" />
            <p>
              AI summary: student is ahead on research, needs one mentor review before final
              campaign handoff.
            </p>
          </div>
        </div>
      </section>

      <section className="section audiences">
        {audiences.map(({ icon: Icon, title, copy, points }) => (
          <article className="audience-card" key={title}>
            <Icon size={28} aria-hidden="true" />
            <h3>{title}</h3>
            <p>{copy}</p>
            <ul>
              {points.map((point) => (
                <li key={point}>
                  <CheckCircle2 size={16} aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section id="impact" className="section impact-section">
        <div>
          <p className="eyebrow dark">Grant and workforce ready</p>
          <h2>Designed for measurable youth employment outcomes.</h2>
          <p>
            SkillBridge gives schools, cities, and workforce agencies the reporting layer they need
            to fund, measure, and scale paid student work experience.
          </p>
        </div>
        <div className="impact-grid">
          <Impact icon={Users} value="1,240" label="student placements tracked" />
          <Impact icon={BriefcaseBusiness} value="$486k" label="student earnings projected" />
          <Impact icon={BarChart3} value="38" label="grant metrics exported" />
          <Impact icon={ShieldCheck} value="100%" label="verified school eligibility" />
        </div>
      </section>

      <section id="pricing" className="section pricing-section">
        <div className="section-heading compact">
          <p className="eyebrow dark">B2B SaaS model</p>
          <h2>Simple plans for businesses, schools, and regional partners.</h2>
        </div>
        <div className="pricing-grid">
          <Plan
            name="Starter"
            price="$49"
            copy="For small businesses posting occasional projects."
            items={["2 active projects", "Project templates", "Student chat", "Review tools"]}
          />
          <Plan
            name="Growth"
            price="$149"
            copy="For employers building a repeat teen talent pipeline."
            items={["AI candidate matching", "Payroll support", "Mentor dashboard", "Rehire lists"]}
            featured
          />
          <Plan
            name="Partner"
            price="Custom"
            copy="For schools, municipalities, and workforce agencies."
            items={["Student verification", "Placement analytics", "Credit tracking", "Grant reports"]}
          />
        </div>
      </section>

      <section id="demo" className="cta-band">
        <Handshake size={34} aria-hidden="true" />
        <div>
          <h2>Launch a local pilot with 50 businesses and 100 students.</h2>
          <p>
            Start with one region, prove placement outcomes, then expand through schools,
            chambers, and workforce development partners.
          </p>
        </div>
        <a className="primary-button light" href="mailto:pilot@skillbridge.example">
          Start pilot
          <ArrowRight size={18} aria-hidden="true" />
        </a>
      </section>
    </main>
  );
}

function Progress({ label, value }) {
  return (
    <div className="progress-item">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="progress-track">
        <span style={{ width: value }} />
      </div>
    </div>
  );
}

function Impact({ icon: Icon, value, label }) {
  return (
    <article className="impact-card">
      <Icon size={22} aria-hidden="true" />
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}

function Plan({ name, price, copy, items, featured = false }) {
  return (
    <article className={`plan ${featured ? "featured" : ""}`}>
      <div className="plan-head">
        <h3>{name}</h3>
        {featured && <span>Popular</span>}
      </div>
      <strong>{price}</strong>
      <p>{copy}</p>
      <ul>
        {items.map((item) => (
          <li key={item}>
            <Star size={15} aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

createRoot(document.getElementById("root")).render(<App />);
