const filterOptions = {
  "Property type": [
    "Apartment / Flat",
    "House",
    "Condo",
    "Studio apartment",
    "Duplexes",
    "Serviced apartment",
    "Shared apartment",
    "self-contained rooms",
  ],
  "Rent Price, Yearly, N": [
    "100 - 200k",
    "200k - 400k",
    "400k - 600k",
    "600k - 1M",
    "1M - 2M",
    "2M - 5M",
    "5M and above",
  ],
  Agent: ["Show all", "Verified agent", "Unverified agent"],
  Amenities: [
    "Swimming Pool",
    "Gym",
    "Air Conditioning",
    "PParking space",
    "Garden",
    "Elevator",
    "Security",
    "Balcony",
    "Furnished",
    "Pet Friendly",
  ],
  Bathrooms: ["1", "2", "3", "4", "5+"],
  Bedrooms: ["Studio", "1", "2", "3", "4", "5+"],
  Furnishing: ["Fully Furnished", "Semi Furnished", "Unfurnished"],
};

let selectedFilters = {};

function initializeFilters() {
  Object.keys(filterOptions).forEach((category) => {
    selectedFilters[category] = [];
  });
}

function createFilterSection(category, options) {
  const section = document.createElement("div");
  section.className = "filter-section";

  const header = document.createElement("button");
  header.className = "section-header";
  header.innerHTML = `
                <span>${category}</span>
                <svg class="section-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>         
            `;

  const content = document.createElement("div");
  content.className = "section-content";

  options.forEach((option) => {
    const optionDiv = document.createElement("div");
    optionDiv.className = "checkbox-option";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `${category}-${option}`;
    checkbox.value = option;

    const label = document.createElement("label");
    label.htmlFor = `${category}-${option}`;
    label.textContent = option;

    checkbox.addEventListener("change", (e) => {
      handleCheckboxChange(category, option, e.target.checked);
    });

    optionDiv.appendChild(checkbox);
    optionDiv.appendChild(label);
    optionDiv.addEventListener("click", (e) => {
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
        handleCheckboxChange(category, option, checkbox.checked);
      }
    });

    content.appendChild(optionDiv);
  });
  header.addEventListener("click", () => {
    header.classList.toggle("active");
    content.classList.toggle("active");
  });

  section.appendChild(header);
  section.appendChild(content);

  return section;
}

function handleCheckboxChange(category, option, isChecked) {
  if (isChecked) {
    if (!selectedFilters[category].includes(option)) {
      selectedFilters[category].push(option);
    }
  } else {
    selectedFilters[category] = selectedFilters[category].filter(
      (item) => item !== option,
    );
  }
  updateFilterCount();
}

function updateFilterCount() {
  const count = Object.values(selectedFilters).flat().length;
  const filterCountDiv = document.getElementById("filterCount");
  const countBadge = document.getElementById("countBadge");

  countBadge.textContent = count;

  if (count > 0) {
    filterCountDiv.classList.add("active");
  } else {
    filterCountDiv.classList.remove("active");
  }
}

function resetFilters() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  Object.keys(selectedFilters).forEach((category) => {
    selectedFilters[category] = [];
  });

  updateFilterCount();
}

function applyFilters() {
  console.log("Applied filters:", selectedFilters);

  const filterSummary = Object.entries(selectedFilters)
    .filter(([_, values]) => values.length > 0)
    .map(([category, values]) => `${category}: ${values.join(", ")}`)
    .join("\n");

  if (filterSummary) {
    alert("Filters applied!\n\n" + filterSummary);
  } else {
    alert("No filters selected");
  }
}
function init() {
  initializeFilters();

  const sectionsContainer = document.getElementById("filterSections");

  Object.entries(filterOptions).forEach(([category, options]) => {
    const section = createFilterSection(category, options);
    sectionsContainer.appendChild(section);
  });

  document.getElementById("resetBtn").addEventListener("click", resetFilters);
  document.getElementById("filterBtn").addEventListener("click", applyFilters);
}

init();
