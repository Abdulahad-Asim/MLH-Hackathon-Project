const SUPABASE_URL = "https://jgepcpicrgqjwygxzctl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpnZXBjcGljcmdxand5Z3h6Y3RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NTM2ODgsImV4cCI6MjA5ODIyOTY4OH0.rN3nv4O7NeNPvpjrwkE5G4PN771v32Nws8I3IJ1e7cg";
const BUSINESS_LISTING_FEE = 19;
const STUDENT_HIRED_FEE = 5;

const seedListings = [
  {
    id: "listing-1",
    title: "Launch a 30-day social content calendar",
    business_name: "Northline Fitness Studio",
    business_email: "owner@northlinefitness.com",
    business_phone: "555-0101",
    location: "Toronto, ON",
    description: "Create a month of Instagram content, captions, and a posting plan.",
    pay: "$420 fixed",
    hours: "8 hrs/week",
    skills: ["Canva", "Writing", "Instagram"],
    match: 94,
    category: "creative",
    status: "open",
    listing_fee_status: "pending",
    created_at: new Date().toISOString(),
  },
  {
    id: "listing-2",
    title: "Automate inventory spreadsheet reporting",
    business_name: "The Green Pantry",
    business_email: "ops@greenpantry.com",
    business_phone: "555-0144",
    location: "Mississauga, ON",
    description: "Clean up weekly inventory data and build a simple reporting dashboard.",
    pay: "$520 fixed",
    hours: "10 hrs/week",
    skills: ["Sheets", "Data", "AI"],
    match: 89,
    category: "tech",
    status: "open",
    listing_fee_status: "pending",
    created_at: new Date().toISOString(),
  },
  {
    id: "listing-3",
    title: "Film and edit event recap videos",
    business_name: "Harbor Youth Arts",
    business_email: "events@harboryoutharts.com",
    business_phone: "555-0180",
    location: "Scarborough, ON",
    description: "Capture two youth arts events and deliver three short edited clips.",
    pay: "$480 fixed",
    hours: "7 hrs/week",
    skills: ["Video", "Storytelling", "Editing"],
    match: 86,
    category: "creative",
    status: "open",
    listing_fee_status: "pending",
    created_at: new Date().toISOString(),
  },
  {
    id: "listing-4",
    title: "Clean up CRM records and customer survey tags",
    business_name: "Cedar Lane Dental",
    business_email: "admin@cedarlanedental.com",
    business_phone: "555-0119",
    location: "Brampton, ON",
    description: "Organize contact records and summarize survey themes for the owner.",
    pay: "$360 fixed",
    hours: "6 hrs/week",
    skills: ["Data entry", "Research", "Detail"],
    match: 82,
    category: "ops",
    status: "open",
    listing_fee_status: "pending",
    created_at: new Date().toISOString(),
  },
  {
    id: "listing-5",
    title: "Build a simple appointment reminder workflow",
    business_name: "Maple Street Salon",
    business_email: "hello@maplestreetsalon.com",
    business_phone: "555-0128",
    location: "Etobicoke, ON",
    description: "Build an email reminder workflow and document how staff can use it.",
    pay: "$600 fixed",
    hours: "9 hrs/week",
    skills: ["Automation", "Email", "AI"],
    match: 91,
    category: "tech",
    status: "open",
    listing_fee_status: "pending",
    created_at: new Date().toISOString(),
  },
  {
    id: "listing-6",
    title: "Plan and promote a neighborhood pop-up event",
    business_name: "Oak & Thread Boutique",
    business_email: "shop@oakandthread.com",
    business_phone: "555-0165",
    location: "Hamilton, ON",
    description: "Help plan vendors, outreach, signage, and social posts for a local event.",
    pay: "$450 fixed",
    hours: "8 hrs/week",
    skills: ["Events", "Design", "Outreach"],
    match: 88,
    category: "ops",
    status: "open",
    listing_fee_status: "pending",
    created_at: new Date().toISOString(),
  },
];

