// Supabase
const supabase = window.supabase.createClient(
  "https://jttxhtpcyqsvmautnjob.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0dHhodHBjeXFzdm1hdXRuam9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MjkwMjAsImV4cCI6MjA5MzQwNTAyMH0.Mj5ARjHG31DksTmXKUgYfbt7CZGLqV6bwFtqrZcAI-s"
);

// =========================
// STUDENTS
// =========================
async function loadStudents() {
  const { data, error } = await supabase.from("students").select("*");

  if (error) {
    alert("ERROR: " + error.message);
    return;
  }

  const container = document.getElementById("studentsList");
  if (!container) return;

  container.innerHTML = data.map(s => `
    <div>
      ${s.name} (${s.email})
      <button onclick="deleteStudent('${s.id}')">Delete</button>
    </div>
  `).join("");
}

async function addStudent() {
  const name = document.getElementById("studentName").value;
  const email = document.getElementById("studentEmail").value;

  console.log("Adding:", name);

  const { error } = await supabase
    .from("students")
    .insert([{ name, email }]);

  if (error) {
    alert("ERROR: " + error.message);
  } else {
    alert("SUCCESS!");
  }

  loadStudents();
}

async function deleteStudent(id) {
  await supabase.from("students").delete().eq("id", id);
  loadStudents();
}

// =========================
// DELETION
// =========================
document.addEventListener("DOMContentLoaded", () => {


  loadStudents();

  const btn = document.getElementById("addBtn");


  btn.addEventListener("click", addStudent);
});

window.deleteStudent = async function (id) {
  alert("Deleting ID: " + id);

  await supabase.from("students").delete().eq("id", id);

  loadStudents();
};

window.deleteStudent = async function (id) {
  const confirmDelete = confirm("Are you sure?");

  if (!confirmDelete) return;

  await supabase.from("students").delete().eq("id", id);

  loadStudents();
};

console.log(document.getElementById("addUniBtn"));

// =========================
// UNIVERSITIES
// =========================
async function loadUniversities() {
  const { data, error } = await supabase.from("universities").select("*");

  if (error) {
    alert("ERROR: " + error.message);
    return;
  }

  const container = document.getElementById("universitiesList");
  if (!container) return;

  container.innerHTML = data.map(u => `
    <div>
      ${u.name} (${u.location})
      <button onclick="deleteUniversity('${u.id}')">Delete</button>
    </div>
  `).join("");
}

async function addUniversity() {
  const name = document.getElementById("uniName").value;
  const location = document.getElementById("uniLocation").value;

  alert("Adding university: " + name);

  const { error } = await supabase
    .from("universities")
    .insert([{ name, location }]);

  if (error) {
    alert("ERROR: " + error.message);
  } else {
    alert("SUCCESS!");
  }

  loadUniversities();
}

// Global
window.deleteUniversity = async function (id) {
  const confirmDelete = confirm("Are you sure?");
  if (!confirmDelete) return;

  await supabase.from("universities").delete().eq("id", id);
  loadUniversities();
};

const btn = document.getElementById("addUniBtn");
if (btn) {
  btn.onclick = addUniversity;
  loadUniversities();
}

// =========================
// ENROLLMENTS
// =========================
async function loadEnrollments() {
  const { data, error } = await supabase
    .from("enrollments")
    .select("id, students(name), universities(name)");

  if (error) {
    alert("ERROR: " + error.message);
    return;
  }

  const list = document.getElementById("enrollmentList");
  if (!list) return;

  list.innerHTML = data.map(e => `
    <div>
      ${e.students.name} → ${e.universities.name}
      <button onclick="deleteEnrollment('${e.id}')">Delete</button>
    </div>
  `).join("");
}

async function loadDropdowns() {
  const { data: students } = await supabase.from("students").select("*");
  const { data: universities } = await supabase.from("universities").select("*");

  const studentSelect = document.getElementById("studentSelect");
  const uniSelect = document.getElementById("uniSelect");

  if (!studentSelect || !uniSelect) return;

  studentSelect.innerHTML = students
    .map(s => `<option value="${s.id}">${s.name}</option>`)
    .join("");

  uniSelect.innerHTML = universities
    .map(u => `<option value="${u.id}">${u.name}</option>`)
    .join("");
}

async function enroll() {
  const student_id = document.getElementById("studentSelect").value;
  const university_id = document.getElementById("uniSelect").value;

  alert("Creating enrollment");

  const { error } = await supabase
    .from("enrollments")
    .insert([{ student_id, university_id }]);

  if (error) {
    alert("ERROR: " + error.message);
  } else {
    alert("SUCCESS!");
  }

  loadEnrollments();
}

// Global
window.deleteEnrollment = async function (id) {
  const confirmDelete = confirm("Are you sure?");
  if (!confirmDelete) return;

  await supabase.from("enrollments").delete().eq("id", id);
  loadEnrollments();
};

const enrollBtn = document.getElementById("enrollBtn");
if (enrollBtn) {
  enrollBtn.onclick = enroll;
  loadDropdowns();
  loadEnrollments();
}