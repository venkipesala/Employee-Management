document.addEventListener("DOMContentLoaded", () => {
   init();
});

function init() {
   loadDeptDropdown();
   loadEmployees(0);
}

// Make elements global
const empName = document.getElementById("empName");
const empEmail = document.getElementById("empEmail");
const empDept = document.getElementById("empDept");
const empPhone = document.getElementById("empPhone");
const empId = document.getElementById("empId");

const deptId = document.getElementById("deptId");
const deptName = document.getElementById("deptName");
const deptLocation = document.getElementById("deptLocation");

const projectId = document.getElementById("projectId");
const projectName = document.getElementById("projectName");
const projectStatus = document.getElementById("projectStatus");
const projectStart = document.getElementById("projectStart");
const projectEnd = document.getElementById("projectEnd");

/* ================= API CONFIG ================= */

const BASE_API = "https://5my4jefft9.execute-api.ap-south-1.amazonaws.com/dev";
const API_KEY = "JBaXPwTkVz3SjPpDa44sG1lJ1mUdSVqHayP3LOwV";

const API = {
  EMP: `${BASE_API}/api/employees`,
  DEPT: `${BASE_API}/api/departments`,
  PROJ: `${BASE_API}`/api`/projects`
};

    let assignDeptId = null;
    let currentDeptId = null;
    let assignProjectId = null;

    let currentAssignedEmpIds = [];

    /* ================= NAVIGATION ================= */
    function showSection(section, event) {
      // Hide all sections
      document
        .querySelectorAll('.container')
        .forEach(div => div.classList.add('hidden'));

      // Show selected section
      document
        .getElementById(section + '-section')
        .classList.remove('hidden');

      // Update active button
      document
        .querySelectorAll('nav button')
        .forEach(btn => btn.classList.remove('active'));

      event.target.classList.add('active');

      /* 🔥 RESET SEARCH + LOAD FRESH DATA */
      if (section === 'employee') {
        // Clear employee search
        const empSearch = document.getElementById('empSearch');
        if (empSearch) empSearch.value = '';

        loadEmployees(0);
      }

      if (section === 'department') {
        loadDepartments(0);
      }

      if (section === 'project') {
        // Clear project search
        const projSearch = document.getElementById('projectSearch');
        if (projSearch) projSearch.value = '';

        loadProjects(0);
      }
    }


    /* ================= COMMON API ================= */
    async function apiCall(url, method = 'GET', data = null) {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY   // ✅ AUTH HEADER HERE
        }
      };

      if (data) {
        options.body = JSON.stringify(data);
      }
      const res = await fetch(url, options);

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'API Error');
      }
      const text = await res.text();

      return text ? JSON.parse(text) : null;
    }


   /* ================= EMPLOYEE ================= */
  let empPage = 0;
  const empSize = 5;

  document.getElementById('employeeForm')
  .addEventListener('submit', async e => {

  e.preventDefault();

  const emp = {
    name: empName.value,
    email: empEmail.value,
    deptId: empDept.value,
    phone: empPhone.value
  };

  const id = empId.value;

  if (id) {
    await apiCall(`${API.EMP}/${id}`, 'PUT', emp);
  } else {
    await apiCall(API.EMP, 'POST', emp);
  }

  clearEmployeeForm();
  loadEmployees(0);
  });

  function editEmployee(e) {

  empId.value = e.id;
  empName.value = e.name;
  empEmail.value = e.email;
  empDept.value = e.department?.id || '';
  empPhone.value = e.phone;
  }


  async function deleteEmployee(id) {

  if (!confirm('Delete employee?')) return;

  await apiCall(`${API.EMP}/${id}`, 'DELETE');

  loadEmployees(empPage);
  }

  function clearEmployeeForm() {
  empId.value = '';
  document.getElementById('employeeForm').reset();
  }

  async function loadEmployees(page = 0) {
  empPage = page;
  const search = document.getElementById('empSearch').value || '';
  const key = encodeURIComponent(search);
  showLoader();
  try {
      const data = await apiCall(
        `${API.EMP}?page=${page}&size=${empSize}&search=${key}`
      );
      const list = data.content;

      const tbody =
      document.getElementById('employeeTable');
      tbody.innerHTML = '';
      if (!list || !list.length) {
      tbody.innerHTML =
        '<tr><td colspan="6">No Employees</td></tr>';
      return;
      }
      list.forEach(e => {
          tbody.innerHTML += `
            <tr>
              <td>${e.id}</td>
              <td>${e.name}</td>
              <td>${e.email}</td>
              <td>${e.department?.name || 'N/A'}</td>
              <td>
                ${e.projects?.map(p => p.name).join(', ') || ''}
              </td>
              <td>${e.phone}</td>
              <td>
                <button class="btn-edit"
                  onclick='editEmployee(${JSON.stringify(e)})'>
                  Edit
                </button>
                <button class="btn-delete"
                  onclick='deleteEmployee(${e.id})'>
                  Delete
                </button>
              </td>
            </tr>
      `   ;
      });
    renderEmpPagination(data.totalPages);
    } finally {
        hideLoader();
    }
}

  function searchEmployees() {
    loadEmployees(0);
  }

  function renderEmpPagination(totalPages) {
      const div =
      document.getElementById('empPagination');

      div.innerHTML = '';

      for (let i = 0; i < totalPages; i++) {
          const btn = document.createElement('button');
          btn.textContent = i + 1;

          if (i === empPage) {
            btn.classList.add('active-page');
          }

          btn.onclick = () => loadEmployees(i);
          div.appendChild(btn);
      }
  }

  /* ================= DEPARTMENT ================= */
  let deptPage = 0;
  const deptSize = 5;

  async function loadDepartments(page = 0) {
  deptPage = page;
  const data = await apiCall(
  `${API.DEPT}?page=${page}&size=${deptSize}`
  );
  const list = data.content;
  const tbody =
  document.getElementById('deptTable');

  tbody.innerHTML = '';
  if (!list || !list.length) {
  tbody.innerHTML =
    '<tr><td colspan="4">No Departments</td></tr>';
  return;
  }

  list.forEach(d => {
  tbody.innerHTML += `
    <tr>
      <td>${d.id}</td>
      <td>${d.name}</td>
      <td>${d.location}</td>

      <td>
       <button class="btn-edit"
        onclick='editDept(${JSON.stringify(d)})'>
        Edit
       </button>

      <button class="btn-assignemp"
        onclick="openAssign(${d.id}, '${d.name}')">
        Assign Employees
      </button>

      <button class="btn-delete"
        onclick="deleteDept(${d.id})">
        Delete
      </button>
      </td>
    </tr>
  `;
  });
  renderDeptPagination(data.totalPages);
  }

  function renderDeptPagination(totalPages) {

  const div =
  document.getElementById('deptPagination');

  div.innerHTML = '';

  for (let i = 0; i < totalPages; i++) {

  const btn = document.createElement('button');

  btn.textContent = i + 1;

  if (i === deptPage) {
    btn.classList.add('active-page');
  }

  btn.onclick = () => loadDepartments(i);

  div.appendChild(btn);
  }
  }

  function editDept(d) {
  deptId.value = d.id;
  deptName.value = d.name;
  deptLocation.value = d.location;

  currentDeptId = d.id;

  loadDeptEmployees('');
  }