const projectGrid = document.querySelector("#projectGrid");
const liveListings = document.querySelector("#liveListings");
const applicationsList = document.querySelector("#applicationsList");
const notificationBox = document.querySelector("#notificationBox");
const ownerStatus = document.querySelector("#ownerStatus");
const authStatus = document.querySelector("#authStatus");
const authForm = document.querySelector("#authForm");
const signInButton = document.querySelector("#signInButton");
const signOutButton = document.querySelector("#signOutButton");
const profileTitle = document.querySelector("#profileTitle");
const profileDetails = document.querySelector("#profileDetails");
const jobsAuthHint = document.querySelector("#jobsAuthHint");
const businessAuthHint = document.querySelector("#businessAuthHint");
const listingForm = document.querySelector("#listingForm");
const applicationForm = document.querySelector("#applicationForm");
const applicationListingId = document.querySelector("#applicationListingId");
const selectedListingTitle = document.querySelector("#selectedListingTitle");
const businessPhoneInput = document.querySelector('input[name="business_phone"]');
const filters = document.querySelectorAll(".filter");
const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll(".nav-links a, .brand, .nav-cta");

let activeCategory = "all";
let listings = [];
let applications = [];
let notifications = [];
let currentUser = null;
let currentProfile = null;

const supabaseClient =
  SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function hasRole(role) {
  return currentProfile?.role === role;
}

async function loadSession() {
  if (!supabaseClient) {
    currentUser = null;
    currentProfile = null;
    renderAuthState();
    return;
  }

  const { data } = await supabaseClient.auth.getSession();
  currentUser = data.session?.user || null;
  currentProfile = currentUser ? await fetchProfile(currentUser.id) : null;
  renderAuthState();
}

async function fetchProfile(userId) {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.warn("Could not load profile", error);
    return null;
  }

  return data;
}

async function upsertProfile(user, role, displayName) {
  if (!supabaseClient || !user) return;
  const { error } = await supabaseClient.from("profiles").upsert({
    id: user.id,
    email: user.email,
    role,
    display_name: displayName || user.email,
  });

  if (error) {
    alert(`Account created, but profile could not be saved: ${error.message}`);
  }
}

function renderAuthState() {
  const signedIn = Boolean(currentUser);
  const roleLabel = currentProfile?.role === "business"
    ? "Business owner"
    : currentProfile?.role === "student"
      ? "Student"
      : "Profile pending";

  authStatus.textContent = signedIn
    ? `${roleLabel}: ${currentUser.email}`
    : supabaseClient
      ? "Signed out"
      : "Offline access";

  profileTitle.textContent = signedIn ? `${roleLabel} account` : "No one is signed in";
  profileDetails.textContent = signedIn
    ? `${currentUser.email} is signed in. The app will only show records this account is allowed to access.`
    : "Create an account first. Then use the student or business pages with secure access.";
  signOutButton.hidden = !signedIn;

  jobsAuthHint.textContent = hasRole("student")
    ? "You are signed in as a student and can apply to open listings."
    : "Sign in as a student before applying.";
  businessAuthHint.textContent = hasRole("business")
    ? "You are signed in as a business owner and can manage your listings."
    : "Sign in as a business owner before posting or hiring.";

  selectedListingTitle.disabled = true;
}

