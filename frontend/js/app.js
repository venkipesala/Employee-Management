/* ================= CONFIG ================= */

const BASE_API = "https://5my4jefft9.execute-api.ap-south-1.amazonaws.com/dev";
const API_KEY = "JBaXPwTkVz3SjPpDa44sG1lJ1mUdSVqHayP3LOwV";

const API = {
  EMP: `${BASE_API}/api/employees`,
  DEPT: `${BASE_API}/api/departments`,
  PROJ: `${BASE_API}/api/projects`
};


/* ================= STATE ================= */

let empPage = 0;
let deptPage = 0;
let projectPage = 0;

const empSize = 5;
const deptSize = 5;
const projectSize = 5;

let assignDeptId = null;
let currentDeptId = null;
let assignProjectId = null;
let currentAssignedEmpIds = [];


/* ================= DOM ================= */

let empName, empEmail, empDept, empPhone, empId;
let deptId, deptName, deptLocation;
let projectId, projectName, projectStatus, projectStart, projectEnd;


/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", init);

function init() {

  // Employee
  empName = document.getElementById("empName");
  empEmail = document.getElementById("empEmail");
  empDept = document.getElementById("empDept");
  empPhone = document.getElementById("empPhone");
  empId = document.getElementById("empId");

  // Department
  deptId = document.getElementById("deptId");
  deptName = document.getElementById("deptName");
  deptLocation = document.getElementById("deptLocation");

  // Project
  projectId = document.getElementById("projectId");
  projectName = document.getElementById("projectName");
  projectStatus = document.getElementById("projectStatus");
  projectStart = document.getElementById("projectStart");
  projectEnd = document.getElementById("projectEnd");


  bindForms();

  loadDeptDropdown();
  loadEmployees(0);


  /* ================= NAVIGATION ================= */

  function showSection(section, event) {

    // Hide all sections
    document
      .querySelectorAll(".container")
      .forEach(div => div.classList.add("hidden"));

    // Show selected section
    document
      .getElementById(section + "-section")
      .classList.remove("hidden");

    // Active button
    document
      .querySelectorAll("nav button")
      .forEach(btn => btn.classList.remove("active"));

    if (event && event.target) {
      event.target.classList.add("active");
    }

    // Reset + Reload

    if (section === "employee") {
      document.getElementById("empSearch").value = "";
      loadEmployees(0);
    }

    if (section === "department") {
      loadDepartments(0);
    }

    if (section === "project") {
      document.getElementById("projectSearch").value = "";
      loadProjects(0);
    }
  }

}


/* ================= FORM BINDING ================= */

function bindForms() {

  document
    .getElementById("employeeForm")
    .addEventListener("submit", handleEmployeeSubmit);

  document
    .getElementById("deptForm")
    .addEventListener("submit", handleDeptSubmit);

  document
    .getElementById("projectForm")
    .addEventListener("submit", handleProjectSubmit);
}


/* ================= API ================= */

async function apiCall(url, method = "GET", data = null) {

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const res = await fetch(url, options);

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "API Error");
  }

  const text = await res.text();

  return text ? JSON.parse(text) : null;
}


/* ================= EMPLOYEE ================= */

async function handleEmployeeSubmit(e) {

  e.preventDefault();

  const emp = {
    name: empName.value.trim(),
    email: empEmail.value.trim(),
    deptId: empDept.value,
    phone: empPhone.value.trim()
  };

  const id = empId.value;

  if (id) {
    await apiCall(`${API.EMP}/${id}`, "PUT", emp);
  } else {
    await apiCall(API.EMP, "POST", emp);
  }

  clearEmployeeForm();
  loadEmployees(0);
}


function clearEmployeeForm() {
  empId.value = "";
  document.getElementById("employeeForm").reset();
}


async function deleteEmployee(id) {

  if (!confirm("Delete employee?")) return;

  await apiCall(`${API.EMP}/${id}`, "DELETE");

  loadEmployees(empPage);
}


async function loadEmployees(page = 0) {

  empPage = page;

  const search =
    document.getElementById("empSearch").value || "";

  const key = encodeURIComponent(search);

  showLoader();

  try {

    const data = await apiCall(
      `${API.EMP}?page=${page}&size=${empSize}&search=${key}`
    );

    const tbody =
      document.getElementById("employeeTable");

    tbody.innerHTML = "";

    if (!data.content || !data.content.length) {
      tbody.innerHTML =
        "<tr><td colspan='6'>No Employees</td></tr>";
      return;
    }

    data.content.forEach(e => {

      tbody.innerHTML += `
        <tr>
          <td>${e.id}</td>
          <td>${e.name}</td>
          <td>${e.email}</td>
          <td>${e.department?.name || "N/A"}</td>
          <td>${e.phone}</td>
          <td>
            <button onclick='editEmployee(${JSON.stringify(e)})'>
              Edit
            </button>
            <button onclick='deleteEmployee(${e.id})'>
              Delete
            </button>
          </td>
        </tr>
      `;
    });

    renderEmpPagination(data.totalPages);

  } finally {
    hideLoader();
  }
}


