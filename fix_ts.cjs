const fs = require('fs');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const { search, replace } of replacements) {
    content = content.replace(search, replace);
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

// 1. RawNotesProcessor.tsx
replaceInFile('src/components/doctor/RawNotesProcessor.tsx', [
  { search: "import React, { useState } from 'react';", replace: "import { useState } from 'react';" },
  { search: "import type { Tool, FunctionDeclaration }", replace: "import type { FunctionDeclaration }" },
  { search: "const { data: visitData, error: visitError }", replace: "const { error: visitError }" }
]);

// 2. Navbar.tsx
replaceInFile('src/components/layout/Navbar.tsx', [
  { search: "import React from 'react';", replace: "" },
  { search: "Activity, ", replace: "" },
  { search: "FileText, ", replace: "" },
  { search: ", Activity", replace: "" },
  { search: ", FileText", replace: "" }
]);

// 3. AuthContext.tsx
replaceInFile('src/context/AuthContext.tsx', [
  { search: "import React, { createContext, useContext, useState, ReactNode } from 'react';", replace: "import { createContext, useContext, useState } from 'react';\nimport type { ReactNode } from 'react';" },
  { search: "import React, { createContext, useContext, useState } from 'react';\nimport type { ReactNode } from 'react';", replace: "import { createContext, useContext, useState } from 'react';\nimport type { ReactNode } from 'react';" }
]);

// 4. AdminDashboard.tsx
replaceInFile('src/pages/AdminDashboard.tsx', [
  { search: "import React, { useState, useEffect } from 'react';", replace: "import { useState, useEffect } from 'react';" }
]);

// 5. DoctorDashboard.tsx
replaceInFile('src/pages/DoctorDashboard.tsx', [
  { search: "import React, { useState, useEffect } from 'react';", replace: "import { useState } from 'react';" },
  { search: "Activity, Pill, ", replace: "" },
  { search: ", Activity, Pill", replace: "" }
]);

// 6. EmergencyView.tsx
replaceInFile('src/pages/EmergencyView.tsx', [
  { search: "import React, { useState, useEffect } from 'react';", replace: "import { useState, useEffect } from 'react';" },
  { search: "const { data, error } = await supabase", replace: "const { data } = await supabase" }
]);

// 7. PatientDashboard.tsx
replaceInFile('src/pages/PatientDashboard.tsx', [
  { search: "import React, { useState, useEffect } from 'react';", replace: "import { useState, useEffect } from 'react';" },
  { search: "(med, index) =>", replace: "(med) =>" }
]);

console.log('Fixed all TS errors');
