document.addEventListener("DOMContentLoaded", async () => {
  const apiUrl =
    "https://data.gov.bh/api/explore/v2.1/catalog/datasets/01-statistics-of-students-nationalities_updated/records?where=colleges%20like%20%22IT%22%20AND%20the_programs%20like%20%22bachelor%22&limit=100";

  try {
    const response = await fetch(apiUrl);
    if (!response.ok)
      throw new Error(
        `Failed to fetch data: ${response.status} ${response.statusText}`
      );

    const data = await response.json();
    // console.log("Full API Response:", data);

    const results = data.results || [];
    if (results.length === 0) throw new Error("No results found");

    // Sort the results by year then semester then nationality
    results.sort((a, b) => {
      // Extract the start year (before the hyphen) for sorting
      const startYearA = parseInt(a.year.split("-")[0], 10);
      const startYearB = parseInt(b.year.split("-")[0], 10);

      // Compare by start year
      if (startYearA !== startYearB) return startYearA - startYearB;

      // If years are the same, compare by semester
      const semesterOrder = {
        "First Semester": 1,
        "Second Semester": 2,
        "Summer Semester": 3,
      };
      const semesterComparison =
        semesterOrder[a.semester] - semesterOrder[b.semester];
      if (semesterComparison !== 0) return semesterComparison;

      // If semesters are the same, compare by nationality
      // Bahraini -> GCC National -> Other
      const nationalityOrder = (nationality) => {
        if (nationality === "Bahraini") return 1;
        if (nationality === "GCC National") return 2;
        return 3; // Other
      };

      const nationalityComparison =
        nationalityOrder(a.nationality) - nationalityOrder(b.nationality);

      if (nationalityComparison !== 0) return nationalityComparison;
    });

    const tableBody = document
      .getElementById("students-table")
      .querySelector("tbody");
      
    results.forEach((result) => {
      const fields = result || {};

      const row = document.createElement("tr");
      row.classList.add("hover:bg-gray-100"); // Add hover effect
      row.innerHTML = `
                <td class="py-2 px-4 border border-gray-300 text-sm text-center">${fields.year}</td>
                <td class="py-2 px-4 border border-gray-300 text-sm text-center">${fields.semester}</td>
                <td class="py-2 px-4 border border-gray-300 text-sm text-center">${fields.the_programs}</td>
                <td class="py-2 px-4 border border-gray-300 text-sm text-center">${fields.nationality}</td>
                <td class="py-2 px-4 border border-gray-300 text-sm text-center">${fields.colleges}</td>
                <td class="py-2 px-4 border border-gray-300 text-sm text-center">${fields.number_of_students}</td>
            `;
      tableBody.appendChild(row);
    });

    // Display the total number of rows
    document.getElementById("rowsNo").innerText = `Number of Rows = ${data.total_count}`; // or results.length
  } catch (error) {
    console.error("Error:", error.message);
    alert("Failed to load data.");
  }
});
