export const rolesData = {
  financial: {
    id: "financial",
    name: "Financial (Head) Cell",
    description: "Manages all financial operations, budgeting, and auditing for the institution.",
    levels: [
      {
        name: "Top-Level",
        roles: [
          { title: "CFO (Chief Financial Officer)", reportsTo: "Registrar" },
          { title: "DFO (Deputy Financial Officer)", reportsTo: "CFO" },
        ],
      },
      {
        name: "Mid-Level",
        roles: [
          { title: "Accounts Officer", reportsTo: "DFO" },
          { title: "Audit Officer", reportsTo: "DFO" },
          { title: "Budget & Planning (Approval)", reportsTo: "DFO" },
        ],
      },
      {
        name: "Front-Level",
        roles: [{ title: "Accountant", reportsTo: "Accounts Officer" }],
      },
    ],
  },
  admission: {
    id: "admission",
    name: "Admission Cell",
    description: "Handles the entire student admission lifecycle, from inquiry to enrollment.",
    mainRole: "Admission Staff",
    responsibilities: [
      "Managing Fee Structure",
      "Issuing Bonafide & Related Documents",
      "Maintaining Student Data",
      "Overseeing Admission Process",
      "Handling ERP Allocation for new students",
    ],
  },
  administration: {
    id: "administration",
    name: "Administration Cell",
    description: "Oversees all administrative functions, including staff management and departmental planning.",
    levels: [
        {
            name: "Leadership",
            roles: [{title: "Top Administration", reportsTo: "Registrar"}]
        },
        {
            name: "Core Functions",
            responsibilities: [
                "Maintaining Staff Information",
                "Processing Staff & Faculty Salary",
                "Budget & Planning for each department",
            ]
        },
        {
            name: "Sub-Cells",
            roles: [
                {title: "Hiring Cell"},
                {title: "Placement Cell"}
            ]
        }
    ]
  },
};