document.getElementById('deptForm')
  .addEventListener('submit', async e => {

    e.preventDefault();

    const dept = {
      name: deptName.value,
      location: deptLocation.value
    };

    const id = deptId.value;

    if (id) {
      await apiCall(`${API.DEPT}/${id}`, 'PUT', dept);
    } else {
      await apiCall(API.DEPT, 'POST', dept);
    }

    clearDeptForm();
    loadDepartments(0);

});


    /* ================= PROJECT ================= */
    let projectPage = 0;
    const projectSize = 5;

    async function loadProjects(page = 0) {

      projectPage = page;

      const search =
        document.getElementById("projectSearch")?.value || '';

      const key = encodeURIComponent(search);

      const data = await apiCall(
        `${API.PROJ}?page=${page}&size=${projectSize}&search=${key}`
      );

      const list = data.content;

      const tbody =
        document.getElementById('projectTable');

      tbody.innerHTML = '';

      if (!list || !list.length) {
        tbody.innerHTML =
          '<tr><td colspan="5">No Projects</td></tr>';
        return;
      }

      list.forEach(p => {

        tbody.innerHTML += `
          <tr id="project-row-${p.id}">
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.status}</td>
            <td>
              👥 ${p.employees?.length || 0} Assigned
              <button class="btn-link"
                onclick="openProjectAssign(${p.id}, '${p.name}')">
                View
              </button>
            </td>

            <td>
              <button class="btn-edit"
                onclick='editProject(${JSON.stringify(p)})'>
                Edit
              </button>

              <button class="btn-assignemp"
                onclick="openProjectAssign(${p.id}, '${p.name}')">
                Assign Employees
              </button>

              <button class="btn-delete"
                onclick="deleteProject(${p.id})">
                Delete
              </button>
            </td>
          </tr>
        `;
      });

      renderProjectPagination(data.totalPages);
    }

  async function openProjectAssign(id, name){
      assignProjectId = id;
      assignDeptId = null; // disable dept mode

      const proj = await apiCall(`${API.PROJ}/${id}`);

      currentAssignedEmpIds =
          proj.employees?.map(e => e.id) || [];

      document.getElementById('assignTitle')
          .innerText =
            `Assign Employees to Project: ${name}`;

      document.getElementById('assignModal').style.display = 'block';

      // 🔥 Auto-load existing employees
      if (currentAssignedEmpIds.length > 0) {
        loadAssignEmployeesByIds(currentAssignedEmpIds);
      } else {
        document.getElementById('assignList').innerHTML =
          "<i>No employees assigned yet. Search to add.</i>";
      }

      document.getElementById("assignedCount").innerText =
        `Assigned Employees: ${currentAssignedEmpIds.length}`;
    }

    document.getElementById('projectForm')
      .addEventListener('submit', async e => {

        e.preventDefault();

        if (projectStart.value &&
            projectEnd.value &&
            projectStart.value > projectEnd.value) {

          alert("End date must be after start date");
          return;
        }

        const project = {
          name: projectName.value,
          status: projectStatus.value,
          startDate: projectStart.value,
          endDate: projectEnd.value,
        };

        const id = projectId.value;

        if (id) {
          await apiCall(`${API.PROJ}/${id}`, 'PUT', project);
        } else {
          await apiCall(API.PROJ, 'POST', project);
        }

        clearProjectForm();
        loadProjects();
      });

    function editProject(p) {
      projectId.value = p.id;
      projectName.value = p.name;
      projectStatus.value = p.status;
      projectStart.value = p.startDate || '';
      projectEnd.value = p.endDate || '';

      // Select assigned employees
      [...projectEmployees.options].forEach(o => {
        o.selected =
          p.employees?.some(e => e.id == o.value);
      });

      // Scroll to form (UX improvement)
      document.getElementById("projectForm")
        .scrollIntoView({ behavior: "smooth" });
    }

    async function deleteProject(id) {
      if (!confirm('Delete project?')) return;

      await apiCall(`${API.PROJ}/${id}`, 'DELETE');

      loadProjects();
    }

    function clearProjectForm() {
      projectId.value = '';
      document.getElementById('projectForm').reset();
    }

  async function loadDeptDropdown() {
      const data = await apiCall(`${API.DEPT}?page=0&size=100`);

      const depts = data.content;

      const select =
      document.getElementById('empDept');

      select.innerHTML =
      '<option value="">Select</option>';

      if (!depts) return;

      depts.forEach(d => {

      select.innerHTML +=
        `<option value="${d.id}">
          ${d.name}
        </option>`;
      });
  }

  function clearDeptTable() {
    document.getElementById('deptTable').innerHTML = '';
  }

  function showAllEmployees() {
      // Clear search box
      document.getElementById('empSearch').value = '';

      // Reload first page
      loadEmployees(0);
  }

  async function loadDeptEmployees(search) {
    if (!currentDeptId) return;

    const data = await apiCall(
      `${API.EMP}?search=${search}&page=0&size=10`
    );

    const list = data.content;

    const div =
      document.getElementById('deptEmpResults');

    div.innerHTML = '';

    list.forEach(e => {

      const checked =
        e.department?.id === currentDeptId
          ? 'checked' : '';

      div.innerHTML += `
        <label>
          <input type="checkbox"
                 value="${e.id}"
                 ${checked}>
          ${e.name} (${e.email})
        </label><br>
      `;
    });
  }

  async function saveDeptEmployees() {

    if (!currentDeptId) {
      alert('Select department first');
      return;
    }

    const ids =
      [...document.querySelectorAll(
        '#deptEmpResults input:checked'
      )]
      .map(i => i.value);

    await apiCall(
      `${API.DEPT}/${currentDeptId}/employees`,
      'PUT',
      ids
    );

    alert('Employees Assigned');
  }

  function clearDeptForm() {
      deptId.value = '';
      document.getElementById('deptForm').reset();

      currentDeptId = null;

      document.getElementById('deptEmpResults').innerHTML = '';
  }

  async function openAssign(id, name) {
    assignDeptId = id;
    assignProjectId = null;

    // Load dept employees first
    const dept = await apiCall(`${API.DEPT}/${id}`);

    currentAssignedEmpIds =
       dept.employees?.map(e => e.id) || [];

    document.getElementById('assignTitle')
      .innerText = `Assign Employees to ${name}`;

    document.getElementById('assignList').innerHTML =
        "<i>Type at least 3 characters to search...</i>";

    document.getElementById('assignModal')
    .style.display = 'block';
  }

  function closeAssign() {
    document.getElementById('assignModal')
      .style.display = 'none';

    assignDeptId = null;
    assignProjectId = null;

    currentAssignedEmpIds = [];

    document.getElementById('assignList').innerHTML = '';
    document.getElementById('assignSearch').value = '';

    if (assignSearchTimer) {
      clearTimeout(assignSearchTimer);
      assignSearchTimer = null;
    }
  }


  /* ================= ASSIGN MODAL ================= */
  async function loadAssignEmployees(search) {
    if (!assignDeptId && !assignProjectId) return;
    if (!search || search.length < 1) return;

    const loader = document.getElementById("assignLoader");
    const div = document.getElementById('assignList');

    loader.style.display = "block";

    try {
      const data = await apiCall(
        `${API.EMP}?search=${search}&page=0&size=20`
      );

      const list = data.content;

      div.innerHTML = '';

      if (!list || list.length === 0) {
        div.innerHTML = '<i>No employees found</i>';
        return;
      }

      list.forEach(e => {

        const checked =
          currentAssignedEmpIds.includes(e.id)
            ? 'checked'
            : '';

        div.innerHTML += `
          <div class="assign-item">
            <label>
              <input type="checkbox"
                     value="${e.id}"
                     ${checked}
                     onchange="toggleAssign(${e.id}, this.checked)">
              <b>${e.name}</b>
              <span>(${e.email})</span>
            </label>
          </div>
        `;
      });

    } finally {
      loader.style.display = "none";
    }
  }