function readLocal(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function writeLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function splitSkills(value) {
  return String(value || "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function selectedSkills(form) {
  const checked = [...form.querySelectorAll('input[name="skills"]:checked')].map((item) => item.value);
  const typed = splitSkills(new FormData(form).get("skills"));
  return checked.length ? checked : typed;
}

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

async function loadData() {
  if (supabaseClient) {
    const requests = [supabaseClient.from("listings").select("*").order("created_at", { ascending: false })];

    if (currentUser) {
      requests.push(
        supabaseClient.from("applications").select("*").order("created_at", { ascending: false }),
        supabaseClient.from("notifications").select("*").order("created_at", { ascending: false }),
      );
    }

    const [listingResult, applicationResult, notificationResult] = await Promise.all(requests);
    const { data: listingRows, error: listingError } = listingResult;
    const { data: applicationRows = [], error: appError } = applicationResult || {};
    const { data: notificationRows = [] } = notificationResult || {};

    if (listingError || appError) {
      setStatus("Connection needs attention");
      listings = seedListings;
      applications = [];
      notifications = [];
    } else {
      listings = listingRows.length ? listingRows : seedListings;
      applications = applicationRows || [];
      notifications = notificationRows || [];
      setStatus(currentUser ? "Ready" : "Sign in required");
    }
  } else {
    listings = readLocal("skillbridge_listings", seedListings);
    applications = readLocal("skillbridge_applications", []);
    notifications = readLocal("skillbridge_notifications", []);
    setStatus("Ready");
  }

  renderAll();
}

function setStatus(text) {
  ownerStatus.textContent = text;
}

function renderAll() {
  renderProjects(activeCategory);
  renderLiveListings();
  renderApplications();
  renderNotifications();
}

function renderProjects(category = "all") {
  activeCategory = category;
  const visible = listings.filter((listing) => category === "all" || listing.category === category);
  projectGrid.innerHTML = visible.map(projectCard).join("");
}

function projectCard(listing) {
  const match = listing.match || estimateMatch(listing);
  return `
    <article class="project-card">
      <div class="card-topline">
        <span>${match}% AI match</span>
        <span aria-hidden="true">${listing.status === "open" ? "Open" : "Hired"}</span>
      </div>
      <h3>${escapeHtml(listing.title)}</h3>
      <p>${escapeHtml(listing.business_name)} &middot; ${escapeHtml(listing.location)}</p>
      <div class="project-meta">
        <span>${escapeHtml(listing.pay)}</span>
        <span>${escapeHtml(listing.hours)}</span>
      </div>
      <div class="skill-row">
        ${(listing.skills || []).map((skill) => `<span>${escapeHtml(skill)}</span>`).join("")}
      </div>
    </article>
  `;
}

function renderLiveListings() {
  const openListings = listings.filter((listing) => listing.status === "open");
  liveListings.innerHTML = openListings.length
    ? openListings
        .map(
          (listing) => `
            <article class="list-row">
              <div>
                <h4>${escapeHtml(listing.title)}</h4>
                <p>${escapeHtml(listing.business_name)} &middot; ${escapeHtml(listing.location)} &middot; ${escapeHtml(listing.pay)}</p>
              </div>
              <button class="mini-button" type="button" data-apply="${listing.id}" ${
                supabaseClient && !hasRole("student") ? "disabled" : ""
              }>Apply</button>
            </article>
          `,
        )
        .join("")
    : `<div class="empty-state">No open listings yet.</div>`;

  liveListings.querySelectorAll("[data-apply]").forEach((button) => {
    button.addEventListener("click", () => selectListing(button.dataset.apply));
  });
}

function renderApplications() {
  applicationsList.innerHTML = applications.length
    ? applications
        .map((application) => {
          const listing = listings.find((item) => item.id === application.listing_id);
          return `
            <article class="application-card">
              <div class="application-head">
                <div>
                  <h4>${escapeHtml(application.student_name)}</h4>
                  <p>${escapeHtml(application.school)} &middot; ${escapeHtml(application.availability)}</p>
                </div>
                <span>${escapeHtml(application.status.replace("_", " "))}</span>
              </div>
              <p><strong>Listing:</strong> ${listing ? escapeHtml(listing.title) : "Deleted listing"}</p>
              <p><strong>Email:</strong> ${escapeHtml(application.student_email)}</p>
              <p><strong>Skills:</strong> ${escapeHtml((application.skills || []).join(", "))}</p>
              <p>${escapeHtml(application.resume)}</p>
              ${
                application.portfolio_url
                  ? `<a class="text-link" href="${escapeHtml(application.portfolio_url)}" target="_blank" rel="noreferrer">Portfolio</a>`
                  : ""
              }
              <button class="mini-button hire-button" type="button" data-hire="${application.id}" ${
                application.status === "selected" ? "disabled" : ""
              }>Select and notify</button>
            </article>
          `;
        })
        .join("")
    : `<div class="empty-state">Applications submitted by students will appear here.</div>`;

  applicationsList.querySelectorAll("[data-hire]").forEach((button) => {
    button.addEventListener("click", () => hireApplicant(button.dataset.hire));
  });
}

function renderNotifications() {
  const selected = notifications[0];
  notificationBox.innerHTML = selected
    ? `<strong>Selected:</strong> ${escapeHtml(selected.message)}<br><span>Student fee due: $${Number(selected.fee_amount || STUDENT_HIRED_FEE).toFixed(2)}</span>`
    : "Student notifications will appear here after a business owner selects an applicant.";
}

function selectListing(id) {
  const listing = listings.find((item) => item.id === id);
  if (!listing) return;
  applicationListingId.value = listing.id;
  selectedListingTitle.value = `${listing.title} at ${listing.business_name}`;
  if (location.hash !== "#jobs") {
    location.hash = "jobs";
  }
  applicationForm.scrollIntoView({ behavior: "smooth", block: "center" });
}

async function createListing(event) {
  event.preventDefault();
  if (supabaseClient && !hasRole("business")) {
    alert("Sign in as a business owner before creating a listing.");
    location.hash = "account";
    return;
  }

  const data = Object.fromEntries(new FormData(listingForm).entries());
  const skills = selectedSkills(listingForm);
  if (!skills.length) {
    alert("Choose at least one required skill.");
    return;
  }

  const listing = {
    owner_id: currentUser?.id,
    business_name: data.business_name,
    business_email: data.business_email,
    business_phone: data.business_phone,
    location: data.location,
    title: data.title,
    description: data.description,
    pay: data.pay,
    hours: data.hours,
    category: data.category,
    skills,
    status: "open",
    listing_fee_status: "pending",
  };

  if (supabaseClient) {
    const { error } = await supabaseClient.from("listings").insert(listing);
    if (error) return alert(`Could not create listing: ${error.message}`);
  } else {
    listings = [{ ...listing, id: crypto.randomUUID(), created_at: new Date().toISOString() }, ...listings];
    writeLocal("skillbridge_listings", listings);
  }

  listingForm.reset();
  alert(`Listing posted. Charge business owner $${BUSINESS_LISTING_FEE} listing fee at payment step.`);
  await loadData();
  location.hash = "jobs";
}

async function createApplication(event) {
  event.preventDefault();
  if (supabaseClient && !hasRole("student")) {
    alert("Sign in as a student before applying.");
    location.hash = "account";
    return;
  }

  if (!applicationListingId.value) {
    alert("Choose a listing before applying.");
    return;
  }

  const data = Object.fromEntries(new FormData(applicationForm).entries());
  const skills = selectedSkills(applicationForm);
  if (!skills.length) {
    alert("Choose at least one skill.");
    return;
  }

  const application = {
    student_id: currentUser?.id,
    listing_id: data.listing_id,
    student_name: data.student_name,
    student_email: data.student_email,
    school: data.school,
    availability: data.availability,
    skills,
    portfolio_url: data.portfolio_url,
    resume: data.resume,
    status: "submitted",
    student_fee_status: "pending",
  };

  if (supabaseClient) {
    const { error } = await supabaseClient.from("applications").insert(application);
    if (error) return alert(`Could not submit application: ${error.message}`);
  } else {
    applications = [{ ...application, id: crypto.randomUUID(), created_at: new Date().toISOString() }, ...applications];
    writeLocal("skillbridge_applications", applications);
  }

  applicationForm.reset();
  applicationListingId.value = "";
  selectedListingTitle.value = "Choose a listing";
  alert("Application submitted to the business owner.");
  await loadData();
}

async function hireApplicant(applicationId) {
  if (supabaseClient && !hasRole("business")) {
    alert("Sign in as a business owner before selecting applicants.");
    location.hash = "account";
    return;
  }

  const application = applications.find((item) => item.id === applicationId);
  if (!application) return;
  const listing = listings.find((item) => item.id === application.listing_id);
  const message = `You were selected for ${listing ? listing.title : "a SkillBridge project"}. Please complete the $${STUDENT_HIRED_FEE} student placement fee.`;
  const notification = {
    application_id: application.id,
    student_id: application.student_id,
    student_email: application.student_email,
    message,
    fee_amount: STUDENT_HIRED_FEE,
  };

  if (supabaseClient) {
    const updates = [
      supabaseClient.from("applications").update({ status: "selected" }).eq("id", application.id),
      supabaseClient.from("notifications").insert(notification),
    ];
    if (listing) {
      updates.push(
        supabaseClient
          .from("listings")
          .update({ status: "hired", selected_application_id: application.id })
          .eq("id", listing.id),
      );
    }
    const results = await Promise.all(updates);
    const error = results.find((result) => result.error)?.error;
    if (error) return alert(`Could not select applicant: ${error.message}`);
  } else {
    applications = applications.map((item) =>
      item.id === application.id ? { ...item, status: "selected" } : item,
    );
    listings = listings.map((item) =>
      item.id === application.listing_id
        ? { ...item, status: "hired", selected_application_id: application.id }
        : item,
    );
    notifications = [{ ...notification, id: crypto.randomUUID(), created_at: new Date().toISOString() }, ...notifications];
    writeLocal("skillbridge_applications", applications);
    writeLocal("skillbridge_listings", listings);
    writeLocal("skillbridge_notifications", notifications);
  }

  alert(`Student selected and notified. Charge business owner $${BUSINESS_LISTING_FEE} and selected student $${STUDENT_HIRED_FEE}.`);
  await loadData();
}

async function handleAuth(event) {
  event.preventDefault();
  if (!supabaseClient) {
    alert("Supabase is not configured, so auth is unavailable.");
    return;
  }

  const submitter = event.submitter;
  const action = authForm.dataset.authMode || submitter?.dataset.authAction || "signup";
  const data = Object.fromEntries(new FormData(authForm).entries());

  if (action === "signup") {
    const { data: signUpData, error } = await supabaseClient.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) return alert(`Could not create account: ${error.message}`);
    if (signUpData.user) {
      await upsertProfile(signUpData.user, data.role, data.display_name);
    }

    alert("Account created. If Supabase asks for email confirmation, confirm your email before signing in.");
  } else {
    const { data: signInData, error } = await supabaseClient.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) return alert(`Could not sign in: ${error.message}`);
    if (signInData.user) {
      const profile = await fetchProfile(signInData.user.id);
      if (!profile) {
        await upsertProfile(signInData.user, data.role, data.display_name);
      }
    }
  }

  authForm.reset();
  authForm.dataset.authMode = "";
  await loadSession();
  await loadData();
}

