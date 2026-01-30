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
const projectEmployees = document.getElementById("projectEmployees");

/* ================= API CONFIG ================= */

    const API = {
      EMP: '/api/employees',
      DEPT: '/api/departments',
      PROJ: '/api/projects'
    };

    let assignDeptId = null;
    let currentDeptId = null;

    /* ================= NAVIGATION ================= */

    function showSection(section, event) {

      document
        .querySelectorAll('.container')
        .forEach(div => div.classList.add('hidden'));

      document
        .getElementById(section + '-section')
        .classList.remove('hidden');

      document
        .querySelectorAll('nav button')
        .forEach(btn => btn.classList.remove('active'));

      event.target.classList.add('active');

      if (section === 'project') {
        loadProjectEmployees();
        loadProjects();
      }
    }


    /* ================= COMMON API ================= */

    async function apiCall(url, method = 'GET', data = null) {

      const options = {
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (data) {
        options.body = JSON.stringify(data);
      }

      const res = await fetch(url, options);

      if (!res.ok) {
        throw new Error('API Error');
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

  const search =
  document.getElementById('empSearch').value || '';

  const key = encodeURIComponent(search);

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
  `;
  });

  renderEmpPagination(data.totalPages);
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

    async function loadProjectEmployees() {

      const emps = await apiCall(API.EMP);

      const select =
        document.getElementById('projectEmployees');

      select.innerHTML = '';

      emps.content.forEach(e => {

        select.innerHTML +=
          `<option value="${e.id}">
            ${e.name}
          </option>`;
      });
    }


    async function loadProjects() {

      const projects = await apiCall(API.PROJ);

      const tbody =
        document.getElementById('projectTable');

      tbody.innerHTML = '';

      if (!projects || !projects.length) {

        tbody.innerHTML =
          '<tr><td colspan="5">No Data</td></tr>';

        return;
      }

      projects.forEach(p => {

        const empNames =
          p.employees?.map(e => e.name).join(', ') || '';

        tbody.innerHTML += `
          <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.status}</td>
            <td>${empNames}</td>
            <td>
              <button class="btn-delete"
                onclick="deleteProject(${p.id})">
                Delete
              </button>
            </td>
          </tr>
        `;
      });
    }


    document.getElementById('projectForm')
      .addEventListener('submit', async e => {

        e.preventDefault();

        const empIds =
          [...projectEmployees.selectedOptions]
            .map(o => o.value);

        const project = {
          name: projectName.value,
          status: projectStatus.value,
          startDate: projectStart.value,
          endDate: projectEnd.value,
          employeeIds: empIds
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
      `/api/employees?search=${search}&page=0&size=10`
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
      `/api/departments/${currentDeptId}/employees`,
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

    document.getElementById('assignTitle')
      .innerText = `Assign Employees to ${name}`;

    document.getElementById('assignSearch').value = '';

    await loadAssignEmployees('');

    document.getElementById('assignModal')
      .style.display = 'block';
  }

  function closeAssign() {
    document.getElementById('assignModal')
      .style.display = 'none';

    assignDeptId = null;
  }

  /* ================= ASSIGN MODAL ================= */

  async function loadAssignEmployees(search) {

  if (!assignDeptId) return;

  const data = await apiCall(
  `/api/employees?search=${search}&page=0&size=20`
  );

  const list = data.content;

  const div =
  document.getElementById('assignList');

  div.innerHTML = '';

  list.forEach(e => {

  const checked =
    e.department?.id === assignDeptId
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

  /* Save assignment */

  async function saveAssign() {
    if (!assignDeptId) return;

    const ids =
    [...document.querySelectorAll(
      '#assignList input:checked'
    )]
    .map(i => i.value);

    await apiCall(
    `/api/departments/${assignDeptId}/employees`,
    'PUT',
    ids
    );

    alert('Employees Assigned');

    closeAssign();

    loadDepartments(deptPage);
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
      loadAssignEmployees(e.target.value);
    });
  }
});