function editEmployee(e) {

  empId.value = e.id;
  empName.value = e.name;
  empEmail.value = e.email;
  empDept.value = e.department?.id || "";
  empPhone.value = e.phone;
}


function renderEmpPagination(total) {

  const div =
    document.getElementById("empPagination");

  div.innerHTML = "";

  for (let i = 0; i < total; i++) {

    const btn = document.createElement("button");

    btn.textContent = i + 1;

    if (i === empPage) {
      btn.classList.add("active-page");
    }

    btn.onclick = () => loadEmployees(i);

    div.appendChild(btn);
  }
}


function searchEmployees() {
  loadEmployees(0);
}


function showAllEmployees() {

  document.getElementById("empSearch").value = "";

  loadEmployees(0);
}


/* ================= DEPARTMENT ================= */

async function handleDeptSubmit(e) {

  e.preventDefault();

  const dept = {
    name: deptName.value.trim(),
    location: deptLocation.value.trim()
  };

  const id = deptId.value;

  if (id) {
    await apiCall(`${API.DEPT}/${id}`, "PUT", dept);
  } else {
    await apiCall(API.DEPT, "POST", dept);
  }

  clearDeptForm();
  loadDepartments(0);
}


async function loadDepartments(page = 0) {

  deptPage = page;

  const data = await apiCall(
    `${API.DEPT}?page=${page}&size=${deptSize}`
  );

  const tbody =
    document.getElementById("deptTable");

  tbody.innerHTML = "";

  if (!data.content || !data.content.length) {
    tbody.innerHTML =
      "<tr><td colspan='4'>No Departments</td></tr>";
    return;
  }

  data.content.forEach(d => {

    tbody.innerHTML += `
      <tr>
        <td>${d.id}</td>
        <td>${d.name}</td>
        <td>${d.location}</td>
        <td>
          <button onclick='editDept(${JSON.stringify(d)})'>
            Edit
          </button>
          <button onclick='deleteDept(${d.id})'>
            Delete
          </button>
        </td>
      </tr>
    `;
  });

  renderDeptPagination(data.totalPages);
}


function editDept(d) {

  deptId.value = d.id;
  deptName.value = d.name;
  deptLocation.value = d.location;

  currentDeptId = d.id;
}


function clearDeptForm() {

  deptId.value = "";

  document.getElementById("deptForm").reset();

  currentDeptId = null;
}


function renderDeptPagination(total) {

  const div =
    document.getElementById("deptPagination");

  div.innerHTML = "";

  for (let i = 0; i < total; i++) {

    const btn = document.createElement("button");

    btn.textContent = i + 1;

    if (i === deptPage) {
      btn.classList.add("active-page");
    }

    btn.onclick = () => loadDepartments(i);

    div.appendChild(btn);
  }
}


/* ================= PROJECT ================= */

async function handleProjectSubmit(e) {

  e.preventDefault();

  const project = {
    name: projectName.value.trim(),
    status: projectStatus.value,
    startDate: projectStart.value,
    endDate: projectEnd.value
  };

  const id = projectId.value;

  if (id) {
    await apiCall(`${API.PROJ}/${id}`, "PUT", project);
  } else {
    await apiCall(API.PROJ, "POST", project);
  }

  clearProjectForm();
  loadProjects();
}


async function loadProjects(page = 0) {

  projectPage = page;

  const search =
    document.getElementById("projectSearch").value || "";

  const key = encodeURIComponent(search);

  const data = await apiCall(
    `${API.PROJ}?page=${page}&size=${projectSize}&search=${key}`
  );

  const tbody =
    document.getElementById("projectTable");

  tbody.innerHTML = "";

  if (!data.content || !data.content.length) {
    tbody.innerHTML =
      "<tr><td colspan='5'>No Projects</td></tr>";
    return;
  }

  data.content.forEach(p => {

    tbody.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.status}</td>
        <td>${p.employees?.length || 0}</td>
        <td>
          <button onclick='editProject(${JSON.stringify(p)})'>
            Edit
          </button>
          <button onclick='deleteProject(${p.id})'>
            Delete
          </button>
        </td>
      </tr>
    `;
  });

  renderProjectPagination(data.totalPages);
}


function editProject(p) {

  projectId.value = p.id;
  projectName.value = p.name;
  projectStatus.value = p.status;
  projectStart.value = p.startDate || "";
  projectEnd.value = p.endDate || "";
}


function clearProjectForm() {

  projectId.value = "";

  document.getElementById("projectForm").reset();
}


/* ================= DROPDOWN ================= */

async function loadDeptDropdown() {

  const data = await apiCall(
    `${API.DEPT}?page=0&size=100`
  );

  const select =
    document.getElementById("empDept");

  select.innerHTML =
    "<option value=''>Select</option>";

  if (!data.content) return;

  data.content.forEach(d => {

    select.innerHTML +=
      `<option value="${d.id}">${d.name}</option>`;
  });
}


/* ================= UTILS ================= */

function showLoader() {
  document.getElementById("loader").classList.remove("hidden");
}

function hideLoader() {
  document.getElementById("loader").classList.add("hidden");
}