async function signOut() {
  if (!supabaseClient) return;
  await supabaseClient.auth.signOut();
  currentUser = null;
  currentProfile = null;
  renderAuthState();
  await loadData();
  location.hash = "account";
}

function estimateMatch(listing) {
  const base = listing.category === "tech" ? 89 : listing.category === "creative" ? 86 : 83;
  return Math.min(base + (listing.skills || []).length, 96);
}

function routeFromHash() {
  const route = location.hash.replace("#", "") || "home";
  return ["home", "account", "post-job", "jobs"].includes(route) ? route : "home";
}

function renderRoute() {
  const route = routeFromHash();
  pages.forEach((page) => {
    page.hidden = page.dataset.page !== route;
  });

  navLinks.forEach((link) => {
    const linkRoute = link.getAttribute("href")?.replace("#", "");
    link.classList.toggle("active-route", linkRoute === route);
  });

  window.scrollTo({ top: 0, behavior: "auto" });
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

businessPhoneInput.addEventListener("input", () => {
  businessPhoneInput.value = formatPhone(businessPhoneInput.value);
});

listingForm.addEventListener("submit", createListing);
applicationForm.addEventListener("submit", createApplication);
authForm.addEventListener("submit", handleAuth);
signInButton.addEventListener("click", () => {
  authForm.dataset.authMode = "signin";
  authForm.requestSubmit();
});
signOutButton.addEventListener("click", signOut);
window.addEventListener("hashchange", renderRoute);

if (supabaseClient) {
  supabaseClient.auth.onAuthStateChange(async () => {
    await loadSession();
    await loadData();
  });
}

(async function init() {
  await loadSession();
  await loadData();
  renderRoute();
})();
