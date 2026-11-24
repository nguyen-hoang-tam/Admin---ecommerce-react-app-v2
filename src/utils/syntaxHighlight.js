export const syntaxHighlight = (jsonStr) => {
  if (!jsonStr) return '';

  const escaped = jsonStr
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const jsonRegex = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g;

  return escaped.replace(jsonRegex, (match) => {
    const val = match.trim();
    let color = '#cf222e';

    if (val.startsWith('"')) {
      color = val.endsWith(':') ? '#24292f' : '#0969da';
    } else if (val === 'true' || val === 'false') {
      color = '#0550ae';
    } else if (val === 'null') {
      color = '#6e7781';
    }

    return `<span style="color:${color}">${match}</span>`;
  });
};

export default syntaxHighlight;
