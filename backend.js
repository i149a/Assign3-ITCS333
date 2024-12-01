document.addEventListener("DOMContentLoaded", async () => {
    const apiUrl = "https://data.gov.bh/api/explore/v2.1/catalog/datasets/01-statistics-of-students-nationalities_updated/records?where=colleges%20like%20%22IT%22%20AND%20the_programs%20like%20%22bachelor%22&limit=100";

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);

        const data = await response.json();
        console.log("Full API Response:", data);

        const results = data.results || [];
        if (results.length === 0) throw new Error("No results found");

        const tableBody = document.getElementById("students-table").querySelector("tbody");
        results.forEach(result => {
            const fields = result || {};

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${fields.year}</td>
                <td>${fields.semester}</td>
                <td>${fields.the_programs}</td>
                <td>${fields.nationality}</td>
                <td>${fields.colleges}</td>
                <td>${fields.number_of_students}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error:", error.message);
        alert("Failed to load data. Check the console for more details.");
    }
});