function toggleAssign(empId, checked) {

  empId = Number(empId);

  if (checked) {
    // Add
    if (!currentAssignedEmpIds.includes(empId)) {
      currentAssignedEmpIds.push(empId);
    }
  } else {
    // Remove
    currentAssignedEmpIds =
      currentAssignedEmpIds.filter(id => id !== empId);
  }

document.getElementById("assignedCount").innerText =
  `Assigned: ${currentAssignedEmpIds.length}`;


  console.log("Current Assigned:", currentAssignedEmpIds);
}


  /* Save assignment */
  async function saveAssign() {

    if (!currentAssignedEmpIds.length) {
      alert("Select at least one employee");
      return;
    }

    // PROJECT MODE
    if (assignProjectId) {

      await apiCall(
        `${API.PROJ}/${assignProjectId}/employees`,
        'PUT',
        currentAssignedEmpIds
      );

    document.getElementById("assignedCount").innerText =
    `Assigned Employees: ${currentAssignedEmpIds.length}`;

      alert("Employees updated for Project");

      closeAssign();
      loadProjects(projectPage);

      return;
    }

    // DEPARTMENT MODE
    if (assignDeptId) {

      await apiCall(
        `${API.DEPT}/${assignDeptId}/employees`,
        'PUT',
        currentAssignedEmpIds
      );

      alert("Employees updated for Department");

      closeAssign();
      loadDepartments(deptPage);

      return;
    }

    alert("No target selected");
  }


  // ================= SAFE EVENT BINDING =================
