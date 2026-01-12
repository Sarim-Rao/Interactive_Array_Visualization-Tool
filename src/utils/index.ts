// --- Parsing Functions ---

export const parseIntDeclaration = (
  line: string
): { name: string; size: number; values: number[] } | null => {
  const match = line.match(/int\s+(\w+)\[(\-?\d*)]\s*=\s*\{([^}]+)\};/);
  if (match) {
    const name = match[1];
    const size = match[2] ? parseInt(match[2], 10) : 0; // allow negative check
    const values = match[3].split(",").map((s) => {
      const num = parseInt(s.trim(), 10);
      return isNaN(num) ? 0 : num;
    });
    return { name, size, values };
  }
  return null;
};

export const parseDoubleDeclaration = (
  line: string
): { name: string; size: number; values: number[] } | null => {
  const match = line.match(/double\s+(\w+)\[(\-?\d*)]\s*=\s*\{([^}]+)\};/);
  if (match) {
    const name = match[1];
    const size = match[2] ? parseInt(match[2], 10) : 0;
    const values = match[3].split(",").map((s) => {
      const num = parseFloat(s.trim());
      return isNaN(num) ? 0.0 : num;
    });
    return { name, size, values };
  }
  return null;
};

export const parseCharDeclaration = (
  line: string
): { name: string; size: number; values: string[] } | null => {
  const match = line.match(/char\s+(\w+)\[(\-?\d*)]\s*=\s*"([^"]*)";/);
  if (match) {
    const name = match[1];
    const size = match[2] ? parseInt(match[2], 10) : 0;
    const values = match[3].split("");
    return { name, size, values };
  }
  return null;
};

export const parseUpdate = (
  line: string
): { name: string; index: number; value: number | string } | null => {
  let match = line.match(/(\w+)\[(-?\d+)]\s*=\s*(\d+);/);
  if (match) {
    return {
      name: match[1],
      index: parseInt(match[2], 10),
      value: parseInt(match[3], 10),
    };
  }

  match = line.match(/(\w+)\[(-?\d+)]\s*=\s*([\d.]+);/);
  if (match) {
    return {
      name: match[1],
      index: parseInt(match[2], 10),
      value: parseFloat(match[3]),
    };
  }

  match = line.match(/(\w+)\[(-?\d+)]\s*=\s*'(.)';/);
  if (match) {
    return { name: match[1], index: parseInt(match[2], 10), value: match[3] };
  }

  return null;
};

export const parseInsert = (
  line: string
): { name: string; index: number; value: number | string } | null => {
  // Parse insert operations like: array.insert(2, 50); or array.insert(2, 'a');
  let match = line.match(/(\w+)\.insert\((-?\d+),\s*(\d+)\);/);
  if (match) {
    return {
      name: match[1],
      index: parseInt(match[2], 10),
      value: parseInt(match[3], 10),
    };
  }

  match = line.match(/(\w+)\.insert\((-?\d+),\s*([\d.]+)\);/);
  if (match) {
    return {
      name: match[1],
      index: parseInt(match[2], 10),
      value: parseFloat(match[3]),
    };
  }

  match = line.match(/(\w+)\.insert\((-?\d+),\s*'(.)'\);/);
  if (match) {
    return { name: match[1], index: parseInt(match[2], 10), value: match[3] };
  }

  return null;
};

export const parseDelete = (
  line: string
): { name: string; index: number } | null => {
  // Parse delete operations like: array.remove(2); or array.delete(2);
  let match = line.match(/(\w+)\.remove\((-?\d+)\);/);
  if (match) {
    return {
      name: match[1],
      index: parseInt(match[2], 10),
    };
  }

  match = line.match(/(\w+)\.delete\((-?\d+)\);/);
  if (match) {
    return {
      name: match[1],
      index: parseInt(match[2], 10),
    };
  }

  return null;
};

// Helper function to detect if a line looks like an update statement but is missing a semicolon
export const detectMissingSemicolon = (line: string): boolean => {
  // Check if line matches update pattern but without semicolon at the end
  const updatePatterns = [
    /^\s*\w+\[\d+\]\s*=\s*\d+\s*$/, // int update without semicolon
    /^\s*\w+\[\d+\]\s*=\s*[\d.]+\s*$/, // double update without semicolon
    /^\s*\w+\[\d+\]\s*=\s*'.'\s*$/, // char update without semicolon
  ];

  return updatePatterns.some((pattern) => pattern.test(line));
};