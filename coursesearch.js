document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document.getElementById("searchInput").value.toLowerCase().trim();

  const results = courses.filter(course => 
    course.active && (
      course.code.toLowerCase().includes(query) ||
      course.name.toLowerCase().includes(query) ||
      course.dept.toLowerCase().includes(query)
    )
  );

  const table = document.getElementById("resultsTable");
  table.innerHTML = "";

  if (results.length === 0) {
    table.innerHTML = `<tr><td colspan="5" style="text-align:center;">No matching courses found.</td></tr>`;
    return;
  }

  results.forEach(course => {
    table.innerHTML += `
      <tr>
        <td>${course.code}</td>
        <td>${course.name}</td>
        <td>${course.dept}</td>
        <td>${course.instructor}</td>
        <td>${course.credits}</td>
      </tr>
    `;
  });
});