window.addEventListener("load", () => {
  // Department employee search
  const deptSearch =
    document.getElementById("deptEmpSearch");

  if (deptSearch) {
    deptSearch.addEventListener("input", e => {
      const q = e.target.value;
      if (q.length < 2) {
        loadDeptEmployees('');
        return;
      }
      loadDeptEmployees(q);
    });
  }
 // Assign modal search
 const assignSearch =
   document.getElementById("assignSearch");

 if (assignSearch) {
   assignSearch.addEventListener("input", e => {
     const q = e.target.value.trim();

     if (q.length < 1) {
       document.getElementById("assignList").innerHTML =
         "<i>Type to search...</i>";
       return;
     }

     loadAssignEmployees(q);
   });
 }
});

function showLoader() {
  document.getElementById("loader").classList.remove("hidden");
}

function hideLoader() {
  document.getElementById("loader").classList.add("hidden");
}

// ================= ENTER KEY SEARCH =================

window.addEventListener("load", () => {
  const empSearch =
    document.getElementById("empSearch");

  if (empSearch) {
    empSearch.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault(); // stop form submit
        searchEmployees(); // trigger search
      }
    });
  }
});

// ================= PROJECT ENTER KEY SEARCH =================
window.addEventListener("load", () => {
  const projectSearch =
    document.getElementById("projectSearch");

  if (projectSearch) {
    projectSearch.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault(); // stop form submit
        searchProjects();   // trigger search
      }
    });
  }
});


