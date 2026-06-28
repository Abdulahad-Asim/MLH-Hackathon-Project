const projects = [
  {
    title: "Launch a 30-day social content calendar",
    business: "Northline Fitness Studio",
    pay: "$420 fixed",
    hours: "8 hrs/week",
    skills: ["Canva", "Writing", "Instagram"],
    match: 94,
    category: "creative",
  },
  {
    title: "Automate inventory spreadsheet reporting",
    business: "The Green Pantry",
    pay: "$520 fixed",
    hours: "10 hrs/week",
    skills: ["Sheets", "Data", "AI"],
    match: 89,
    category: "tech",
  },
  {
    title: "Film and edit event recap videos",
    business: "Harbor Youth Arts",
    pay: "$480 fixed",
    hours: "7 hrs/week",
    skills: ["Video", "Storytelling", "Editing"],
    match: 86,
    category: "creative",
  },
  {
    title: "Clean up CRM records and customer survey tags",
    business: "Cedar Lane Dental",
    pay: "$360 fixed",
    hours: "6 hrs/week",
    skills: ["Data entry", "Research", "Detail"],
    match: 82,
    category: "ops",
  },
  {
    title: "Build a simple appointment reminder workflow",
    business: "Maple Street Salon",
    pay: "$600 fixed",
    hours: "9 hrs/week",
    skills: ["Automation", "Email", "AI"],
    match: 91,
    category: "tech",
  },
  {
    title: "Plan and promote a neighborhood pop-up event",
    business: "Oak & Thread Boutique",
    pay: "$450 fixed",
    hours: "8 hrs/week",
    skills: ["Events", "Design", "Outreach"],
    match: 88,
    category: "ops",
  },
];

const projectGrid = document.querySelector("#projectGrid");
const filters = document.querySelectorAll(".filter");

function renderProjects(category = "all") {
  const visible = projects.filter((project) => category === "all" || project.category === category);
  projectGrid.innerHTML = visible
    .map(
      (project) => `
        <article class="project-card">
          <div class="card-topline">
            <span>${project.match}% AI match</span>
            <span aria-hidden="true">OK</span>
          </div>
          <h3>${project.title}</h3>
          <p>${project.business}</p>
          <div class="project-meta">
            <span>${project.pay}</span>
            <span>${project.hours}</span>
          </div>
          <div class="skill-row">
            ${project.skills.map((skill) => `<span>${skill}</span>`).join("")}
          </div>
        </article>
      `,
    )
    .join("");
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderProjects(button.dataset.filter);
  });
});

document.querySelectorAll(".progress-item").forEach((item) => {
  const bar = item.querySelector(".progress-track span");
  requestAnimationFrame(() => {
    bar.style.width = `${item.dataset.value}%`;
  });
});

renderProjects();
