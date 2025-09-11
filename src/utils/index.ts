// --- Parsing Functions ---

export const parseIntDeclaration = (
  line: string
): { name: string; values: number[] } | null => {
  const match = line.match(/int\s+(\w+)\[\s*\d*\s*]\s*=\s*\{([^}]+)\};/);
  if (match) {
    const name = match[1];
    const values = match[2].split(",").map((s) => {
      const num = parseInt(s.trim(), 10);
      return isNaN(num) ? 0 : num;
    });
    return { name, values };
  }
  return null;
};

export const parseDoubleDeclaration = (
  line: string
): { name: string; values: number[] } | null => {
  const match = line.match(/double\s+(\w+)\[\s*\d*\s*]\s*=\s*\{([^}]+)\};/);
  if (match) {
    const name = match[1];
    const values = match[2].split(",").map((s) => {
      const num = parseFloat(s.trim());
      return isNaN(num) ? 0.0 : num;
    });
    return { name, values };
  }
  return null;
};

export const parseCharDeclaration = (
  line: string
): { name: string; values: string[] } | null => {
  const stringLiteralMatch = line.match(
    /char\s+(\w+)\[\s*\d*\s*]\s*=\s*"([^"]*)";/
  );
  if (stringLiteralMatch) {
    return {
      name: stringLiteralMatch[1],
      values: stringLiteralMatch[2].split(""),
    };
  }
  return null;
};

export const parseUpdate = (
  line: string
): { name: string; index: number; value: number | string } | null => {
  let match = line.match(/(\w+)\[(\d+)]\s*=\s*(\d+);/);
  if (match) {
    return {
      name: match[1],
      index: parseInt(match[2], 10),
      value: parseInt(match[3], 10),
    };
  }

  match = line.match(/(\w+)\[(\d+)]\s*=\s*([\d.]+);/);
  if (match) {
    return {
      name: match[1],
      index: parseInt(match[2], 10),
      value: parseFloat(match[3]),
    };
  }

  match = line.match(/(\w+)\[(\d+)]\s*=\s*'(.)';/);
  if (match) {
    return { name: match[1], index: parseInt(match[2], 10), value: match[3] };
  }

  return null;
};