// ================= GOOGLE-STYLE AUTO SEARCH =================
let empSearchTimer = null;
window.addEventListener("load", () => {
  const empSearch =
    document.getElementById("empSearch");

  if (!empSearch) return;
  empSearch.addEventListener("input", e => {
    // Clear old timer if user keeps typing
    if (empSearchTimer) {
      clearTimeout(empSearchTimer);
    }
    // Wait 500ms after typing stops
    empSearchTimer = setTimeout(() => {
      loadEmployees(0); // trigger search
    }, 2500);
  });
});

// ================= ASSIGN POPUP AUTO SEARCH =================
let assignSearchTimer = null;
window.addEventListener("load", () => {
  const assignSearch =
    document.getElementById("assignSearch");

  if (!assignSearch) return;
  assignSearch.addEventListener("input", e => {
    if (assignSearchTimer) {
      clearTimeout(assignSearchTimer);
    }
    assignSearchTimer = setTimeout(() => {
      loadAssignEmployees(e.target.value);
    }, 2500);
  });
});

function openProjectAssignFromForm(){
  if(!projectId.value){
    alert("Save project first");
    return;
  }
  openProjectAssign(
    projectId.value,
    projectName.value || "Project"
  );
}

function renderProjectPagination(totalPages) {
  const div =
    document.getElementById("projectPagination");

  div.innerHTML = '';

  for (let i = 0; i < totalPages; i++) {

    const btn = document.createElement("button");

    btn.textContent = i + 1;

    if (i === projectPage) {
      btn.classList.add("active-page");
    }

    btn.onclick = () => loadProjects(i);

    div.appendChild(btn);
  }
}

function searchProjects() {
  loadProjects(0);
}

function resetProjectSearch() {
  document.getElementById("projectSearch").value = '';
  loadProjects(0);
}

async function loadAssignEmployeesByIds(ids){
  if (!ids || ids.length === 0) return;

  const div = document.getElementById("assignList");
  div.innerHTML = '<i>Loading assigned employees...</i>';

  try {

    // Fetch each employee
    const requests = ids.map(id =>
      apiCall(`${API.EMP}/${id}`)
    );

    const employees = await Promise.all(requests);

    div.innerHTML = '';

    employees.forEach(e => {
      div.innerHTML += `
        <div class="assign-item">
          <label>
            <input type="checkbox"
                   value="${e.id}"
                   checked
                   onchange="toggleAssign(${e.id}, this.checked)">
            <b>${e.name}</b>
            <span>(${e.email})</span>
          </label>
        </div>
      `;
    });

  } catch (err) {
    console.error(err);
    div.innerHTML = "<i>Failed to load assigned employees</i>";
  }
}
